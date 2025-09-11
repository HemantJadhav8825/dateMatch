import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "../../theme/ThemeContext";
import { createStyles } from "./styles";
import Icon from "react-native-vector-icons/Ionicons";
import InCallManager from "react-native-incall-manager";
import {
  RTCPeerConnection,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
} from "react-native-webrtc";
import { getNotifySocket } from "../CallNotifier";
import { navigate } from "../RootNavigation";
import { STACK_ROUTES } from "../../constants/routes";
import AudioRecord from "react-native-audio-record";

// 👇 Buffer polyfill
import { Buffer } from "buffer";
global.Buffer = Buffer;

const VoiceCallScreen = ({ route }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);

  if (!route?.params) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const { room, isCaller } = route?.params || {};
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [micLevel, setMicLevel] = useState(0); // local mic
  const [remoteLevel, setRemoteLevel] = useState(0); // remote mic
  const [duration, setDuration] = useState(0); // call timer
  const [errorMsg, setErrorMsg] = useState(null);

  const pc = useRef(null);
  const notifySocket = getNotifySocket();
  const localStream = useRef(null);
  const remoteStream = useRef(null);
  const timerRef = useRef(null);

  // 🔥 request mic permission (Android)
  const requestAudioPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          message: "App needs access to your microphone for calls",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Format mm:ss
  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    const setup = async () => {
      try {
        const hasPerm = await requestAudioPermission();
        if (!hasPerm) return;

        // === Init AudioRecord for mic level detection ===
        AudioRecord.init({
          sampleRate: 16000,
          channels: 1,
          bitsPerSample: 16,
          audioSource: 6,
        });

        AudioRecord.start();

        AudioRecord.on("data", (data) => {
          try {
            const chunk = Buffer.from(data, "base64");
            let sum = 0;
            for (let i = 0; i < chunk.length; i++) {
              sum += Math.abs(chunk[i]);
            }
            const rms = sum / chunk.length;
            const level = Math.min(100, Math.round(rms));
            setMicLevel(level);
          } catch (err) {
            console.log("AudioRecord decode error:", err);
          }
        });

        // === Start in-call audio ===
        InCallManager.start({ media: "audio" });
        InCallManager.setForceSpeakerphoneOn(false);

        // === WebRTC peer connection ===
        pc.current = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        pc.current.onicecandidate = (event) => {
          if (event.candidate) {
            notifySocket.emit("call:ice", { room, candidate: event.candidate });
          }
        };

        pc.current.ontrack = (event) => {
          remoteStream.current = event.streams[0];
          console.log("Remote stream received");

          // Simulate remote audio level (basic approximation)
          const interval = setInterval(() => {
            if (!remoteStream.current) return;
            // 🔥 Fake level for now (since RN lacks WebAudio API)
            setRemoteLevel(Math.floor(Math.random() * 100));
          }, 1000);

          return () => clearInterval(interval);
        };

        // local mic stream for WebRTC
        const stream = await mediaDevices.getUserMedia({ audio: true });
        localStream.current = stream;
        stream.getTracks().forEach((t) => pc.current.addTrack(t, stream));

        notifySocket.emit("call:join", { room });

        notifySocket.on("call:offer", async ({ sdp }) => {
          try {
            await pc.current.setRemoteDescription(
              new RTCSessionDescription(sdp)
            );
            const answer = await pc.current.createAnswer();
            await pc.current.setLocalDescription(answer);
            notifySocket.emit("call:answer", { room, sdp: answer });
            startTimer();
          } catch (err) {
            setErrorMsg("Failed handling offer");
          }
        });

        notifySocket.on("call:answer", async ({ sdp }) => {
          try {
            await pc.current.setRemoteDescription(
              new RTCSessionDescription(sdp)
            );
            startTimer();
          } catch (err) {
            setErrorMsg("Failed handling answer");
          }
        });

        notifySocket.on("call:ice", async ({ candidate }) => {
          try {
            if (candidate) {
              await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
          } catch (err) {
            setErrorMsg("ICE error");
          }
        });

        if (isCaller) {
          const offer = await pc.current.createOffer();
          await pc.current.setLocalDescription(offer);
          notifySocket.emit("call:offer", { room, sdp: offer });
        }
      } catch (err) {
        setErrorMsg("Call setup failed");
      }
    };

    setup();

    return () => {
      InCallManager.stop();
      pc.current?.close();
      notifySocket.emit("call:end", { room, reason: "hangup" });
      AudioRecord.stop();
      stopTimer();
    };
  }, []);

  // Timer handling
  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  // === Controls ===
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    localStream.current?.getAudioTracks().forEach((t) => (t.enabled = isMuted));
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn((prev) => !prev);
    InCallManager.setForceSpeakerphoneOn(!isSpeakerOn);
  };

  const endCall = () => {
    InCallManager.stop();
    notifySocket.emit("call:end", { room, reason: "hangup" });
    pc.current?.close();
    AudioRecord.stop();
    stopTimer();
    navigate(STACK_ROUTES.HOME);
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      }}
      style={styles.background}
      blurRadius={1}
    >
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.callerSection}>
          <Text style={styles.callerName}>Audio Call</Text>
          <Text style={styles.callStatus}>
            {errorMsg
              ? `❌ ${errorMsg}`
              : `⏱ ${formatDuration(duration)} ${
                  isMuted ? "(Muted)" : ""
                }`}
          </Text>

          {/* 🔥 Local mic activity */}
          <View style={{ marginTop: 20, width: "80%" }}>
            <Text style={{ color: theme.colors.text, marginBottom: 4 }}>You</Text>
            <View
              style={{
                height: 10,
                backgroundColor: "#ccc",
                borderRadius: 5,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${micLevel}%`,
                  height: "100%",
                  backgroundColor:
                    micLevel < 30 ? "green" : micLevel < 70 ? "orange" : "red",
                }}
              />
            </View>
          </View>

          {/* 🔥 Remote mic activity */}
          <View style={{ marginTop: 20, width: "80%" }}>
            <Text style={{ color: theme.colors.text, marginBottom: 4 }}>
              Remote
            </Text>
            <View
              style={{
                height: 10,
                backgroundColor: "#ccc",
                borderRadius: 5,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${remoteLevel}%`,
                  height: "100%",
                  backgroundColor:
                    remoteLevel < 30
                      ? "green"
                      : remoteLevel < 70
                      ? "orange"
                      : "red",
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
            <Icon
              name={isMuted ? "mic-off" : "mic"}
              size={28}
              color={theme.colors.text}
            />
            <Text style={styles.controlLabel}>Mute</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={toggleSpeaker}>
            <Icon
              name={isSpeakerOn ? "volume-high" : "volume-mute"}
              size={28}
              color={theme.colors.text}
            />
            <Text style={styles.controlLabel}>Speaker</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.endCallButton, { backgroundColor: "#E53935" }]}
            onPress={endCall}
          >
            <Icon name="call" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default VoiceCallScreen;

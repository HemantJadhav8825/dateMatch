import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
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
import { useNavigation } from "@react-navigation/native";
import { getNotifySocket } from "../CallNotifier";

const VoiceCallScreen = ({ route }) => {
  const { theme } = useContext(ThemeContext);
  const styles = createStyles(theme);
  const navigation = useNavigation();
  console.log("Route Params:", route);
  const { token, room, isCaller } = route?.params || {};
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const pc = useRef(null);
  const notifySocket = getNotifySocket(); // use existing socket
  const localStream = useRef(null);

  useEffect(() => {
    InCallManager.start({ media: "audio" });
    InCallManager.setForceSpeakerphoneOn(false);

    // 1. Create peer connection
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // send ICE candidates
    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        notifySocket.emit("call:ice", { room, candidate: event.candidate });
      }
    };

    // handle remote stream
    pc.current.ontrack = (event) => {
      console.log("Remote stream received");
      // attach to RTCView if needed
    };

    // 2. Get local audio
    mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      localStream.current = stream;
      stream.getTracks().forEach((t) => pc.current.addTrack(t, stream));
    });

    // 3. Join signaling room
    notifySocket.emit("call:join", { room });

    // handle offer/answer/ice
    notifySocket.on("call:offer", async ({ sdp }) => {
      await pc.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      notifySocket.emit("call:answer", { room, sdp: answer });
    });

    notifySocket.on("call:answer", async ({ sdp }) => {
      await pc.current.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    notifySocket.on("call:ice", async ({ candidate }) => {
      if (candidate) {
        await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // 4. Caller initiates offer
    if (isCaller) {
      (async () => {
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        notifySocket.emit("call:offer", { room, sdp: offer });
      })();
    }

    return () => {
      InCallManager.stop();
      pc.current?.close();
      notifySocket.emit("call:end", { room, reason: "hangup" });
    };
  }, []);

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
    navigation.navigate("Home");
  };

  return (
    <ImageBackground
      source={{ uri: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" }}
      style={styles.background}
      blurRadius={1}
    >
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.callerSection}>
          <Text style={styles.callerName}>Audio Call</Text>
          <Text style={styles.callStatus}>
            {isMuted ? "Muted" : "Voice Call in Progress"}
          </Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
            <Icon name={isMuted ? "mic-off" : "mic"} size={28} color={theme.colors.text} />
            <Text style={styles.controlLabel}>Mute</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={toggleSpeaker}>
            <Icon name={isSpeakerOn ? "volume-high" : "volume-mute"} size={28} color={theme.colors.text} />
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

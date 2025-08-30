import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  MediaStream,
} from 'react-native-webrtc';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Ensure installed: react-native-vector-icons
import styles from './styles';
import Toast from 'react-native-toast-message';

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export default function VideoCall() {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const pc = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);
          if (
            granted['android.permission.CAMERA'] !==
              PermissionsAndroid.RESULTS.GRANTED ||
            granted['android.permission.RECORD_AUDIO'] !==
              PermissionsAndroid.RESULTS.GRANTED
          ) {
            Toast.show({
              position: 'bottom',
              type: 'error',
              text1: 'Permissions not granted',
            });
            return;
          }
        }

        pc.current = new RTCPeerConnection(configuration);

        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setLocalStream(stream);

        stream.getTracks().forEach(track => pc.current.addTrack(track, stream));

        pc.current.ontrack = event => {
          if (event.streams && event.streams[0]) {
            setRemoteStream(event.streams[0]);
          } else {
            const inboundStream = new MediaStream();
            inboundStream.addTrack(event.track);
            setRemoteStream(inboundStream);
          }
        };

        // TODO: Add signaling logic here (offer/answer/ICE)
      } catch (error) {
        console.error('Error initializing call:', error);
      }
    };

    init();

    return () => {
      if (pc.current) {
        pc.current.close();
      }
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const toggleMute = () => {
    if (!localStream) return;
    const audioTrack = localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const endCall = () => {
    pc.current?.close();
    localStream?.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    setRemoteStream(null);
    Toast.show({
      position: 'bottom',
      type: 'success',
      text1: 'Call ended',
    });
  };

  return (
    <View style={styles.container}>
      {remoteStream ? (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={styles.remoteVideo}
          objectFit="cover"
        />
      ) : (
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>Waiting for remote video...</Text>
        </View>
      )}

      {localStream && (
        <View style={styles.localPreview}>
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localVideo}
            objectFit="cover"
          />
        </View>
      )}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
          <Icon
            name={isMuted ? 'microphone-off' : 'microphone'}
            size={28}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endButton]}
          onPress={endCall}
        >
          <Icon name="phone-hangup" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            /* Switch camera */
          }}
        >
          <Icon name="camera-switch" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

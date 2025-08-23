import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {
  RTCPeerConnection,
  RTCView,
  mediaDevices
} from 'react-native-webrtc';

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'turn:your-turn-server-url', username: 'user', credential: 'pass' }
  ]
};

export default function CallScreen() {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const pc = useRef(new RTCPeerConnection(configuration)).current;

  useEffect(() => {
    const init = async () => {
      const stream = await mediaDevices.getUserMedia({ audio: true, video: true });
      setLocalStream(stream);

      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        const [stream] = event.streams;
        if (stream) {
          setRemoteStream(stream);
        }
      };

      // TODO: signaling logic here (send offer/answer to your call-service)
    };

    init();

    return () => {
      pc.close();
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <View style={styles.container}>
      {remoteStream ? (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={styles.remoteVideo}
          objectFit="cover"
        />
      ) : (
        <Text style={styles.waitingText}>Waiting for remote video...</Text>
      )}

      {localStream && (
        <RTCView
          streamURL={localStream.toURL()}
          style={styles.localVideo}
          objectFit="cover"
        />
      )}

      <View style={styles.controls}>
        <Button title="Start" onPress={() => {/* Start call */}} />
        <Button title="Mute" onPress={() => {/* Toggle mute */}} />
        <Button title="End" color="red" onPress={() => {/* End call */}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteVideo: {
    flex: 1,
    width: '100%',
  },
  localVideo: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: 'black',
  },
  waitingText: {
    color: 'white',
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
});

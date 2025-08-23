// CallScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { RTCPeerConnection, mediaDevices, RTCView, RTCIceCandidate, RTCSessionDescription } from 'react-native-webrtc';
import { io } from 'socket.io-client';

const SIGNALING_BASE = 'http://127.0.0.1:5004'; // call-service
const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  // add TURN server here
];

export default function CallScreen({ route, navigation }) {
  const { sessionId, isCaller, token } = route.params;
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const pcRef = useRef(null);
  const sigSocketRef = useRef(null);

  useEffect(() => {
    (async () => {
      // 1) get mic/camera
      const stream = await mediaDevices.getUserMedia({ audio: true, video: false });
      setLocalStream(stream);

      // 2) create RTCPeerConnection
      const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      pcRef.current = pc;
      stream.getTracks().forEach(t => pc.addTrack(t, stream));

      pc.ontrack = e => setRemoteStream(e.streams[0]);
      pc.onicecandidate = e => {
        if (e.candidate) {
          sigSocketRef.current.emit('ice', { room: roomName, candidate: e.candidate });
        }
      };

      // 3) connect signaling namespace
      const sig = io(`${SIGNALING_BASE}/signaling`, { auth: { token }, transports: ['websocket'] });
      sigSocketRef.current = sig;

      // We need room name — fetch session info once
      const sessionRes = await fetch(`${SIGNALING_BASE}/call-sessions/${sessionId}`)
        .then(r => r.json());
      const roomName = sessionRes.session ? sessionRes.session.room : sessionRes.room; // adapt to your /call-sessions/:id response
      // store roomName locally
      sig.on('connect', () => {
        // join the room when connected
        sig.emit('join', { room: roomName });
      });

      // signaling handlers
      sig.on('peer.joined', async () => {
        // Peer joined the room -> if caller, create offer
        if (isCaller) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          sig.emit('offer', { room: roomName, sdp: offer.sdp });
        }
      });

      sig.on('offer', async ({ sdp }) => {
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp }));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sig.emit('answer', { room: roomName, sdp: answer.sdp });
      });

      sig.on('answer', async ({ sdp }) => {
        await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }));
      });

      sig.on('ice', async ({ candidate }) => {
        try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) {}
      });

      sig.on('ended', () => {
        endCall();
      });

      // For caller: once session created by match-service, call-service will emit call_accepted to caller
      sig.on('call_accepted', (d) => {
        // room join already happened, waiting for peer.joined event, then createOffer triggered there.
      });

      // cleanup on unmount
      const endCall = () => {
        try { sig.emit('end', { room: roomName, reason: 'hangup' }); } catch {}
        sig.disconnect();
        pc.close();
        stream.getTracks().forEach(t => t.stop());
        navigation.goBack();
      };

    })();

    return () => { /* cleanup handled inside endCall when called */ };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {remoteStream && <RTCView streamURL={remoteStream.toURL()} style={{ flex: 1 }} />}
      {localStream && <RTCView streamURL={localStream.toURL()} style={{ width: 120, height: 160, position: 'absolute', right: 10, top: 10 }} />}
      <Button title="End" onPress={() => {
        // call end endpoint or emit end via signaling
      }} />
    </View>
  );
}

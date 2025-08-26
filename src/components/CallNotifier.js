// CallNotifier.js
import io from "socket.io-client";
import { socketURL } from "../env/allEnv";
import { navigate } from "../components/RootNavigation"; // Adjust path as needed

let notifySocket = null;
let isManuallyDisconnected = false;

const RECONNECT_INTERVAL = 5000; // 5 seconds
let reconnectTimer = null;

function setupListeners(onIncomingCall, onChatMessage) {
  // Call events
  notifySocket.on("incoming_call", (data) => {
    console.log("Incoming call:", data);
    if (onIncomingCall) onIncomingCall(data);
  });

  notifySocket.on("call_accepted", (data) => console.log("Call accepted:", data));
  notifySocket.on("call_rejected", (data) => console.log("Call rejected:", data));

  // Chat events (example)
  if (onChatMessage) {
    notifySocket.on("chat_message", (msg) => {
      console.log("New chat message:", msg);
      onChatMessage(msg);
    });
  }

  // Handle disconnection
  notifySocket.on("disconnect", (reason) => {
    console.warn("Socket disconnected:", reason);
    if (!isManuallyDisconnected) {
      scheduleReconnect();
    }
  });

  notifySocket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
    scheduleReconnect();
  });
}

function scheduleReconnect() {
  if (reconnectTimer) return; // already scheduled
  console.log(`Attempting to reconnect in ${RECONNECT_INTERVAL / 1000}s...`);
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    if (!isManuallyDisconnected && notifySocket) {
      notifySocket.connect();
    }
  }, RECONNECT_INTERVAL);
}

export function initNotifySocket(userId, token, onIncomingCall, onChatMessage) {
  if (notifySocket) return notifySocket; // Reuse

  isManuallyDisconnected = false;
  notifySocket = io(socketURL + "/notify", {
    auth: { token },
    reconnectionAttempts: 5, // built-in retry
    reconnectionDelay: 3000,
  });

  notifySocket.on("connect", () => {
    notifySocket.emit("register", userId);
    console.log("Notify socket connected");
  });

  setupListeners(onIncomingCall, onChatMessage);

  return notifySocket;
}

export function getNotifySocket() {
  return notifySocket;
}

export async function startCall(targetUserId, token) {
  // Request backend to create call session
  const session = await createCallSession(targetUserId); // backend returns { sessionId, room }

  navigate("VoiceCall", {
    token,
    room: session.room,
    isCaller: true,
  });
}


export function acceptCall(sessionId) {
  if (!notifySocket) return console.warn("Socket not initialized");
  notifySocket.emit("call:accept", { sessionId });
}

export function rejectCall(sessionId) {
  if (!notifySocket) return console.warn("Socket not initialized");
  notifySocket.emit("call:reject", { sessionId });
}

export function sendChatMessage(toUserId, message) {
  if (!notifySocket) return console.warn("Socket not initialized");
  notifySocket.emit("chat_message", { to: toUserId, message });
}

export function disconnectNotifySocket() {
  isManuallyDisconnected = true;
  if (notifySocket) {
    notifySocket.disconnect();
    notifySocket = null;
    console.log("Notify socket disconnected");
  }
}

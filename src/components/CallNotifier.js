import io from "socket.io-client";
import { socketURL } from "../env/allEnv";

let notifySocket = null; // Singleton instance

export function initNotifySocket(userId, token, onIncomingCall) {
  // If already initialized, just return it
  if (notifySocket) return notifySocket;

  notifySocket = io(socketURL + "/notify", {
    auth: { token },
  });

  notifySocket.on("connect", () => {
    notifySocket.emit("register", userId);
    console.log("Notify socket connected");
  });

  // Handle incoming calls
  notifySocket.on("incoming_call", (data) => {
    console.log("Incoming call:", data);
    if (onIncomingCall) onIncomingCall(data);
  });

  // Optional: listen to call accepted/rejected
  notifySocket.on("call_accepted", (data) => console.log("Call accepted:", data));
  notifySocket.on("call_rejected", (data) => console.log("Call rejected:", data));

  return notifySocket;
}

// Access the same socket elsewhere
export function getNotifySocket() {
  return notifySocket;
}

// Emit events
export function acceptCall(sessionId) {
  if (!notifySocket) {
    console.warn("Socket not initialized");
    return;
  }
  notifySocket.emit("call:accept", { sessionId });
}

export function rejectCall(sessionId) {
  if (!notifySocket) {
    console.warn("Socket not initialized");
    return;
  }
  notifySocket.emit("call:reject", { sessionId });
}

// Optional: Disconnect (e.g., on logout)
export function disconnectNotifySocket() {
  if (notifySocket) {
    notifySocket.disconnect();
    notifySocket = null;
    console.log("Notify socket disconnected");
  }
}

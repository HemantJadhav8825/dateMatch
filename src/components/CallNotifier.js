import io from "socket.io-client";
import { socketURL } from "../env/allEnv"; // baseURL points to your REST API base (e.g., http://<SERVER_IP>:5004)
import { navigate } from "../components/RootNavigation"; // Adjust path as needed
import axiosClient from "../api/axiosClient";
import { clearTokens, getAccessToken, removeLocalStorage } from "../utils";
import { CREATE_CALL_SESSION } from "../api/endpoints";

let notifySocket = null;
let isManuallyDisconnected = false;

const RECONNECT_INTERVAL = 5000; // 5 seconds
let reconnectTimer = null;

function setupListeners(onIncomingCall, onChatMessage) {
  notifySocket.on("incoming_call", (data) => {
    console.log("Incoming call:", data);
    if (onIncomingCall) onIncomingCall(data);
  });

  notifySocket.on("call_accepted", (data) => console.log("Call accepted:", data));
  notifySocket.on("call_rejected", (data) => console.log("Call rejected:", data));

  if (onChatMessage) {
    notifySocket.on("chat_message", (msg) => {
      console.log("New chat message:", msg);
      onChatMessage(msg);
    });
  }

  notifySocket.on("disconnect", (reason) => {
    console.warn("Socket disconnected:", reason);
    if (!isManuallyDisconnected) {
      scheduleReconnect();
    }
  });

notifySocket.on("connect_error", async (error) => {
  console.error("Socket connection error:", error?.message);

  // Handle unauthorized from middleware
  if (error?.message === "unauthorized") {
    console.warn("Unauthorized socket connection. Logging out...");

    try {
      await clearTokens();               // Clear token
      await removeLocalStorage('userId'); // Clear userId
    } catch (e) {
      console.error("Failed to clear local storage:", e);
    }

    isManuallyDisconnected = true;
    if (notifySocket) {
      notifySocket.disconnect();
      notifySocket = null;
    }

    navigate("Login");
    return; // Don't reconnect if unauthorized
  }

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
  if (notifySocket) return notifySocket; // Reuse existing

  isManuallyDisconnected = false;
  notifySocket = io(socketURL + "/notify", {
    auth: { token },
    reconnectionAttempts: 5,
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

// NEW: create call session (HTTP API)
async function createCallSession(calleeId) {
  try {
    const { data } = await axiosClient.post(CREATE_CALL_SESSION, { calleeId });

    return data;
  } catch (error) {
    console.error("Error creating call session:", error);
    throw error;
  }
}

export async function startCall(targetUserId) {
  try {
    const token = await getAccessToken();
    const session = await createCallSession(targetUserId);

    navigate("VoiceCall", {
      token,
      room: session.room,
      isCaller: true,
    });
  } catch (error) {
    console.error("Failed to start call:", error.message);
  }
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

export function isNotifySocketAlive() {
  return notifySocket?.connected ?? false;
}

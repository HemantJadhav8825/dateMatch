import io from "socket.io-client";

let notifySocket;

export function initNotifySocket(userId, token, onIncomingCall) {
  notifySocket = io("http://<SERVER_IP>:5004/notify", {
    auth: { token },
  });

  notifySocket.on("connect", () => {
    notifySocket.emit("register", userId);
    console.log("notify connected");
  });

  // incoming call event
  notifySocket.on("incoming_call", (data) => {
    console.log("Incoming call:", data);
    onIncomingCall(data); // show call popup screen
  });

  // optional: listen to call accepted/rejected
  notifySocket.on("call_accepted", (data) => console.log("Call accepted", data));
  notifySocket.on("call_rejected", (data) => console.log("Call rejected", data));
}

export function acceptCall(sessionId) {
  notifySocket.emit("call:accept", { sessionId });
}

export function rejectCall(sessionId) {
  notifySocket.emit("call:reject", { sessionId });
}

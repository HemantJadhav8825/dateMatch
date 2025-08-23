// CallNotifier.js (singleton)
// usage: import notifier from './CallNotifier'; notifier.init({ token, userId });

import { io } from 'socket.io-client';
const NOTIFY_URL = 'http://127.0.0.1:5004/notify'; // call-service notify namespace

class CallNotifier {
  init({ token, userId, onIncoming }) {
    this.socket = io('http://127.0.0.1:5004/notify', {
      auth: { token },
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      this.socket.emit('register', userId);
    });

    this.socket.on('incoming_call', (data) => {
      // data: { sessionId, from, room }
      onIncoming && onIncoming(data);
    });

    this.socket.on('call_accepted', (data) => {
      // caller receives this: { sessionId, room }
      if (this.onCallAccepted) this.onCallAccepted(data);
    });

    this.socket.on('call_rejected', (data) => {
      if (this.onCallRejected) this.onCallRejected(data);
    });
  }

  accept(sessionId) {
    this.socket.emit('call:accept', { sessionId });
  }
  reject(sessionId) {
    this.socket.emit('call:reject', { sessionId });
  }
}
export default new CallNotifier();

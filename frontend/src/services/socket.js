import io from 'socket.io-client';
import { store } from '../store/store';
import { addNotification } from '../store/slices/notificationSlice';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8081';

class SocketService {
  socket = null;

  connect() {
    this.socket = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    this.socket.on('notification', (notification) => {
      store.dispatch(addNotification(notification));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketService(); 
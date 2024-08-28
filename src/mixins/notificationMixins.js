// src/mixins/notificationsMixin.js
import { io } from 'socket.io-client';

export const notificationsMixin = {
  data() {
    return {
      notifications: [],
      socket: null
    };
  },
  created() {
    this.setupSocket();
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  methods: {
    setupSocket() {
      this.socket = io('http://localhost:8000');
      this.socket.on('notification', (notification) => {
        if (this.shouldReceiveNotification(notification)) {
          this.notifications.push(notification);
          console.log('notificationDavid', this.notifications);
        }
      });
    },
    // shouldReceiveNotification(notification) {
    //   // Implémentez cette méthode dans chaque composant pour filtrer les notifications
    //   return true;
    // }
  }
};

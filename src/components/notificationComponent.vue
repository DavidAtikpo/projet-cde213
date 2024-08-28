<template>
    <div id="app">
      <Navigation :notifications="notifications" />
      <router-view />
    </div>
  </template>
  
  <script>
  import { io } from 'socket.io-client';
  import Navigation from './components/admin/adminDashNavbarComponent.vue';
  
  export default {
    name: 'App',
    components: {
      Navigation
    },
    data() {
      return {
        notifications: []
      };
    },
    created() {
      this.setupSocket();
    },
    methods: {
      setupSocket() {
        const socket = io('http://localhost:8000'); // Remplacez par l'URL de votre backend
        socket.on('notification', (notification) => {
          this.notifications.push(notification);
        });
      }
    }
  };
  </script>
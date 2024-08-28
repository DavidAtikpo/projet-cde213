<template>
  <div class="notification">
    {{ notification.message }}
  </div>
</template>

<script>
export default {
  props: {
    notification: Object
  }
};
</script>

<style scoped>
.notification {
  /* Votre style ici */
}
</style>


<!-- <template>
  <div>
    <button @click="confirmLogout">Logout</button>
  </div>
</template>

<script>
import axios from 'axios';
import {API_BASE_URL}  from '@/config.js';
export default {
  methods: {
    async logout() {
      try {
        await axios.post(`${API_BASE_URL}/user/logout`, {}, { withCredentials: true });
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        this.$router.push('/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },
    confirmLogout() {
      if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        this.logout();
      }
    }
  }
}
</script> -->



<!-- <template>
  <div>
    <button @click="confirmLogout">Logout</button>
  </div>
</template>

<script>
import axios from 'axios';
import {API_BASE_URL}  from '@/config.js';
export default {
  methods: {
    async logout() {
      try {
        await axios.post(`${API_BASE_URL}/user/logout`);
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        this.$router.push('/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },
    confirmLogout() {
      if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        this.logout();
      }
    }
  }
}
</script> -->

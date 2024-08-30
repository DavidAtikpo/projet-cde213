<!-- <template>
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
}
</style> -->


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



<script>
// src/composables/useAuth.js
import { ref } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export function useAuth() {
  const isAuthenticated = ref(!!localStorage.getItem('authToken')); // Check if user is authenticated

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout`); // Send logout request to backend
      localStorage.removeItem('authToken'); // Remove token from localStorage
      isAuthenticated.value = false; // Update authentication state
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  };

  return {
    isAuthenticated,
    logout,
  };
}

</script>

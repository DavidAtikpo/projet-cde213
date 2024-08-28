<template>
  <div>
    <!-- Utilisez v-for pour itérer sur la liste des utilisateurs et afficher les informations de chaque utilisateur -->
    <div v-for="user in users" :key="user._id" class="objective-component">
      <div class="objective-time">{{ user.objectiveTime }}</div>
      <div class="user-profile">
        <img :src="user.profilePhotoURL" alt="Profile">
        <div class="profile-info">
          <h3>{{ user.firstName }}</h3>
          <p>{{ user.role }}</p>
        </div>
      </div>
      <div class="objective">
        <p>Objectif: {{ user.dailyGoal }}</p>
        <div>{{user.date }}</div>
        <div>{{user.arrivalTime }}</div>
        <div>{{ user.createdAt }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {API_BASE_URL}  from '@/config.js';

export default {
  data() {
    return {
      users: []
    };
  },
  mounted() {
    // Appel à la méthode pour récupérer les données des utilisateurs et des objectifs depuis le backend au moment du montage du composant
    this.fetchDataFromBackend();
  },
  methods: {
    fetchDataFromBackend() {
      // Utilisez Axios ou Fetch pour effectuer une requête HTTP au backend
      // et récupérez les données des utilisateurs et des objectifs
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      axios.get(`${API_BASE_URL}/admin/getallObjective`, { headers })
      .then(res => {
      // Update the profilePhotoURL for each user
      this.users = res.data.map(user => ({
        ...user,
        profilePhotoURL: `${API_BASE_URL}` + user.profilePhotoURL
      }));
    })
        .catch(error => {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        });
    }
  }
};
</script>

<style scoped>
.objective-component {
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
}

.objective-time {
  font-size: 14px;
  margin-bottom: 10px;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-profile img {
  width: 50px; /* Ajustez selon votre design */
  height: 50px; /* Ajustez selon votre design */
  border-radius: 50%;
  margin-right: 10px;
}

.profile-info h3 {
  margin: 0;
}

.profile-info p {
  margin: 0;
  color: #666;
}
p{
  color: blue;
}
</style>


<template>
  <div>
    <div class="user-profile" v-for="user in users" :key="user._id" @click="toggleDropdown(user._id)">
      <div class="profile-info">
        <img class="icone" :src="user.profilePhotoURL"  alt="profile">
        <span>{{ user.firstName }}</span>
      </div>
      <div v-if="isDropdownOpen === user._id" class="dropdown">
        <p>Nom: {{ user.lastName }}</p>
        <p>Prénom: {{ user.firstName }}</p>
        <p>Rôle: {{ user.role }}</p>
        <p>Objectif du jour: {{ user.dailyObjective }}</p>
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
      users: [], // Liste pour stocker les données de tous les utilisateurs
      isDropdownOpen: null // Variable pour stocker l'id de l'utilisateur dont la dropdown est ouverte
    };
  },
  methods: {
    toggleDropdown(userId) {
      // Pour ouvrir/fermer la dropdown pour un utilisateur spécifique
      this.isDropdownOpen = this.isDropdownOpen === userId ? null : userId;
    },
    fetchDataFromBackend() {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      axios.get(`${API_BASE_URL}/admin/allusers`, { headers })
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
  },
  mounted() {
    // Appel à la méthode pour récupérer les données de tous les utilisateurs depuis le backend au moment du montage du composant
    this.fetchDataFromBackend();
  }
};
</script>

<style scoped>
.user-profile {
  cursor: pointer;
}

.profile-info {
  display: flex;
  align-items: center;
  background-color: #a04242;
  width: 45%;
  margin-left: 10%;
  margin-top: 2%;
  border-top-left-radius: 10px ;
  border-top-right-radius: 10px ;
  border-bottom-left-radius: 10px ;
  border:2px solid blue;
  color:#f9f9f9
}

.profile-info img {
  width: 50px; /* Ajustez la taille de l'image selon vos besoins */
  height: 50px; /* Ajustez la taille de l'image selon vos besoins */
  border-radius: 50%;
  margin-right: 10px;
}

.dropdown {
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  width: 43%;
  margin-left: 10%;
  margin-top: 5px;
  border-top-right-radius: 10px ;
  border-bottom-right-radius: 10px ;
  border-bottom-left-radius: 10px ;
  border:2px solid #333
}
</style>






<!-- <template>
    <div class="user-profile" @click="toggleDropdown">
      <div class="profile-info">
        <img :src="profilePhotoURL" alt="Profile">
        <span>{{ firstName }}</span>
      </div>
      <div v-if="isDropdownOpen" class="dropdown">
        <p>Nom: {{ lastName }}</p>
        <p>Prénom: {{ firstName }}</p>
        <p>Rôle: {{ role }}</p>
        <p>Objectif du jour: {{ dailyObjective }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios  from 'axios';
  export default {
    data() {
      return {
        profilePhotoURL: '',
        firstName: '',
        lastName: '',
        role: '',
        dailyObjective: '',
        isDropdownOpen: false
      };
    },
    methods: {
      toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
      },
      fetchDataFromBackend() {
        // Ici, vous devriez implémenter la logique pour récupérer les données de l'utilisateur depuis le backend
        // Vous pouvez utiliser Axios, fetch ou une autre méthode pour effectuer une requête HTTP au backend
        // Une fois les données récupérées, mettez à jour les données du composant avec les valeurs reçues
        // Par exemple :
        const token = localStorage.getItem('token');
        const headers ={
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`
      };
        axios.get('http://localhost:8000/admin/allusers' ,{headers})
          .then(res => {
            if (res.data.length > 0) {
      const premierUtilisateur = res.data[0];
      this.profilePhotoURL = premierUtilisateur.profilePhotoURL;
      this.firstName = premierUtilisateur.firstName;
      this.lastName = premierUtilisateur.lastName;
      this.role = premierUtilisateur.role;
      this.dailyObjective = premierUtilisateur.dailyObjective;
    } else {
      console.error('Aucun utilisateur trouvé.');
    }
          })
          .catch(error => {
            console.error('Erreur lors de la récupération des données utilisateur:', error);
         });
      }
    },
    mounted() {
      // Appel à la méthode pour récupérer les données de l'utilisateur depuis le backend au moment du montage du composant
      this.fetchDataFromBackend();
    }
  };
  </script>
  
  <style scoped>
  .user-profile {
    cursor: pointer;
  }
  
  .profile-info {
    display: flex;
    align-items: center;
  }
  
  .profile-info img {
    width: 50px; /* Ajustez la taille de l'image selon vos besoins */
    height: 50px; /* Ajustez la taille de l'image selon vos besoins */
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .dropdown {
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    margin-top: 5px;
  }
  </style>
   -->
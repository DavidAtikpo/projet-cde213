<template>
  <div class="page">
    <div class="header">
      <h5>Liste des enfants absents</h5>
      <em>Effectif total: ({{ children.length }})</em>
    </div>

    <!-- Loading indicator -->
    <div v-if="isLoading" class="loading-indicator">
      <div class="loading-bar"></div>
    </div>

    <div v-if="!isLoading">
      <div v-for="child in children" :key="child._id" class="child-item">
        <div class="profile-info">
          <img :src="child.profilePhotoURL" alt="Profile Icon" class="profile-icon">
          <div class="child-details">
            <p class="name">{{ child.firstName }}</p>
            <p class="class">Class: ({{ child.class }})</p>
            <p class="tel">Tel: ({{ child.phoneNumber }})</p>
            <p class="nbre">Nbre de fois: ({{ child.absentCount }})</p>

            <!-- Date cachée par défaut -->
            <p v-if="isDateVisible[child._id]" class="date">Date: ({{ child.absentDates.join(', ') }})</p>

            <!-- Bouton pour afficher/cacher la date -->
            <button @click="toggleDateVisibility(child._id)">
              {{ isDateVisible[child._id] ? 'Cacher la date' : 'Afficher la date' }}
            </button>

            <!-- Bouton pour supprimer un enfant -->
            <button @click="deleteAbsentCountAndDates(child._id)" class="delete-button">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue'; // Importation de ref pour la réactivité
import { API_BASE_URL } from '@/config.js';

export default {
  setup() {
    const children = ref([]);
    const isLoading = ref(true);
    const isDateVisible = ref({}); // Utilisation de ref pour les données réactives

    const fetchChildren = async () => {
      try {
        isLoading.value = true; // Mise à jour de l'état de chargement
        const response = await axios.get(`${API_BASE_URL}/absent/absent`);
        children.value = response.data.sort((a, b) => a.firstName.localeCompare(b.firstName));

        // Initialiser isDateVisible pour chaque enfant
        children.value.forEach(child => {
          isDateVisible.value[child._id] = false;
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des enfants :', error);
      } finally {
        isLoading.value = false; // Mise à jour de l'état de chargement
      }
    };

    const toggleDateVisibility = (childId) => {
      // Inverser la visibilité de la date
      isDateVisible.value[childId] = !isDateVisible.value[childId];
    };

    const deleteAbsentCountAndDates = async (childId) => {
      try {
        const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer le absentCount et les dates d\'absence de cet enfant ?');
        if (confirmDelete) {
          await axios.delete(`${API_BASE_URL}/absent/absentchild/${childId}`);
          alert('AbsentCount et dates d\'absence supprimés avec succès');
          
          // Mettre à jour l'affichage
          children.value = children.value.filter(child => child._id !== childId);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du absentCount et des dates:', error);
        alert('Erreur lors de la suppression');
      }
    };

    // Appeler fetchChildren lors de l'initialisation du composant
    fetchChildren();

    // Retourner les variables et fonctions pour les utiliser dans le template
    return {
      children,
      isLoading,
      isDateVisible,
      toggleDateVisibility,
      deleteAbsentCountAndDates,
    };
  }
};
</script>







<style scoped>
.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Assure que la page prend toute la hauteur de la fenêtre */
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.child-list {
  width: 100%; /* Adapte la largeur à 100% pour contenir tous les enfants */
  max-width: 600px; /* Limite la largeur pour ne pas s'étendre trop */
}

.child-item {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 50%; /* Remplit la largeur du parent */
}

.profile-info {
  display: flex;
  align-items: center;
}

.profile-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}

.child-details {
  flex-grow: 1;
}

.name {
  font-weight: bold;
}

.class,
.tel,
.nbre,
.date {
  color: #666;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
}

.loading-bar {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(0, 0, 0, 0.2);
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>


<!-- <template>
  <div :class="[theme, 'page']">
    <div class="header">
      <p>Liste des enfants inscrits dans le serveur</p>
      <p>Veuillez sélectionner les noms des enfants qui sont présents au rendez-vous aujourd'hui</p>
      <em>Effectif total: {{ children.length }}</em>
    </div>
    <div class="child-list">
      
      <div v-if="loading" class="loading-indicator">
        <i class="fas fa-circle-notch fa-spin"></i> Chargement des données...
      </div>
      <div v-else></div>
      <div class="child-item" v-for="child in children" :key="child._id">
        <router-link :to="{ name: 'ChildPicture', params: { id: child._id } }">
          <img :src="child.profilePhotoURL" alt="Profile Icon" class="profile-icon">
        </router-link>
        <div class="info">
          <div class="profile-info" @click="toggleDropdown(child._id)">
            <span class="name">{{ child.firstName }}</span>
            <span class="class">Class: {{ child.class }}</span>
            <span class="tel">Tel: {{ child.phoneNumber }}</span>
          </div>
          <input type="checkbox" v-model="selectedChildren" :value="child._id" @click.stop>
        </div>
        <div v-if="isDropdownOpen === child._id" class="dropdown">
          <template v-if="editableChildId === child._id">
            <div class="editable-child-form" @click="preventDropdownClose($event)">
              <div class="form-group">
                <label for="firstName">Nom:</label>
                <input id="firstName" v-model="child.firstName" placeholder="Prénom">
              </div>
              <div class="form-group">
                <label for="lastName">Prenom:</label>
                <input id="lastName" v-model="child.lastName" placeholder="Nom">
              </div>
              <div class="form-group">
                <label for="sex">Sexe:</label>
                <input id="sex" v-model="child.sex" placeholder="Sexe">
              </div>
              <div class="form-group">
                <label for="class">Class:</label>
                <input id="class" v-model="child.class" placeholder="Classe">
              </div>
              <div class="form-group">
                <label for="school">Etablissement:</label>
                <input id="school" v-model="child.school" placeholder="Ecole">
              </div>
           
              <button class="valider" @click.stop="saveChanges(child._id)">Valider</button>
            </div>
          </template>
          <template v-else>
            <div class="child-info">
              <p><strong>Nom:</strong><em class="data">{{ child.lastName }}</em></p>
              <p><strong>Prénom:</strong><em class="data">{{ child.firstName }}</em></p>
              <p><strong>Sexe:</strong><em class="data">{{ child.sex }}</em></p>
              <p><strong>Classe:</strong><em class="data">{{ child.class }}</em></p>
              <p><strong>Etablissement:</strong><em class="data">{{ child.school }}</em></p>
              <p><strong>Date de naissance:</strong><em class="data">{{ child.birthDate }}</em></p>
              <p><strong>Lieu de naissance:</strong><em class="data">{{ child.birthPlace }}</em></p>
              <p><strong>Quartier:</strong><em class="data">{{ child.live }}</em></p>
              <p><strong>Nom du père/tuteur:</strong><em class="data">{{ child.fatherName }}</em></p>
              <p><strong>Nom de la mère:</strong><em class="data">{{ child.motherName }}</em></p>
              <p><strong>Numéro de téléphone:</strong><em class="data">{{ child.phoneNumber }}</em></p>
              <p><strong>Profession:</strong><em class="data">{{ child.occupation }}</em></p>
              <p><strong>Date de mise à jour:</strong><em class="data">{{ child.createdAt }}</em></p>
              <p><strong>Inscrit par:</strong><em class="data">{{ child.postedBy.firstName }}</em></p>
              <p><strong>Autre information:</strong><em class="data">{{ child.otherInfo }}</em></p>
              <button class="update" @click.stop="editChild(child._id)">Modifier</button>
            </div>
          </template>
        </div>
      </div>
    </div>
    <button @click="submitForm"> <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
      <span v-if="showSubmitButton" class="submit-button" @click="submitSelectedChildren">Valider la sélection</span></button>
    <div class="typewriter">Bienvenue à la gestion des présences</div>

  </div>
  
</template> -->

<template>
  <div :class="[theme, 'page']">
    <div v-if="loading" class="loading-spinner">
      <!-- Indicateur de chargement -->
      <i class="fas fa-circle-notch fa-spin"></i>
      Chargement des données...
    </div>

    <div v-else>
      <div class="child-list">
        <div class="child-item" v-for="child in children" :key="child._id">
          <router-link :to="{ name: 'ChildPicture', params: { id: child._id } }">
            <img :src="child.profilePhotoURL" alt="Profile Icon" class="profile-icon">
          </router-link>
          <div class="info">
            <div class="profile-info" @click="toggleDropdown(child._id)">
              <span class="name">{{ child.firstName }}</span>
              <span class="class">Class: {{ child.class }}</span>
              <span class="tel">Tel: {{ child.phoneNumber }}</span>
            </div>
            <!-- Checkbox with proper binding -->
            <input
              type="checkbox"
              v-model="selectedChildren"
              :value="child._id"
              @click.stop
            >
          </div>
          <div v-if="isDropdownOpen === child._id" class="dropdown">
            <template v-if="editableChildId === child._id">
              <div class="editable-child-form" @click="preventDropdownClose($event)">
                <button class="valider" @click.stop="saveChanges(child._id)">Valider</button>
              </div>
            </template>
            <template v-else>
              <div class="child-info">
                <button class="update" @click.stop="editChild(child._id)">Modifier</button>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Validation button appears only when children are selected -->
      <button
        v-if="children.length > 0 && selectedChildren.length > 0"
        @click="submitSelectedChildren"
      >
        <i v-if="submitLoading" class="fas fa-circle-notch fa-spin"></i>
        <span v-else>Valider la sélection</span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  data() {
    return {
      children: [],
      selectedChildren: [], // Manages selected children IDs
      isDropdownOpen: null,
      editableChildId: null,
      loading: true, // Loading state
      submitLoading: false,  
    };
  },
  computed: {
    ...mapState(['theme', 'userId']),
  },
  created() {
    this.fetchChildren();
  },
  methods: {
    async fetchChildren() {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const response = await axios.get(`${API_BASE_URL}/child/allchildren`, { headers });
        const children = await Promise.all(response.data.map(async (child) => {
          const profilePhotoURL = await this.fetchProfilePicture(child._id);
          return { ...child, profilePhotoURL };
        }));
        this.children = children.sort((a, b) => a.firstName.localeCompare(b.firstName));
      } catch (error) {
        console.error('Error fetching children:', error);
      } finally {
        this.loading = false; // Turn off loading indicator
      }
    },

    async submitSelectedChildren() {
      this.submitLoading = true; // Enable loading indicator for submission
      try {
        const response = await axios.post(`${API_BASE_URL}/absent/present`, { ids: this.selectedChildren });
        console.log('Submitted selected children:', response.data);
        this.selectedChildren = []; // Clear the selected children after submission
      } catch (error) {
        console.error('Error submitting selected children:', error);
      } finally {
        this.submitLoading = false; // Turn off loading indicator after submission
      }
    },

    async fetchProfilePicture(childId) {
      try {
        const res = await axios.get(`${API_BASE_URL}/child/getprofilepicture/${childId}`);
        return res.data.profilePhotoUrl;
      } catch (error) {
        console.error('Error fetching profile picture:', error);
        return '';
      }
    },

    toggleDropdown(childId) {
      this.isDropdownOpen = this.isDropdownOpen === childId ? null : childId;
    },

    async saveChanges(childId) {
      // Save changes
    },

    preventDropdownClose(event) {
      event.stopPropagation();
    },

    editChild(childId) {
      this.editableChildId = childId;
    }
  }
};
</script>





<style scoped>

.page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f4;
}

.content {
  max-width: 800px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  margin: 0 15px;
  position: relative;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.child-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.child-item {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.profile-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}

.info {
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  align-items: center;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.name {
  font-weight: bold;
  font-size: 1.2em;
}

.class, .tel {
  color: #666;
}

.checkbox {
  margin-left: auto;
}

.dropdown {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

button.update, button.valider {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.update:hover, button.valider:hover {
  background-color: #45a049;
}

.editable-child-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: bold;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
}

.typewriter {
  position: absolute;
  right: 20px;
  bottom: 20px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.2em;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  border-right: 3px solid #333;
  width: 14ch; /* Number of characters to display */
  animation: typing 2s steps(14), blink 0.5s step-end infinite alternate;
}

@keyframes typing {
  from { width: 0; }
  to { width: 14ch; }
}

@keyframes blink {
  from { border-color: transparent; }
  to { border-color: #333; }
}
/* .page {
  padding: 20px;
}

.dark.page {
  background-color: #636060;
  color: #fff;
}

.light.page {
  background-color: #fff;
  color: #333;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.child-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.child-item {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.child-item:hover {
  background-color: #e0e0e0;
}

.profile-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}

.info {
  flex-grow: 1;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.name {
  font-weight: bold;
  font-size: 1.2em;
}

.class, .tel {
  color: #666;
}

.dropdown {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.child-info p {
  margin: 5px 0;
}

.data {
  color: #1e88e5;
}

button.update, button.valider {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.update:hover, button.valider:hover {
  background-color: #45a049;
}

.editable-child-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: bold;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #0056b3;
} */
</style>


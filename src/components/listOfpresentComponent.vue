<template>
  <div :class="[theme, 'page']">
    <div class="header">
      <h2>Liste des présences</h2>
      <p>Effectif total: {{ children.length }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-spinner">
      <i class="fas fa-circle-notch fa-spin"></i>
      <span>Chargement des données...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      <span>{{ error }}</span>
    </div>

    <!-- Main Content -->
    <div v-else class="content">
      <!-- Search and Filter -->
      <div class="search-filter-container">
        <div class="search-filter">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Rechercher un enfant..."
              @input="filterChildren"
            >
          </div>
          <div class="filter-box">
            <select v-model="classFilter" @change="filterChildren">
              <option value="">Toutes les classes</option>
              <option v-for="classOption in uniqueClasses" :key="classOption" :value="classOption">
                {{ classOption }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Children List -->
      <div class="child-list">
        <div v-for="child in filteredChildren" 
             :key="child._id" 
             class="child-item"
             :class="{ 'selected': selectedChildren.includes(child._id) }"
             @click="toggleChildSelection(child._id)">
          <div class="profile-section">
            <img :src="child.profilePhotoURL" :alt="child.firstName" class="profile-icon">
            <div class="profile-info">
              <h3>{{ child.firstName }} {{ child.lastName }}</h3>
              <p class="class">Classe: {{ child.class }}</p>
              <p class="tel">Tél: {{ child.phoneNumber }}</p>
            </div>
          </div>

          <!-- Child Details -->
          <div v-if="selectedChildren.includes(child._id)" class="child-details">
            <div class="detail-group">
              <h4>Informations personnelles</h4>
              <p><strong>Date de naissance:</strong> {{ formatDate(child.birthDate) }}</p>
              <p><strong>Lieu de naissance:</strong> {{ child.birthPlace }}</p>
              <p><strong>Quartier:</strong> {{ child.live }}</p>
            </div>

            <div class="detail-group">
              <h4>Informations scolaires</h4>
              <p><strong>Établissement:</strong> {{ child.school }}</p>
              <p><strong>Classe:</strong> {{ child.class }}</p>
            </div>

            <div class="detail-group">
              <h4>Informations parentales</h4>
              <p><strong>Père/Tuteur:</strong> {{ child.fatherName }}</p>
              <p><strong>Mère:</strong> {{ child.motherName }}</p>
              <p><strong>Profession:</strong> {{ child.occupation }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div v-if="selectedChildren.length > 0" class="submit-section">
        <button 
          class="submit-button" 
          @click="submitSelectedChildren"
          :disabled="submitLoading"
        >
          <i v-if="submitLoading" class="fas fa-circle-notch fa-spin"></i>
          <span v-else>Valider la présence ({{ selectedChildren.length }})</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  name: 'ListOfPresentComponent',
  
  data() {
    return {
      children: [],
      filteredChildren: [],
      selectedChildren: [],
      loading: true,
      submitLoading: false,
      error: null,
      searchQuery: '',
      classFilter: '',
    };
  },

  computed: {
    ...mapState(['theme']),
    
    uniqueClasses() {
      return [...new Set(this.children.map(child => child.class))].sort();
    }
  },

  created() {
    this.fetchChildren();
  },

  methods: {
    async fetchChildren() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('Fetching children data...');
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const response = await axios.get(`${API_BASE_URL}/child/allchildren`, { headers });
        console.log('API Response:', response.data);
        
        const children = await Promise.all(
          response.data.map(async (child) => {
            try {
              const profilePhotoURL = await this.fetchProfilePicture(child._id);
              return { ...child, profilePhotoURL };
            } catch (error) {
              console.error(`Error fetching profile picture for child ${child._id}:`, error);
              return { ...child, profilePhotoURL: '' };
            }
          })
        );
        
        console.log('Processed children data:', children);
        this.children = children.sort((a, b) => a.firstName.localeCompare(b.firstName));
        this.filteredChildren = [...this.children];
      } catch (error) {
        console.error('Error fetching children:', error);
        this.error = 'Erreur lors du chargement des données';
      } finally {
        this.loading = false;
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

    filterChildren() {
      this.filteredChildren = this.children.filter(child => {
        const matchesSearch = 
          child.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          child.lastName.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        const matchesClass = !this.classFilter || child.class === this.classFilter;
        
        return matchesSearch && matchesClass;
      });
    },

    toggleChildSelection(childId) {
      if (this.selectedChildren.includes(childId)) {
        this.selectedChildren = this.selectedChildren.filter(id => id !== childId);
      } else {
        this.selectedChildren.push(childId);
      }
    },

    formatDate(date) {
      if (!date) return 'Non spécifié';
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    async submitSelectedChildren() {
      if (this.selectedChildren.length === 0) return;
      
      this.submitLoading = true;
      try {
        console.log('Submitting selected children:', this.selectedChildren);
        const response = await axios.post(
          `${API_BASE_URL}/absent/present`, 
          { ids: this.selectedChildren }
        );
        console.log('Submission response:', response.data);
        this.selectedChildren = [];
        this.$emit('submission-success');
      } catch (error) {
        console.error('Error submitting selected children:', error);
        this.error = 'Erreur lors de la soumission';
      } finally {
        this.submitLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.page {
  padding: 2rem;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.dark.page {
  background-color: #1a1a1a;
  color: #fff;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h2 {
  font-size: 1.8rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.dark .header h2 {
  color: #fff;
}

.search-filter-container {
  background-color: #fff;
  padding: 0.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.dark .search-filter-container {
  background-color: #2d3748;
}

.search-filter {
  display: flex;
  gap: 2rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  padding: 0.5rem;
}

.search-box {
  flex: 1;
  position: relative;
  min-width: 300px;
  max-width: 900px;
  margin-right: 1rem;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
  z-index: 1;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fff;
}

.dark .search-box input {
  background-color: #1a202c;
  border-color: #4a5568;
  color: #fff;
}

.filter-box {
  min-width: 200px;
  position: relative;
  z-index: 2;
  margin-left: 1rem;
}

.filter-box select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

.dark .filter-box select {
  background-color: #1a202c;
  border-color: #4a5568;
  color: #fff;
}

.child-list {
  display: grid;
  gap: 1rem;
}

.child-item {
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.dark .child-item {
  background-color: #2d3748;
}

.child-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.child-item.selected {
  border: 2px solid #4299e1;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.profile-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
}

.profile-info h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #2d3748;
}

.dark .profile-info h3 {
  color: #fff;
}

.profile-info p {
  margin: 0.25rem 0;
  color: #718096;
  font-size: 0.9rem;
}

.child-details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.dark .child-details {
  border-color: #4a5568;
}

.detail-group h4 {
  color: #4a5568;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.dark .detail-group h4 {
  color: #a0aec0;
}

.detail-group p {
  margin: 0.5rem 0;
  color: #718096;
  font-size: 0.9rem;
}

.submit-section {
  margin-top: 2rem;
  text-align: center;
}

.submit-button {
  padding: 1rem 2rem;
  background-color: #48bb78;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background-color: #38a169;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #718096;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #f56565;
}

@media (max-width: 768px) {
  .page {
    padding: 1rem;
  }

  .search-filter {
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
  }

  .search-box {
    max-width: 100%;
    min-width: 100%;
    margin-right: 0;
  }

  .filter-box {
    width: 100%;
    margin-left: 0;
  }

  .child-details {
    grid-template-columns: 1fr;
  }
}
</style>
  
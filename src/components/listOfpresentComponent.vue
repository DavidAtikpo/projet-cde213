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
          <!-- Main Content Row -->
          <div class="main-content-row">
            <div class="profile-section">
              <div class="profile-avatar">
                {{ child.firstName.charAt(0).toUpperCase() }}
              </div>
              <div class="profile-info">
                <h3>{{ child.firstName }} {{ child.lastName }}</h3>
                <div class="info-row">
                  <span class="info-item">
                    <i class="fas fa-graduation-cap"></i>
                    {{ child.class }}
                  </span>
                  <span class="info-item">
                    <i class="fas fa-phone"></i>
                    {{ child.phoneNumber }}
                  </span>
                  <span class="info-item status-present">
                    <i class="fas fa-check-circle"></i>
                    Présent
                  </span>
                </div>
              </div>
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
  padding: 1.2rem;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.dark.page {
  background-color: #1a1a1a;
  color: #fff;
}

.header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.header h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.3rem;
  font-weight: 600;
}

.header p {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

.dark .header h2 {
  color: #fff;
}

.dark .header p {
  color: #a0aec0;
}

.search-filter-container {
  background-color: #fff;
  padding: 1rem;
  border-radius: 0.6rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.2rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dark .search-filter-container {
  background-color: #2d3748;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.search-filter {
  display: flex;
  gap: 1rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  position: relative;
  min-width: 280px;
  max-width: 600px;
}

.search-box i {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
  z-index: 1;
  font-size: 0.9rem;
}

.search-box input {
  width: 100%;
  padding: 0.6rem 0.8rem 0.6rem 2.2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background-color: #f8f9fa;

  &:focus {
    outline: none;
    border-color: #48bb78;
    box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
    background-color: #fff;
  }
}

.dark .search-box input {
  background-color: #1a202c;
  border-color: #4a5568;
  color: #fff;
  
  &:focus {
    background-color: #2d3748;
    border-color: #48bb78;
  }
}

.filter-box {
  min-width: 180px;
  position: relative;
  z-index: 2;
}

.filter-box select {
  width: 100%;
  padding: 0.6rem 2.2rem 0.6rem 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 0.8em;

  &:focus {
    outline: none;
    border-color: #48bb78;
    box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.1);
    background-color: #fff;
  }
}

.dark .filter-box select {
  background-color: #1a202c;
  border-color: #4a5568;
  color: #fff;
  
  &:focus {
    background-color: #2d3748;
    border-color: #48bb78;
  }
}

.child-list {
  display: grid;
  gap: 0.8rem;
}

.child-item {
  background-color: #fff;
  border-radius: 0.6rem;
  padding: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border-left: 4px solid #48bb78;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.dark .child-item {
  background-color: #2d3748;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.child-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(72, 187, 120, 0.12);
  border-left-width: 6px;
}

.child-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #48bb78, #38a169);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.child-item:hover::before {
  opacity: 1;
}

.child-item.selected {
  border: 2px solid #48bb78;
  background: rgba(72, 187, 120, 0.05);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.2);
}

.child-item.selected::before {
  opacity: 1;
}

.dark .child-item.selected {
  background: rgba(72, 187, 120, 0.1);
}

.main-content-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 1;
}

.profile-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  border: 2px solid #f1f5f9;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(72, 187, 120, 0.2);
  text-decoration: none;
}

.child-item:hover .profile-avatar {
  border-color: #48bb78;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.child-item.selected .profile-avatar {
  border-color: #48bb78;
  box-shadow: 0 0 0 2px rgba(72, 187, 120, 0.3);
}

.dark .profile-avatar {
  border-color: #4a5568;
  box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3);
}

.dark .child-item:hover .profile-avatar {
  border-color: #48bb78;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-info h3 {
  margin: 0 0 0.3rem 0;
  font-size: 0.95rem;
  color: #1a202c;
  font-weight: 600;
  transition: color 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.child-item:hover .profile-info h3 {
  color: #48bb78;
}

.dark .profile-info h3 {
  color: #fff;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #718096;
  white-space: nowrap;
}

.info-item i {
  font-size: 0.75rem;
  color: #48bb78;
  width: 12px;
  text-align: center;
}

.info-item.status-present {
  color: #48bb78;
  font-weight: 600;
  background: rgba(72, 187, 120, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  border: 1px solid rgba(72, 187, 120, 0.2);
}

.dark .info-item {
  color: #a0aec0;
}

.dark .info-item.status-present {
  background: rgba(72, 187, 120, 0.2);
  border-color: rgba(72, 187, 120, 0.3);
}

.child-details {
  margin-top: 0.8rem;
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  background: rgba(248, 249, 250, 0.5);
  border-radius: 0 0 0.6rem 0.6rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.dark .child-details {
  border-color: #4a5568;
  background: rgba(26, 32, 44, 0.5);
}

.detail-group {
  background: white;
  padding: 0.8rem;
  border-radius: 0.4rem;
  border-left: 3px solid #48bb78;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.dark .detail-group {
  background: #2d3748;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.detail-group h4 {
  color: #48bb78;
  margin-bottom: 0.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.detail-group h4::before {
  content: '';
  width: 6px;
  height: 6px;
  background: #48bb78;
  border-radius: 50%;
}

.dark .detail-group h4 {
  color: #68d391;
}

.detail-group p {
  margin: 0.4rem 0;
  color: #4a5568;
  font-size: 0.85rem;
  line-height: 1.4;
}

.detail-group p strong {
  color: #2d3748;
  font-weight: 600;
}

.dark .detail-group p {
  color: #a0aec0;
}

.dark .detail-group p strong {
  color: #fff;
}

.submit-section {
  margin-top: 1.5rem;
  text-align: center;
  padding: 1rem;
  background: rgba(72, 187, 120, 0.05);
  border-radius: 0.6rem;
  border: 1px solid rgba(72, 187, 120, 0.1);
}

.submit-button {
  padding: 0.8rem 2rem;
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
  position: relative;
  overflow: hidden;
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.submit-button:hover::before {
  left: 100%;
}

.submit-button:hover {
  background: linear-gradient(135deg, #38a169, #2f855a);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(72, 187, 120, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 4px rgba(72, 187, 120, 0.2);
}

.submit-button:disabled:hover {
  transform: none;
  background: linear-gradient(135deg, #48bb78, #38a169);
}

.dark .submit-section {
  background: rgba(72, 187, 120, 0.1);
  border-color: rgba(72, 187, 120, 0.2);
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 2rem;
  color: #718096;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 0.6rem;
  margin: 1rem 0;
}

.loading-spinner i {
  font-size: 1.2rem;
  color: #48bb78;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 1.5rem;
  color: #f56565;
  background: rgba(245, 101, 101, 0.1);
  border: 1px solid rgba(245, 101, 101, 0.2);
  border-radius: 0.6rem;
  margin: 1rem 0;
}

.error-message i {
  font-size: 1.2rem;
}

.dark .loading-spinner {
  background: rgba(45, 55, 72, 0.8);
  color: #a0aec0;
}

.dark .error-message {
  background: rgba(245, 101, 101, 0.15);
  border-color: rgba(245, 101, 101, 0.3);
}

@media (max-width: 768px) {
  .page {
    padding: 0.8rem;
  }

  .header h2 {
    font-size: 1.3rem;
  }

  .search-filter {
    flex-direction: column;
    gap: 0.8rem;
  }

  .search-box {
    max-width: 100%;
    min-width: 100%;
  }

  .filter-box {
    width: 100%;
  }

  .child-item {
    padding: 0.6rem;
  }

  .main-content-row {
    gap: 0.8rem;
  }

  .profile-section {
    gap: 0.6rem;
  }

  .profile-avatar {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .profile-info h3 {
    font-size: 0.9rem;
  }

  .info-row {
    gap: 0.8rem;
  }

  .info-item {
    font-size: 0.75rem;
  }

  .child-details {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .detail-group {
    padding: 0.6rem;
  }

  .submit-section {
    padding: 0.8rem;
  }

  .submit-button {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 0.6rem;
  }

  .header h2 {
    font-size: 1.2rem;
  }

  .search-filter-container {
    padding: 0.8rem;
  }

  .search-box input {
    padding: 0.5rem 0.6rem 0.5rem 2rem;
    font-size: 0.85rem;
  }

  .filter-box select {
    padding: 0.5rem 2rem 0.5rem 0.6rem;
    font-size: 0.85rem;
  }

  .child-item {
    padding: 0.5rem;
  }

  .main-content-row {
    gap: 0.6rem;
  }

  .profile-avatar {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }

  .profile-info h3 {
    font-size: 0.85rem;
  }

  .info-row {
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .info-item {
    font-size: 0.7rem;
  }

  .info-item.status-present {
    padding: 0.15rem 0.4rem;
  }

  .child-details {
    padding: 0.8rem;
  }

  .detail-group {
    padding: 0.5rem;
  }

  .detail-group h4 {
    font-size: 0.85rem;
  }

  .detail-group p {
    font-size: 0.8rem;
  }
}
</style>
  
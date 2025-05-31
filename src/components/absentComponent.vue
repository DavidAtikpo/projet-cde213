<template>
  <div :class="[theme, 'page']">
    <div class="header">
      <h2>Liste des enfants absents</h2>
      <p>Effectif total: {{ children.length }}</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-spinner">
      <i class="fas fa-circle-notch fa-spin"></i>
      <span>Chargement des données...</span>
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
             class="child-item">
          <div class="profile-section">
            <img :src="child.profilePhotoURL" :alt="child.firstName" class="profile-icon">
        <div class="profile-info">
              <h3>{{ child.firstName }} {{ child.lastName }}</h3>
              <p class="class">Classe: {{ child.class }}</p>
              <p class="tel">Tél: {{ child.phoneNumber }}</p>
              <p class="nbre">Nombre d'absences: {{ child.absentCount }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button 
              class="toggle-button" 
              @click="toggleDateVisibility(child._id)"
              :class="{ 'active': isDateVisible[child._id] }"
            >
              <i class="fas" :class="isDateVisible[child._id] ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              {{ isDateVisible[child._id] ? 'Masquer les dates' : 'Voir les dates' }}
            </button>
            <button 
              class="delete-button" 
              @click="confirmDelete(child._id)"
            >
              <i class="fas fa-trash"></i>
              Supprimer
            </button>
          </div>

          <!-- Dates Section -->
          <div v-if="isDateVisible[child._id]" class="dates-section">
            <h4>Historique des absences</h4>
            <div class="dates-list">
              <div v-for="(date, index) in child.absentDates" :key="index" class="date-item">
                <i class="fas fa-calendar-alt"></i>
                <span>{{ formatDate(date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <h3>Confirmer la suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer l'historique des absences de cet enfant ?</p>
        <div class="modal-actions">
          <button class="cancel-button" @click="showDeleteModal = false">Annuler</button>
          <button class="confirm-button" @click="deleteAbsentCountAndDates">Confirmer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';
import { mapState } from 'vuex';

export default {
  name: 'AbsentComponent',
  
  setup() {
    const children = ref([]);
    const filteredChildren = ref([]);
    const isLoading = ref(true);
    const isDateVisible = ref({});
    const searchQuery = ref('');
    const classFilter = ref('');
    const showDeleteModal = ref(false);
    const childToDelete = ref(null);

    const fetchChildren = async () => {
      try {
        isLoading.value = true;
        console.log('Fetching absent children data...');
        const response = await axios.get(`${API_BASE_URL}/absent/absent`);
        console.log('API Response:', response.data);
        
        children.value = response.data.sort((a, b) => a.firstName.localeCompare(b.firstName));
        filteredChildren.value = [...children.value];

        children.value.forEach(child => {
          isDateVisible.value[child._id] = false;
        });
      } catch (error) {
        console.error('Error fetching children:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const filterChildren = () => {
      filteredChildren.value = children.value.filter(child => {
        const matchesSearch = 
          child.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          child.lastName.toLowerCase().includes(searchQuery.value.toLowerCase());
        
        const matchesClass = !classFilter.value || child.class === classFilter.value;
        
        return matchesSearch && matchesClass;
      });
    };

    const toggleDateVisibility = (childId) => {
      isDateVisible.value[childId] = !isDateVisible.value[childId];
    };

    const confirmDelete = (childId) => {
      childToDelete.value = childId;
      showDeleteModal.value = true;
    };

    const deleteAbsentCountAndDates = async () => {
      if (!childToDelete.value) return;
      
      try {
        await axios.delete(`${API_BASE_URL}/absent/absentchild/${childToDelete.value}`);
        children.value = children.value.filter(child => child._id !== childToDelete.value);
        filterChildren();
        showDeleteModal.value = false;
        childToDelete.value = null;
      } catch (error) {
        console.error('Error deleting absent record:', error);
      }
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const uniqueClasses = computed(() => {
      return [...new Set(children.value.map(child => child.class))].sort();
    });

    // Initial fetch
    fetchChildren();

    return {
      children,
      filteredChildren,
      isLoading,
      isDateVisible,
      searchQuery,
      classFilter,
      showDeleteModal,
      uniqueClasses,
      toggleDateVisibility,
      confirmDelete,
      deleteAbsentCountAndDates,
      filterChildren,
      formatDate
    };
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
  max-width: 1200px;
  margin: 0 auto;
}

.child-item {
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.dark .child-item {
  background-color: #2d3748;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.profile-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e2e8f0;
}

.dark .profile-icon {
  border-color: #4a5568;
}

.profile-info {
  flex: 1;
}

.profile-info h3 {
  margin: 0;
  font-size: 1.2rem;
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

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.toggle-button, .delete-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.toggle-button {
  background-color: #4299e1;
  color: white;
}

.toggle-button:hover {
  background-color: #3182ce;
}

.delete-button {
  background-color: #f56565;
  color: white;
}

.delete-button:hover {
  background-color: #e53e3e;
}

.dates-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.dark .dates-section {
  border-color: #4a5568;
}

.dates-section h4 {
  color: #4a5568;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.dark .dates-section h4 {
  color: #a0aec0;
}

.dates-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #f7fafc;
  border-radius: 0.5rem;
  color: #4a5568;
}

.dark .date-item {
  background-color: #2d3748;
  color: #a0aec0;
}

.date-item i {
  color: #4299e1;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 0.75rem;
  max-width: 400px;
  width: 90%;
}

.dark .modal-content {
  background-color: #2d3748;
  color: #fff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.cancel-button, .confirm-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button {
  background-color: #e2e8f0;
  color: #4a5568;
}

.confirm-button {
  background-color: #f56565;
  color: white;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: #718096;
}

@media (max-width: 768px) {
  .page {
    padding: 1rem;
  }

  .search-filter {
    flex-direction: column;
    gap: 1rem;
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

  .action-buttons {
    flex-direction: column;
  }

  .dates-list {
    grid-template-columns: 1fr;
  }
}
</style>


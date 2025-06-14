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
                  <span class="info-item absent-count">
                    <i class="fas fa-calendar-times"></i>
                    {{ child.absentCount }} absence{{ child.absentCount > 1 ? 's' : '' }}
                  </span>
                </div>
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
                {{ isDateVisible[child._id] ? 'Masquer' : 'Dates' }}
              </button>
              <button 
                class="delete-button" 
                @click="confirmDelete(child._id)"
              >
                <i class="fas fa-trash"></i>
                Supprimer
              </button>
            </div>
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
    border-color: #f56565;
    box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
    background-color: #fff;
  }
}

.dark .search-box input {
  background-color: #1a202c;
  border-color: #4a5568;
  color: #fff;
  
  &:focus {
    background-color: #2d3748;
    border-color: #f56565;
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
    border-color: #f56565;
    box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1);
    background-color: #fff;
  }
}

.dark .filter-box select {
  background-color: #1a202c;
  border-color: #4a5568;
  color: #fff;
  
  &:focus {
    background-color: #2d3748;
    border-color: #f56565;
  }
}

.child-list {
  display: grid;
  gap: 0.8rem;
  max-width: 1200px;
  margin: 0 auto;
}

.child-item {
  background-color: #fff;
  border-radius: 0.6rem;
  padding: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid #f56565;
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
  box-shadow: 0 6px 16px rgba(245, 101, 101, 0.12);
  border-left-width: 6px;
}

.child-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #f56565, #e53e3e);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.child-item:hover::before {
  opacity: 1;
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
  background: linear-gradient(135deg, #f56565, #e53e3e);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  border: 2px solid #f1f5f9;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(245, 101, 101, 0.2);
  text-decoration: none;
}

.child-item:hover .profile-avatar {
  border-color: #f56565;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
}

.dark .profile-avatar {
  border-color: #4a5568;
  box-shadow: 0 2px 8px rgba(245, 101, 101, 0.3);
}

.dark .child-item:hover .profile-avatar {
  border-color: #f56565;
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
  color: #f56565;
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
  color: #f56565;
  width: 12px;
  text-align: center;
}

.info-item.absent-count {
  color: #f56565;
  font-weight: 600;
  background: rgba(245, 101, 101, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  border: 1px solid rgba(245, 101, 101, 0.2);
}

.dark .info-item {
  color: #a0aec0;
}

.dark .info-item.absent-count {
  background: rgba(245, 101, 101, 0.2);
  border-color: rgba(245, 101, 101, 0.3);
}

.action-buttons {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex-shrink: 0;
}

.toggle-button, .delete-button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 0.3rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.toggle-button::before,
.delete-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.toggle-button:hover::before,
.delete-button:hover::before {
  left: 100%;
}

.toggle-button {
  background: linear-gradient(135deg, #4299e1, #3182ce);
  color: white;
  box-shadow: 0 2px 4px rgba(66, 153, 225, 0.3);
}

.toggle-button:hover {
  background: linear-gradient(135deg, #3182ce, #2c5282);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 153, 225, 0.4);
}

.delete-button {
  background: linear-gradient(135deg, #f56565, #e53e3e);
  color: white;
  box-shadow: 0 2px 4px rgba(245, 101, 101, 0.3);
}

.delete-button:hover {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(245, 101, 101, 0.4);
}

.dates-section {
  margin-top: 0.8rem;
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  background: rgba(248, 249, 250, 0.5);
  border-radius: 0 0 0.6rem 0.6rem;
}

.dark .dates-section {
  border-color: #4a5568;
  background: rgba(26, 32, 44, 0.5);
}

.dates-section h4 {
  color: #f56565;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.dates-section h4::before {
  content: '';
  width: 6px;
  height: 6px;
  background: #f56565;
  border-radius: 50%;
}

.dark .dates-section h4 {
  color: #fbb6ce;
}

.dates-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.8rem;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  background-color: white;
  border-radius: 0.4rem;
  color: #4a5568;
  border-left: 3px solid #f56565;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.date-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(245, 101, 101, 0.15);
}

.dark .date-item {
  background-color: #2d3748;
  color: #a0aec0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.date-item i {
  color: #f56565;
  font-size: 0.9rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.6rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transform: scale(0.95);
  animation: slideIn 0.3s ease forwards;
}

@keyframes slideIn {
  from {
    transform: scale(0.95);
    opacity: 0.8;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-content h3 {
  margin: 0 0 0.8rem 0;
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
}

.modal-content p {
  margin: 0 0 1rem 0;
  color: #4a5568;
  font-size: 0.9rem;
  line-height: 1.5;
}

.dark .modal-content {
  background-color: #2d3748;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.dark .modal-content h3 {
  color: #fff;
}

.dark .modal-content p {
  color: #a0aec0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.2rem;
}

.cancel-button, .confirm-button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.cancel-button {
  background-color: #e2e8f0;
  color: #4a5568;
  border: 1px solid #cbd5e0;
}

.cancel-button:hover {
  background-color: #cbd5e0;
  transform: translateY(-1px);
}

.confirm-button {
  background: linear-gradient(135deg, #f56565, #e53e3e);
  color: white;
  box-shadow: 0 2px 4px rgba(245, 101, 101, 0.3);
}

.confirm-button:hover {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(245, 101, 101, 0.4);
}

.dark .cancel-button {
  background-color: #4a5568;
  color: #a0aec0;
  border-color: #2d3748;
}

.dark .cancel-button:hover {
  background-color: #2d3748;
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
  color: #f56565;
}

.dark .loading-spinner {
  background: rgba(45, 55, 72, 0.8);
  color: #a0aec0;
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
    flex-direction: column;
    align-items: stretch;
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

  .action-buttons {
    justify-content: center;
    gap: 0.5rem;
  }

  .toggle-button, .delete-button {
    padding: 0.35rem 0.6rem;
    font-size: 0.75rem;
  }

  .dates-section {
    padding: 0.8rem;
  }

  .dates-list {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }

  .modal-content {
    margin: 1rem;
    width: calc(100% - 2rem);
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

  .info-item.absent-count {
    padding: 0.15rem 0.4rem;
  }

  .action-buttons {
    gap: 0.4rem;
  }

  .toggle-button, .delete-button {
    padding: 0.3rem 0.5rem;
    font-size: 0.7rem;
  }

  .dates-section {
    padding: 0.6rem;
  }

  .dates-section h4 {
    font-size: 0.85rem;
  }

  .date-item {
    padding: 0.5rem 0.6rem;
    font-size: 0.8rem;
  }
}
</style>


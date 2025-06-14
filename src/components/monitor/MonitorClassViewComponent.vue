<template>
  <div class="monitor-class-page">
    <div class="page-header">
      <h2>Ma Classe</h2>
      <div v-if="classData" class="class-badge">
        {{ classData.name }}
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <span>Chargement...</span>
    </div>
    
    <div v-else-if="error" class="error-message">
      <i class="error-icon">⚠️</i>
      {{ error }}
    </div>
    
    <div v-else-if="!classData" class="no-data">
      <i class="info-icon">ℹ️</i>
      Aucune classe assignée
    </div>
    
    <div v-else class="content-wrapper">
      <div class="class-info-card">
        <div class="info-item">
          <label>Classe</label>
          <span>{{ classData.name }}</span>
        </div>
        <div class="info-item">
          <label>Moniteur</label>
          <span>{{ monitorName }}</span>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="course-form">
        <div class="form-section">
          <h3>Informations du cours</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Grand titre du cours *</label>
              <input 
                v-model="form.title" 
                type="text" 
                required 
                placeholder="Ex: Les animaux domestiques" 
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label>Sous-thème développé *</label>
              <input 
                v-model="form.subTheme" 
                type="text" 
                required 
                placeholder="Ex: Le chien et le chat" 
                class="form-input"
              />
            </div>
            <div class="form-group full-width">
              <label>Besoins de la classe</label>
              <input 
                v-model="form.need" 
                type="text" 
                placeholder="Ex: Craies, cahiers..." 
                class="form-input"
              />
            </div>
          </div>
        </div>

        <div class="children-section">
          <div class="section-header">
            <h3>Liste des enfants</h3>
            <div class="children-count">
              {{ children.length }} enfant{{ children.length > 1 ? 's' : '' }}
            </div>
          </div>
          
          <div v-if="children.length === 0" class="no-children">
            <i class="info-icon">👥</i>
            Aucun enfant dans cette classe
          </div>
          
          <div v-else class="table-container">
            <div class="table-wrapper">
              <table class="children-table">
                <thead>
                  <tr>
                    <th>Enfant</th>
                    <th>Présent</th>
                    <th>Comportement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="child in children" :key="child._id" class="child-row">
                    <td class="child-name">
                      <div class="name-avatar">
                        <div class="avatar">
                          {{ getInitials(child.firstName, child.lastName) }}
                        </div>
                        <span>{{ child.firstName }} {{ child.lastName }}</span>
                      </div>
                    </td>
                    <td class="presence-cell">
                      <label class="checkbox-wrapper">
                        <input 
                          type="checkbox" 
                          v-model="form.presences[child._id]" 
                          class="checkbox-input"
                        />
                        <span class="checkbox-custom"></span>
                      </label>
                    </td>
                    <td class="behavior-cell">
                      <select 
                        v-model="form.behaviors[child._id]" 
                        class="behavior-select"
                        :class="getBehaviorClass(form.behaviors[child._id])"
                      >
                        <option value="">--Choisir--</option>
                        <option value="Bien">Bien</option>
                        <option value="Moyen">Moyen</option>
                        <option value="Difficile">Difficile</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button 
            class="submit-btn" 
            type="submit" 
            :disabled="!canSubmit()"
            :class="{ 'btn-disabled': !canSubmit() }"
          >
            <span v-if="!canSubmit()">Remplir les champs requis</span>
            <span v-else>📋 Enregistrer le rapport</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';
import { ref, reactive } from 'vue';

export default {
  name: 'MonitorClassViewComponent',
  setup() {
    const loading = ref(false);
    const error = ref(null);
    const classData = ref(null);
    const monitorName = ref('');
    const children = ref([]);
    const form = reactive({
      title: '',
      subTheme: '',
      need: '',
      presences: {},
      behaviors: {}
    });

    const canSubmit = () => {
      return form.title && 
             form.subTheme && 
             children.value.length > 0 &&
             Object.keys(form.presences).some(key => form.presences[key]);
    };

    const getInitials = (firstName, lastName) => {
      return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    };

    const getBehaviorClass = (behavior) => {
      switch(behavior) {
        case 'Bien': return 'behavior-good';
        case 'Moyen': return 'behavior-average';
        case 'Difficile': return 'behavior-difficult';
        default: return '';
      }
    };

    const fetchClassData = async () => {
      loading.value = true;
      error.value = null;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Non authentifié');
        }
        const headers = { Authorization: `Bearer ${token}` };

        // Récupérer la classe du moniteur avec les données populées
        const classRes = await axios.get(`${API_BASE_URL}/class/monitor`, { headers });
        if (!classRes.data) {
          throw new Error('Aucune classe trouvée');
        }
        classData.value = classRes.data;

        // Utiliser directement les données populées
        if (classData.value.monitorId) {
          monitorName.value = `${classData.value.monitorId.firstName} ${classData.value.monitorId.lastName}`;
        }
        
        // Utiliser directement les enfants de la classe
        children.value = classData.value.childIds || [];

        // Initialiser les présences et comportements
        children.value.forEach(child => {
          form.presences[child._id] = false;
          form.behaviors[child._id] = '';
        });
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        error.value = err.response?.data?.error || err.message || 'Une erreur est survenue';
      } finally {
        loading.value = false;
      }
    };

    const handleSubmit = async () => {
      if (!canSubmit()) return;
      
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const reportData = {
          classId: classData.value._id,
          title: form.title,
          subTheme: form.subTheme,
          need: form.need,
          presences: form.presences,
          behaviors: form.behaviors,
          date: new Date()
        };

        await axios.post(`${API_BASE_URL}/monitor-report`, reportData, { headers });
        alert('Rapport enregistré avec succès !');
        
        // Réinitialiser le formulaire
        form.title = '';
        form.subTheme = '';
        form.need = '';
        form.presences = {};
        form.behaviors = {};

        // Réinitialiser les présences et comportements
        children.value.forEach(child => {
          form.presences[child._id] = false;
          form.behaviors[child._id] = '';
        });
      } catch (err) {
        console.error('Erreur lors de l\'enregistrement:', err);
        alert('Erreur lors de l\'enregistrement du rapport : ' + (err.response?.data?.error || err.message));
      }
    };

    return {
      loading,
      error,
      classData,
      monitorName,
      children,
      form,
      canSubmit,
      getInitials,
      getBehaviorClass,
      fetchClassData,
      handleSubmit
    };
  },
  mounted() {
    this.fetchClassData();
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.monitor-class-page {
  max-width: min(95vw, 800px);
  width: 100%;
  margin: 1rem auto;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(219, 35, 35, 0.1);
  padding: 1.5rem;
  overflow-x: hidden;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-header h2 {
  color: #db2323;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.class-badge {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  color: #db2323;
  padding: 2rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #db2323;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message, .no-data, .no-children {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
  padding: 1rem;
  border-radius: 0.8rem;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.error-message {
  color: #db2323;
  background: #fff3f3;
  border: 1px solid #ffebee;
}

.no-data, .no-children {
  color: #666;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.class-info-card {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa, #fff);
  border-radius: 0.8rem;
  border: 1px solid #e9ecef;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.info-item label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item span {
  color: #db2323;
  font-weight: 600;
  font-size: 0.9rem;
}

.course-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 0.8rem;
  padding: 1.2rem;
}

.form-section h3 {
  color: #db2323;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  color: #333;
  font-weight: 500;
  font-size: 0.85rem;
}

.form-input {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #db2323;
  box-shadow: 0 0 0 2px rgba(219, 35, 35, 0.1);
}

.children-section {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 0.8rem;
  padding: 1.2rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.section-header h3 {
  color: #db2323;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.children-count {
  background: #f8f9fa;
  color: #666;
  padding: 0.3rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.table-wrapper {
  min-width: 100%;
}

.children-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.children-table th {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: #fff;
  padding: 0.8rem;
  font-weight: 600;
  font-size: 0.85rem;
  text-align: left;
}

.children-table td {
  padding: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.85rem;
}

.child-row:hover {
  background-color: #f8f9fa;
}

.child-name {
  min-width: 180px;
}

.name-avatar {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  flex-shrink: 0;
}

.presence-cell {
  text-align: center;
  width: 80px;
}

.checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.checkbox-input {
  opacity: 0;
  position: absolute;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s ease;
  position: relative;
}

.checkbox-input:checked + .checkbox-custom {
  background: #db2323;
  border-color: #db2323;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: bold;
}

.behavior-cell {
  min-width: 120px;
}

.behavior-select {
  padding: 0.4rem;
  border: 1px solid #ddd;
  border-radius: 0.4rem;
  font-size: 0.8rem;
  width: 100%;
  background: white;
  transition: all 0.2s ease;
}

.behavior-select:focus {
  outline: none;
  border-color: #db2323;
}

.behavior-good {
  border-color: #28a745;
  color: #28a745;
}

.behavior-average {
  border-color: #ffc107;
  color: #e68900;
}

.behavior-difficult {
  border-color: #dc3545;
  color: #dc3545;
}

.form-actions {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
}

.submit-btn {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: #fff;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 0.6rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(219, 35, 35, 0.2);
}

.submit-btn:hover:not(.btn-disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(219, 35, 35, 0.3);
}

.btn-disabled {
  background: #ccc !important;
  cursor: not-allowed !important;
  box-shadow: none !important;
  transform: none !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .monitor-class-page {
    margin: 0.5rem;
    padding: 1rem;
    border-radius: 0.8rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .page-header h2 {
    font-size: 1.3rem;
  }

  .class-info-card {
    flex-direction: column;
    gap: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .children-table th,
  .children-table td {
    padding: 0.6rem 0.4rem;
    font-size: 0.8rem;
  }

  .name-avatar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }

  .avatar {
    width: 28px;
    height: 28px;
    font-size: 0.65rem;
  }

  .submit-btn {
    padding: 0.8rem 1.5rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .monitor-class-page {
    margin: 0.25rem;
    padding: 0.8rem;
  }

  .children-table {
    font-size: 0.75rem;
  }

  .children-table th,
  .children-table td {
    padding: 0.5rem 0.3rem;
  }

  .form-section,
  .children-section {
    padding: 1rem;
  }
}
</style>

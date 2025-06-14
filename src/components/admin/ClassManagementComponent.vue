<template>
  <div class="class-management-page">
    <div class="page-header">
      <h2>Gestion des Classes</h2>
      <div class="classes-count">
        {{ classes.length }} classe{{ classes.length > 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Formulaire de création/modification de classe -->
    <form @submit.prevent="handleSubmit" class="class-form">
      <div class="form-card">
        <div class="card-header">
          <h3>{{ form._id ? 'Modifier la classe' : 'Nouvelle classe' }}</h3>
          <div v-if="form._id" class="edit-indicator">
            ✏️ Mode édition
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>Nom de la classe *</label>
            <input 
              v-model="form.name" 
              type="text" 
              required 
              placeholder="Ex: CP1, CE2..." 
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Moniteur *</label>
            <select v-model="form.monitorId" required class="form-select">
              <option value="" disabled>Choisir un moniteur</option>
              <option v-for="monitor in monitors" :key="monitor._id" :value="monitor._id">
                {{ monitor.firstName }} {{ monitor.lastName }}
              </option>
            </select>
          </div>
        </div>

        <div class="children-section">
          <div class="section-header">
            <div class="section-title">
              <label>Enfants assignés</label>
              <span class="selected-count">{{ form.childIds.length }} sélectionné{{ form.childIds.length > 1 ? 's' : '' }}</span>
            </div>
            <button type="button" class="select-all-btn" @click="toggleSelectAll">
              {{ isAllSelected ? '🚫 Tout désélectionner' : '✅ Tout sélectionner' }}
            </button>
          </div>
          
          <div class="children-container">
            <div v-if="children.length === 0" class="no-children">
              👥 Aucun enfant disponible
            </div>
            <div v-else class="children-grid">
              <div v-for="child in children" :key="child._id" class="child-card">
                <label class="child-label">
                  <input 
                    type="checkbox" 
                    :value="child._id" 
                    v-model="form.childIds"
                    class="child-checkbox"
                  >
                  <div class="child-info">
                    <div class="child-avatar">
                      {{ getInitials(child.firstName, child.lastName) }}
                    </div>
                    <span class="child-name">{{ child.firstName }} {{ child.lastName }}</span>
                  </div>
                  <div class="check-indicator">✓</div>
                </label>
              </div>
            </div>
          </div>
          <small class="help-text">💡 Sélectionnez les enfants à ajouter à cette classe</small>
        </div>

        <div class="form-actions">
          <button class="submit-btn" type="submit">
            <span v-if="form._id">💾 Mettre à jour la classe</span>
            <span v-else>✨ Créer la classe</span>
          </button>
          <button v-if="form._id" class="cancel-btn" type="button" @click="resetForm">
            🚫 Annuler
          </button>
        </div>
      </div>
    </form>

    <!-- Liste des classes existantes -->
    <div class="classes-section">
      <div class="section-header">
        <h3>Classes existantes</h3>
      </div>
      
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <span>Chargement des classes...</span>
      </div>
      
      <div v-else-if="classes.length === 0" class="no-classes">
        <i class="icon">🏫</i>
        <p>Aucune classe créée pour le moment</p>
        <small>Utilisez le formulaire ci-dessus pour créer votre première classe</small>
      </div>
      
      <div v-else class="classes-grid">
        <div v-for="classe in classes" :key="classe._id" class="class-card">
          <div class="card-header">
            <div class="class-name">
              <h4>{{ classe.name }}</h4>
              <div class="class-stats">
                {{ classe.childIds.length }} enfant{{ classe.childIds.length > 1 ? 's' : '' }}
              </div>
            </div>
            <div class="card-actions">
              <button class="action-btn edit-btn" @click="editClass(classe)" title="Modifier">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete-btn" @click="deleteClass(classe._id)" title="Supprimer">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          
          <div class="class-content">
            <div class="monitor-info">
              <div class="monitor-avatar">
                {{ getMonitorInitials(classe.monitorId) }}
              </div>
              <div class="monitor-details">
                <label>Moniteur</label>
                <span>{{ getMonitorName(classe.monitorId) }}</span>
              </div>
            </div>
            
            <div class="children-info">
              <label>Enfants de la classe</label>
              <div v-if="classe.childIds.length === 0" class="empty-children">
                Aucun enfant assigné
              </div>
              <div v-else class="children-list">
                <div v-for="childId in classe.childIds.slice(0, 6)" :key="childId" class="child-chip">
                  <div class="chip-avatar">
                    {{ getChildInitials(childId) }}
                  </div>
                  <span>{{ getChildName(childId) }}</span>
                </div>
                <div v-if="classe.childIds.length > 6" class="more-children">
                  +{{ classe.childIds.length - 6 }} autres
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  name: 'ClassManagementComponent',
  data() {
    return {
      form: {
        _id: '',
        name: '',
        monitorId: '',
        childIds: []
      },
      classes: [],
      monitors: [],
      children: [],
      loading: false,
      isAllSelected: false
    };
  },
  methods: {
    async fetchAll() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Récupérer les moniteurs
        const monitorsRes = await axios.get(`${API_BASE_URL}/monitor`, { headers });
        this.monitors = monitorsRes.data;

        // Récupérer les enfants
        const childrenRes = await axios.get(`${API_BASE_URL}/child/allchildren`, { headers });
        this.children = childrenRes.data;

        // Récupérer les classes
        const classesRes = await axios.get(`${API_BASE_URL}/class`, { headers });
        this.classes = classesRes.data.map(classe => ({
          ...classe,
          monitorId: classe.monitorId?._id || classe.monitorId,
          childIds: classe.childIds.map(child => child._id || child)
        }));
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        const errorMessage = err.response?.data?.error || err.message;
        alert('Erreur lors du chargement des données : ' + errorMessage);
      } finally {
        this.loading = false;
      }
    },
    async handleSubmit() {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Préparation des données pour l'envoi
        const classeData = {
          name: this.form.name,
          monitorId: this.form.monitorId,
          childIds: Array.isArray(this.form.childIds) ? [...this.form.childIds] : []
        };

        if (this.form._id) {
          await axios.put(`${API_BASE_URL}/class/${this.form._id}`, classeData, { headers });
        } else {
          console.log('Classe envoyée :', classeData);
          await axios.post(`${API_BASE_URL}/class`, classeData, { headers });
        }
        await this.fetchAll();
        this.resetForm();
      } catch (err) {
        console.error('Erreur détaillée:', err);
        const errorMessage = err.response?.data?.error || err.message;
        alert('Erreur lors de la sauvegarde : ' + errorMessage);
      }
    },
    editClass(classe) {
      this.form = { ...classe, monitorId: classe.monitorId?._id || classe.monitorId, childIds: classe.childIds.map(c => c._id || c) };
    },
    async deleteClass(id) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) return;
      try {
        await axios.delete(`${API_BASE_URL}/class/${id}`);
        await this.fetchAll();
        if (this.form._id === id) this.resetForm();
      } catch (err) {
        alert('Erreur lors de la suppression : ' + err.message);
      }
    },
    resetForm() {
      this.form = { _id: '', name: '', monitorId: '', childIds: [] };
    },
    getMonitorName(id) {
      const m = this.monitors.find(m => m._id === (id?._id || id));
      return m ? `${m.firstName} ${m.lastName}` : 'Non défini';
    },
    getChildName(id) {
      const c = this.children.find(c => c._id === (id?._id || id));
      return c ? `${c.firstName} ${c.lastName}` : 'Non défini';
    },
    getInitials(firstName, lastName) {
      return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
    },
    getMonitorInitials(id) {
      const m = this.monitors.find(m => m._id === (id?._id || id));
      return m ? this.getInitials(m.firstName, m.lastName) : 'M';
    },
    getChildInitials(id) {
      const c = this.children.find(c => c._id === (id?._id || id));
      return c ? this.getInitials(c.firstName, c.lastName) : 'E';
    },
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.form.childIds = [];
      } else {
        this.form.childIds = this.children.map(child => child._id);
      }
      this.isAllSelected = !this.isAllSelected;
    }
  },
  watch: {
    'form.childIds': {
      handler(newVal) {
        this.isAllSelected = newVal.length === this.children.length;
      },
      deep: true
    }
  },
  mounted() {
    this.fetchAll();
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.class-management-page {
  max-width: min(95vw, 1000px);
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
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-header h2 {
  color: #db2323;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.classes-count {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.class-form {
  margin-bottom: 2rem;
}

.form-card {
  background: linear-gradient(135deg, #fff, #f8f9fa);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(219, 35, 35, 0.05);
  border: 1px solid #e9ecef;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-header h3 {
  color: #db2323;
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.edit-indicator {
  background: #fff3cd;
  color: #856404;
  padding: 0.3rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #ffeaa7;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-input, .form-select {
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #db2323;
  box-shadow: 0 0 0 2px rgba(219, 35, 35, 0.1);
}

.children-section {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 0.8rem;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.section-title label {
  color: #db2323;
  font-weight: 600;
  font-size: 1rem;
}

.selected-count {
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
}

.select-all-btn {
  background: #f8f9fa;
  color: #db2323;
  border: 1px solid #db2323;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.select-all-btn:hover {
  background: #db2323;
  color: white;
  transform: translateY(-1px);
}

.children-container {
  margin-bottom: 1rem;
}

.no-children {
  text-align: center;
  color: #666;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 0.6rem;
  border: 2px dashed #ddd;
}

.children-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.8rem;
  max-height: 350px;
  overflow-y: auto;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 0.6rem;
  border: 1px solid #e9ecef;
}

.child-card {
  background: white;
  border-radius: 0.6rem;
  transition: all 0.2s ease;
  border: 1px solid #e9ecef;
}

.child-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(219, 35, 35, 0.1);
}

.child-label {
  display: flex;
  align-items: center;
  padding: 0.8rem;
  cursor: pointer;
  gap: 0.8rem;
  position: relative;
}

.child-checkbox {
  display: none;
}

.child-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 1;
}

.child-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  color: #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  border: 2px solid #e9ecef;
  transition: all 0.2s ease;
}

.child-name {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.check-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: transparent;
  transition: all 0.2s ease;
}

.child-checkbox:checked + .child-info .child-avatar {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  border-color: #db2323;
}

.child-checkbox:checked ~ .check-indicator {
  background: #db2323;
  border-color: #db2323;
  color: white;
}

.help-text {
  color: #666;
  font-size: 0.8rem;
  display: block;
  font-style: italic;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.submit-btn {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 0.6rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(219, 35, 35, 0.2);
}

.submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(219, 35, 35, 0.3);
}

.cancel-btn {
  background: white;
  color: #db2323;
  border: 1px solid #db2323;
  padding: 0.8rem 1.5rem;
  border-radius: 0.6rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #fff3f3;
  transform: translateY(-1px);
}

.classes-section {
  margin-top: 2rem;
}

.classes-section .section-header h3 {
  color: #db2323;
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
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

.no-classes {
  text-align: center;
  padding: 3rem 2rem;
  background: #f8f9fa;
  border-radius: 1rem;
  border: 2px dashed #ddd;
}

.no-classes .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.no-classes p {
  color: #666;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
}

.no-classes small {
  color: #999;
  font-size: 0.9rem;
}

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.class-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(219, 35, 35, 0.08);
  border: 1px solid #e9ecef;
  overflow: hidden;
  transition: all 0.2s ease;
}

.class-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(219, 35, 35, 0.15);
}

.class-card .card-header {
  background: linear-gradient(135deg, #f8f9fa, #fff);
  padding: 1.2rem;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 0;
}

.class-name h4 {
  color: #db2323;
  margin: 0 0 0.3rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.class-stats {
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 0.5rem;
  border: 1px solid #db2323;
  background: white;
  color: #db2323;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.8rem;
}

.action-btn:hover {
  background: #db2323;
  color: white;
  transform: scale(1.05);
}

.class-content {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.monitor-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  background: #f8f9fa;
  border-radius: 0.6rem;
}

.monitor-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  flex-shrink: 0;
}

.monitor-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.monitor-details label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.monitor-details span {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.children-info label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.8rem;
  display: block;
}

.empty-children {
  color: #999;
  font-style: italic;
  font-size: 0.9rem;
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
}

.children-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.child-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 0.4rem;
  padding: 0.4rem 0.6rem;
  font-size: 0.75rem;
}

.chip-avatar {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 600;
}

.more-children {
  display: flex;
  align-items: center;
  background: #e9ecef;
  color: #666;
  border-radius: 0.4rem;
  padding: 0.4rem 0.6rem;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .class-management-page {
    margin: 0.5rem;
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .page-header h2 {
    font-size: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .children-grid {
    grid-template-columns: 1fr;
  }

  .classes-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }
}

@media (max-width: 480px) {
  .class-management-page {
    margin: 0.25rem;
    padding: 0.8rem;
  }

  .form-card {
    padding: 1rem;
  }

  .class-content {
    padding: 1rem;
  }

  .children-list {
    flex-direction: column;
  }

  .child-chip {
    justify-content: flex-start;
  }
}
</style> 
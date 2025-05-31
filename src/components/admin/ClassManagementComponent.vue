<template>
  <div class="class-management-page">
    <h2>Gestion des Classes</h2>
    <!-- Formulaire de création/modification de classe -->
    <form @submit.prevent="handleSubmit" class="class-form">
      <div class="form-section">
        <div class="form-group">
          <label>Nom de la classe</label>
          <input v-model="form.name" type="text" required placeholder="Ex: CP1, CE2..." />
        </div>
        <div class="form-group">
          <label>Moniteur</label>
          <select v-model="form.monitorId" required>
            <option value="" disabled>Choisir un moniteur</option>
            <option v-for="monitor in monitors" :key="monitor._id" :value="monitor._id">
              {{ monitor.firstName }} {{ monitor.lastName }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-section children-section">
        <div class="section-header">
          <label>Enfants</label>
          <button type="button" class="select-all-btn" @click="toggleSelectAll">
            {{ isAllSelected ? 'Désélectionner tout' : 'Sélectionner tout' }}
          </button>
        </div>
        <div class="children-list">
          <div v-for="child in children" :key="child._id" class="child-item">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                :value="child._id" 
                v-model="form.childIds"
              >
              <span class="checkbox-text">{{ child.firstName }} {{ child.lastName }}</span>
            </label>
          </div>
        </div>
        <small class="select-help">Cochez les enfants à ajouter à la classe</small>
      </div>

      <div class="form-actions">
        <button class="submit-btn" type="submit">
          {{ form._id ? 'Mettre à jour la classe' : 'Créer la classe' }}
        </button>
        <button v-if="form._id" class="cancel-btn" type="button" @click="resetForm">Annuler</button>
      </div>
    </form>

    <hr />

    <!-- Liste des classes existantes -->
    <div class="classes-list">
      <h3>Liste des classes</h3>
      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="classes.length === 0">Aucune classe créée.</div>
      <div v-else class="class-card" v-for="classe in classes" :key="classe._id">
        <div class="class-header">
          <h4>{{ classe.name }}</h4>
          <button class="edit-btn" @click="editClass(classe)"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" @click="deleteClass(classe._id)"><i class="fas fa-trash"></i></button>
        </div>
        <div class="class-info">
          <p><strong>Moniteur :</strong> {{ getMonitorName(classe.monitorId) }}</p>
          <p><strong>Enfants :</strong></p>
          <ul>
            <li v-for="childId in classe.childIds" :key="childId">
              {{ getChildName(childId) }}
            </li>
          </ul>
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
      if (!confirm('Supprimer cette classe ?')) return;
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
.class-management-page {
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(219,35,35,0.08);
  padding: 2rem;
}
.class-management-page h2 {
  color: #db2323;
  /* margin-bottom: 1.5rem; */
  text-align: center;
}
.class-form {
  display: flex;
  flex-direction: column;
  /* gap: 1.5rem; */
  margin-bottom: 1rem;
}
.form-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  /* flex: 1 1 200px; */
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.form-group label {
  color: #db2323;
  font-weight: 500;
}
.form-group input,
.form-group select {
  padding: 0.7rem;
  border: 1px solid #db2323;
  border-radius: 0.5rem;
  font-size: 1rem;
}
.submit-btn {
  background: #db2323;
  color: #fff;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.submit-btn:hover {
  background: #b31b1b;
}
.cancel-btn {
  background: #fff;
  color: #db2323;
  border: 1px solid #db2323;
  padding: 0.7rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  margin-left: 0.5rem;
}
.cancel-btn:hover {
  background: #f8d7da;
}
hr {
  margin: 2rem 0;
  border: none;
  border-top: 1px solid #eee;
}
.classes-list h3 {
  color: #db2323;
  margin-bottom: 1rem;
}
.class-card {
  background: #f9f9f9;
  border-radius: 0.7rem;
  box-shadow: 0 2px 8px rgba(219,35,35,0.06);
  margin-bottom: 1.2rem;
  padding: 1.2rem;
  border-left: 5px solid #db2323;
}
.class-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.7rem;
}
.class-header h4 {
  flex: 1;
  margin: 0;
  color: #db2323;
}
.edit-btn, .delete-btn {
  background: #fff;
  border: 1px solid #db2323;
  color: #db2323;
  border-radius: 0.4rem;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
}
.edit-btn:hover, .delete-btn:hover {
  background: #db2323;
  color: #fff;
}
.class-info p {
  margin: 0.2rem 0;
}
.class-info ul {
  margin: 0.2rem 0 0 1.2rem;
  padding: 0;
}
.loading {
  color: #db2323;
  text-align: center;
}
.children-section {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #eee;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.section-header label {
  color: #db2323;
  font-weight: 500;
  font-size: 1.1rem;
}
.children-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
  background: white;
  border: 1px solid #db2323;
  border-radius: 0.5rem;
}
.child-item {
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}
.child-item:last-child {
  border-bottom: none;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 0.3rem;
  transition: background-color 0.2s;
}
.checkbox-label:hover {
  background-color: #f8d7da;
}
.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #db2323;
}
.checkbox-text {
  font-size: 0.95rem;
  color: #333;
}
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.select-all-btn {
  background: #f8f9fa;
  color: #db2323;
  border: 1px solid #db2323;
  padding: 0.5rem 1rem;
  border-radius: 0.4rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.select-all-btn:hover {
  background: #db2323;
  color: white;
}
.select-help {
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: block;
}
</style> 
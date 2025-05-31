<template>
  <div class="monitor-registration-page">
    <h2>Inscription des Moniteurs</h2>
    <form @submit.prevent="handleSubmit" class="monitor-form">
      <div class="form-group">
        <label>Prénom</label>
        <input v-model="form.firstName" type="text" required />
      </div>
      <div class="form-group">
        <label>Nom</label>
        <input v-model="form.lastName" type="text" required />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" required />
      </div>
      <div class="form-group">
        <label>Téléphone</label>
        <input v-model="form.phoneNumber" type="text" required />
      </div>
      <button class="submit-btn" type="submit">
        {{ form._id ? 'Mettre à jour' : 'Ajouter' }} le moniteur
      </button>
      <button v-if="form._id" class="cancel-btn" type="button" @click="resetForm">Annuler</button>
    </form>

    <!-- Modal pour afficher le mot de passe -->
    <div v-if="showPasswordModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Informations de connexion</h3>
        <p>Le moniteur a été créé avec succès. Voici ses informations de connexion :</p>
        <div class="credentials">
          <p><strong>Email :</strong> {{ createdMonitor.email }}</p>
          <p><strong>Mot de passe :</strong> {{ createdMonitor.password }}</p>
        </div>
        <p class="warning">⚠️ Notez bien ce mot de passe, il ne sera plus visible après la fermeture de cette fenêtre.</p>
        <button class="close-btn" @click="closePasswordModal">Fermer</button>
      </div>
    </div>

    <hr />
    <div class="monitors-list">
      <h3>Liste des moniteurs</h3>
      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="monitors.length === 0">Aucun moniteur inscrit.</div>
      <div v-else class="monitor-card" v-for="monitor in monitors" :key="monitor._id">
        <div class="monitor-header">
          <span>{{ monitor.firstName }} {{ monitor.lastName }}</span>
          <button class="edit-btn" @click="editMonitor(monitor)"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" @click="deleteMonitor(monitor._id)"><i class="fas fa-trash"></i></button>
        </div>
        <div class="monitor-info">
          <p><strong>Email :</strong> {{ monitor.email }}</p>
          <p><strong>Téléphone :</strong> {{ monitor.phoneNumber }}</p>
          <p><strong>Mot de passe :</strong> {{ monitor.password }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  name: 'MonitorRegistrationComponent',
  data() {
    return {
      form: {
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
      },
      monitors: [],
      loading: false,
      showPasswordModal: false,
      createdMonitor: null
    };
  },
  methods: {
    generatePassword() {
      return 'cde213@25'; // Mot de passe fixe
    },
    async fetchMonitors() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${API_BASE_URL}/monitor`, { headers });
        // Ajouter le mot de passe à chaque moniteur
        this.monitors = res.data.map(monitor => ({
          ...monitor,
          password: 'cde213@25' // Afficher le mot de passe en clair
        }));
      } catch (err) {
        alert('Erreur lors du chargement des moniteurs : ' + err.message);
      } finally {
        this.loading = false;
      }
    },
    async handleSubmit() {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        if (this.form._id) {
          await axios.put(`${API_BASE_URL}/monitor/${this.form._id}`, this.form, { headers });
        } else {
          const { _id, ...formToSend } = this.form;
          // Générer un mot de passe unique
          const password = this.generatePassword();
          const monitorData = {
            ...formToSend,
            password,
            role: 'monitor'
          };
          
          const response = await axios.post(`${API_BASE_URL}/monitor`, monitorData, { headers });
          this.createdMonitor = {
            ...response.data.monitor,
            password // Ajouter le mot de passe en clair pour l'affichage
          };
          this.showPasswordModal = true;
        }
        await this.fetchMonitors();
        this.resetForm();
      } catch (err) {
        alert('Erreur lors de la sauvegarde : ' + (err.response?.data?.error || err.message));
      }
    },
    closePasswordModal() {
      this.showPasswordModal = false;
      this.createdMonitor = null;
    },
    editMonitor(monitor) {
      this.form = { ...monitor };
    },
    async deleteMonitor(id) {
      if (!confirm('Supprimer ce moniteur ?')) return;
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        await axios.delete(`${API_BASE_URL}/monitor/${id}`, { headers });
        await this.fetchMonitors();
        if (this.form._id === id) this.resetForm();
      } catch (err) {
        alert('Erreur lors de la suppression : ' + err.message);
      }
    },
    resetForm() {
      this.form = { _id: '', firstName: '', lastName: '', email: '', phoneNumber: '' };
    }
  },
  mounted() {
    this.fetchMonitors();
  }
};
</script>

<style scoped>
.monitor-registration-page {
  max-width: 900px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(219,35,35,0.08);
  padding: 2rem;
}
.monitor-registration-page h2 {
  color: #db2323;
  margin-bottom: 1.5rem;
  text-align: center;
}
.monitor-form {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 2rem;
}
.form-group {
  flex: 1 1 200px;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.form-group label {
  color: #db2323;
  font-weight: 500;
}
.form-group input {
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
.monitors-list h3 {
  color: #db2323;
  margin-bottom: 1rem;
}
.monitor-card {
  background: #f9f9f9;
  border-radius: 0.7rem;
  box-shadow: 0 2px 8px rgba(219,35,35,0.06);
  margin-bottom: 1.2rem;
  padding: 1.2rem;
  border-left: 5px solid #db2323;
}
.monitor-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.7rem;
}
.monitor-header span {
  flex: 1;
  color: #db2323;
  font-weight: 600;
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
.monitor-info p {
  margin: 0.2rem 0;
}
.loading {
  color: #db2323;
  text-align: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  color: #db2323;
  margin-bottom: 1rem;
}

.credentials {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.credentials p {
  margin: 0.5rem 0;
}

.warning {
  color: #db2323;
  font-size: 0.9rem;
  margin: 1rem 0;
}

.close-btn {
  background: #db2323;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}

.close-btn:hover {
  background: #b31b1b;
}
</style> 
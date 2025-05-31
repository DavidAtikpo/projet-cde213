<template>
  <div class="monitor-class-page">
    <h2>Ma Classe</h2>
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="!classData" class="no-data">
      Aucune classe assignée
    </div>
    <div v-else>
      <div class="class-info">
        <p><strong>Classe :</strong> {{ classData.name }}</p>
        <p><strong>Moniteur :</strong> {{ monitorName }}</p>
      </div>
      <form @submit.prevent="handleSubmit" class="course-form">
        <div class="form-group">
          <label>Grand titre du cours</label>
          <input v-model="form.title" type="text" required placeholder="Ex: Les animaux domestiques" />
        </div>
        <div class="form-group">
          <label>Sous-thème développé</label>
          <input v-model="form.subTheme" type="text" required placeholder="Ex: Le chien et le chat" />
        </div>
        <div class="form-group">
          <label>Besoins de la classe</label>
          <input v-model="form.need" type="text" placeholder="Ex: Craies, cahiers..." />
        </div>
        <h3>Liste des enfants</h3>
        <div v-if="children.length === 0" class="no-children">
          Aucun enfant dans cette classe
        </div>
        <table v-else class="children-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Présent</th>
              <th>Comportement</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="child in children" :key="child._id">
              <td>{{ child.firstName }} {{ child.lastName }}</td>
              <td>
                <input type="checkbox" v-model="form.presences[child._id]" />
              </td>
              <td>
                <select v-model="form.behaviors[child._id]">
                  <option value="">--Choisir--</option>
                  <option value="Bien">Bien</option>
                  <option value="Moyen">Moyen</option>
                  <option value="Difficile">Difficile</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <button class="submit-btn" type="submit" :disabled="!canSubmit">Enregistrer le rapport</button>
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
        const classRes = await axios.get('http://localhost:8000/class/monitor', { headers });
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

        await axios.post('http://localhost:8000/monitor-report', reportData, { headers });
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
.monitor-class-page {
  max-width: 700px;
  margin: 2rem auto;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(219,35,35,0.08);
  padding: 2rem;
}
.monitor-class-page h2 {
  color: #db2323;
  margin-bottom: 1.5rem;
  text-align: center;
}
.class-info {
  margin-bottom: 1.5rem;
  color: #db2323;
}
.course-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
.children-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}
.children-table th, .children-table td {
  border: 1px solid #db2323;
  padding: 0.5rem;
  text-align: center;
}
.children-table th {
  background: #db2323;
  color: #fff;
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
.submit-btn:hover:not(:disabled) {
  background: #b31b1b;
}
.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.loading {
  color: #db2323;
  text-align: center;
}
.error-message {
  color: #db2323;
  text-align: center;
  padding: 1rem;
  background: #fff3f3;
  border-radius: 0.5rem;
  margin: 1rem 0;
}
.no-data, .no-children {
  text-align: center;
  color: #666;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 0.5rem;
  margin: 1rem 0;
}
</style>

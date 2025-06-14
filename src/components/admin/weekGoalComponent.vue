<template>
  <div class="page">
    <div class="content">
      <div class="header">
        <h2>🎯 Définir l'objectif pour la Semaine</h2>
        <p class="description">Créez un objectif hebdomadaire pour guider les activités</p>
      </div>
      
      <div class="form-card">
        <div class="input-group">
          <label for="weeklyGoal">📝 Objectif de la semaine *</label>
          <textarea 
            id="weeklyGoal" 
            v-model="weeklyGoal" 
            rows="4" 
            :class="{ 'error-border': errorSubmitting }" 
            ref="weeklyGoalField"
            placeholder="Décrivez l'objectif principal pour cette semaine..."
          ></textarea>
          <small class="help-text">💡 Soyez spécifique et mesurable dans votre objectif</small>
        </div>
        
        <div class="form-actions">
          <button @click="submitForm" :disabled="!weeklyGoal.trim() || loading" class="submit-btn">
            <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
            <span v-else>✅ Enregistrer l'objectif</span>
          </button>
        </div>
        
        <div v-if="errorFetchingDate" class="error-message">
          ⚠️ Erreur lors du chargement. Veuillez vérifier votre connexion Internet.
        </div>
      </div>
    </div>
    
    <!-- Success Popup -->
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <div class="popup-icon">✅</div>
        <h3>Objectif créé avec succès !</h3>
        <p>L'objectif hebdomadaire a été enregistré</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';
import TypewriterText from '@/components/TypewriterText.vue';

export default {
  components: {
    TypewriterText
  },
  data() {
    return {
      loading: false,
      weeklyGoal: '',
      showPopup: false,
      errorSubmitting: false,
      errorFetchingDate: false
    };
  },
  methods: {
    submitForm() {
      if (!this.weeklyGoal.trim()) return;
      
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const formData = {
        weeklyGoal: this.weeklyGoal
      };
      
      this.loading = true;
      
      axios.post(`${API_BASE_URL}/week/weekly`, formData, { headers })
        .then(response => {
          console.log('Form submitted successfully:', response.data);
          this.weeklyGoal = '';
          this.showPopup = true;
          setTimeout(() => {
            this.showPopup = false;
            this.$router.push(`/admin/${this.$route.params.id}`);
            this.$parent.activeTab = 'create-activity';
          }, 2000);
          this.errorSubmitting = false;
        })
        .catch(error => {
          console.error('Error submitting form:', error);
          this.errorSubmitting = true;
          this.shakeInput();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    shakeInput() {
      const weeklyGoalField = this.$refs.weeklyGoalField;
      if (weeklyGoalField) {
        weeklyGoalField.classList.add('shake');
        setTimeout(() => weeklyGoalField.classList.remove('shake'), 500);
      }
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.content {
  width: 100%;
  max-width: min(95vw, 600px);
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(219, 35, 35, 0.1);
  border: 1px solid #e9ecef;
}

.header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.header h2 {
  color: #db2323;
  font-size: 1.4rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.description {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.form-card {
  background: linear-gradient(135deg, #f8f9fa, #fff);
  border-radius: 0.8rem;
  padding: 1.2rem;
  border: 1px solid #e9ecef;
}

.input-group {
  margin-bottom: 1.2rem;
}

.input-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.6rem;
  font-size: 0.9rem;
}

.input-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #333;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 100px;
  background-color: #fff;
}

.input-group textarea:focus {
  outline: none;
  border-color: #db2323;
  box-shadow: 0 0 0 2px rgba(219, 35, 35, 0.1);
}

.input-group textarea.error-border {
  border-color: #dc3545;
  animation: shake 0.5s;
}

.input-group textarea::placeholder {
  color: #999;
  font-size: 0.85rem;
}

.help-text {
  display: block;
  color: #666;
  font-size: 0.75rem;
  margin-top: 0.4rem;
  font-style: italic;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #db2323 0%, #b31b1b 100%);
  color: #fff;
  border: none;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(219, 35, 35, 0.2);
  min-width: 180px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(219, 35, 35, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  background: #ccc;
}

.error-message {
  background: #fff3f3;
  color: #dc3545;
  padding: 0.8rem;
  border-radius: 0.6rem;
  font-size: 0.85rem;
  margin-top: 1rem;
  border: 1px solid #ffebee;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.popup-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s ease;
  max-width: 300px;
  margin: 1rem;
}

.popup-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.popup-content h3 {
  color: #1e293b;
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.popup-content p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .page {
    padding: 0.5rem;
  }

  .content {
    padding: 1rem;
  }

  .header h2 {
    font-size: 1.2rem;
  }

  .description {
    font-size: 0.8rem;
  }

  .form-card {
    padding: 1rem;
  }

  .input-group textarea {
    padding: 0.7rem;
    font-size: 0.85rem;
    min-height: 80px;
  }

  .submit-btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.85rem;
    min-width: 150px;
  }

  .popup-content {
    padding: 1.5rem;
    margin: 0.5rem;
  }

  .popup-icon {
    font-size: 2.5rem;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 0.8rem;
  }

  .header {
    margin-bottom: 1rem;
    padding-bottom: 0.8rem;
  }

  .header h2 {
    font-size: 1.1rem;
  }

  .form-card {
    padding: 0.8rem;
  }

  .submit-btn {
    width: 100%;
    min-width: auto;
  }

  .popup-content {
    padding: 1.2rem;
  }
}
</style>

  
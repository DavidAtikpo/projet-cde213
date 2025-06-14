<template>
  <div class="activity-page" :class="theme">
    <div class="activity-container">
      <!-- En-tête -->
      <div class="activity-header">
        <h1>🎯 Planification des objectifs</h1>
        <div class="info-card">
          <TypewriterText 
            class="typewriter-text" 
            text="Définissez vos objectifs quotidiens pour la semaine en cours. Assurez-vous de remplir tous les champs pour une planification efficace." 
          />
        </div>
      </div>

      <!-- Objectif hebdomadaire -->
      <div class="week-goal-card">
        <div class="card-header">
          <h3>🎯 Objectif hebdomadaire</h3>
        </div>
        <div class="card-content">
          <p>{{ goalOfWeek || 'Aucun objectif défini pour cette semaine' }}</p>
        </div>
      </div>

      <!-- Formulaire des objectifs quotidiens -->
      <div class="daily-goals">
        <div v-for="(day, index) in days" 
             :key="index" 
             class="goal-card"
             :class="{ 'has-error': errors[index] }">
          <div class="goal-header">
            <h3>{{ getDayEmoji(index) }} {{ day.label }}</h3>
            <div class="goal-status" :class="{ 'filled': day.goal.trim() }">
              {{ day.goal.trim() ? '✅' : '⏳' }}
            </div>
          </div>
          <div class="goal-content">
            <textarea 
              :id="`dailyGoal-${index}`" 
              v-model="day.goal" 
              rows="3" 
              :placeholder="`Objectifs pour ${day.label.toLowerCase()}`"
              :ref="'textarea-' + index"
              class="form-control"
            ></textarea>
            <div v-if="errors[index]" class="error-message">
              ⚠️ Ce champ est requis
            </div>
          </div>
        </div>
      </div>

      <!-- Message d'erreur de chargement -->
      <div v-if="errorFetchingDate" class="error-alert">
        ⚠️ Erreur lors du chargement des données. Veuillez vérifier votre connexion Internet.
      </div>

      <!-- Bouton de soumission -->
      <div class="submit-section">
        <button 
          @click="submitForm" 
          :disabled="loading || !canSubmit"
          class="submit-button"
          :class="{ 'ready': canSubmit }"
        >
          <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
          <span v-else>{{ canSubmit ? '🚀 Soumettre les objectifs' : '📝 Complétez tous les champs' }}</span>
        </button>
        <div class="submit-info">
          <small>{{ filledCount }}/{{ days.length }} objectifs complétés</small>
        </div>
      </div>

      <!-- Popup de succès -->
      <transition name="fade">
        <div v-if="showPopup" class="success-popup">
          <div class="popup-content">
            <div class="popup-icon">🎉</div>
            <h2>Objectifs enregistrés avec succès !</h2>
            <p>Redirection en cours...</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';
import { mapState } from 'vuex';
import TypewriterText from '@/components/TypewriterText.vue';

export default {
  components: {
    TypewriterText
  },
  data() {
    return {
      loading: false,
      days: [
        { label: 'Mardi', goal: '' },
        { label: 'Mercredi', goal: '' },
        { label: 'Jeudi', goal: '' },
        { label: 'Vendredi', goal: '' },
        { label: 'Samedi', goal: '' }
      ],
      showPopup: false,
      errors: [false, false, false, false, false],
      errorFetchingDate: false,
      goalOfWeek: ''
    };
  },
  computed: {
    ...mapState(['theme']),
    filledCount() {
      return this.days.filter(day => day.goal.trim()).length;
    },
    canSubmit() {
      return this.days.every(day => day.goal.trim());
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    getDayEmoji(index) {
      const emojis = ['📅', '📆', '🗓️', '📋', '⭐'];
      return emojis[index] || '📝';
    },
    
    fetchData() {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      axios.get(`${API_BASE_URL}/week/getgoal`, { headers })
        .then(response => {
          this.goalOfWeek = response.data.data.weeklyGoal;
        })
        .catch(error => {
          console.error('Erreur lors du chargement de la date :', error);
          this.errorFetchingDate = true;
        });
    },
    
    submitForm() {
      if (!this.canSubmit) return;
      
      let hasError = false;
      this.errors = this.days.map(day => !day.goal.trim());

      this.errors.forEach(error => {
        if (error) hasError = true;
      });

      if (hasError) {
        this.shakeInput();
        return;
      }

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const goalsData = {
        tuesday: this.days[0].goal,
        wednesday: this.days[1].goal,
        thursday: this.days[2].goal,
        friday: this.days[3].goal,
        saturday: this.days[4].goal
      };

      this.loading = true;
      axios.post(`${API_BASE_URL}/week/weeks`, goalsData, { headers })
        .then(response => {
          this.errors = [false, false, false, false, false];
          this.showPopup = true;
          setTimeout(() => {
            this.showPopup = false;
            this.$router.push(`/user/${this.$route.params.id}`);
            this.$parent.activeTab = 'check-in';
          }, 2000);
        })
        .catch(error => {
          console.error('Erreur lors de la soumission du formulaire :', error);
          this.shakeInput();
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    shakeInput() {
      this.errors.forEach((error, index) => {
        if (error) {
          const textarea = this.$refs[`textarea-${index}`][0];
          textarea.classList.add('shake');
          setTimeout(() => {
            textarea.classList.remove('shake');
          }, 500);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.activity-page {
  min-height: 100vh;
  padding: 1rem;
  background: #f8f9fa;
}

.activity-container {
  max-width: min(95vw, 1000px);
  margin: 0 auto;
}

.activity-header {
  text-align: center;
  margin-bottom: 1.5rem;

  h1 {
    font-size: 1.6rem;
    color: #db2323;
    margin-bottom: 1rem;
    font-weight: 600;
  }
}

.info-card {
  background: linear-gradient(135deg, #fff, #f8f9fa);
  padding: 1rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 12px rgba(219, 35, 35, 0.08);
  margin-bottom: 1.5rem;
  border: 1px solid #e9ecef;
}

.week-goal-card {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  border-radius: 0.8rem;
  padding: 1.2rem;
  box-shadow: 0 4px 20px rgba(219, 35, 35, 0.2);
  margin-bottom: 1.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }
}

.card-content {
  p {
    margin: 0;
    line-height: 1.5;
    font-size: 0.9rem;
    opacity: 0.95;
  }
}

.daily-goals {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.goal-card {
  background: white;
  border-radius: 0.8rem;
  padding: 1rem;
  box-shadow: 0 2px 12px rgba(219, 35, 35, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(219, 35, 35, 0.15);
  }

  &.has-error {
    border-color: #dc3545;
    box-shadow: 0 2px 12px rgba(220, 53, 69, 0.2);
  }
}

.goal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;

  h3 {
    margin: 0;
    font-size: 0.95rem;
    color: #333;
    font-weight: 600;
  }
}

.goal-status {
  font-size: 1.2rem;
  opacity: 0.6;
  
  &.filled {
    opacity: 1;
  }
}

.goal-content {
  .form-control {
    width: 100%;
    padding: 0.7rem;
    border: 1px solid #ddd;
    border-radius: 0.6rem;
    font-size: 0.85rem;
    transition: all 0.3s ease;
    resize: vertical;
    min-height: 80px;
    background-color: #fff;

    &:focus {
      outline: none;
      border-color: #db2323;
      box-shadow: 0 0 0 2px rgba(219, 35, 35, 0.1);
    }

    &::placeholder {
      color: #999;
      font-size: 0.8rem;
    }
  }
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: #fff3f3;
  padding: 0.4rem 0.6rem;
  border-radius: 0.4rem;
  border: 1px solid #ffebee;
}

.error-alert {
  background: #fff3cd;
  color: #856404;
  padding: 0.8rem;
  border-radius: 0.6rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  border: 1px solid #ffeaa7;
}

.submit-section {
  text-align: center;
  margin-top: 1.5rem;
}

.submit-button {
  width: 100%;
  max-width: 400px;
  background: #ccc;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &.ready {
    background: linear-gradient(135deg, #db2323, #b31b1b);
    box-shadow: 0 2px 8px rgba(219, 35, 35, 0.2);

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(219, 35, 35, 0.3);
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
}

.submit-info {
  margin-top: 0.5rem;
  
  small {
    color: #666;
    font-size: 0.8rem;
  }
}

.success-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
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

.popup-content h2 {
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.popup-content p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Dark theme */
:deep(.dark) {
  .activity-page {
    background: #1a1a1a;
  }

  .info-card,
  .goal-card {
    background: #2d2d2d;
    border-color: #404040;
  }

  .activity-header h1 {
    color: #fff;
  }

  .card-header h3,
  .goal-header h3 {
    color: #fff;
  }

  .card-content p {
    color: #ccc;
  }

  .form-control {
    background: #1a1a1a;
    border-color: #404040;
    color: #fff;

    &:focus {
      border-color: #db2323;
    }

    &::placeholder {
      color: #888;
    }
  }

  .error-alert {
    background: #2d2d2d;
    color: #ffc107;
    border-color: #555;
  }

  .error-message {
    background: #2d1a1a;
    border-color: #553333;
  }

  .popup-content {
    background: #2d2d2d;

    h2 {
      color: #fff;
    }

    p {
      color: #ccc;
    }
  }

  .submit-info small {
    color: #888;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .activity-page {
    padding: 0.5rem;
  }

  .activity-header h1 {
    font-size: 1.4rem;
  }

  .info-card,
  .week-goal-card {
    padding: 0.8rem;
  }

  .daily-goals {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .goal-card {
    padding: 0.8rem;
  }

  .form-control {
    min-height: 70px;
    font-size: 0.8rem;
  }

  .submit-button {
    font-size: 0.85rem;
    padding: 0.7rem 1.2rem;
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
  .activity-container {
    padding: 0;
  }

  .activity-header h1 {
    font-size: 1.2rem;
  }

  .daily-goals {
    gap: 0.6rem;
  }

  .goal-card {
    padding: 0.6rem;
  }

  .card-header h3,
  .goal-header h3 {
    font-size: 0.85rem;
  }

  .form-control {
    padding: 0.6rem;
    font-size: 0.8rem;
    min-height: 60px;
  }

  .submit-button {
    width: 100%;
    max-width: none;
    margin: 0 0.5rem;
  }

  .popup-content {
    padding: 1.2rem;
    margin: 0.5rem;
  }
}
</style>



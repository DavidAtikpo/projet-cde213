<template>
  <div class="check-in-page" :class="theme">
    <div class="check-in-container">
      <!-- En-tête -->
      <div class="check-in-header">
        <h1>📝 {{ translatedTitle }}</h1>
        <div class="info-card">
          <TypewriterText 
            class="typewriter-text" 
            text="Avant de définir l'objectif de la journée, veillez vérifier si l'objectif hebdomadaire a été défini. Si non, cliquez sur l'onglet 'Objectifs Heb' et remplir l'objectif de la semaine." 
          />
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="check-in-content">
        <!-- Objectif hebdomadaire -->
        <div class="weekly-goal-card">
          <div class="card-header">
            <h3>🎯 Objectif hebdomadaire</h3>
            <div class="goal-status">
              {{ dailyGoals ? '✅' : '⏳' }}
            </div>
          </div>
          <div class="card-content">
            <p>{{ dailyGoals || 'Aucun objectif défini pour cette semaine' }}</p>
          </div>
        </div>

        <!-- Formulaire de check-in -->
        <div class="check-in-form">
          <div class="form-header">
            <h3>📋 Check-in du jour</h3>
            <div class="current-time">{{ getCurrentTime() }}</div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>
                🕐 Heure d'arrivée
              </label>
              <input 
                type="text" 
                v-model="arrivalTime" 
                readonly 
                class="form-control"
              >
            </div>

            <div class="form-group">
              <label>
                📅 Date
              </label>
              <input 
                type="date" 
                v-model="date" 
                readonly 
                class="form-control"
              >
            </div>
          </div>

          <div class="form-group">
            <label>
              🎯 Objectif de la journée
            </label>
            <textarea 
              v-model="dailyGoal" 
              :class="['form-control', { 'error': errorMessage }]"
              rows="3" 
              ref="dailyGoalInput"
              placeholder="Décrivez vos objectifs pour aujourd'hui..."
            ></textarea>
            <div v-if="errorMessage" class="error-message">
              ⚠️ {{ errorMessage }}
            </div>
          </div>

          <button 
            @click="submitForm" 
            :disabled="loading || !dailyGoal.trim()"
            class="submit-button"
            :class="{ 'ready': dailyGoal.trim() }"
          >
            <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
            <span v-else>{{ dailyGoal.trim() ? '🚀 Enregistrer le check-in' : '📝 Complétez l\'objectif' }}</span>
          </button>
        </div>
      </div>

      <!-- Message d'erreur de chargement -->
      <div v-if="errorFetchingDate" class="error-alert">
        ⚠️ Erreur lors du chargement de la date. Veuillez vérifier votre connexion Internet.
      </div>

      <!-- Popup de succès -->
      <transition name="fade">
        <div v-if="showPopup" class="success-popup">
          <div class="popup-content">
            <div class="popup-icon">🎉</div>
            <h2>Check-in enregistré avec succès !</h2>
            <p>Redirection vers les analytics...</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import { API_BASE_URL } from '@/config.js';
import TypewriterText from '@/components/TypewriterText.vue';

export default {
  components: {
    TypewriterText
  },
  data() {
    return {
      loading: false,
      arrivalTime: '',
      date: '',
      dailyGoal: '',
      dailyGoals: '',
      errorFetchingDate: false,
      showPopup: false,
      weeklyGoals: {},
      errorMessage: ''
    };
  },
  computed: {
    ...mapState(['theme', 'language']),
    translatedTitle() {
      const titles = {
        en: 'Daily Check-in',
        fr: 'Check-in quotidien'
      };
      return titles[this.language] || titles.fr;
    }
  },
  mounted() {
    this.arrivalTime = this.getCurrentTime();
    this.fetchDate();
  },
  methods: {
    getCurrentTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    fetchDate() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      this.date = `${year}-${month}-${day}`;

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      axios.get(`${API_BASE_URL}/week/getweekly`, { headers })
        .then(response => {
          this.weeklyGoals = response.data;
          this.setDailyGoal();
        })
        .catch(error => {
          console.error('Error fetching weekly goals:', error);
          this.errorFetchingDate = true;
        });
    },
    setDailyGoal() {
      const currentDayOfWeek = new Date().getDay();
      const weeklyGoalsData = this.weeklyGoals.data;
      const dayKeys = Object.keys(weeklyGoalsData).filter(key => 
        ['sunday','monday','tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].includes(key.toLowerCase())
      );
      const dayKey = dayKeys[currentDayOfWeek];
      if (dayKey) {
        this.dailyGoals = weeklyGoalsData[dayKey];
      }
    },
    submitForm() {
      if (!this.dailyGoal.trim()) {
        this.errorMessage = "Le champ 'Objectif de la journée' est requis.";
        this.shakeInput();
        return;
      }

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const formData = {
        arrivalTime: this.arrivalTime,
        date: this.date,
        dailyGoal: this.dailyGoal
      };

      this.loading = true;
      axios.post(`${API_BASE_URL}/user/entre`, formData, { headers })
        .then(response => {
          this.arrivalTime = '';
          this.date = '';
          this.dailyGoal = '';
          this.showPopup = true;
          this.errorMessage = '';
          localStorage.setItem('dailyGoal', formData.dailyGoal);
          setTimeout(() => {
            this.showPopup = false;
            this.$router.push('/user/analytics');
          }, 2000);
        })
        .catch(error => {
          console.error('Error submitting form:', error);
          this.errorMessage = "Une erreur est survenue lors de l'enregistrement.";
        })
        .finally(() => {
          this.loading = false;
        });
    },
    shakeInput() {
      const input = this.$refs.dailyGoalInput;
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 500);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.check-in-page {
  min-height: 100vh;
  padding: 1rem;
  background: #f8f9fa;
}

.check-in-container {
  max-width: min(95vw, 1000px);
  margin: 0 auto;
}

.check-in-header {
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

.check-in-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 1.5rem;
}

.weekly-goal-card {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  border-radius: 0.8rem;
  padding: 1.2rem;
  box-shadow: 0 4px 20px rgba(219, 35, 35, 0.2);
  height: fit-content;
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

.goal-status {
  font-size: 1.2rem;
  opacity: 0.9;
}

.card-content {
  p {
    margin: 0;
    line-height: 1.5;
    font-size: 0.9rem;
    opacity: 0.95;
  }
}

.check-in-form {
  background: white;
  border-radius: 0.8rem;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(219, 35, 35, 0.08);
  border: 1px solid #e9ecef;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #e9ecef;

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #333;
    font-weight: 600;
  }
}

.current-time {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
    font-size: 0.9rem;
  }
}

.form-control {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 0.6rem;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  background-color: #fff;

  &:focus {
    outline: none;
    border-color: #db2323;
    box-shadow: 0 0 0 2px rgba(219, 35, 35, 0.1);
  }

  &.error {
    border-color: #dc3545;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
  }

  &::placeholder {
    color: #999;
    font-size: 0.8rem;
  }
}

textarea.form-control {
  resize: vertical;
  min-height: 80px;
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

.submit-button {
  width: 100%;
  background: #ccc;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
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

.error-alert {
  background: #fff3cd;
  color: #856404;
  padding: 0.8rem;
  border-radius: 0.6rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  border: 1px solid #ffeaa7;
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
  .check-in-page {
    background: #1a1a1a;
  }

  .info-card,
  .check-in-form {
    background: #2d2d2d;
    border-color: #404040;
  }

  .check-in-header h1 {
    color: #fff;
  }

  .form-header {
    border-color: #404040;

    h3 {
      color: #fff;
    }
  }

  .form-group label {
    color: #fff;
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
}

/* Responsive Design */
@media (max-width: 768px) {
  .check-in-page {
    padding: 0.5rem;
  }

  .check-in-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .check-in-header h1 {
    font-size: 1.4rem;
  }

  .info-card {
    padding: 0.8rem;
  }

  .check-in-form {
    padding: 1.2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .current-time {
    align-self: flex-end;
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
  .check-in-container {
    padding: 0;
  }

  .check-in-header h1 {
    font-size: 1.2rem;
  }

  .check-in-form {
    padding: 1rem;
  }

  .form-control {
    padding: 0.6rem;
    font-size: 0.8rem;
  }

  textarea.form-control {
    min-height: 70px;
  }

  .submit-button {
    font-size: 0.85rem;
    padding: 0.7rem 1.2rem;
  }

  .popup-content {
    padding: 1.2rem;
    margin: 0.5rem;
  }
}
</style>

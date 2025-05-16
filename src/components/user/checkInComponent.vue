<template>
  <div class="check-in-page" :class="theme">
    <div class="check-in-container">
      <!-- En-tête -->
      <div class="check-in-header">
        <h1>{{ translatedTitle }}</h1>
        <div class="info-card">
          <TypewriterText 
            class="typewriter-text" 
            text="Avant de définir l'objectif de la journée, veillez vérifier si l'objectif hebdomadaire a été défini. Si non, cliquez sur l'onglet 'Objectifs Heb' et remplir l'objectif de la semaine. Cela se fera une seule fois dans la semaine." 
          />
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="check-in-content">
        <!-- Objectif hebdomadaire -->
        <div class="weekly-goal-card">
          <div class="card-header">
            <i class="fas fa-bullseye"></i>
            <h3>Objectif hebdomadaire</h3>
          </div>
          <div class="card-content">
            <p>{{ dailyGoals }}</p>
          </div>
        </div>

        <!-- Formulaire de check-in -->
        <div class="check-in-form">
          <div class="form-group">
            <label>
              <i class="fas fa-clock"></i>
              Heure d'arrivée
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
              <i class="fas fa-calendar"></i>
              Date
            </label>
            <input 
              type="date" 
              v-model="date" 
              readonly 
              class="form-control"
            >
          </div>

          <div class="form-group">
            <label>
              <i class="fas fa-tasks"></i>
              Objectif de la journée
            </label>
            <textarea 
              v-model="dailyGoal" 
              :class="['form-control', { 'error': errorMessage }]"
              rows="4" 
              ref="dailyGoalInput"
              placeholder="Décrivez vos objectifs pour aujourd'hui..."
            ></textarea>
            <div v-if="errorMessage" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              {{ errorMessage }}
            </div>
          </div>

          <button 
            @click="submitForm" 
            :disabled="loading"
            class="submit-button"
          >
            <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
            <span v-else>Enregistrer le check-in</span>
          </button>
        </div>
      </div>

      <!-- Message d'erreur de chargement -->
      <div v-if="errorFetchingDate" class="error-alert">
        <i class="fas fa-exclamation-triangle"></i>
        Erreur lors du chargement de la date. Veuillez vérifier votre connexion Internet.
      </div>

      <!-- Popup de succès -->
      <transition name="fade">
        <div v-if="showPopup" class="success-popup">
          <div class="popup-content">
            <i class="fas fa-check-circle"></i>
            <h2>Check-in enregistré avec succès !</h2>
            <p>Redirection en cours...</p>
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
      if (!this.dailyGoal) {
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
          }, 3000);
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
.check-in-page {
  min-height: 100vh;
  padding: 2rem;
  background: #f8f9fa;
}

.check-in-container {
  max-width: 1200px;
  margin: 0 auto;
}

.check-in-header {
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 1rem;
  }
}

.info-card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.check-in-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.weekly-goal-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;

  i {
    color: #db2323;
    font-size: 1.2rem;
  }

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
  }
}

.card-content {
  p {
    margin: 0;
    color: #666;
    line-height: 1.5;
  }
}

.check-in-form {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;

    i {
      color: #db2323;
    }
  }
}

.form-control {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #db2323;
  }

  &.error {
    border-color: #dc3545;
  }
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-button {
  width: 100%;
  background: #db2323;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;

  &:hover {
    background: darken(#db2323, 10%);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.error-alert {
  background: #fff3cd;
  color: #856404;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.success-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  i {
    font-size: 3rem;
    color: #28a745;
    margin-bottom: 1rem;
  }

  h2 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    margin: 0;
  }
}

.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
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
  .weekly-goal-card,
  .check-in-form {
    background: #2d2d2d;
  }

  .check-in-header h1 {
    color: #fff;
  }

  .card-header h3 {
    color: #fff;
  }

  .card-content p {
    color: #ccc;
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
  }

  .error-alert {
    background: #2d2d2d;
    color: #ffc107;
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
    padding: 1rem;
  }

  .check-in-content {
    grid-template-columns: 1fr;
  }

  .check-in-header h1 {
    font-size: 1.5rem;
  }

  .info-card {
    padding: 1rem;
  }

  .check-in-form {
    padding: 1.5rem;
  }
}
</style>

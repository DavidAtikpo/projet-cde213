<template>
  <div class="activity-page" :class="theme">
    <div class="activity-container">
      <!-- En-tête -->
      <div class="activity-header">
        <h1>Planification des objectifs</h1>
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
          <i class="fas fa-bullseye"></i>
          <h3>Objectif hebdomadaire</h3>
        </div>
        <div class="card-content">
          <p>{{ goalOfWeek }}</p>
        </div>
      </div>

      <!-- Formulaire des objectifs quotidiens -->
      <div class="daily-goals">
        <div v-for="(day, index) in days" 
             :key="index" 
             class="goal-card"
             :class="{ 'has-error': errors[index] }">
          <div class="goal-header">
            <i class="fas fa-calendar-day"></i>
            <h3>{{ day.label }}</h3>
          </div>
          <div class="goal-content">
            <textarea 
              :id="`dailyGoal-${index}`" 
              v-model="day.goal" 
              rows="4" 
              :placeholder="`Entrez vos objectifs pour ${day.label.toLowerCase()}`"
              :ref="'textarea-' + index"
              class="form-control"
            ></textarea>
            <div v-if="errors[index]" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              Ce champ est requis
            </div>
          </div>
          </div>
        </div>

      <!-- Message d'erreur de chargement -->
      <div v-if="errorFetchingDate" class="error-alert">
        <i class="fas fa-exclamation-triangle"></i>
        Erreur lors du chargement des données. Veuillez vérifier votre connexion Internet.
      </div>

      <!-- Bouton de soumission -->
      <div class="submit-section">
        <button 
          @click="submitForm" 
          :disabled="loading"
          class="submit-button"
        >
          <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
          <span v-else>Soumettre les objectifs</span>
        </button>
      </div>

      <!-- Popup de succès -->
      <transition name="fade">
        <div v-if="showPopup" class="success-popup">
          <div class="popup-content">
            <i class="fas fa-check-circle"></i>
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
    ...mapState(['theme'])
  },
  mounted() {
    this.fetchData();
  },
  methods: {
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
      let hasError = false;
      this.errors = this.days.map(day => !day.goal);

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
          }, 3000);
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
@use "sass:color";

.activity-page {
  min-height: 100vh;
  padding: 2rem;
  background: #f8f9fa;
}

.activity-container {
  max-width: 1200px;
  margin: 0 auto;
}

.activity-header {
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

.week-goal-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
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

.daily-goals {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.goal-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

  &.has-error {
    border: 2px solid #dc3545;
  }
}

.goal-header {
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

.goal-content {
  .form-control {
  width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s ease;
  resize: vertical;
    min-height: 100px;

    &:focus {
      outline: none;
      border-color: #db2323;
    }
  }
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-alert {
  background: #fff3cd;
  color: #856404;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.submit-section {
  text-align: center;
  margin-top: 2rem;
}

.submit-button {
  width: 100%;
  max-width: 400px;
  background: #db2323;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;

  &:hover {
    background: color.adjust(#db2323, $lightness: -10%);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
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
  .activity-page {
    background: #1a1a1a;
  }

  .info-card,
  .week-goal-card,
  .goal-card {
    background: #2d2d2d;
  }

  .activity-header h1 {
    color: #fff;
  }

  .card-header h3 {
    color: #fff;
  }

  .card-content p {
    color: #ccc;
  }

  .goal-header h3 {
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
  .activity-page {
    padding: 1rem;
  }

  .activity-header h1 {
    font-size: 1.5rem;
  }

  .info-card,
  .week-goal-card {
    padding: 1rem;
  }

  .daily-goals {
    grid-template-columns: 1fr;
  }

  .goal-card {
    padding: 1.2rem;
  }
}
</style>



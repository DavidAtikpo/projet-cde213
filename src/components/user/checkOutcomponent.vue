<template>
  <div class="check-out-page" :class="theme">
    <div class="check-out-container">
      <!-- En-tête -->
      <div class="check-out-header">
        <h1>Rapport journalier</h1>
        <div class="info-card">
          <TypewriterText 
            class="typewriter-text" 
            text="Remplissez l'objectif de la journée en suivant ces étapes..." 
          />
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="check-out-content">
        <!-- Objectif du jour -->
        <div class="daily-goal-card">
          <div class="card-header">
            <i class="fas fa-bullseye"></i>
            <h3>Objectif du jour</h3>
          </div>
          <div class="card-content">
            <p>{{ dailyGoal }}</p>
          </div>
        </div>

        <!-- Formulaire de rapport -->
        <div class="report-form">
          <div class="form-group">
          <h4>Est-ce que l'objectif quotidien a été réalisé ?</h4>
            <div class="radio-group">
              <label class="radio-label">
                <input 
                  type="radio" 
                  value="oui" 
                  v-model="choix" 
                  :class="{'error': errors.choix}" 
                  ref="choixField"
                >
                <span class="radio-text">Oui</span>
              </label>
              <label class="radio-label">
                <input 
                  type="radio" 
                  value="non" 
                  v-model="choix" 
                  :class="{'error': errors.choix}" 
                  ref="choixField"
                >
                <span class="radio-text">Non</span>
              </label>
          </div>
          </div>

          <div class="form-group">
            <label>
              <i class="fas fa-percentage"></i>
              Pourcentage de travail effectué
            </label>
            <select 
              v-model="pourcentage" 
              :class="['form-control', {'error': errors.pourcentage}]" 
              ref="pourcentageField"
            >
              <option value="">Sélectionner le pourcentage</option>
              <option v-for="i in 11" :key="i" :value="i * 10">{{ i * 10 }}%</option>
            </select>
          </div>

          <div class="form-group">
            <label>
              <i class="fas fa-comment-alt"></i>
              Commentaire ou justification
            </label>
            <textarea 
              v-model="justification" 
              rows="4" 
              :class="['form-control', {'error': errors.justification}]" 
              ref="justificationField"
              placeholder="Décrivez les détails de votre travail..."
            ></textarea>
          </div>

          <div class="message">
            <i class="fas fa-heart"></i>
            <p>Bon travail ! Passez une agréable soirée sous la protection de Dieu</p>
        </div>

          <button 
            @click="submitForm" 
            :disabled="loading"
            class="submit-button"
          >
            <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
            <span v-else>Soumettre le rapport</span>
          </button>
        </div>
      </div>

      <!-- Popup de succès -->
      <transition name="fade">
        <div v-if="showPopup" class="success-popup">
          <div class="popup-content">
            <i class="fas fa-check-circle"></i>
            <h2>Rapport soumis avec succès !</h2>
            <p>Redirection en cours...</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import TypewriterText from '@/components/TypewriterText.vue';
import { mapState } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  components: {
    TypewriterText
  },
  data() {
    return {
      loading: false,
      justification: '',
      choix: '',
      pourcentage: '',
      dailyGoal: '',
      showPopup: false,
      errors: {
        justification: false,
        choix: false,
        pourcentage: false,
      }
    };
  },
  computed: {
    ...mapState(['theme'])
  },
  mounted() {
    this.dailyGoal = localStorage.getItem('dailyGoal');
  },
  methods: {
    submitForm() {
      // Réinitialiser les erreurs
      this.errors.justification = !this.justification;
      this.errors.choix = !this.choix;
      this.errors.pourcentage = !this.pourcentage;

      // Si une des erreurs est vraie, arrêter l'exécution
      if (this.errors.justification || this.errors.choix || this.errors.pourcentage) {
        this.shakeInput();
        return;
      }

      const formData = {
        justification: this.justification,
        choix: this.choix,
        pourcentage: this.pourcentage,
        dailyGoal: this.dailyGoal
      };

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      this.loading = true;
      axios.post(`${API_BASE_URL}/user/rapport`, formData, { headers })
        .then(res => {
          if (res.status === 201) {
            this.showPopup = true;
            setTimeout(() => {
              this.showPopup = false;
              this.$router.push('/user/analytics');
            }, 3000);
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    shakeInput() {
      const inputFields = [
        this.$refs.justificationField,
        this.$refs.choixField,
        this.$refs.pourcentageField
      ];

      inputFields.forEach(input => {
        if (input) {
          if (Array.isArray(input)) {
            input.forEach(radio => {
              radio.classList.add('shake');
              setTimeout(() => radio.classList.remove('shake'), 500);
            });
          } else {
            input.classList.add('shake');
            setTimeout(() => input.classList.remove('shake'), 500);
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@use "sass:color";

.check-out-page {
  min-height: 100vh;
  padding: 2rem;
  background: #f8f9fa;
}

.check-out-container {
  max-width: 1200px;
  margin: 0 auto;
}

.check-out-header {
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

.check-out-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.daily-goal-card {
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

.report-form {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;

  h4 {
    color: #333;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

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

.radio-group {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  input[type="radio"] {
    width: 1.2rem;
    height: 1.2rem;
    cursor: pointer;
  }

  .radio-text {
    color: #333;
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

.message {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;

  i {
    color: #db2323;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    color: #666;
}
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
  .check-out-page {
    background: #1a1a1a;
  }

  .info-card,
  .daily-goal-card,
  .report-form {
    background: #2d2d2d;
  }

  .check-out-header h1 {
    color: #fff;
  }

  .card-header h3 {
    color: #fff;
  }

  .card-content p {
    color: #ccc;
  }

  .form-group {
    h4 {
      color: #fff;
    }

    label {
      color: #fff;
  }
  }

  .radio-label .radio-text {
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

  .message {
    background: #1a1a1a;

    p {
      color: #ccc;
  }
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
  .check-out-page {
    padding: 1rem;
  }

  .check-out-content {
    grid-template-columns: 1fr;
  }

  .check-out-header h1 {
    font-size: 1.5rem;
  }

  .info-card {
    padding: 1rem;
}

  .report-form {
    padding: 1.5rem;
}

  .radio-group {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>

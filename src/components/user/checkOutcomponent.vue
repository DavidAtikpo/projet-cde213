<template>
  <div class="check-out-page" :class="theme">
    <div class="check-out-container">
      <!-- En-tête -->
      <div class="check-out-header">
        <h1>📊 Rapport journalier</h1>
        <div class="info-card">
          <p>Évaluez votre journée de travail en remplissant ce rapport quotidien. Soyez honnête dans votre évaluation pour un meilleur suivi.</p>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="check-out-content">
        <!-- Objectif du jour -->
        <div class="daily-goal-card">
          <div class="card-header">
            <h3>🎯 Objectif du jour</h3>
            <div class="goal-status">
              {{ dailyGoal ? '📋' : '❓' }}
            </div>
          </div>
          <div class="card-content">
            <p>{{ dailyGoal || 'Aucun objectif défini pour aujourd\'hui' }}</p>
          </div>
        </div>

        <!-- Formulaire de rapport -->
        <div class="report-form">
          <div class="form-header">
            <h3>📝 Évaluation de la journée</h3>
            <div class="progress-indicator">
              {{ completedFields }}/3 complétés
            </div>
          </div>

          <div class="form-group">
            <h4>✅ L'objectif quotidien a-t-il été réalisé ?</h4>
            <div class="radio-group">
              <label class="radio-label" :class="{ 'selected': choix === 'oui' }">
                <input 
                  type="radio" 
                  value="oui" 
                  v-model="choix" 
                  :class="{'error': errors.choix}" 
                  ref="choixField"
                >
                <span class="radio-text">✅ Oui</span>
              </label>
              <label class="radio-label" :class="{ 'selected': choix === 'non' }">
                <input 
                  type="radio" 
                  value="non" 
                  v-model="choix" 
                  :class="{'error': errors.choix}" 
                  ref="choixField"
                >
                <span class="radio-text">❌ Non</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>
              📊 Pourcentage de travail effectué
            </label>
            <div class="select-wrapper">
              <select 
                v-model="pourcentage" 
                :class="['form-control', {'error': errors.pourcentage}]" 
                ref="pourcentageField"
              >
                <option value="">Sélectionner le pourcentage</option>
                <option v-for="i in 11" :key="i" :value="i * 10">{{ i * 10 }}%</option>
              </select>
              <div class="percentage-visual" v-if="pourcentage">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: pourcentage + '%' }"></div>
                </div>
                <span class="percentage-text">{{ pourcentage }}%</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>
              💬 Commentaire ou justification
            </label>
            <textarea 
              v-model="justification" 
              rows="3" 
              :class="['form-control', {'error': errors.justification}]" 
              ref="justificationField"
              placeholder="Décrivez les détails de votre travail, les défis rencontrés..."
            ></textarea>
            <div class="char-count">
              {{ justification.length }}/500 caractères
            </div>
          </div>

          <div class="message">
            💝 Bon travail ! Passez une agréable soirée sous la protection de Dieu
          </div>

          <button 
            @click="submitForm" 
            :disabled="loading || !canSubmit"
            class="submit-button"
            :class="{ 'ready': canSubmit }"
          >
            <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
            <span v-else>{{ canSubmit ? '🚀 Soumettre le rapport' : '📝 Complétez tous les champs' }}</span>
          </button>
        </div>
      </div>

      <!-- Popup de succès -->
      <transition name="fade">
        <div v-if="showPopup" class="success-popup">
          <div class="popup-content">
            <div class="popup-icon">🎉</div>
            <h2>Rapport soumis avec succès !</h2>
            <p>Redirection vers les analytics...</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
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
    ...mapState(['theme']),
    completedFields() {
      let count = 0;
      if (this.choix) count++;
      if (this.pourcentage) count++;
      if (this.justification.trim()) count++;
      return count;
    },
    canSubmit() {
      return this.choix && this.pourcentage && this.justification.trim();
    }
  },
  mounted() {
    this.dailyGoal = localStorage.getItem('dailyGoal');
  },
  methods: {
    submitForm() {
      if (!this.canSubmit) return;
      
      // Réinitialiser les erreurs
      this.errors.justification = !this.justification.trim();
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
            }, 2000);
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
* {
  box-sizing: border-box;
}

.check-out-page {
  min-height: 100vh;
  padding: 1rem;
  background: #f8f9fa;
}

.check-out-container {
  max-width: min(95vw, 1000px);
  margin: 0 auto;
}

.check-out-header {
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

  p {
    margin: 0;
    color: #666;
    line-height: 1.5;
    font-size: 0.9rem;
  }
}

.check-out-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 1.5rem;
}

.daily-goal-card {
  background: white;
  border: 2px solid #db2323;
  border-radius: 0.8rem;
  padding: 1.2rem;
  box-shadow: 0 2px 12px rgba(219, 35, 35, 0.1);
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
    color: #db2323;
  }
}

.goal-status {
  font-size: 1.2rem;
  opacity: 0.8;
}

.card-content {
  p {
    margin: 0;
    line-height: 1.5;
    font-size: 0.9rem;
    color: #333;
  }
}

.report-form {
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

.progress-indicator {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.2rem;

  h4 {
    color: #333;
    margin-bottom: 0.8rem;
    font-size: 0.95rem;
    font-weight: 600;
  }

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

.radio-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.8rem;
  border: 2px solid #e9ecef;
  border-radius: 0.6rem;
  transition: all 0.3s ease;
  background: #fff;

  &:hover {
    border-color: #db2323;
    background: #fff5f5;
  }

  &.selected {
    border-color: #db2323;
    background: linear-gradient(135deg, #fff5f5, #fff);
    box-shadow: 0 2px 8px rgba(219, 35, 35, 0.1);
  }

  input[type="radio"] {
    width: 1.1rem;
    height: 1.1rem;
    cursor: pointer;
  }

  .radio-text {
    color: #333;
    font-weight: 500;
    font-size: 0.9rem;
  }
}

.select-wrapper {
  position: relative;
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
  max-length: 500;
}

.percentage-visual {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.progress-bar {
  flex: 1;
  height: 0.5rem;
  background: #e9ecef;
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #db2323, #b31b1b);
  transition: width 0.3s ease;
}

.percentage-text {
  font-weight: 600;
  color: #db2323;
  font-size: 0.9rem;
}

.char-count {
  text-align: right;
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.3rem;
}

.message {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 1rem;
  border-radius: 0.6rem;
  margin: 1.2rem 0;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid #e9ecef;
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
  .check-out-page {
    background: #1a1a1a;
  }

  .info-card,
  .report-form {
    background: #2d2d2d;
    border-color: #404040;
  }

  .info-card p {
    color: #ccc;
  }

  .daily-goal-card {
    background: #2d2d2d;
    border-color: #db2323;

    .card-header h3 {
      color: #db2323;
    }

    .card-content p {
      color: #ccc;
    }
  }

  .check-out-header h1 {
    color: #fff;
  }

  .form-header {
    border-color: #404040;

    h3 {
      color: #fff;
    }
  }

  .form-group {
    h4 {
      color: #fff;
    }

    label {
      color: #fff;
    }
  }

  .radio-label {
    background: #1a1a1a;
    border-color: #404040;

    &:hover {
      border-color: #db2323;
      background: #2d1a1a;
    }

    &.selected {
      background: #2d1a1a;
    }

    .radio-text {
      color: #fff;
    }
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

  .progress-bar {
    background: #404040;
  }

  .char-count {
    color: #888;
  }

  .message {
    background: #1a1a1a;
    border-color: #404040;
    color: #ccc;
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
    padding: 0.5rem;
  }

  .check-out-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .check-out-header h1 {
    font-size: 1.4rem;
  }

  .info-card {
    padding: 0.8rem;
  }

  .report-form {
    padding: 1.2rem;
  }

  .radio-group {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .progress-indicator {
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
  .check-out-container {
    padding: 0;
  }

  .check-out-header h1 {
    font-size: 1.2rem;
  }

  .report-form {
    padding: 1rem;
  }

  .form-control {
    padding: 0.6rem;
    font-size: 0.8rem;
  }

  textarea.form-control {
    min-height: 70px;
  }

  .radio-label {
    padding: 0.6rem;
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

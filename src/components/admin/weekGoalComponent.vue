<template>
  <div class="page">
    <div class="content">
      <h2>Définir l'objectif pour la Semaine</h2>
      <hr>
      <div class="input-group">
        <label for="weeklyGoal">Objectif</label><br>
        <textarea id="weeklyGoal" v-model="weeklyGoal" rows="4" 
                  :class="{ 'error-border': errorSubmitting }" 
                  ref="weeklyGoalField"></textarea>
      </div><br>
      <button @click="submitForm"> <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
        <span v-else>Submit</span></button>
      <h5 v-if="errorFetchingDate">Erreur lors du chargement de la date. Veuillez vérifier votre connexion Internet.</h5>
    </div>
    <!-- Popup to display "Created successfully" -->
    <div v-if="showPopup" class="popup">
      <h2>Formulaire soumis avec succès !</h2>
    </div>
  </div>
</template>


  
  <script>
  import axios from 'axios';
import { API_BASE_URL } from '@/config.js';
import TypewriterText from '@/components/TypewriterText.vue';

export default {
  components :{
    TypewriterText
    },
  data() {
    return {
      loading:false,
      weeklyGoal: '',
      showPopup: false, // Initialize popup visibility to false
      errorSubmitting: false,
      errorFetchingDate: false
    };
  },
  methods: {
    submitForm() {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const formData = {
        weeklyGoal: this.weeklyGoal
      };
  this.loading = true
      axios.post(`${API_BASE_URL}/week/weekly`, formData, { headers })
        .then(response => {
          console.log('Form submitted successfully:', response.data);
          this.weeklyGoal = '';
          this.showPopup = true; // Show the popup
          // Hide the popup after 3 seconds
          setTimeout(() => {
            this.showPopup = false; // Hide the popup
            this.$router.push(`/admin/${this.$route.params.id}`);
            this.$parent.activeTab = 'create-activity';
          }, 3000);
          this.errorSubmitting = false;
        })
        .catch(error => {
          console.error('Error submitting form:', error);
          this.errorSubmitting = true;
          this.shakeInput();
        })
        .finally(()=>{
          this.loading = false
        });
    },
    shakeInput() {
      // Vérifier l'existence de la référence avant d'ajouter ou de retirer la classe 'shake'
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
.page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.content {
  width: 100%;
  max-width: 800px;
  padding: 4rem;
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  h2 {
    color: #db2323;
    font-size: 1.8rem;
    margin: 0 0 1.5rem;
    font-weight: 600;
  }

  hr {
    border: none;
    border-top: 1px solid #eee;
    margin: 1.5rem 0;
  }
}

.input-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    font-weight: 500;
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid #eee;
    border-radius: 0.5rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #333;
    transition: all 0.3s ease;
    resize: vertical;
    min-height: 120px;

    &:focus {
      outline: none;
      border-color: #db2323;
      box-shadow: 0 0 0 3px rgba(219, 35, 35, 0.1);
    }

    &.error-border {
      border-color: #dc3545;
      animation: shake 0.5s;
    }
  }
}

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #db2323 0%, #b31b1b 100%);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(219, 35, 35, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(219, 35, 35, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  i {
    font-size: 1.1rem;
  }
}

.popup {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: #fff;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
  z-index: 1000;
  animation: slideIn 0.3s ease;

  h2 {
    color: #fff;
    font-size: 1rem;
    margin: 0;
    font-weight: 500;
  }
}

h5 {
  color: #dc3545;
  font-size: 0.9rem;
  margin: 1rem 0 0;
  font-weight: 500;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Dark theme */
:deep(.dark) {
  .page {
    background-color: #1a1a1a;
  }

  .content {
    background-color: #2d2d2d;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

    h2 {
      color: #fff;
    }

    hr {
      border-color: #404040;
    }
  }

  .input-group {
    label {
      color: #e2e8f0;
    }

    textarea {
      background-color: #1a1a1a;
      border-color: #404040;
      color: #e2e8f0;

      &:focus {
        border-color: #db2323;
        box-shadow: 0 0 0 3px rgba(219, 35, 35, 0.2);
      }
    }
  }

  button {
    background: linear-gradient(135deg, #db2323 0%, #8b1515 100%);
  }

  h5 {
    color: #ff6b6b;
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .page {
    padding: 1rem;
  }

  .content {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .page {
    padding: 1rem;
  }

  .content {
    padding: 1.2rem;

    h2 {
      font-size: 1.5rem;
    }
  }

  .input-group {
    label {
      font-size: 0.9rem;
    }

    textarea {
      font-size: 0.9rem;
      padding: 0.8rem;
    }
  }

  button {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }

  .popup {
    top: 1rem;
    right: 1rem;
    padding: 0.8rem 1.2rem;

    h2 {
      font-size: 0.9rem;
    }
  }
}

@media (max-width: 480px) {
  .page {
    padding: 0.8rem;
  }

  .content {
    padding: 1rem;

    h2 {
      font-size: 1.3rem;
    }
  }

  .input-group {
    label {
      font-size: 0.85rem;
    }

    textarea {
      font-size: 0.85rem;
      padding: 0.7rem;
    }
  }

  button {
    width: 100%;
    padding: 0.7rem 1rem;
    font-size: 0.85rem;
  }
}
</style>

  
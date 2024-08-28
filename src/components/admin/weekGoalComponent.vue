<template>
  <div class="page">
    <div class="container">
      <TypewriterText class="typewriter" text="Remplissez l'objectif de la journée en suivant ces étapes..." />
      <div class="content-wrapper">
      <div class="content">
        <h2>Définir l'objectif pour la Semaine</h2>
        <hr>
        <div class="input-group">
          <label for="weeklyGoal">Objectif</label><br>
          <textarea id="weeklyGoal" v-model="weeklyGoal" rows="4" 
                    :class="{ 'error-border': errorSubmitting }" 
                    ref="weeklyGoalField"></textarea>
        </div><br>
        <button @click="submitForm">Soumettre</button>
        <h5 v-if="errorFetchingDate">Erreur lors du chargement de la date. Veuillez vérifier votre connexion Internet.</h5>
      </div>
      <!-- Popup to display "Created successfully" -->
      <div v-if="showPopup" class="popup">
        <h2>Formulaire soumis avec succès !</h2>
      </div>
    </div>
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

      axios.post(`${API_BASE_URL}/week/weekly`, formData, { headers })
        .then(response => {
          console.log('Form submitted successfully:', response.data);
          this.weeklyGoal = '';
          this.showPopup = true; // Show the popup
          // Hide the popup after 3 seconds
          setTimeout(() => {
            this.showPopup = false; // Hide the popup
            this.$router.push('/admin/analytics');
          }, 3000);
          this.errorSubmitting = false;
        })
        .catch(error => {
          console.error('Error submitting form:', error);
          this.errorSubmitting = true;
          this.shakeInput();
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
  background-color: #c4c1c1;
}
button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
}
.content {
  width: 65%;
  max-width: 800px;
  padding: 39px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
}
.typewriter {
  position: absolute;
  width: 30%;
  padding: 40px;
  margin-left: 900px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.input-group {
  margin-bottom: 20px;
}
label {
  display: block;
  font-weight: bold;
}
input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
textarea {
  height: 70px;
}
h5 {
  color: blue;
}
h2 {
  color: rgb(187, 4, 4);
}
.popup {
  position: fixed;
  top: 10%;
  left: 80%;
  transform: translate(-50%, -50%);
  background-color: rgba(45, 214, 29, 0.7);
  color: #fff;
  padding: 20px;
  border-radius: 5px;
  z-index: 999;
}
.popup h2 {
  font-size: 15px;
  margin-bottom: 10px;
  color: #fff;
}
.error-border {
  border: 2px solid red;
}
.shake {
  animation: shake 0.5s;
}
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}
/* Styles pour les téléphones mobiles */
@media only screen and (max-width: 768px) {
  .content {
    width: 80%; /* Ajustez la largeur pour les petits écrans */
  }
  input,
  textarea {
    font-size: 14px; /* Réduisez la taille de la police pour une meilleure lisibilité */
  }
  label {
    font-size: 12px; /* Ajustez la taille de la police pour les étiquettes */
  }
  h2 {
    font-size: 14px; /* Ajustez la taille de la police pour les titres */
  }
  h5 {
    font-size: 10px; /* Ajustez la taille de la police pour les messages */
  }
}
</style>

  
<template>
  <div class="page">
    <div class="container">
      <div class="content">
        <h2>Remplir l'objectif de la journée</h2>
        <hr>
        <div class="goal">
          <p>{{ dailyGoals }}</p> <!-- Display the daily goal dynamically -->
        </div>

        <div class="input-group">
          <label for="arrivalTime">Temps d'arrivée au service:</label><br>
          <input type="text" id="arrivalTime" v-model="arrivalTime" readonly>
        </div>
        <div class="input-group">
          <label for="date">Date:</label><br>
          <input type="date" id="date" v-model="date" readonly>
        </div>
        <div class="input-group">
          <label for="dailyGoal">Objectif de la journée:</label><br>
          <textarea 
            id="dailyGoal" 
            v-model="dailyGoal" 
            :class="{'error': errorMessage}" 
            rows="4" 
            ref="dailyGoalInput">
          </textarea>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>
        <button @click="submitForm">Submit</button>
        <h5 v-if="errorFetchingDate">Erreur lors du chargement de la date. Veuillez vérifier votre connexion Internet.</h5>
      </div>
      <!-- Popup to display "Created successfully" -->
      <div v-if="showPopup" class="popup">
        <h2>Formulaire soumis avec succès !</h2>
      </div>
    </div>
  </div>
</template>



<script>
import axios from 'axios';
import {API_BASE_URL}  from '@/config.js';
export default {
  data() {
    return {
      arrivalTime: '',
      date: '',
      dailyGoal: '',
      dailyGoals:'',
      errorFetchingDate: false,
      showPopup: false, // Initialize popup visibility to false
      weeklyGoals: {} ,// Store weekly goals fetched from backend
      errorMessage:''
    };
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

      // Fetch all weekly goals from the backend
      axios.get(`${API_BASE_URL}/week/getweekly`, { headers })
        .then(response => {
          // Store the fetched weekly goals in the weeklyGoals object
          console.log('Weekly goals:', this.weeklyGoals);
          this.weeklyGoals = response.data;
          // Set the dailyGoal based on the current day of the week
          this.setDailyGoal();
        })
        .catch(error => {
          console.error('Error fetching weekly goals:', error);
          this.errorFetchingDate = true;
        });
    },
    setDailyGoal() {
  // Get the current day of the week (0=Sunday, 1=Monday, ..., 6=Saturday)
  const currentDayOfWeek = new Date().getDay();
  // console.log('Current day of week:', currentDayOfWeek);
  // console.log('Weekly goals:', this.weeklyGoals);

  // Get the data object from the weeklyGoals proxy
  const weeklyGoalsData = this.weeklyGoals.data;

  // Filter out non-day keys (e.g., 'postedBy')
  // Filter out non-day keys (e.g., 'postedBy', 'createdAt', 'updatedAt', etc.)
const dayKeys = Object.keys(weeklyGoalsData).filter(key => ['sunday','monday','tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].includes(key.toLowerCase()));

  console.log('Filtered day keys:', dayKeys);

  // Get the key corresponding to the current day of the week
  const dayKey = dayKeys[currentDayOfWeek];
  console.log('Day key:', dayKey);

  // Check if the day key exists
  if (dayKey) {
    // Set the dailyGoal based on the weekly goal for the current day of the week
    this.dailyGoals = weeklyGoalsData[dayKey];
  } else {
    console.log('Day key not found for current day of week:', currentDayOfWeek);
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

      axios.post(`${API_BASE_URL}/user/entre`, formData, { headers })
        .then(response => {
          console.log('Form submitted successfully:', response.data);
          this.arrivalTime = '';
          this.date = '';
          this.dailyGoal = '';
          this.showPopup = true; // Show the popup
          this.errorMessage=''
          // Hide the popup after 3 seconds
          setTimeout(() => {
            this.showPopup = false; // Hide the popup
            this.$router.push('/user/analytics');
          }, 3000);
          // Save daily goal in local storage
          localStorage.setItem('dailyGoal', formData.dailyGoal);
        })
        .catch(error => {
          console.error('Error submitting form:', error);
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




<style scoped>
.page {
  background-color: #c4c1c1;
}
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  width: 90%;
  max-width: 800px;
  padding: 39px;
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
input.error,
textarea.error {
  border-color: red;
}
.error-message {
  color: red;
  font-size: 12px;
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
h5 {
  color: blue;
}
h2 {
  color: rgb(187, 4, 4);
}
p {
  color: #0056b3;
  font-size: 25px;
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
.goal {
  width: 100%;
  background-color: rgb(247, 247, 247);
  height: 5vh;
  border-radius: 20px;
  text-align: center;
}
/* Styles pour les téléphones mobiles */
@media only screen and (max-width: 768px) {
  .content {
    width: 80%; /* Ajustez la largeur pour les petits écrans */
    margin-top: -185px;
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


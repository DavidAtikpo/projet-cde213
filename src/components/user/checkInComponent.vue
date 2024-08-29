<template>
  <div :class="[theme, 'page']">
    <div class="container">
       <!-- Description avec l'effet de machine à écrire -->
      
        <TypewriterText class="typewriter" text="Avant de definir l'objectif de la journee veillesz verifier si l'objectif hebdomadaire a ete defini.Si non, cliquez sur l'onglet 'Objectifs Heb'et remplir l'objectif de la semaine. et cela se fera une seul fois dans la semaine" />
      
<div class="content-wrapper">
      <div class="content">
        <h2>{{ translatedTitle }}</h2>
        <hr>
        <div class="goal">
          <p>{{ dailyGoals }}</p>
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
        <button @click="submitForm"> <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
          <span v-else>Submit</span></button>
        <h5 v-if="errorFetchingDate">Erreur lors du chargement de la date. Veuillez vérifier votre connexion Internet.</h5>
      </div>
      <div v-if="showPopup" class="popup">
        <h2>Formulaire soumis avec succès !</h2>
      </div>
    </div>
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
      loading:false,
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
    ...mapState(['theme']),
    ...mapState(['theme', 'language']),
    translatedTitle() {
      // Logique simple de traduction
      const titles = {
        en: 'Fill in the daily goal',
        fr: "Remplir l'objectif de la journée"
      };
      return titles[this.language];
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
      this.loading = true
      axios.post(`${API_BASE_URL}/user/entre`, formData, { headers })
        .then(response => {
          console.log('Form submitted successfully:', response.data);
          this.arrivalTime = '';
          this.date = '';
          this.dailyGoal = '';
          this.showPopup = true;
          this.errorMessage = '';
          setTimeout(() => {
            this.showPopup = false;
            this.$router.push('/user/analytics');
          },500);
          localStorage.setItem('dailyGoal', formData.dailyGoal);
        })
        .catch(error => {
          console.error('Error submitting form:', error);
        })
        .finally(()=>{
          this.loading = false
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
.dark.page {
  background-color:#858282;
  color: #fff;
}
.light.page {
  background-color: #fff;
  color: #333;
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
.content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
}
.content {
  width: 65%;
  max-width: 800px;
  padding: 39px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.typewriter {
  position: absolute;
  width: 20%;
  padding: 39px;
  margin-left: 900px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.dark .content {
  background-color: #444;
}
.light .content {
  background-color: #fff;
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
@media only screen and (max-width: 768px) {
  .content {
    width: 80%;
    margin-top: -185px;
  }
  input,
  textarea {
    font-size: 14px;
  }
  label {
    font-size: 12px;
  }
  h2 {
    font-size: 14px;
  }
  h5 {
    font-size: 10px;
  }
  .typewriter {
    display: none; /* Masquer le composant */
  }
}
</style>

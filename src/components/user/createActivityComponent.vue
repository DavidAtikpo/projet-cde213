<template>
  <div class="page1">
    <div class="container">
      <div class="content">
        <h2>Remplir l'objectif de la Semaine</h2>
        <hr><br>
        <div class="goal"><p>{{ goalOfWeek }}</p></div>
        
        <div v-for="(day, index) in days" :key="index">
          <div class="input-group">
            <label :for="`dailyGoal-${index}`">{{ day.label }} :</label><br>
            <textarea :id="`dailyGoal-${index}`" v-model="day.goal" rows="4" 
                      :class="{ 'error-border': errors[index] }" :ref="'textarea-' + index"></textarea>
          </div>
        </div>

        <button @click="submitForm"> <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
          <span v-else>Submit</span></button>
      </div>
      <!-- Popup pour afficher "Créé avec succès" -->
      <div v-if="showPopup" class="popup">
        <h2>Formulaire soumis avec succès !</h2>
      </div>
    </div>
  </div>
</template>




<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  data() {
    return {
      loading: false,
      days: [
        { label: 'Objectif du Mardi', goal: '' },
        { label: 'Objectif du Mercredi', goal: '' },
        { label: 'Objectif du Jeudi', goal: '' },
        { label: 'Objectif du Vendredi', goal: '' },
        { label: 'Objectif du Samedi', goal: '' }
      ],
      showPopup: false,
      errors: [false, false, false, false, false], // Initialize error state for each day
      errorFetchingDate: false,
      goalOfWeek: ''
    };
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
          console.log('Objectif de la semaine :', response.data);
        })
        .catch(error => {
          console.error('Erreur lors du chargement de la date :', error);
          this.errorFetchingDate = true;
        });
    },
    submitForm() {
      let hasError = false;
      // Reset errors
      this.errors = this.days.map(day => !day.goal);

      // Check if any field is empty and set hasError accordingly
      this.errors.forEach(error => {
        if (error) {
          hasError = true;
        }
      });

      if (hasError) {
        this.shakeInput();
        return; // If there are errors, do not submit the form
      }

      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Préparation des données à envoyer au backend
      const goalsData = {
        tuesday: this.days[0].goal,
        wednesday: this.days[1].goal,
        thursday: this.days[2].goal,
        friday: this.days[3].goal,
        saturday: this.days[4].goal
      };
       this.loading = true
      axios.post(`${API_BASE_URL}/week/weeks`, goalsData, { headers })
        .then(response => {
          console.log('Formulaire soumis avec succès :', response.data);
          this.errors = [false, false, false, false, false]; // Reset error states
          this.showPopup = true; // Afficher le popup
          // Masquer le popup après 3 secondes
          setTimeout(() => {
            this.showPopup = false; // Masquer le popup
            this.$router.push('/admin/analytics');
          }, 3000);
        })
        .catch(error => {
          console.error('Erreur lors de la soumission du formulaire :', error);
          this.shakeInput();
        })
        .finally(()=>{
         this.loading = false
        })
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



<style scoped>
.page1 {
  background-color: #c4c1c1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120vh;
}
h2 {
  color: red;
}
.container {
  width: 80%;
}
.content {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.input-group {
  margin-bottom: 20px;
}
label {
  font-weight: bold;
}
textarea {
  width: 100%;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
}
.error-border {
  border: 2px solid red;
}
.goal {
  width: 100%;
  background-color: rgb(247, 247, 247);
  height: 5vh;
  border-radius: 20px;
  text-align: center;
}
p {
  color: #007bff;
  font-size: 25px;
}
button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
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
@media only screen and (max-width: 768px) {
  .content {
    margin-top: 60px;
    width: 90%;
  }
  textarea {
    font-size: 10px;
    width: calc(100% - 10px);
    padding: 0px;
    resize: none;
  }
  input {
    font-size: 10px;
    width: calc(100% - 16px);
    padding: 6px;
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
  p {
    font-size: 10px;
  }
}
</style>



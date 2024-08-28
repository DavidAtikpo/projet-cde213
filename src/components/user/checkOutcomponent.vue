<template>
  <div class="page">
    <div class="container1">
      <div class="content1">
        <h2>Rapport journalier</h2><br>
        <div class="goal">
          <p>{{ dailyGoal }}</p>
        </div>
        <h4>Est-ce que l'objectif quotidien a été réalisé ?</h4>
        <div class="check">
          <label for="oui">Oui :</label>
          <input type="radio" id="oui" value="oui" v-model="choix" :class="{'error': errors.choix}" ref="choixField" />
        </div>
        <div class="check">
          <label for="non">Non:</label>
          <input type="radio" id="non" value="non" v-model="choix" :class="{'error': errors.choix}" ref="choixField" />
        </div>
        <div>
          <label for="pourcentage">Pourcentage de travail effectué:</label>
          <select id="pourcentage" v-model="pourcentage" :class="{'error': errors.pourcentage}" ref="pourcentageField">
            <option value="">Sélectionner le pourcentage</option>
            <option v-for="i in 11" :key="i" :value="i * 10">{{ i * 10 }}%</option>
          </select>
        </div>
        <div class="input-group">
          <label for="justification">Commentaire ou justification</label>
          <textarea id="justification" v-model="justification" rows="4" :class="{'error': errors.justification}" ref="justificationField"></textarea>
        </div>
        <h5>Bon travail ! Passez une agréable soirée sous la protection de Dieu</h5><br>
        <button @click="submitForm">Soumettre</button>
      </div>
      <div class="popup" ref="popup">
        <img class="check" src="@/assets/images/check.png" />
        <h2>Rapport soumis avec succès !</h2>
        <button @click="closePopup" type="button">OK</button>
      </div>
    </div>
  </div>
</template>




<script>
import axios from 'axios'
import {API_BASE_URL}  from '@/config.js';
export default {
  data() {
    return {
      justification: '',
      choix: '',
      pourcentage: '',
      dailyGoal: '',
      errors: {
        justification: false,
        choix: false,
        pourcentage: false,
      }
    };
  },
  mounted() {
    this.dailyGoal = localStorage.getItem('dailyGoal');
  },
  methods: {
    openPopup() {
      this.$refs.popup.classList.add('open-popup');
    },
    closePopup() {
      this.$refs.popup.classList.remove('open-popup');
      this.$router.push('/user/analytics');
    },
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
      axios.post(`${API_BASE_URL}/user/rapport`, formData, { headers })
        .then(res => {
          if (res.status === 200) {
            this.openPopup();
            setTimeout(() => {
              this.closePopup();
            }, 3000);
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    shakeInput() {
      // Récupérer les références des champs
      const inputFields = [
        this.$refs.justificationField,
        this.$refs.choixField, // Ceci sera une NodeList (array-like object)
        this.$refs.pourcentageField
      ];

      // Ajouter et retirer la classe 'shake' pour chaque champ
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

<style scoped>
.page {
  background-color: #c4c1c1;
}
.container1 {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content1 {
  width: 90%;
  max-width: 800px;
  padding: 40px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.popup {
  width: 300px;
  height: 150px;
  background-color: #fff;
  border-radius: 8px;
  text-align: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  display: none; /* Initial state hidden */
}
.popup.open-popup {
  display: block; /* Show when open-popup class is added */
}
.popup img.check {
  width: 50px;
  margin-top: 5px;
}
.popup h2 {
  margin-top: 5px;
  color: #333;
  font-size: 18px;
  margin-bottom: 5px;
}
.popup button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
  margin-top: 10px;
}
.popup button:hover {
  background-color: #0056b3;
}
.goal {
  width: 100%;
  background-color: rgb(247, 247, 247);
  height: 5vh;
  border-radius: 20px;
  text-align: center;
}
p {
  color: #0056b3;
  font-size: 20px;
}
h2 {
  color: rgb(187, 4, 4);
}
input,
textarea,
select {
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
textarea {
  height: 70px;
}
input.error,
textarea.error,
select.error {
  border-color: red;
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
label {
  font-size: 90%;
}
@media only screen and (max-width: 768px) {
  .popup {
    width: 60px;
    height: 80px;
  }
  .popup h2 {
    font-size: 10px;
  }
  .popup img.check {
    width: 20px;
  }
  .popup button {
    padding: 3px 9px;
    font-size: 8px;
    text-align: center;
  }
  .content {
    width: 80%;
  }
  input,
  textarea {
    font-size: 14px;
  }
  label {
    font-size: 13px;
  }
  h2 {
    font-size: 14px;
  }
  h5 {
    font-size: 10px;
  }
}
.check {
  position: relative;
  margin-right: 10%;
}
h5 {
  color: #006eff;
}
h4 {
  color: blue;
}
</style>



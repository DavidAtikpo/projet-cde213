<template>
  <div class="page">
    <!-- <TypewriterText class="typewriter" text="Remplissez l'objectif de la journée en suivant ces étapes..." /> -->
    <div class="container">
      <!-- Step 1: Information about the child -->
      <div v-if="currentStep === 1" class="info">
        <h2>Information de l'enfant</h2><br>
        <div class="form-group">
          <label for="Nom">Nom <span>*</span></label>
          <input type="text" v-model="child.lastName" class="input-field">
        </div><br>
        <div class="form-group">
          <label>Prénom <span>*</span></label>
          <input type="text" v-model="child.firstName" class="input-field">
        </div><br>
        <div class="form-group">
          <label>Sexe</label>
          <select v-model="child.sex" class="input-field">
            <option value="Masculin">Masculin</option>
            <option value="Féminin">Féminin</option>
          </select>
        </div><br>
        <div class="form-group">
          <label>Classe</label>
          <select v-model="child.class" class="input-field">
            <option value="CP1">CP1</option>
            <option value="CP2">CP2</option>
          </select>
        </div><br>
        <div class="form-group">
          <label>Établissement</label>
          <input type="text" v-model="child.school" class="input-field">
        </div><br>
        <div class="form-group">
          <label>Date de naissance <span>*</span></label>
          <input type="date" v-model="child.birthDate" class="input-field">
        </div><br>
        <div class="form-group">
          <label>Lieu de naissance <span>*</span></label>
          <input type="text" v-model="child.birthPlace" class="input-field">
        </div><br>
        <div class="form-group">
          <label>Quartier de résidence <span>*</span></label>
          <input type="text" v-model="child.live" class="input-field">
        </div><br>
        <p v-if="showAlert" class="alert-message">Veuillez remplir tous les champs obligatoires.</p>
        <button class="button" @click="validateStep1">Suivant</button>
      </div>

      <!-- Step 2: Information about the parents -->
      <div v-if="currentStep === 2" class="info">
        <h2>Information de parent/Tuteur</h2><br>
        <div class="form-group">
          <label>Nom du père/tuteur <span>*</span></label>
          <input type="text" v-model="parent.fatherName" class="input-field">
        </div><br>
        <div class="form-group">
          <label>Nom de la mère </label>
          <input type="text" v-model="parent.motherName" class="input-field">
        </div><br>
        <div class="form-group">
          <label>Téléphone <span>*</span></label>
          <input type="text" v-model="parent.phoneNumber" class="input-field">
        </div><br>
        <div class="form-group">
          <label>Profession</label>
          <input type="text" v-model="parent.occupation" class="input-field">
        </div><br>
        <p v-if="showAlert" class="alert-message">Veuillez remplir tous les champs obligatoires.</p>
        <button class="previous" @click="previousStep">Retour</button>
        <button class="button" @click="validateStep2">Suivant</button>
      </div>

      <!-- Step 3: Entry Date -->
      <div v-if="currentStep === 3" class="info">
        <h2>Date d'entrée au CDE 213</h2><br>
        <div class="form-group">
          <label>Date d'entrée </label>
          <input type="date" v-model="date.dateOfEntrance" class="input-field">
        </div><br>
        <div class="form-group">
          <label>Autre information </label>
          <textarea v-model="date.otherInfo" class="input-field"></textarea>
          <p>Pouvez-vous fournir une autre information concernant la vie de l'enfant ?</p>
        </div><br>
        <button class="previous" @click="previousStep">Retour</button>
        <button class="button" @click="validateStep3">Suivant</button>
      </div>

      <!-- Step 4: Add a photo -->
      <div v-if="currentStep === 4" class="info">
        <h2>Ajouter la photo de l'enfant</h2>
        <input type="file" @change="onFileChange" accept="image/*">
        <img v-if="profileImage" :src="profileImageURL" alt="Photo de profil" class="profile-photo"><br>
        <button class="previous" @click="previousStep">Retour</button>
        <button @click="submitForm"><i v-if="loading" class="fas fa-circle-notch fa-spin"></i><span v-else>Submit</span></button>
      </div>
    </div>
    <div v-if="showPopup" class="popup">
      <h3>Formulaire soumis avec succès !</h3>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import TypewriterText from '@/components/TypewriterText.vue';
import { API_BASE_URL } from '@/config.js';

export default {
  components: {
    TypewriterText
  },
  data() {
    return {
      showAlert: false,
      loading: false,
      currentStep: 1,
      showPopup: false,
      child: {
        lastName: '',
        firstName: '',
        sex: '',
        class: '',
        birthDate: '',
        birthPlace: '',
        live: ''
      },
      parent: {
        fatherName: '',
        motherName: '',
        phoneNumber: ''
      },
      date: {
        dateOfEntrance: '',
        otherInfo: ''
      },
      profileImage: null,
      profileImageURL: null
    };
  },
  methods: {
    validateStep1() {
      if (this.child.lastName && this.child.firstName && this.child.birthDate && this.child.birthPlace && this.child.live) {
        this.showAlert = false;
        this.nextStep();
      } else {
        this.showAlert = true;
      }
    },
    validateStep2() {
      if (this.parent.fatherName && this.parent.phoneNumber) {
        this.showAlert = false;
        this.nextStep();
      } else {
        this.showAlert = true;
      }
    },
    validateStep3() {
      this.showAlert = false;
      this.nextStep();
    },
    nextStep() {
      this.currentStep++;
    },
    previousStep() {
      this.currentStep--;
    },
    onFileChange(event) {
      const file = event.target.files[0];
      this.profileImageURL = URL.createObjectURL(file);
      this.profileImage = file;
    },
    submitForm() {
      if (this.profileImage) {
        this.showAlert = false;
        this.submit();
      } else {
        this.showAlert = true;
      }
    },
    submit() {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      const postData = {
        ...this.child,
        ...this.parent,
        ...this.date,
        profileImageURL: this.profileImageURL
      };

      this.loading = true;

      axios.post(`${API_BASE_URL}/child/childInfo`, postData, { headers })
        .then(res => {
          console.log('Data saved successfully:', res.data);
          this.showPopup = true;
          setTimeout(() => {
            this.showPopup = false;
          }, 1000);
          this.resetForm();
        })
        .catch(error => {
          console.error('Error saving data:', error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetForm() {
      this.currentStep = 1;
      this.child = {
        lastName: '',
        firstName: '',
        sex: '',
        class: '',
        birthDate: '',
        birthPlace: '',
        live: ''
      };
      this.parent = {
        fatherName: '',
        motherName: '',
        phoneNumber: ''
      };
      this.date = {
        dateOfEntrance: '',
        otherInfo: ''
      };
      this.profileImage = null;
      this.profileImageURL = null;
    }
  }
};
</script>

<style scoped>
.page {
  padding: 20px;
  background-color: #f5f5f5;
}

h2 {
  color: rgb(180, 34, 34);
}

span {
  color: red;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* .typewriter {
  margin: 20px 0;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 20px;
  text-align: center;
} */

.form-group {
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.button, .previous {
  padding: 10px 20px;
  background-color: rgb(180, 34, 34);
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.button:hover, .previous:hover {
  background-color: #a30000;
}

.previous {
  background-color: #6c757d;
}

.previous:hover {
  background-color: #5a6268;
}

.profile-photo {
  margin-top: 20px;
  max-width: 100px;
  border-radius: 5px;
  display: block;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.popup h3 {
  text-align: center;
  color: rgb(180, 34, 34);
}
.alert-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

@media only screen and (max-width: 768px) {
  .container {
    width: 90%;
  }

  .popup {
    width: 90%;
  }
}
</style>

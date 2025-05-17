<template>
  <div class="page">
    <!-- <TypewriterText class="typewriter" text="Remplissez l'objectif de la journée en suivant ces étapes..." /> -->
    <div class="container">
      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress" :style="{ width: `${(currentStep / 4) * 100}%` }"></div>
        </div>
        <div class="steps">
          <div v-for="step in 4" :key="step" 
               :class="['step', { active: currentStep >= step, completed: currentStep > step }]">
            <div class="step-number">{{ step }}</div>
            <div class="step-label">{{ getStepLabel(step) }}</div>
          </div>
        </div>
      </div>

      <!-- Step 1: Information about the child -->
      <div v-if="currentStep === 1" class="info">
        <h2><i class="fas fa-child"></i> Information de l'enfant</h2>
        <div class="form-grid">
          <div class="form-group">
            <label for="Nom">Nom <span>*</span></label>
            <input type="text" v-model="child.lastName" class="input-field" placeholder="Entrez le nom">
          </div>
          <div class="form-group">
            <label>Prénom <span>*</span></label>
            <input type="text" v-model="child.firstName" class="input-field" placeholder="Entrez le prénom">
          </div>
          <div class="form-group">
            <label>Sexe</label>
            <select v-model="child.sex" class="input-field">
              <option value="">Sélectionnez le sexe</option>
              <option value="Masculin">Masculin</option>
              <option value="Féminin">Féminin</option>
            </select>
          </div>
          <div class="form-group">
            <label>Classe</label>
            <select v-model="child.class" class="input-field">
              <option value="">Sélectionnez la classe</option>
              <option value="CP1">CP1</option>
              <option value="CP2">CP2</option>
              <option value="CE1">CE1</option>
              <option value="CE2">CE2</option>
              <option value="CM1">CM1</option>
              <option value="CM2">CM2</option>
              <option value="6e">6e</option>
              <option value="5e">5e</option>
              <option value="4e">4e</option>
              <option value="3e">3e</option>
              <option value="2e">2e</option>
              <option value="1e">1e</option>
              <option value="Terminale">Terminale</option>  
            </select>
          </div>
          <div class="form-group">
            <label>Établissement</label>
            <input type="text" v-model="child.school" class="input-field" placeholder="Nom de l'établissement">
          </div>
          <div class="form-group">
            <label>Date de naissance <span>*</span></label>
            <input type="date" v-model="child.birthDate" class="input-field">
          </div>
          <div class="form-group">
            <label>Lieu de naissance <span>*</span></label>
            <input type="text" v-model="child.birthPlace" class="input-field" placeholder="Lieu de naissance">
          </div>
          <div class="form-group">
            <label>Quartier de résidence <span>*</span></label>
            <input type="text" v-model="child.live" class="input-field" placeholder="Quartier de résidence">
          </div>
        </div>
        <p v-if="showAlert" class="alert-message"><i class="fas fa-exclamation-circle"></i> Veuillez remplir tous les champs obligatoires.</p>
        <div class="button-group">
          <button class="button" @click="validateStep1">
            Suivant <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Step 2: Information about the parents -->
      <div v-if="currentStep === 2" class="info">
        <h2><i class="fas fa-users"></i> Information de parent/Tuteur</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Nom du père/tuteur <span>*</span></label>
            <input type="text" v-model="parent.fatherName" class="input-field" placeholder="Nom du père/tuteur">
          </div>
          <div class="form-group">
            <label>Nom de la mère</label>
            <input type="text" v-model="parent.motherName" class="input-field" placeholder="Nom de la mère">
          </div>
          <div class="form-group">
            <label>Téléphone <span>*</span></label>
            <input type="tel" v-model="parent.phoneNumber" class="input-field" placeholder="Numéro de téléphone">
          </div>
          <div class="form-group">
            <label>Profession</label>
            <input type="text" v-model="parent.occupation" class="input-field" placeholder="Profession">
          </div>
        </div>
        <p v-if="showAlert" class="alert-message"><i class="fas fa-exclamation-circle"></i> Veuillez remplir tous les champs obligatoires.</p>
        <div class="button-group">
          <button class="previous" @click="previousStep">
            <i class="fas fa-arrow-left"></i> Retour
          </button>
          <button class="button" @click="validateStep2">
            Suivant <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Step 3: Entry Date -->
      <div v-if="currentStep === 3" class="info">
        <h2><i class="fas fa-calendar-alt"></i> Date d'entrée au CDE 213</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Date d'entrée</label>
            <input type="date" v-model="date.dateOfEntrance" class="input-field">
          </div>
          <div class="form-group full-width">
            <label>Autre information</label>
            <textarea v-model="date.otherInfo" class="input-field" rows="4" 
                      placeholder="Informations supplémentaires concernant la vie de l'enfant"></textarea>
          </div>
        </div>
        <div class="button-group">
          <button class="previous" @click="previousStep">
            <i class="fas fa-arrow-left"></i> Retour
          </button>
          <button class="button" @click="validateStep3">
            Suivant <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Step 4: Add a photo -->
      <div v-if="currentStep === 4" class="info">
        <h2><i class="fas fa-camera"></i> Photo de l'enfant</h2>
        <div class="photo-upload">
          <div class="upload-area" @click="triggerFileInput" :class="{ 'has-image': profileImageURL }">
            <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" class="file-input">
            <div v-if="!profileImageURL" class="upload-placeholder">
              <i class="fas fa-cloud-upload-alt"></i>
              <p>Cliquez pour ajouter une photo</p>
            </div>
            <img v-else :src="profileImageURL" alt="Photo de profil" class="profile-photo">
          </div>
          <p class="upload-hint">Format accepté : JPG, PNG. Taille maximale : 2MB</p>
        </div>
        <div class="button-group">
          <button class="previous" @click="previousStep">
            <i class="fas fa-arrow-left"></i> Retour
          </button>
          <button class="button" @click="submitForm" :disabled="loading">
            <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
            <span v-else>Terminer l'inscription</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Popup -->
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <i class="fas fa-check-circle"></i>
        <h3>Inscription réussie !</h3>
        <p>L'enfant a été enregistré avec succès.</p>
      </div>
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
    },
    getStepLabel(step) {
      const labels = {
        1: 'Informations',
        2: 'Parents',
        3: 'Date d\'entrée',
        4: 'Photo'
      };
      return labels[step];
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    }
  }
};
</script>

<style scoped>
.page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.progress-container {
  margin-bottom: 40px;
}

.progress-bar {
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  margin-bottom: 20px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(135deg, #db2323 0%, #b31b1b 100%);
  transition: width 0.3s ease;
}

.steps {
  display: flex;
  justify-content: space-between;
  position: relative;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background-color: #db2323;
  color: white;
}

.step.completed .step-number {
  background-color: #b31b1b;
  color: white;
}

.step-label {
  font-size: 0.8rem;
  color: #64748b;
  text-align: center;
}

.step.active .step-label {
  color: #db2323;
  font-weight: 500;
}

h2 {
  color: #1e293b;
  font-size: 1.5rem;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
}

h2 i {
  color: #db2323;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #475569;
  font-weight: 500;
}

span {
  color: #db2323;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

.input-field:focus {
  outline: none;
  border-color: #db2323;
  box-shadow: 0 0 0 3px rgba(219, 35, 35, 0.1);
}

.input-field::placeholder {
  color: #94a3b8;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.button, .previous {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.button {
  background: linear-gradient(135deg, #db2323 0%, #b31b1b 100%);
  color: white;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(219, 35, 35, 0.2);
}

.button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.previous {
  background-color: #e2e8f0;
  color: #475569;
}

.previous:hover {
  background-color: #cbd5e1;
}

.alert-message {
  color: #db2323;
  font-size: 0.9rem;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.photo-upload {
  text-align: center;
  margin: 30px 0;
}

.upload-area {
  width: 200px;
  height: 200px;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  margin: 0 auto;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.upload-area:hover {
  border-color: #db2323;
}

.upload-area.has-image {
  border-style: solid;
}

.file-input {
  display: none;
}

.upload-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.upload-placeholder i {
  font-size: 3rem;
  margin-bottom: 10px;
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-hint {
  margin-top: 10px;
  color: #64748b;
  font-size: 0.9rem;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-content {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  animation: popup 0.3s ease;
}

.popup-content i {
  font-size: 3rem;
  color: #22c55e;
  margin-bottom: 15px;
}

.popup-content h3 {
  color: #1e293b;
  margin-bottom: 10px;
}

.popup-content p {
  color: #64748b;
}

@keyframes popup {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .button-group {
    flex-direction: column;
  }

  .button, .previous {
    width: 100%;
    justify-content: center;
  }

  .upload-area {
    width: 150px;
    height: 150px;
  }
}
</style>

<template>
  <div class="reset-password-page">
    <div class="reset-password-container">
      <div class="reset-password-content">
        <div class="reset-password-header">
          <router-link to="/" class="logo-link">
            <img class="reset-password-logo" src="@/assets/images/logo.jpeg" alt="CDE Koinonia" />
          </router-link>
          <h1 class="reset-password-title">Réinitialisation du mot de passe</h1>
          <p class="reset-password-subtitle">Créez un nouveau mot de passe sécurisé</p>
        </div>

        <form class="reset-password-form" @submit.prevent="resetPassword">
          <div class="form-group">
            <label for="password">Nouveau mot de passe<span class="required">*</span></label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
            <input
              id="password"
                :type="showPassword ? 'text' : 'password'"
              v-model="password"
                placeholder="Entrez votre nouveau mot de passe"
              required
                :class="{ 'is-invalid': passwordError }"
            />
              <i 
                class="fas" 
                :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                @click="togglePasswordVisibility"
              ></i>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmer le mot de passe<span class="required">*</span></label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
            <input
              id="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
                placeholder="Confirmez votre nouveau mot de passe"
              required
                :class="{ 'is-invalid': passwordError }"
              />
              <i 
                class="fas" 
                :class="showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'"
                @click="toggleConfirmPasswordVisibility"
              ></i>
            </div>
            <div class="error-message" v-if="passwordError">
              <i class="fas fa-exclamation-circle"></i>
              {{ passwordError }}
            </div>
          </div>

          <div class="password-requirements">
            <p>Le mot de passe doit contenir :</p>
            <ul>
              <li :class="{ 'valid': password.length >= 8 }">
                <i class="fas" :class="password.length >= 8 ? 'fa-check' : 'fa-times'"></i>
                Au moins 8 caractères
              </li>
              <li :class="{ 'valid': /[A-Z]/.test(password) }">
                <i class="fas" :class="/[A-Z]/.test(password) ? 'fa-check' : 'fa-times'"></i>
                Une lettre majuscule
              </li>
              <li :class="{ 'valid': /[a-z]/.test(password) }">
                <i class="fas" :class="/[a-z]/.test(password) ? 'fa-check' : 'fa-times'"></i>
                Une lettre minuscule
              </li>
              <li :class="{ 'valid': /[0-9]/.test(password) }">
                <i class="fas" :class="/[0-9]/.test(password) ? 'fa-check' : 'fa-times'"></i>
                Un chiffre
              </li>
              <li :class="{ 'valid': /[^A-Za-z0-9]/.test(password) }">
                <i class="fas" :class="/[^A-Za-z0-9]/.test(password) ? 'fa-check' : 'fa-times'"></i>
                Un caractère spécial
              </li>
            </ul>
          </div>

          <div class="success-message" v-if="successMessage">
            <i class="fas fa-check-circle"></i>
            {{ successMessage }}
          </div>

          <button 
            class="submit-button" 
            type="submit" 
            :disabled="loading || !isPasswordValid"
            :class="{ 'loading': loading }"
          >
            <span v-if="!loading">Réinitialiser le mot de passe</span>
            <i v-else class="fas fa-circle-notch fa-spin"></i>
        </button>

          <div class="back-to-login">
            <router-link to="/login">
              <i class="fas fa-arrow-left"></i>
              Retour à la connexion
            </router-link>
          </div>
        </form>
      </div>

      <div class="reset-password-image">
        <img src="@/assets/images/309430577_431589382413805_5270125874633532938_n.jpg" alt="CDE Koinonia" />
        <div class="image-overlay">
          <h2>CDE Koinonia</h2>
          <p>Nous sommes là pour vous aider</p>
        </div>
      </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { API_BASE_URL } from '@/config.js';
  
  export default {
  name: 'ResetPassword',
    data() {
      return {
        loading: false,
        password: '',
        confirmPassword: '',
        passwordError: '',
      successMessage: '',
      showPassword: false,
      showConfirmPassword: false
    };
  },
  computed: {
    isPasswordValid() {
      return (
        this.password.length >= 8 &&
        /[A-Z]/.test(this.password) &&
        /[a-z]/.test(this.password) &&
        /[0-9]/.test(this.password) &&
        /[^A-Za-z0-9]/.test(this.password) &&
        this.password === this.confirmPassword
      );
    }
    },
    methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
      async resetPassword() {
      if (!this.isPasswordValid) {
        this.passwordError = 'Le mot de passe ne respecte pas les critères requis';
          return;
        }

        this.loading = true;
      this.passwordError = '';
      this.successMessage = '';
        
        try {
        const response = await axios.post(
          `${API_BASE_URL}/user/reset-password/${this.$route.params.token}`,
          { password: this.password }
        );

        this.successMessage = 'Votre mot de passe a été réinitialisé avec succès.';
          this.password = '';
          this.confirmPassword = '';

        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
        } catch (error) {
          if (error.response && error.response.data) {
          this.passwordError = error.response.data.error || 'Une erreur est survenue. Veuillez réessayer.';
          } else {
          this.passwordError = 'Le lien de réinitialisation est invalide ou a expiré.';
          }
        } finally {
        this.loading = false;
        }
      }
    }
  };
</script>

  <style scoped>
.reset-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 2rem;
}

.reset-password-container {
  display: flex;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
}

.reset-password-content {
  flex: 1;
  padding: 3rem;
    display: flex;
  flex-direction: column;
    justify-content: center;
  }
  
.reset-password-header {
    text-align: center;
  margin-bottom: 2rem;
}

.logo-link {
  display: inline-block;
    margin-bottom: 1rem;
}

.reset-password-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.reset-password-title {
  font-size: 2rem;
    color: #333;
  margin-bottom: 0.5rem;
}

.reset-password-subtitle {
  color: #666;
  font-size: 1.1rem;
  }
  
  .form-group {
  margin-bottom: 1.5rem;
  }
  
.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
  font-weight: 500;
}

.required {
  color: #dc3545;
  margin-left: 0.25rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i {
  position: absolute;
  color: #666;
  }
  
.input-wrapper i:first-child {
  left: 1rem;
}

.input-wrapper i:last-child {
  right: 1rem;
  cursor: pointer;
}

.input-wrapper input {
    width: 100%;
  padding: 0.8rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  }
  
.input-wrapper input:focus {
  border-color: #db2323;
  box-shadow: 0 0 0 2px rgba(219, 35, 35, 0.1);
    outline: none;
  }
  
.input-wrapper input.is-invalid {
  border-color: #dc3545;
}

.password-requirements {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.password-requirements p {
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.password-requirements ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.password-requirements li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.password-requirements li.valid {
  color: #28a745;
}

.password-requirements li i {
  font-size: 0.8rem;
}

.error-message {
  background-color: #fff5f5;
  color: #dc3545;
  padding: 0.8rem;
  border-radius: 0.5rem;
    margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 0.8rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  }
  
  .submit-button {
  width: 100%;
  padding: 1rem;
  background-color: #db2323;
  color: white;
    border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
    cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.submit-button:hover:not(:disabled) {
  background-color: #b31b1b;
  transform: translateY(-2px);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-to-login {
  text-align: center;
    margin-top: 1rem;
  }
  
.back-to-login a {
  color: #666;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
  }
  
.back-to-login a:hover {
  color: #db2323;
}

.reset-password-image {
  flex: 1;
  position: relative;
  display: none;
  }
  
.reset-password-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 2rem;
  text-align: center;
}

.image-overlay h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  }
  
@media (min-width: 768px) {
  .reset-password-image {
    display: block;
    }
}

@media (max-width: 767px) {
  .reset-password-container {
    flex-direction: column;
    }
  
  .reset-password-content {
    padding: 2rem;
  }

  .reset-password-image {
    display: none;
    }
  }
  </style>
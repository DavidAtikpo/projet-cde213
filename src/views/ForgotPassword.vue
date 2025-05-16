<template>
  <div class="forgot-password-page">
    <div class="forgot-password-container">
      <div class="forgot-password-content">
        <div class="forgot-password-header">
          <router-link to="/" class="logo-link">
            <img class="forgot-password-logo" src="@/assets/images/logo.jpeg" alt="CDE Koinonia" />
          </router-link>
          <h1 class="forgot-password-title">Mot de passe oublié</h1>
          <p class="forgot-password-subtitle">Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>

        <form class="forgot-password-form" @submit.prevent="requestPasswordReset">
          <div class="form-group">
            <label for="email">Email<span class="required">*</span></label>
            <div class="input-wrapper">
              <i class="fas fa-envelope"></i>
              <input
                id="email"
                type="email"
                v-model="email"
                placeholder="Entrez votre email"
                required
                :class="{ 'is-invalid': emailError }"
              />
            </div>
            <div class="error-message" v-if="emailError">
              <i class="fas fa-exclamation-circle"></i>
              {{ emailError }}
            </div>
          </div>

          <div class="success-message" v-if="successMessage">
            <i class="fas fa-check-circle"></i>
            {{ successMessage }}
          </div>

          <button 
            class="submit-button" 
            type="submit" 
            :disabled="loading"
            :class="{ 'loading': loading }"
          >
            <span v-if="!loading">Envoyer le lien</span>
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

      <div class="forgot-password-image">
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
  name: 'ForgotPassword',
  data() {
    return {
      loading: false,
      email: '',
      emailError: '',
      successMessage: ''
    };
  },
  methods: {
    requestPasswordReset() {
      this.loading = true;
      this.emailError = '';
      this.successMessage = '';

      axios
        .post(`${API_BASE_URL}/user/forgot-password`, { email: this.email })
        .then((res) => {
          this.successMessage = 'Un lien de réinitialisation a été envoyé à votre email.';
          setTimeout(() => {
            this.$router.push('/reset');
          }, 2000);
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 404) {
            this.emailError = 'Email non trouvé';
          } else {
            this.emailError = 'Une erreur est survenue. Veuillez réessayer plus tard.';
          }
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
.forgot-password-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 2rem;
}

.forgot-password-container {
  display: flex;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
}

.forgot-password-content {
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.forgot-password-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-link {
  display: inline-block;
  margin-bottom: 1rem;
}

.forgot-password-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.forgot-password-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.forgot-password-subtitle {
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
  left: 1rem;
  color: #666;
}

.input-wrapper input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
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

.forgot-password-image {
  flex: 1;
  position: relative;
  display: none;
}

.forgot-password-image img {
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
  .forgot-password-image {
    display: block;
  }
}

@media (max-width: 767px) {
  .forgot-password-container {
    flex-direction: column;
  }

  .forgot-password-content {
    padding: 2rem;
  }

  .forgot-password-image {
    display: none;
  }
}
</style>
  
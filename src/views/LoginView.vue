<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-content">
        <div class="login-header">
          <router-link to="/" class="logo-link">
            <img class="login-logo" src="@/assets/images/logo.jpeg" alt="CDE Koinonia" />
          </router-link>
          <h1 class="login-title">Bienvenue</h1>
          <p class="login-subtitle">Connectez-vous à votre compte</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-wrapper">
              <i class="fas fa-envelope"></i>
              <input
                id="email"
                v-model="loginData.email"
                type="email"
                placeholder="Entrez votre email"
                @input="clearError"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="loginData.password"
                placeholder="Entrez votre mot de passe"
                :class="{ 'is-invalid': errorMessage }"
                @input="clearError"
                required
              />
              <i
                class="password-toggle"
                :class="{ 'fas fa-eye-slash': !showPassword, 'fas fa-eye': showPassword }"
                @click="togglePasswordVisibility"
              ></i>
            </div>
          </div>

          <div class="form-options">
            <router-link to="/forgot-password" class="forgot-password">
              Mot de passe oublié ?
            </router-link>
          </div>

          <div class="error-message" v-if="errorMessage">
            <i class="fas fa-exclamation-circle"></i>
            {{ errorMessage }}
          </div>

          <button 
            class="login-button" 
            type="submit" 
            :disabled="loading"
            :class="{ 'loading': loading }"
          >
            <span v-if="!loading">Se connecter</span>
            <i v-else class="fas fa-circle-notch fa-spin"></i>
          </button>

          <div class="register-link">
            Vous n'avez pas de compte ?
            <router-link to="/user/signup">S'inscrire</router-link>
          </div>
        </form>
      </div>

      <div class="login-image">
        <img src="@/assets/images/309430577_431589382413805_5270125874633532938_n.jpg" alt="CDE Koinonia" />
        <div class="image-overlay">
          <h2>CDE Koinonia</h2>
          <p>Délivrer les enfants de la pauvreté</p>
        </div>
      </div>
    </div>

    <!-- Popup de succès -->
    <div class="success-popup" :class="{ 'active': popupVisible }">
      <div class="popup-content">
        <i class="fas fa-check-circle"></i>
        <h3>Connexion réussie</h3>
        <p>Vous allez être redirigé...</p>
        <button @click="closePopup" class="popup-button">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { API_BASE_URL } from '@/config';

export default {
  name: 'LoginView',
  data() {
    return {
      loading: false,
      showPassword: false,
      popupVisible: false,
      loginData: {
        email: '',
        password: ''
      },
      errorMessage: ''
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    handleLogin() {
      this.loading = true;
      axios.post('http://localhost:8000/user/login', this.loginData, { withCredentials: true })
        .then((res) => {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', res.data.firstName);
          if (res.status == 200) {
            this.popupVisible = true;
            setTimeout(() => {
              if (res.data.role === 'Coordinateur') {
                this.$router.push(`/admin/${res.data._id}`);
              } else if (res.data.role === 'monitor') {
                this.$router.push(`/monitor/${res.data._id}`);
              } else {
                this.$router.push(`/user/${res.data._id}`);
              }
            }, 2000);
          }
        })
        .catch((error) => {
          console.log('Error submitting login:', error);
          this.errorMessage = error.response.data.message;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    clearError() {
      this.errorMessage = ''
    },
    closePopup() {
      this.popupVisible = false;
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 2rem;
}

.login-container {
  display: flex;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
}

.login-content {
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-link {
  display: inline-block;
  margin-bottom: 1rem;
}

.login-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.login-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.login-subtitle {
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

.password-toggle {
  position: absolute;
  right: 1rem;
  cursor: pointer;
  color: #666;
}

.form-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.forgot-password {
  color: #db2323;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #b31b1b;
}

.error-message {
  background-color: #fff5f5;
  color: #dc3545;
  padding: 0.8rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.login-button {
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

.login-button:hover:not(:disabled) {
  background-color: #b31b1b;
  transform: translateY(-2px);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  color: #666;
}

.register-link a {
  color: #db2323;
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.5rem;
}

.login-image {
  flex: 1;
  position: relative;
  display: none;
}

.login-image img {
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

.success-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.success-popup.active {
  opacity: 1;
  visibility: visible;
}

.popup-content {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.success-popup.active .popup-content {
  transform: translateY(0);
}

.popup-content i {
  font-size: 3rem;
  color: #28a745;
  margin-bottom: 1rem;
}

.popup-button {
  background-color: #db2323;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.popup-button:hover {
  background-color: #b31b1b;
}

@media (min-width: 768px) {
  .login-image {
    display: block;
  }
}

@media (max-width: 767px) {
  .login-container {
    flex-direction: column;
  }

  .login-content {
    padding: 2rem;
  }

  .login-image {
    display: none;
  }
}
</style>

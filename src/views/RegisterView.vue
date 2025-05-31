<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-content">
        <div class="register-header">
          <router-link to="/" class="logo-link">
            <img class="register-logo" src="@/assets/images/logo.jpeg" alt="CDE Koinonia" />
          </router-link>
          <h1 class="register-title">Créer un compte</h1>
          <p class="register-subtitle">Rejoignez notre communauté</p>
        </div>

        <form class="register-form" @submit.prevent="registerStudent">
          <div class="form-row">
            <div class="form-group">
              <label for="lastName">Nom<span class="required">*</span></label>
              <div class="input-wrapper">
                <i class="fas fa-user"></i>
                <input
                  id="lastName"
                  type="text"
                  v-model="data.lastName"
                  placeholder="Entrez votre nom"
                  @input="clearError('lastNameError')"
                  :class="{ 'is-invalid': lastNameError }"
                  required
                />
              </div>
              <div class="error-message" v-if="lastNameError">
                <i class="fas fa-exclamation-circle"></i>
                {{ lastNameError }}
              </div>
            </div>
           
            <div class="form-group">
              <label for="firstName">Prénom<span class="required">*</span></label>
              <div class="input-wrapper">
                <i class="fas fa-user"></i>
                <input
                  id="firstName"
                  type="text"
                  v-model="data.firstName"
                  placeholder="Entrez votre prénom"
                  @input="clearError('firstNameError')"
                  :class="{ 'is-invalid': firstNameError }"
                  required
                />
              </div>
              <div class="error-message" v-if="firstNameError">
                <i class="fas fa-exclamation-circle"></i>
                {{ firstNameError }}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="role">Rôle<span class="required">*</span></label>
            <div class="input-wrapper">
              <i class="fas fa-briefcase"></i>
              <input
                id="role"
                type="text"
                v-model="data.role"
                placeholder="ex: Santé, Comptable..."
                @input="clearError('roleExistError')"
                :class="{ 'is-invalid': roleExistError }"
                required
              />
            </div>
            <div class="error-message" v-if="roleExistError">
              <i class="fas fa-exclamation-circle"></i>
              {{ roleExistError }}
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email<span class="required">*</span></label>
            <div class="input-wrapper">
              <i class="fas fa-envelope"></i>
              <input
                id="email"
                type="email"
                v-model="data.email"
                placeholder="exemple@email.com"
                @input="clearError('emailFormatError', 'emailExistError')"
                :class="{ 'is-invalid': emailFormatError || emailExistError }"
                required
              />
            </div>
            <div class="error-message" v-if="emailFormatError || emailExistError">
              <i class="fas fa-exclamation-circle"></i>
              {{ emailFormatError || emailExistError }}
            </div>
          </div>

          <div class="form-group">
            <label for="phone">Téléphone<span class="required">*</span></label>
            <div class="input-wrapper">
              <i class="fas fa-phone"></i>
              <input
                id="phone"
                type="tel"
                v-model="data.phoneNumber"
                placeholder="0123456789"
                @input="clearError('phoneNumberError')"
                :class="{ 'is-invalid': phoneNumberError }"
                required
              />
            </div>
            <div class="error-message" v-if="phoneNumberError">
              <i class="fas fa-exclamation-circle"></i>
              {{ phoneNumberError }}
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe<span class="required">*</span></label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input
                id="password"
                :type="passwordFieldType"
                v-model="data.password"
                placeholder="Créez votre mot de passe"
                @input="clearError('passwordError')"
                :class="{ 'is-invalid': passwordError }"
                required
              />
              <button 
                type="button"
                class="password-toggle"
                @click="togglePasswordVisibility"
              >
                <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
              </button>
            </div>
            <div class="error-message" v-if="passwordError">
              <i class="fas fa-exclamation-circle"></i>
              {{ passwordError }}
            </div>
          </div>

          <button 
            class="register-button" 
            type="submit" 
            :disabled="loading"
            :class="{ 'loading': loading }"
          >
            <span v-if="!loading">S'inscrire</span>
            <i v-else class="fas fa-circle-notch fa-spin"></i>
          </button>

          <div class="login-link">
            Vous avez déjà un compte ?
            <router-link to="/login">Se connecter</router-link>
          </div>
        </form>
      </div>

      <div class="register-image">
        <img src="@/assets/images/309430577_431589382413805_5270125874633532938_n.jpg" alt="CDE Koinonia" />
        <div class="image-overlay">
          <h2>CDE Koinonia</h2>
          <p>Rejoignez notre mission</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  name: 'RegisterView',
  data() {
    return {
      showPassword: false,
      loading: false,
      data: {
        lastName: '',
        firstName: '',
        role: '',
        email: '',
        phoneNumber: '',
        password: '',
      },
      lastNameError: '',
      firstNameError: '',
      roleExistError: '',
      phoneNumberError: '',
      emailFormatError: '',
      emailExistError: '',
      passwordError: '',
    };
  },
  computed: {
    passwordFieldType() {
      return this.showPassword ? 'text' : 'password';
    },
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    registerStudent() {
      this.loading = true;
      axios
        .post(`${API_BASE_URL}/user/register`, this.data)
        .then((res) => {
          if (res.status === 201) {
            this.$router.push('/login');
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response) {
            if (error.response.status === 403) {
              const serverErrors = error.response.data.errors;
              if (serverErrors) {
                if (serverErrors.lastName) this.lastNameError = serverErrors.lastName;
                if (serverErrors.firstName) this.firstNameError = serverErrors.firstName;
                if (serverErrors.role) this.roleExistError = serverErrors.role;
                if (serverErrors.email) this.emailFormatError = serverErrors.email;
                if (serverErrors.phoneNumber) this.phoneNumberError = serverErrors.phoneNumber;
                if (serverErrors.password) this.passwordError = serverErrors.password;
              }
            } else if (error.response.status === 400) {
              if (error.response.data.email === 'Email already exists') {
                this.emailExistError = 'Cet email est déjà enregistré.';
              } else if (error.response.data.role === 'Role already exists') {
                this.roleExistError = 'Ce rôle est déjà enregistré.';
              }
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    clearError(...errors) {
      errors.forEach((error) => {
        this[error] = '';
      });
    },
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 2rem;
}

.register-container {
  display: flex;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  min-height: 600px;
}

.register-content {
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-link {
  display: inline-block;
  margin-bottom: 1rem;
}

.register-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.register-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.register-subtitle {
  color: #666;
  font-size: 1.1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.input-wrapper i:first-child {
  position: absolute;
  left: 1rem;
  color: #666;
  z-index: 1;
}

.input-wrapper input {
  width: 100%;
  padding: 0.8rem 3rem 0.8rem 2.5rem;
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
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #666;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #db2323;
}

.password-toggle i {
  font-size: 1rem;
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

.register-button {
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

.register-button:hover:not(:disabled) {
  background-color: #b31b1b;
  transform: translateY(-2px);
}

.register-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  color: #666;
}

.login-link a {
  color: #db2323;
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.5rem;
}

.register-image {
  flex: 1;
  position: relative;
  display: none;
}

.register-image img {
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
  .register-image {
    display: block;
  }
}

@media (max-width: 767px) {
  .register-container {
    flex-direction: column;
  }

  .register-content {
    padding: 2rem;
  }

  .register-image {
    display: none;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

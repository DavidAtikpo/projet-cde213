<!-- <template>
  <div class="overall">
    <div class="login-pic-container" :class="{ blurred: popupVisible }">
      <img class="login-pic" src="@/assets/images/309430577_431589382413805_5270125874633532938_n.jpg" alt="login-picture" />
      <div class="login-intro">Compassion Togo<br />Aneho Nlessi.</div>
    </div>
    <div class="login-container" :class="{ blurred: popupVisible }">
      <div>
        <a href="http://localhost:8080/">
          <img class="login-logo" src="@/assets/images/logo.jpeg" alt="logo" />
        </a>
      </div>
      <h2 class="login-title">Connectez ici</h2>
      <div class="login-user">
        <img class="user-logo" src="" alt="" />
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <input
          v-model="loginData.email"
          class="form-input"
          type="email"
          name="email"
          placeholder="Email"
          @input="clearError"
          required
        />
        <div class="password-container">
          <input
            id="password"
            class="form-input inner-pswd"
            :type="showPassword ? 'text' : 'password'"
            name="password"
            v-model="loginData.password"
            placeholder="Password"
            :class="{ 'is-invalid': errorMessage }"
            @input="clearError"
            required
          />
          <i
            class="toggle-password-icon"
            :class="{ 'fas fa-eye-slash': !showPassword, 'fas fa-eye': showPassword }"
            @click="togglePasswordVisibility"
          >
          </i>
        </div>
        <span class="error" v-if="errorMessage">{{ errorMessage }}</span>
        <div>
          <a class="forgot" @click="gotToForgot">Mot de passe oublie?</a>
        </div>

        <button class="form-button" type="submit" @click="handleLogin" :disabled="loading">
          <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
          <span v-else>Connecte</span>
        </button>
        <div class="login-p">
          Vous n'avez pas de compte?
          <a @click="goToRegister" class="sign-up-link" href="#">Inscription</a>
        </div>
      </form>
    </div>
    <div class="popup" id="popup">
      <img class="check" src="@/assets/images/check.png" />
      <h2>Login was successful</h2>
      <button @click="closePopup" type="button">OK</button>
    </div>
  </div>
</template> -->

<!-- <script>
import axios from 'axios'
import {API_BASE_URL}  from '@/config';
export default {
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
    gotToForgot() {
      this.$router.push('/forgot-password')
    },
    goToRegister() {
      this.$router.push('/user/signup')
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    handleLogin() {
      this.loading = true;
      axios.post(`${API_BASE_URL}/user/login`, this.loginData,{ withCredentials: true })
        .then((res) => {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', res.data.firstName);
          if (res.status == 200) {
            this.popupVisible = true;
            if (res.data.role === 'Coordinateur') {
              this.$router.push(`/admin/adminDashboard`);
            } else {
              this.$router.push(`/user/suivi`);
            }
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
      this.$router.push('/student/analytics'); 
    }
  }
}
</script> -->


<!-- <style scoped>
.overall {
  display: flex;
  padding: 0;
  margin: 0;
  gap: 2em;
  height: 100vh;
}
.blurred {
  filter: blur(5px); 
}

.login-pic-container {
  display: flex;
  background: black;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 56em;
  position: relative; 
  overflow: hidden; 
}
.login-pic {
  object-fit: cover;
  width: 100%;
  height: 100vh;
  opacity: 0.5;
  transition: transform 1.5s ease;
}
.login-pic:hover {
  transform: scale(1.9) rotate(5deg);
}


@keyframes move {
  0% {
    transform: translateX(0); 
  }
  50% {
    transform: translateX(50px); 
  }
  100% {
    transform: translateX(0);
  }
}


.login-pic.animated {
  animation: move 2s infinite; 
}

.login-intro {
  position: absolute;
  color: white;
  font-size: 3.5rem;
}

.login-title {
  color: #1f2bd3;
  font-size: 2.25rem;
  padding-top: 0.625rem;
}

.login-logo {
  padding-top: 1rem;
  width: 100px;
  
}


.login-user {
  padding-top: 0.313rem;
  font-size: 1.5rem;
  font-weight: 700;
  padding-bottom: 3.125rem;
}

.login-container {
  text-align: center;
  height: 100dvh;
  width: 34rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;


  gap: 1.25rem;
  width: 100%;
}

.form-input {
  width: 26rem;
  height: 2.844rem;
  padding-left: 0.5em;
  border: solid 1px;
  border-radius: 0.25em;
  border: 1px solid #ccc;
}
.is-invalid {
  border: 2px solid red;
}

.error {
  display: block;
  font-size: 1rem;
  margin-top: 1px;
  color: red;
}

@keyframes error-shake {
  0% {
    --left: -10px;
  }
  20% {
    --left: 8px;
  }
  40% {
    --left: -6px;
  }
  60% {
    --left: 4px;
  }
  80% {
    --left: -2px;
  }
  100% {
    --left: 0;
  }
}

.inner-pswd {
  border: none;
  display: inline-block;
  width: 26rem;
}

.inner-pswd:active {
  border: none;
}

.inner-pswd:invalid {
  border: none;
}

label {
  text-align: start;
}

.password-container {
  display: flex;
  border: solid 1px;
  border-color: #cccccc;
  border-radius: 0.25rem;
  position: relative;
}

.password-container:invalid {
  border: solid 2px red;
}

.toggle-password-icon {
  border: none;
  position: absolute;
  right: 0.375rem;
  top: 0.875rem;
  cursor: pointer;
}

.form-button {
  width: 26rem;
  height: 3rem;
  border: none;
  background-color: #1f2bd3;
  border-radius: 0.25em;
  cursor: pointer;
  color: white;
  font-weight: bold;
}

.form-button:hover{
  background-color: #06d73a;
}

.fa-spinner {
  font-size: 25px;
}
.login-p {
  color: grey;
  font-size: 14px;
}

.forgot {
  color: black;
  text-decoration: none;
  font-size: 1rem;
  display: inline;
  display: block;
  margin-bottom: 0;
}

.forgot:hover {
  color: red;
  cursor: pointer;
}

.sign-up-link {
  color: #1f2bd3;
  font-weight: 900;
  font-size: 1rem;
  text-decoration: underline;
}

.sign-up-link:hover {
  color: #06d73a;
}


@media only screen and (max-width: 600px) {
  .overall {
    display: flex;
    justify-content: center;
    height: 100dvh;
  }
  .login-pic-container {
    display: none;
  }
  .login-logo {
    
    padding-top: 0rem;
    margin-bottom: 4rem;
    width: 100px;
  }
  .login-container {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
    margin-top: 0%;
  }
  .form-input {
    width: 20rem;
    height: 2rem;
  }
  .form-button {
    width: 20rem;
    height: 2rem;
  }
  .login-title {
    font-size: 1.5rem;
  }
  .user-logo {
    width: 3rem;
  }
  .toggle-password-icon {
    top: 0.6rem;
  }
}

.check {
  width: 100px;
  margin-top: -50px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.popup {
  width: 400px;
  background: #fff;
  border-radius: 6px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.1);
  text-align: center;
  padding: 0 30px 30px;
  color: #333;
  visibility: hidden;
  z-index: 1;
  transition:
    transform 0.4s,
    top 0.4s;
}

.open-popup {
  visibility: visible;
  top: 50%;
  transform: translate(-50%, -50%) scale(1);
}

.popup h2 {
  font-size: 38px;
  font-weight: 500;
  margin: 30px 0 10px;
}

.popup button {
  width: 30%;
  margin-top: 50px;
  padding: 10px 0;
  background: #32c671;
  color: #fff;
  border: 0;
  outline: none;
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

}

.fas {
  color: #333; 
  font-size: 24px;
}


.fa-circle-notch {
  color: #06d73a; 
}


.fa-spin {
  animation: spin 2s linear infinite; 
}


@keyframes spin {
  from {
    transform: rotate(0deg); 
  }
  to {
    transform: rotate(360deg);
  }
}
</style> -->

<template>
  <div class="overall">
    <!-- Removed the login-pic-container -->
    <div class="login-container">
      <div>
        <a href="http://localhost:5173/">
          <img class="login-logo" src="@/assets/images/logo.jpeg" alt="logo" />
        </a>
      </div>
      <h2 class="login-title">Connectez ici</h2>
      <form class="login-form" @submit.prevent="handleLogin">
        <input
          v-model="loginData.email"
          class="form-input"
          type="email"
          name="email"
          placeholder="Email"
          @input="clearError"
          required
        />
        <div class="password-container">
          <input
            id="password"
            class="form-input inner-pswd"
            :type="showPassword ? 'text' : 'password'"
            name="password"
            v-model="loginData.password"
            placeholder="Password"
            :class="{ 'is-invalid': errorMessage }"
            @input="clearError"
            required
          />
          <i
    class="toggle-password-icon"
    :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
    @click="togglePasswordVisibility">
          </i>
        </div>
        <span class="error" v-if="errorMessage">{{ errorMessage }}</span>
        <div>
          <a class="forgot" @click="gotToForgot">Mot de passe oublié?</a>
        </div>

        <button class="form-button" type="submit" :disabled="loading">
          <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
          <span v-else>Connecter</span>
        </button>

        <div class="login-p">
          Vous n'avez pas de compte?
          <a @click="goToRegister" class="sign-up-link" href="#">Inscription</a>
        </div>
      </form>
    </div>
    
    <div class="popup" id="popup">
      <img class="check" src="@/assets/images/check.png" />
      <h2>Login was successful</h2>
      <button @click="closePopup" type="button">OK</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { API_BASE_URL } from '../config.js';

export default {
  data() {
    return {
      loading: false, // Loading state for the spinner
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
    gotToForgot() {
      this.$router.push('/forgot')
    },
    goToRegister() {
      this.$router.push('/user/signup')
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    handleLogin() {
  this.loading = true;
  this.errorMessage = '';  // Clear previous error messages

  console.log("response",this.loginData);
  axios.post(`${API_BASE_URL}/user/login`, this.loginData, { withCredentials: true })
    .then((res) => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', res.data.firstName);

      if (res.status === 200) {
        this.popupVisible = true;  // Show popup after successful login

        // Introduce delay to ensure the spinner appears
        setTimeout(() => {
          if (res.data.role === 'Coordinateur') {
            this.$router.push(`/admin/analytics`);
          } else {
            this.$router.push(`/user/suivi`);
          }
        });  // 2-second delay for testing spinner
      }
    })
    .catch((error) => {
      this.errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
    })
    .finally(() => {
      this.loading = false;  // Stop spinner after the request
    });
},

    clearError() {
      this.errorMessage = ''
    },
    closePopup() {
      this.popupVisible = false; // Close popup
      this.$router.push('/student/analytics'); // Redirect user after popup
    }
  }
}
</script>

<style scoped>
.overall {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("@/assets/images/pngtree-abstract-white-and-red-geometric-background-picture-image_1867378.jpg");
  background-size: cover;
}

.login-container {
  text-align: center;
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.login-title {
  color: #1f2bd3;
  font-size: 2.25rem;
  padding-top: 0.625rem;
}

.login-logo {
  width: 80px;
  margin-bottom: 1.5rem;
}

.form-input {
  width: 100%;
  height: 2.844rem;
  padding-left: 0.5em;
  border: 1px solid #ccc;
  border-radius: 0.25em;
}

.password-container {
  position: relative;
  width: 100%;
}

.toggle-password-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #888; /* Adjust the color */
  font-size: 1.25rem; /* Adjust the size */
}
.toggle-password-icon:hover {
  color: #000; /* Change color on hover */
}
.form-button {
  width: 100%;
  height: 3rem;
  border: none;
  background-color: #1f2bd3;
  border-radius: 0.25em;
  cursor: pointer;
  color: white;
  font-weight: bold;
  margin-top: 1rem;
}

.form-button:hover {
  background-color: #06d73a;
}

.error {
  display: block;
  font-size: 1rem;
  margin-top: 1px;
  color: red;
}

.forgot {
  color: black;
  text-decoration: none;
  font-size: 1rem;
  margin-top: 1rem;
}

.forgot:hover {
  color: red;
  cursor: pointer;
}

.sign-up-link {
  color: #1f2bd3;
  font-weight: 900;
  font-size: 1rem;
  text-decoration: underline;
  margin-top: 1rem;
}

.sign-up-link:hover {
  color: #06d73a;
}

.popup {
  width: 400px;
  background: #fff;
  border-radius: 6px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.1);
  text-align: center;
  padding: 0 30px 30px;
  color: #333;
  visibility: hidden;
  z-index: 1;
  transition: transform 0.4s, top 0.4s;
}

.open-popup {
  visibility: visible;
  top: 50%;
  transform: translate(-50%, -50%) scale(1);
}

.popup h2 {
  font-size: 38px;
  font-weight: 500;
  margin: 30px 0 10px;
}

.popup button {
  width: 30%;
  margin-top: 50px;
  padding: 10px 0;
  background: #32c671;
  color: #fff;
  border: 0;
  outline: none;
  font-size: 18px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.fas.fa-circle-notch.fa-spin {
  margin-right: 8px; /* Adds space between the spinner and text */
  font-size: 16px;   /* Adjusts the size of the spinner */
  color: #ffffff;    /* Ensures the spinner matches your button text color */
  display: inline-block;
  vertical-align: middle;
}

</style>

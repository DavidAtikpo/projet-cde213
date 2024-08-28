<template>
    <div class="forgot-password">
      <div class="password-content">
        <h2>Forgot Password</h2>
        <form @submit.prevent="requestPasswordReset">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Enter your email"
              required
              class="input-field"
            />
            <div v-if="emailError" class="error">{{ emailError }}</div>
          </div>
          <button class="submit-button" type="submit" :disabled="loading">
          <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
          <span v-else>Send Reset Link</span>
          <div v-if="successMessage" class="success">{{ successMessage }}</div>
        </button> 
        </form>
      </div>
    </div>
  </template>
  <script>
  import axios from 'axios';
  import { API_BASE_URL } from '@/config.js';
  
  export default {
    data() {
      return {
        loading:false,
        email: '',
        emailError: '',
        successMessage: ''
      };
    },
    methods: {
      requestPasswordReset() {
        this.loading = true
        axios
          .post(`${API_BASE_URL}/user/forgot-password`, { email: this.email })
          .then((res) => {
            this.successMessage = 'Password reset link has been sent to your email.';
            this.emailError = '';
            this.$router.push('/resset');
            console.log("frogot",res.data);
            
          })
          .catch((error) => {
            console.log(error);
            
            if (error.response && error.response.status === 404) {
              this.emailError = 'Email not found';
            } else {
              this.emailError = 'Something went wrong. Please try again later.';
            }
          }) .finally(() => {
      this.loading = false;  // Stop spinner after the request
    });
      }
    }
  };
  </script>

<style scoped>
.forgot-password {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("@/assets/images/pngtree-abstract-white-and-red-geometric-background-picture-image_1867378.jpg");
  background-size: cover;
  background-position: center;
}

.password-content {
  text-align: center;
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  margin: 0 1rem;
}

h2 {
  margin-bottom: 1rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #333;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: #007bff;
  outline: none;
}

.error {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.submit-button {
  background-color: #007bff;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

.submit-button:hover {
  background-color: #0056b3;
}

.success {
  color: #28a745;
  font-size: 0.875rem;
  margin-top: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .password-content {
    padding: 1.5rem;
  }

  .submit-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .password-content {
    padding: 1rem;
  }

  .input-field,
  .submit-button {
    font-size: 0.875rem;
  }

  .submit-button {
    padding: 0.5rem;
  }
}
</style>
  
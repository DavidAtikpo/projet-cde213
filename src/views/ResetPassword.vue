<template>
    <div class="reset-password">
      <div class="reset-content">
        <h2>Reset Password</h2>
        <form @submit.prevent="resetPassword">
          <div class="form-group">
            <label for="password">New Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Enter your new password"
              required
              class="input-field"
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              placeholder="Confirm your new password"
              required
              class="input-field"
            />
            <div v-if="passwordError" class="error">{{ passwordError }}</div>
          </div>
          <button class="submit-button" type="submit" :disabled="loading">
          <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
          <span v-else>Reset Password</span>
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
        loading: false,
        password: '',
        confirmPassword: '',
        passwordError: '',
        successMessage: ''
      };
    },
    methods: {
      async resetPassword() {
        // Validate password and confirmPassword
        if (this.password !== this.confirmPassword) {
          this.passwordError = 'Passwords do not match';
          return;
        }
        this.loading = true;
        this.passwordError = ''; // Clear any previous errors
        this.successMessage = ''; // Clear any previous success messages
        
        try {
          const response = await axios.post(`${API_BASE_URL}/user/reset-password/${this.$route.params.token}`, {
            password: this.password
          });

          // Handle success
          this.successMessage = 'Password has been reset successfully.';
          console.log(response.data);

          // Optionally reset form fields
          this.password = '';
          this.confirmPassword = '';

        } catch (error) {
          // Handle errors
          if (error.response && error.response.data) {
            this.passwordError = error.response.data.error || 'Something went wrong. Please try again.';
          } else {
            this.passwordError = 'Token is invalid or has expired.';
          }
          console.log(error);
        } finally {
          this.loading = false; // Stop spinner after the request
        }
      }
    }
  };
</script>

  
  <style scoped>
  .reset-password {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: url("@/assets/images/pngtree-abstract-white-and-red-geometric-background-picture-image_1867378.jpg");
    background-size: cover;
    background-position: center;
  }
  
  .reset-content {
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
    .reset-content {
      padding: 1.5rem;
    }
  
    .submit-button {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }
  }
  
  @media (max-width: 480px) {
    .reset-content {
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
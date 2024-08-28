 <template>
  <div v-if="popupVisible" class="popup-overlay">
    <div class="popup-content">
      <div class="nav">
        <a href="/">
          <img class="logo" src="../assets/images/logo.jpeg" alt="Logo" />
        </a>

      </div>
     

      <form @submit.prevent="registerStudent">
        <div class="form-field">
          <div class="top-content">
            <h2>Enregistrez</h2>
          </div>
          <div class="full-name">
            <div>
              <label class="last-name" for="lName">Nom<span>*</span></label>
              <input
                class="input-field name"
                type="text"
                id="lName"
                required
                placeholder="Doe"
                v-model="data.lastName"
                @input="clearError('lastNameError')"
                :class="{ 'is-invalid': lastNameError }"
              />
              <div class="error" v-if="lastNameError">{{ lastNameError }}</div>
            </div>
            <div>
              <label class="first-name" for="fName">Prénom<span>*</span></label>
              <input
                class="input-field name"
                type="text"
                id="fName"
                required
                placeholder="John"
                v-model="data.firstName"
                @input="clearError('firstNameError')"
                :class="{ 'is-invalid': firstNameError }"
              />
              <div class="error" v-if="firstNameError">{{ firstNameError }}</div>
            </div>
          </div>
          <div>
  <label for="role">Role<span>*</span></label>
  <input
    type="text"
    class="input-field"
    id="role"
    required
    placeholder="ex: Sante, Comptable..."
    v-model="data.role"
    @input="clearError('roleExistError')"
    :class="{ 'is-invalid': roleExistError }"
  />
  <div class="error" v-if="roleExistError">{{ roleExistError }}</div>
</div>

          <div>
  <label for="email">Email<span>*</span></label>
  <input
    type="email"
    class="input-field"
    id="email"
    required
    placeholder="example@email.com"
    v-model="data.email"
    @input="clearError('emailFormatError', 'emailExistError')"
    :class="{ 'is-invalid': emailFormatError || emailExistError }"
  />
  <div class="error" v-if="emailFormatError">{{ emailFormatError }}</div>
  <div class="error" v-else-if="emailExistError">{{ emailExistError }}</div>
</div>
          <div>
            <label for="phone">Téléphone<span>*</span></label>
            <input
              class="input-field"
              type="tel"
              id="phone"
              required
              placeholder="0123456789"
              v-model="data.phoneNumber"
              @input="clearError('phoneNumberError')"
              :class="{ 'is-invalid': phoneNumberError }"
            />
            <div class="error" v-if="phoneNumberError">{{ phoneNumberError }}</div>
          </div>
          <div>
            <label for="password">Mot de passe<span>*</span></label>
            <div class="password-container">
              <input
                class="input-field"
                :type="passwordFieldType"
                id="password"
                placeholder="Enter password"
                v-model="data.password"
                @input="clearError('passwordError')"
                :class="{ 'is-invalid': passwordError }"
              />
              <i
                class="toggle-password-icon"
                :class="{ 'fas fa-eye-slash': !showPassword, 'fas fa-eye': showPassword }"
                @click="togglePasswordVisibility"
              ></i>
            </div>
            <div class="error" v-if="passwordError">{{ passwordError }}</div>
          </div>
          <button type="submit" :disabled="loading">
            <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
              <span v-else>Submit</span>
            </button>
          <span class="login">Avez-vous déjà un compte? <a @click.prevent="goToLogin" href="#">Connectez</a></span>
        </div>
      </form>
      <button @click="closePopup" class="close-button">Fermer</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  data() {
    return {
      popupVisible: true,
      showPassword: false,
      loading:false,
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
          this.popupVisible = false; // Masquer la popup après l'inscription
          this.$router.push('/login'); // Redirection vers la page de connexion
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          // Gérer les erreurs de validation du serveur (statut 403)
          if (error.response.status === 403) {
            const serverErrors = error.response.data.errors;

            if (serverErrors) {
              if (serverErrors.lastName) {
                this.lastNameError = serverErrors.lastName;
              }
              if (serverErrors.firstName) {
                this.firstNameError = serverErrors.firstName;
              }
              if (serverErrors.role) {
                this.roleExistError = serverErrors.role;
              }
              if (serverErrors.email) {
                this.emailFormatError = serverErrors.email;
              }
              if (serverErrors.phoneNumber) {
                this.phoneNumberError = serverErrors.phoneNumber;
              }
              if (serverErrors.password) {
                this.passwordError = serverErrors.password;
              }
            }
          } 
          // Gérer l'erreur email déjà existant (statut 400)
          else if (error.response.status === 400 && error.response.data.email === 'Email already exists') {
            this.emailExistError = 'This email is already registered.';
          } 
          else if (error.response.status === 400 && error.response.data.role === 'Role already exists') {
            this.roleExistError = 'This Role already registered.';
          } 
          // Gérer d'autres erreurs
          else {
            console.error("Une erreur inattendue s'est produite", error);
          }
        }
      })
      .finally(() => {
        this.loading = false;  // Fin du chargement
      });
  },
  // La méthode closePopup n'est plus nécessaire ici si vous redirigez depuis registerStudent
  closePopup() {
    this.popupVisible = false;
    this.resetForm();
  },
  resetForm() {
    this.data = {
      lastName: '',
      firstName: '',
      role: '',
      email: '',
      phoneNumber: '',
      password: '',
    };
    this.clearAllErrors();
  },
  clearError(...errors) {
    errors.forEach((error) => {
      this[error] = '';
    });
  },
  clearAllErrors() {
    this.lastNameError = '';
    this.firstNameError = '';
    this.roleExistError = '';
    this.phoneNumberError = '';
    this.emailFormatError = '';
    this.emailExistError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
  },
  goToLogin() {
    this.$router.push('/login');
  }
}

};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("@/assets/images/pngtree-abstract-white-and-red-geometric-background-picture-image_1867378.jpg");
  display: flex;
  background-size: cover;
  align-items: center;
  justify-content: center;
}

.popup-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  position: relative;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin-bottom: 0px; */
}

.nav img {
  height: 60px;
  width: 60px;
  border-radius: 50%;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

label {
  font-size: 1rem;
  margin-bottom: 5px;
}

.input-field {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.password-container {
  position: relative;
}

.password-container i {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}

.error {
  color: red;
  font-size: 0.9rem;
}

button {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  background: #090255;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background: #1fdf5f;
}

.login {
  text-align: center;
  margin-top: 10px;
  font-size: 1rem;
}

.login a {
  color: blue;
  cursor: pointer;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
}

.close-button:hover {
  color: red;
}
.fas.fa-circle-notch.fa-spin {
  margin-right: 8px; /* Adds space between the spinner and text */
  font-size: 16px;   /* Adjusts the size of the spinner */
  color: #ffffff;    /* Ensures the spinner matches your button text color */
  display: inline-block;
  vertical-align: middle;
}
</style>

<template>
  <div>
    <h2>Gérer le compte</h2>
    <p>Nom d'utilisateur : {{ this.lastName }}</p>
    <p>Email : {{ email }}</p>
    <button @click="editAccount">Modifier le compte</button>

    <div v-if="isEditing">
      <button @click="showEditField('lastName')">Modifier le nom</button>
      <button @click="showEditField('firstName')">Modifier le prénom</button>
      <button @click="showEditField('email')">Modifier l'email</button>
      <button @click="showEditField('role')">Modifier le rôle</button>
      <button @click="showEditField('password')">Modifier le mot de passe</button>
    </div>

    <div v-if="editField === 'lastName'">
      <input v-model="newLastName" placeholder="Nouveau nom">
      <button @click="updateName">Valider</button>
    </div>
    <div v-if="editField === 'firstName'">
      <input v-model="newFirstName" placeholder="Nouveau prénom">
      <button @click="updateSurname">Valider</button>
    </div>
    <div v-if="editField === 'email'">
      <input v-model="newEmail" placeholder="Nouvel email">
      <button @click="updateEmail">Valider</button>
    </div>
    <div v-if="editField === 'role'">
      <input v-model="newRole" placeholder="Nouveau rôle">
      <button @click="updateRole">Valider</button>
    </div>
    <div v-if="editField === 'password'">
      <input v-model="currentPassword" type="password" placeholder="Ancien mot de passe">
      <input v-model="newPassword" type="password" placeholder="Nouveau mot de passe">
      <button @click="updatePassword">Valider</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  data() {
    return {
      username: '',
      email: '',
      lastName: '',
      firstName: '',
      role: '',
      isEditing: false,
      editField: '',
      newLastName: '',
      newFirstName: '',
      newEmail: '',
      newRole: '',
      currentPassword: '',
      newPassword: ''
    };
  },
  methods: {
    async editAccount() {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      try {
        const response = await axios.get(`${API_BASE_URL}/user/getuser`, { headers });
        this.lastName = response.data.lastName;
        console.log('data', this.lastName);
        this.email = response.data.email;
        this.firstName = response.data.firstName;
        this.role = response.data.role;
        this.username = response.data.username; // Ajouté si vous avez besoin d'afficher le nom d'utilisateur
        this.isEditing = !this.isEditing;
      } catch (error) {
        console.error('Erreur lors de la récupération des informations du compte :', error);
      }
    },
    showEditField(field) {
      this.editField = field;
    },
    async updateName() {
      try {
        const response = await axios.put(`${API_BASE_URL}/user/update`, {
          action: 'updateLastName',
          newLastName: this.newLastName
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Réponse de la requête de mise à jour du nom :', response.data);
        this.lastName = this.newLastName;
        this.editField = '';
      } catch (error) {
        console.error('Erreur lors de la mise à jour du nom :', error);
      }
    },
    async updateSurname() {
      try {
        const response = await axios.put(`${API_BASE_URL}/user/update`, {
          action: 'updateFirstName',
          newFirstName: this.newFirstName
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Réponse de la requête de mise à jour du prénom :', response.data);
        this.firstName = this.newFirstName;
        this.editField = '';
      } catch (error) {
        console.error('Erreur lors de la mise à jour du prénom :', error);
      }
    },
    async updateEmail() {
      try {
        const response = await axios.put(`${API_BASE_URL}/user/update`, {
          action: 'updateEmail',
          newEmail: this.newEmail
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Réponse de la requête de mise à jour de l\'email :', response.data);
        this.email = this.newEmail;
        this.editField = '';
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'email :', error);
      }
    },
    async updateRole() {
      try {
        const response = await axios.put(`${API_BASE_URL}/user/update`, {
          action: 'updateRole',
          newRole: this.newRole
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Réponse de la requête de mise à jour du rôle :', response.data);
        this.role = this.newRole;
        this.editField = '';
      } catch (error) {
        console.error('Erreur lors de la mise à jour du rôle :', error);
      }
    },
    async updatePassword() {
      try {
        const response = await axios.put(`${API_BASE_URL}/user/update`, {
          action: 'updatePassword',
          currentPassword: this.currentPassword,
          newPassword: this.newPassword
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Réponse de la requête de mise à jour du mot de passe :', response.data);
        this.editField = '';
      } catch (error) {
        console.error('Erreur lors de la mise à jour du mot de passe :', error);
      }
    }
  }
};
</script>



  
  <style scoped>
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  button {
    font-size: 1rem;
    padding: 0.5rem;
    margin-right: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #007bff;
    color: white;
  }
  </style>
  
<template>
    <div>
      <h2>Changer de compte</h2>
      <label for="account">Sélectionner un compte :</label>
      <select v-model="selectedAccount" id="account">
        <option value="compte1">Compte 1</option>
        <option value="compte2">Compte 2</option>
        <option value="compte3">Compte 3</option>
      </select>
      <button @click="changeAccount">Changer de compte</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedAccount: 'compte1' // Définissez le compte par défaut
      };
    },
    methods: {
      changeAccount() {
        // Logique pour changer de compte
        console.log('Changement de compte vers :', this.selectedAccount);
        // Vous pouvez implémenter ici la logique pour effectuer le changement de compte
      }
    }
  }
  </script>
  
  <style scoped>
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  label {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  select, button {
    font-size: 1rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  button {
    margin-top: 0.5rem;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  
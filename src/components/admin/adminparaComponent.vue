<template>
    <div>
      <h2>Paramètres</h2>
      <p>Personnalisez vos préférences et paramètres ici.</p>
      <button @click="openSettings">Ouvrir les paramètres</button>
      <div v-if="showSettings">
        <!-- Contenu des paramètres -->
        <h3>Préférences utilisateur</h3>
        <!-- Formulaires de modification des paramètres -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showSettings: false
      };
    },
    methods: {
      openSettings() {
        // Mettez en place la logique pour ouvrir les paramètres
        this.showSettings = true;
      }
    }
  }
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
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #007bff;
    color: white;
  }
  </style>
  
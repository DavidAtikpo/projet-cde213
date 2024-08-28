<template>
    <div>
      <h2>Besoin d'aide?</h2>
      <p>N'hésitez pas à nous contacter si vous avez des questions ou des préoccupations.</p>
      <button @click="contactSupport">Contacter le support</button>
      <div v-if="showContactForm">
        <!-- Formulaire de contact ou autres méthodes de support -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        showContactForm: false
      };
    },
    methods: {
      contactSupport() {
        // Mettez en place la logique pour afficher le formulaire de contact ou d'autres méthodes de support
        this.showContactForm = true;
        // Autres actions à effectuer lors du contact du support
        console.log('Contact du support');
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
  
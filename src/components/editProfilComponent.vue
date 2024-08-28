<template>
    <div>
      <h2>Modifier la photo de profil</h2>
      <p>Sélectionnez une nouvelle photo de profil :</p>
      <input type="file" @change="handleFileChange">
      <button @click="uploadPhoto">Enregistrer</button>
      <div v-if="previewImage">
        <h3>Aperçu de la nouvelle photo :</h3>
        <img :src="previewImage" alt="Aperçu de la photo de profil">
      </div>
      <p v-if="uploadSuccess">La photo de profil a été téléchargée avec succès !</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        selectedFile: null,
        previewImage: null,
        uploadSuccess: false,
      };
    },
    methods: {
      handleFileChange(event) {
        this.selectedFile = event.target.files[0];
        this.previewImage = URL.createObjectURL(this.selectedFile);
      },
      uploadPhoto() {
        if (this.selectedFile) {
          // Simulation de la requête HTTP pour télécharger la photo
          // Vous devez remplacer cette simulation par votre logique de téléchargement réelle
          setTimeout(() => {
            // Ici, vous enverriez la photo vers le serveur pour le téléchargement
            // Une fois le téléchargement réussi, vous pouvez mettre à jour l'état de uploadSuccess à true
            this.uploadSuccess = true;
  
            const profilePhotoURL = this.previewImage;
            // Exemple de code pour enregistrer l'URL dans localStorage
            localStorage.setItem('profilePhotoURL', profilePhotoURL);
  
            // Navigation vers la page d'accueil après le téléchargement réussi
            this.$router.push('/admin/analytics');
          }, 1500); // Simule un délai de 1.5 secondes pour le téléchargement
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
  
  input[type="file"] {
    margin-bottom: 1rem;
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
  
  img {
    max-width: 200px;
    max-height: 200px;
    margin-top: 1rem;
  }
  </style>
  
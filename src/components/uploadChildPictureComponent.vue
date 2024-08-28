<template>
  <div>
    <input type="file" @change="pickImageChange">
    <button @click="uploadImage">Télécharger</button>
  </div>
</template>


<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  data() {
    return {
      takeFile: null
    };
  },
  methods: {
    pickImageChange(event) {
      this.takeFile = event.target.files[0];
    },
    async uploadImage() {
      if (!this.takeFile) {
        console.error('Aucun fichier sélectionné.');
        return;
      }

      const childId = this.$route.params.id; // Récupérer l'ID de l'enfant depuis les paramètres de la route
      const formDatas = new FormData();
      formDatas.append('profilePicture', this.takeFile);

      const token = localStorage.getItem('token'); // Récupérer le jeton depuis le stockage local
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}` // Inclure le jeton dans l'en-tête Authorization
      };

      try {
        console.log('formData', formDatas);
        const response = await axios.post(`${API_BASE_URL}/childProfile/uploadChild/${childId}`, formDatas, { headers });
        localStorage.setItem('profilePhotoURL', response.data.path);
        console.log('Image téléchargée avec succès.', response.data);
      } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image :', error);
      }
    }
  }
}
</script>

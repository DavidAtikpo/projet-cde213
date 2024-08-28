<template>
  <div>
    <input type="file" @change="handleFileChange">
    <button @click="uploadImage">Télécharger</button>
  </div>
</template>

<script>
import axios from 'axios';
import {API_BASE_URL}  from '@/config.js';
export default {
  data() {
    return {
      selectedFile: null
    };
  },
  methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    async uploadImage() {
      const formData = new FormData();
      formData.append('profileImage', this.selectedFile);
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
      };
      console.log('formadta',formData);
      try {
        const response = await axios.post(`${API_BASE_URL}/profile/upload`, formData, {
          headers: headers
        });
        localStorage.setItem('profilePhotoURL', response.data.path);
        console.log('Image uploaded successfully.');
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  }
}
</script>

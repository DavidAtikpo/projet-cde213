<template>
    <div>
      <input type="file" @change="handleFileUpload">
      <button @click="uploadFile">Upload</button>
    </div>
  </template>
  
  <script>
  import {API_BASE_URL}  from '@/config.js';
  export default {
    data() {
      return {
        file: null
      };
    },
    methods: {
      handleFileUpload(event) {
        // Update the file property when a new file is selected
        this.file = event.target.files[0];
      },
      uploadFile() {
        // Retrieve the JWT token from localStorage
        const token = localStorage.getItem('token');

        // Create headers object with Authorization header
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // Create a FormData object to send the file to the backend
        const formData = new FormData();
        formData.append('file', this.file);

        // Make a POST request to upload the file
        fetch(`${API_BASE_URL}/admin/upload`, {
  method: 'POST',
  body: formData,
  headers: headers
})

        .then(response => {
          if (response.ok) {
            // File uploaded successfully
            console.log('File uploaded successfully');
          } else {
            // Error handling
            console.error('Failed to upload file');
          }
        })
        .catch(error => {
          console.error('Error uploading file:', error);
        });
      }
    }
  };
</script>

  
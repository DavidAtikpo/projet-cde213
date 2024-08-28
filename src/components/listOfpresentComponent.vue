<template>
    <div>
      <!-- Display child information and allow selection -->
      <div v-for="child in children" :key="child.id" @click="toggleChildSelection(child.id)">
        <div>
          <img :src="child.profilePicture" alt="Profile Picture" width="50" height="50">
          <span>{{ child.name }}</span>
        </div>
        <!-- Display additional information if child is selected -->
        <div v-if="selectedChildren.includes(child.id)">
          <p><strong>Name:</strong> {{ child.name }}</p>
          <p><strong>Age:</strong> {{ child.age }}</p>
          <p><strong>Gender:</strong> {{ child.gender }}</p>
          <p><strong>Name:</strong> {{ child.firstName }}</p>
        <p><strong>lastName:</strong> {{ child.lastName }}</p>
        <p><strong>Gender:</strong> {{ child.agender }}</p>
        <p><strong>class:</strong>{{ child.class }}</p>
        <p><strong>Etablissement:</strong> {{ child.school }}</p>
        <p><strong>Date de naissance:</strong> {{ child.birthDate }}</p>
        <p><strong>Lieu de naissance:</strong> {{ child.birthPlace }}</p>
        <p><strong>Quartier de residence:</strong>{{ child.live }}</p>
        <p><strong>Nom du pere/tuteur:</strong> {{ child.fatherName }}</p>
        <p><strong>Nom de la mere:</strong> {{ child.motherName }}</p>
        <p><strong>numero de telephone:</strong> {{ child.phoneNomber }}</p>
        <p><strong>Profession :</strong>{{ child.ocupation }}</p>
        <p><strong>Date de mise a jour:</strong> {{ child.createdAt }}</p>
        <p><strong>Inscri par :</strong> {{ }}</p>
        <p><strong>Autre information:</strong> {{ child.otherInfo }}</p>
        <p><strong>class:</strong>{{ child.class }}</p>
          <!-- Add more fields as needed -->
        </div>
      </div>
      <!-- Button to submit selected children -->
      <button @click="submitSelectedChildren">Submit Selected</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import {API_BASE_URL}  from '@/config.js';
  export default {
    data() {
      return {
        children: [],            // Array to store child information retrieved from the API
        selectedChildren: []    // Array to store IDs of selected children
      };
    },
    created() {
      // Fetch initial child information
      this.fetchChildren();
    },
    methods: {
      async fetchChildren() {
        try {
          const response = await axios.get(`${API_BASE_URL}/user/children`); // Adjust the API endpoint accordingly
          this.children = response.data; // Assuming the response contains an array of child objects
        } catch (error) {
          console.error('Error fetching children:', error);
        }
      },
      toggleChildSelection(childId) {
        // Add or remove child ID from selectedChildren array
        if (this.selectedChildren.includes(childId)) {
          this.selectedChildren = this.selectedChildren.filter(id => id !== childId);
        } else {
          this.selectedChildren.push(childId);
        }
      },
      async submitSelectedChildren() {
        // Make POST request to submit selected children
        try {
          const response = await axios.post('/api/selected-children', { ids: this.selectedChildren });
          console.log('Selected children submitted:', response.data);
          // Clear selectedChildren array after successful submission
          this.selectedChildren = [];
        } catch (error) {
          console.error('Error submitting selected children:', error);
        }
      }
    }
  };
  </script>
  
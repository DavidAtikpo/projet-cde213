<template>
    <div class="report-component" v-for="user in users" :key="user._id">
      <div class="profile-info">
        <img :src="user.profilePhotoURL ? user.profilePhotoURL :'../assets/icons/profile-icon.svg'" alt="Profile">
        <span>{{ user.firstName }}</span>
      </div>
      <div class="report-time">{{ user.createdAt }}</div>
      <div class="report-info">
        <h3>Rapport de l'utilisateur</h3>
        <div>Role:{{ user.role }}</div>
        <p>Percentage: {{user.pourcentage }}%</p>
        <p>Decision: {{ user.choix }}</p>
        <p>commentaire:{{ user.justification }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios  from 'axios';
  import {API_BASE_URL}  from '@/config.js';
  export default {
    data() {
      return {
        // reportTime: '',
        // percentage: '',
        // decision: ''
      };
    },
    mounted() {
      // Call a method to fetch report data from the backend
      this.fetchReportFromBackend();
    },
    methods: {
      fetchReportFromBackend() {
        // Example: Use Axios or Fetch to make an HTTP request to the backend
        // and retrieve report data
        // Example using Axios:
        const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
        axios.get(`${API_BASE_URL}/user/report`,{headers})
           .then(res => {
            this.users=res.data
            //  this.reportTime = response.data.time;
            //  this.percentage = response.data.percentage;
            //  this.decision = response.data.decision;
           })
          .catch(error => {
             console.error('Error fetching report data from backend:', error);
           });
        
        // Simulated data for demonstration
        // this.reportTime = 'Today at 10:00 AM'; // Replace with actual time
        // this.percentage = 75; // Replace with actual percentage
        // this.decision = 'Approved'; // Replace with actual decision
      }
    }
  };
  </script>
  
  <style scoped>
  .report-component {
    border: 1px solid #ccc;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .report-time {
    font-size: 14px;
    margin-bottom: 10px;
  }
  
  .report-info h3 {
    margin: 0;
  }
  
  .report-info p {
    margin: 0;
    color: #666;
  }
  </style>
  
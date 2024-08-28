<template>
    <div class="report-component">
      <div class="profile-info">
        <div>Role: {{ role }}</div>
      </div>
      <div class="report-time">{{ createdAt }}</div>
      <div class="report-info">
        
        <div class="objective">
          <h3>Objectif</h3>
          <p>Time: {{ arrivalTime }}</p>
          <p>Date: {{ date }}</p>
          <p>Commentaire: {{ dailyGoal }}</p>
        </div>
        <br>
        <div class="repport">
        <h3>Rapport</h3>
        <p>Percentage: {{ pourcentage }}%</p>
        <p>Decision: {{ choix }}</p>
        <p>Commentaire: {{ justification }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import {API_BASE_URL}  from '@/config.js';
  export default {
    data() {
      return {
        createdAt: '',
        dailyGoal: '',
        choix: '',
        justification: '',
        role: '',
        date: '',
        arrivalTime: '',
        pourcentage:'',
      };
    },
    mounted() {
      this.fetchReportFromBackend();
    },
    methods: {
      fetchReportFromBackend() {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        axios.get(`${API_BASE_URL}/user/getobject`, { headers })
          .then(res => {
            const { outObjective, enterObjective } = res.data;
  
            // Assuming `role`, `createdAt`, `dailyGoal`, `choix`, `justification`, `date`, and `arrivalTime` are all present in the response
            this.role = outObjective.role; // Assuming `role` is from the Out model
            this.createdAt = outObjective.createdAt; // Assuming `createdAt` is from the Out model
            this.dailyGoal = enterObjective.dailyGoal; // Assuming `dailyGoal` is from the Enter model
            this.choix = outObjective.choix;
            this.justification = outObjective.justification;
            this.date = enterObjective.date;
            this.arrivalTime = enterObjective.arrivalTime;
            this.pourcentage = outObjective.pourcentage
          })
          .catch(error => {
            console.error('Error fetching report data from backend:', error);
          });
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
  
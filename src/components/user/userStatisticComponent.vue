<template>
  <div>
    <div class="user-statistics">
      <h2>Statistiques de travail de l'utilisateur</h2>
      <div class="statistics-item">
        <h3>Nombre d'heures travaillées aujourd'hui</h3>
        <p>{{ hoursWorkedToday }} heures</p>
      </div>
      <div class="statistics-item">
        <h3>Productivité moyenne</h3>
        <p>{{ averageProductivity }}%</p>
      </div>
      <!-- Autres statistiques à afficher -->
    </div>

    <div class="chart-container">
      <canvas ref="barChart"></canvas>
    </div>
  </div>
</template>

  
  <script>
  // import { Chart } from 'chart.js/auto';
  // import {API_BASE_URL}  from '@/config.js';
  
  export default {
    data() {
    return {
      hoursWorkedToday: 8.5, // Exemple de données
      averageProductivity: 75 // Exemple de données
      // Autres données statistiques
    };
  },
    mounted() {
      // Données du graphique (ex. nombre d'heures travaillées par jour)
      const data = {
        labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        datasets: [{
          label: 'Nombre d\'heures travaillées par jour',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          data: [8, 7.5, 8.5, 7, 9, 6.5] // Exemple de données
        }]
      };
  
      // Configuration du graphique
      const options = {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      };
  
      // Création du graphique
      new Chart(this.$refs.barChart, {
        type: 'bar',
        data: data,
        options: options
      });
    }
  };
  </script>
  
  <style scoped>
  .user-statistics {
    max-width: 600px;
    margin: auto;
  }

  .user-statistics {
  max-width: 600px;
  margin: auto;
}

.statistics-item {
  margin-bottom: 20px;
}

h3 {
  margin-bottom: 5px;
}
  </style>
  
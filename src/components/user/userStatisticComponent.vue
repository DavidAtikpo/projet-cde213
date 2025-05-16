<template>
  <div class="statistics-page">
    <!-- En-tête des statistiques -->
    <div class="statistics-header">
      <h1>Statistiques de travail</h1>
      <div class="date-filter">
        <button 
          v-for="period in timePeriods" 
          :key="period.value"
          :class="['period-button', { active: selectedPeriod === period.value }]"
          @click="selectPeriod(period.value)"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Cartes de statistiques -->
    <div class="statistics-cards">
      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <h3>Heures travaillées</h3>
          <div class="stat-value">{{ hoursWorkedToday }}h</div>
          <div class="stat-change" :class="{ positive: hoursChange > 0, negative: hoursChange < 0 }">
            <i :class="['fas', hoursChange > 0 ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
            {{ Math.abs(hoursChange) }}% vs semaine dernière
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="stat-content">
          <h3>Productivité</h3>
          <div class="stat-value">{{ averageProductivity }}%</div>
          <div class="stat-change" :class="{ positive: productivityChange > 0, negative: productivityChange < 0 }">
            <i :class="['fas', productivityChange > 0 ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
            {{ Math.abs(productivityChange) }}% vs semaine dernière
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <i class="fas fa-tasks"></i>
        </div>
        <div class="stat-content">
          <h3>Tâches complétées</h3>
          <div class="stat-value">{{ completedTasks }}</div>
          <div class="stat-change" :class="{ positive: tasksChange > 0, negative: tasksChange < 0 }">
            <i :class="['fas', tasksChange > 0 ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
            {{ Math.abs(tasksChange) }}% vs semaine dernière
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques -->
    <div class="charts-container">
      <div class="chart-card">
        <h3>Heures travaillées par jour</h3>
        <div class="chart-wrapper">
          <canvas ref="hoursChart"></canvas>
        </div>
      </div>

      <div class="chart-card">
        <h3>Productivité par jour</h3>
        <div class="chart-wrapper">
          <canvas ref="productivityChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Tableau des activités récentes -->
    <div class="recent-activities">
      <h3>Activités récentes</h3>
      <div class="activities-table">
        <div class="table-header">
          <span>Date</span>
          <span>Activité</span>
          <span>Durée</span>
          <span>Statut</span>
        </div>
        <div v-for="(activity, index) in recentActivities" 
             :key="index" 
             class="table-row">
          <span>{{ activity.date }}</span>
          <span>{{ activity.name }}</span>
          <span>{{ activity.duration }}h</span>
          <span :class="['status', activity.status]">{{ activity.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      selectedPeriod: 'week',
      timePeriods: [
        { label: 'Aujourd\'hui', value: 'day' },
        { label: 'Cette semaine', value: 'week' },
        { label: 'Ce mois', value: 'month' }
      ],
      hoursWorkedToday: 8.5,
      hoursChange: 5,
      averageProductivity: 85,
      productivityChange: -2,
      completedTasks: 12,
      tasksChange: 8,
      recentActivities: [
        { date: '2024-03-20', name: 'Réunion d\'équipe', duration: 2, status: 'completed' },
        { date: '2024-03-20', name: 'Rapport mensuel', duration: 3, status: 'in-progress' },
        { date: '2024-03-19', name: 'Formation', duration: 4, status: 'completed' }
      ]
    };
  },
  computed: {
    ...mapState(['theme'])
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    selectPeriod(period) {
      this.selectedPeriod = period;
      this.updateCharts();
    },
    initCharts() {
      // Graphique des heures
      new Chart(this.$refs.hoursChart, {
        type: 'bar',
        data: {
          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          datasets: [{
            label: 'Heures travaillées',
            data: [8, 7.5, 8.5, 7, 9, 6.5, 0],
            backgroundColor: 'rgba(219, 35, 35, 0.2)',
            borderColor: 'rgba(219, 35, 35, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });

      // Graphique de productivité
      new Chart(this.$refs.productivityChart, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          datasets: [{
            label: 'Productivité',
            data: [85, 82, 88, 90, 85, 80, 0],
            borderColor: 'rgba(219, 35, 35, 1)',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(219, 35, 35, 0.1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    },
    updateCharts() {
      // Mise à jour des données des graphiques en fonction de la période sélectionnée
      // À implémenter selon les besoins
    }
  }
};
</script>

<style lang="scss" scoped>
.statistics-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.statistics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.8rem;
    color: #333;
    margin: 0;
  }
}

.date-filter {
  display: flex;
  gap: 0.5rem;
}

.period-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f8f9fa;
  }

  &.active {
    background: #db2323;
    color: white;
    border-color: #db2323;
  }
}

.statistics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: rgba(219, 35, 35, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #db2323;
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;

  h3 {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin: 0.5rem 0;
}

.stat-change {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &.positive {
    color: #28a745;
  }

  &.negative {
    color: #dc3545;
  }
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }
}

.chart-wrapper {
  height: 300px;
}

.recent-activities {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }
}

.activities-table {
  .table-header {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 1fr;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 0.5rem;
    font-weight: 500;
    color: #666;
  }

  .table-row {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr 1fr;
    padding: 1rem;
    border-bottom: 1px solid #eee;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }
  }
}

.status {
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;

  &.completed {
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
  }

  &.in-progress {
    background: rgba(255, 193, 7, 0.1);
    color: #ffc107;
  }
}

/* Dark theme */
:deep(.dark) {
  .statistics-header h1 {
    color: #fff;
  }

  .period-button {
    background: #2d2d2d;
    border-color: #404040;
    color: #fff;

    &:hover {
      background: #404040;
    }
  }

  .stat-card,
  .chart-card,
  .recent-activities {
    background: #2d2d2d;
  }

  .stat-content h3 {
    color: #999;
  }

  .stat-value {
    color: #fff;
  }

  .activities-table {
    .table-header {
      background: #1a1a1a;
      color: #999;
    }

    .table-row {
      border-bottom-color: #404040;
    }
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .statistics-page {
    padding: 1rem;
  }

  .statistics-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .charts-container {
    grid-template-columns: 1fr;
  }

  .activities-table {
    .table-header,
    .table-row {
      grid-template-columns: 1fr 2fr 1fr;
      font-size: 0.9rem;

      span:last-child {
        display: none;
      }
    }
  }
}
</style>
  
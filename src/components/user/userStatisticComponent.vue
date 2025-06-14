<template>
  <div class="statistics-page">
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Chargement de toutes les statistiques...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
        <button @click="loadAllStatistics" class="retry-button">Réessayer</button>
      </div>
    </div>

    <!-- Main content -->
    <div v-else>
      <!-- En-tête des statistiques -->
      <div class="statistics-header">
        <h1>📊 Tableau de Bord Complet</h1>
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

      <!-- Statistiques Globales du Système -->
      <div v-if="globalStats" class="section">
        <h2>🌍 Statistiques Globales du Système</h2>
        <div class="statistics-cards">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <h3>Total Utilisateurs</h3>
              <div class="stat-value">{{ globalStats.users?.total || 0 }}</div>
              <div class="stat-change positive">
                <i class="fas fa-info-circle"></i>
                Tous rôles confondus
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-child"></i>
            </div>
            <div class="stat-content">
              <h3>Total Enfants</h3>
              <div class="stat-value">{{ globalStats.children?.total || 0 }}</div>
              <div class="stat-change positive">
                <i class="fas fa-info-circle"></i>
                Dans le système
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-file-alt"></i>
            </div>
            <div class="stat-content">
              <h3>Total Rapports</h3>
              <div class="stat-value">{{ globalStats.reports?.total || 0 }}</div>
              <div class="stat-change positive">
                <i class="fas fa-chart-line"></i>
                {{ Math.round(globalStats.reports?.averagePerformance || 0) }}% moyenne
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-bullseye"></i>
            </div>
            <div class="stat-content">
              <h3>Total Objectifs</h3>
              <div class="stat-value">{{ globalStats.goals?.total || 0 }}</div>
              <div class="stat-change positive">
                <i class="fas fa-target"></i>
                Créés par tous
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tableau de Bord Admin -->
      <div v-if="adminDashboard" class="section">
        <h2>👑 Tableau de Bord Administrateur</h2>
        <div class="admin-dashboard">
          <div class="dashboard-card">
            <h3>📈 Activité Récente (7 derniers jours)</h3>
            <div class="activity-grid">
              <div class="activity-item">
                <span class="activity-label">Nouveaux Utilisateurs</span>
                <span class="activity-value">{{ adminDashboard.recentActivity?.newUsers || 0 }}</span>
              </div>
              <div class="activity-item">
                <span class="activity-label">Nouveaux Enfants</span>
                <span class="activity-value">{{ adminDashboard.recentActivity?.newChildren || 0 }}</span>
              </div>
              <div class="activity-item">
                <span class="activity-label">Nouveaux Rapports</span>
                <span class="activity-value">{{ adminDashboard.recentActivity?.newReports || 0 }}</span>
              </div>
              <div class="activity-item">
                <span class="activity-label">Nouveaux Objectifs</span>
                <span class="activity-value">{{ adminDashboard.recentActivity?.newGoals || 0 }}</span>
              </div>
            </div>
          </div>

          <div class="dashboard-card">
            <h3>🏆 Top 5 Performers</h3>
            <div class="top-performers">
              <div v-for="(performer, index) in adminDashboard.topPerformers" 
                   :key="index" 
                   class="performer-item">
                <div class="performer-rank">{{ index + 1 }}</div>
                <div class="performer-info">
                  <div class="performer-name">{{ performer.userName }}</div>
                  <div class="performer-stats">
                    {{ Math.round(performer.averagePercentage) }}% - {{ performer.reportsCount }} rapports
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mes Statistiques Personnelles -->
      <div class="section">
        <h2>👤 Mes Statistiques Personnelles</h2>
        <div class="statistics-cards">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="stat-content">
              <h3>Ma Performance Moyenne</h3>
              <div class="stat-value">{{ myAveragePerformance }}%</div>
              <div class="stat-change" :class="{ positive: myAveragePerformance >= 70 }">
                <i :class="['fas', myAveragePerformance >= 70 ? 'fa-arrow-up' : 'fa-arrow-down']"></i>
                Basé sur {{ myTotalReports }} rapports
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-file-alt"></i>
            </div>
            <div class="stat-content">
              <h3>Mes Rapports</h3>
              <div class="stat-value">{{ myTotalReports }}</div>
              <div class="stat-change" :class="{ positive: myRecentReports > 0 }">
                <i :class="['fas', myRecentReports > 0 ? 'fa-arrow-up' : 'fa-minus']"></i>
                {{ myRecentReports }} cette semaine
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-bullseye"></i>
            </div>
            <div class="stat-content">
              <h3>Mes Objectifs</h3>
              <div class="stat-value">{{ myTotalGoals }}</div>
              <div class="stat-change" :class="{ positive: myRecentGoals > 0 }">
                <i :class="['fas', myRecentGoals > 0 ? 'fa-arrow-up' : 'fa-minus']"></i>
                {{ myRecentGoals }} cette semaine
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Graphiques de Performance -->
      <div class="section">
        <h2>📈 Analyse de Performance</h2>
        <div class="charts-container">
          <div class="chart-card">
            <h3>📊 Performance par {{ selectedPeriod === 'day' ? 'Jour' : selectedPeriod === 'week' ? 'Semaine' : selectedPeriod === 'month' ? 'Mois' : 'Année' }}</h3>
            <div class="chart-wrapper">
              <canvas ref="performanceChart"></canvas>
            </div>
          </div>

          <div class="chart-card">
            <h3>🎯 Distribution des Performances</h3>
            <div class="chart-wrapper">
              <canvas ref="distributionChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Mes Objectifs Hebdomadaires -->
      <div v-if="userGoals && userGoals.data" class="section">
        <h2>🎯 Mes Objectifs de la Semaine</h2>
        <div class="goals-grid">
          <div v-if="userGoals.data.tuesday" class="goal-card">
            <div class="goal-day">Mardi</div>
            <div class="goal-content">{{ userGoals.data.tuesday }}</div>
          </div>
          <div v-if="userGoals.data.wednesday" class="goal-card">
            <div class="goal-day">Mercredi</div>
            <div class="goal-content">{{ userGoals.data.wednesday }}</div>
          </div>
          <div v-if="userGoals.data.thursday" class="goal-card">
            <div class="goal-day">Jeudi</div>
            <div class="goal-content">{{ userGoals.data.thursday }}</div>
          </div>
          <div v-if="userGoals.data.friday" class="goal-card">
            <div class="goal-day">Vendredi</div>
            <div class="goal-content">{{ userGoals.data.friday }}</div>
          </div>
          <div v-if="userGoals.data.saturday" class="goal-card">
            <div class="goal-day">Samedi</div>
            <div class="goal-content">{{ userGoals.data.saturday }}</div>
          </div>
        </div>
      </div>

      <!-- Statistiques des Utilisateurs -->
      <div v-if="usersStats && usersStats.length > 0" class="section">
        <h2>👥 Statistiques des Utilisateurs</h2>
        <div class="users-table">
          <div class="table-header">
            <span>Utilisateur</span>
            <span>Rôle</span>
            <span>Rapports</span>
            <span>Objectifs</span>
            <span>Performance</span>
            <span>Dernière Activité</span>
          </div>
          <div v-for="(user, index) in usersStats.slice(0, 10)" 
               :key="index" 
               class="table-row">
            <span>{{ user.firstName }} {{ user.lastName }}</span>
            <span :class="['role-badge', user.role]">{{ user.role }}</span>
            <span>{{ user.reportsCount || 0 }}</span>
            <span>{{ user.goalsCount || 0 }}</span>
            <span>{{ Math.round(user.averagePerformance || 0) }}%</span>
            <span>{{ formatDate(user.lastReportDate) || 'Jamais' }}</span>
          </div>
        </div>
      </div>

      <!-- Statistiques des Enfants -->
      <div v-if="childrenStats && childrenStats.length > 0" class="section">
        <h2>👶 Statistiques des Enfants</h2>
        <div class="children-stats">
          <div class="children-summary">
            <div class="summary-card">
              <h4>Par Âge</h4>
              <div v-for="ageGroup in getAgeGroups(childrenStats)" :key="ageGroup.range" class="age-group">
                <span>{{ ageGroup.range }}</span>
                <span>{{ ageGroup.count }}</span>
              </div>
            </div>
            <div class="summary-card">
              <h4>Par Localisation</h4>
              <div v-for="location in getLocationGroups(childrenStats)" :key="location.name" class="location-group">
                <span>{{ location.name }}</span>
                <span>{{ location.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mes Rapports Récents -->
      <div class="section">
        <h2>📋 Mes Rapports Récents</h2>
        <div v-if="myRecentReportsData.length === 0" class="no-data">
          <i class="fas fa-inbox"></i>
          <p>Aucun rapport récent trouvé</p>
        </div>
        <div v-else class="activities-table">
          <div class="table-header">
            <span>Date</span>
            <span>Choix</span>
            <span>Performance</span>
            <span>Statut</span>
          </div>
          <div v-for="(report, index) in myRecentReportsData" 
               :key="index" 
               class="table-row">
            <span>{{ formatDate(report.createdAt) }}</span>
            <span>{{ report.choix || 'N/A' }}</span>
            <span>{{ report.pourcentage }}%</span>
            <span :class="['status', getStatusClass(report.pourcentage)]">
              {{ getStatusText(report.pourcentage) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';
import { mapState } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  data() {
    return {
      loading: true,
      error: null,
      selectedPeriod: 'week',
      timePeriods: [
        { label: '📅 Aujourd\'hui', value: 'day' },
        { label: '📆 Cette semaine', value: 'week' },
        { label: '🗓️ Ce mois', value: 'month' },
        { label: '📅 Cette année', value: 'year' }
      ],
      
      // Toutes les données du backend
      globalStats: null,
      usersStats: null,
      childrenStats: null,
      reportsStats: null,
      goalsStats: null,
      adminDashboard: null,
      dailyStats: [],
      weeklyStats: [],
      monthlyStats: [],
      yearlyStats: [],
      userGoals: null,
      userPerformance: null,
      
      // Données calculées pour l'utilisateur connecté
      myAveragePerformance: 0,
      myTotalReports: 0,
      myTotalGoals: 0,
      myRecentReports: 0,
      myRecentGoals: 0,
      myRecentReportsData: [],
      
      // Charts
      performanceChart: null,
      distributionChart: null
    };
  },
  
  computed: {
    ...mapState(['theme']),
    
    currentStatsData() {
      switch (this.selectedPeriod) {
        case 'day':
          return this.dailyStats;
        case 'week':
          return this.weeklyStats;
        case 'month':
          return this.monthlyStats;
        case 'year':
          return this.yearlyStats;
        default:
          return this.weeklyStats;
      }
    }
  },
  
  async mounted() {
    await this.loadAllStatistics();
    this.initCharts();
  },
  
  methods: {
    async loadAllStatistics() {
      this.loading = true;
      this.error = null;
      
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        // Charger TOUTES les statistiques en parallèle
        const [
          globalRes,
          usersRes,
          childrenRes,
          reportsRes,
          goalsRes,
          adminRes,
          dailyRes,
          weeklyRes,
          monthlyRes,
          yearlyRes,
          userGoalsRes,
          userPerfRes
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/statistic/admin/stats/global`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API_BASE_URL}/statistic/admin/stats/users`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API_BASE_URL}/statistic/admin/stats/children`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API_BASE_URL}/statistic/admin/stats/reports`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API_BASE_URL}/statistic/admin/stats/goals`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API_BASE_URL}/statistic/admin/dashboard`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API_BASE_URL}/statistic/admin/stats/daily`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/statistic/admin/stats/weekly`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/statistic/admin/stats/monthly`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/statistic/admin/stats/yearly`, { headers }).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/week/getweekly`, { headers }).catch(() => ({ data: null })),
          axios.get(`${API_BASE_URL}/user/getObjectives`, { headers }).catch(() => ({ data: null }))
        ]);
        
        // Assigner toutes les données
        this.globalStats = globalRes.data;
        this.usersStats = usersRes.data;
        this.childrenStats = childrenRes.data;
        this.reportsStats = reportsRes.data;
        this.goalsStats = goalsRes.data;
        this.adminDashboard = adminRes.data;
        this.dailyStats = dailyRes.data;
        this.weeklyStats = weeklyRes.data;
        this.monthlyStats = monthlyRes.data;
        this.yearlyStats = yearlyRes.data;
        this.userGoals = userGoalsRes.data;
        this.userPerformance = userPerfRes.data;
        
        // Calculer les métriques personnelles
        this.calculatePersonalMetrics();
        
        // Mettre à jour les graphiques
        this.updateCharts();
        
        console.log('Toutes les statistiques chargées:', {
          globalStats: this.globalStats,
          usersStats: this.usersStats?.length,
          childrenStats: this.childrenStats?.length,
          reportsStats: this.reportsStats?.total,
          goalsStats: this.goalsStats?.total,
          adminDashboard: this.adminDashboard
        });
        
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.error = 'Erreur lors du chargement des statistiques. Veuillez réessayer.';
      } finally {
        this.loading = false;
      }
    },
    
    calculatePersonalMetrics() {
      const currentUserId = localStorage.getItem('userId');
      
      // Calculer à partir des statistiques utilisateurs
      if (this.usersStats && this.usersStats.length > 0) {
        const myStats = this.usersStats.find(user => user._id === currentUserId);
        if (myStats) {
          this.myTotalReports = myStats.reportsCount || 0;
          this.myTotalGoals = myStats.goalsCount || 0;
          this.myAveragePerformance = Math.round(myStats.averagePerformance || 0);
        }
      }
      
      // Calculer les rapports récents de l'utilisateur
      if (this.reportsStats && this.reportsStats.reports) {
        const myReports = this.reportsStats.reports.filter(report => 
          report.postedBy === currentUserId || 
          (report.user && report.user._id === currentUserId)
        );
        
        this.myRecentReportsData = myReports.slice(0, 10);
        
        // Calculer les rapports récents (7 derniers jours)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        this.myRecentReports = myReports.filter(report => 
          new Date(report.createdAt) >= sevenDaysAgo
        ).length;
      }
      
      // Calculer les objectifs récents
      if (this.goalsStats && this.goalsStats.goals) {
        const myGoals = this.goalsStats.goals.filter(goal => 
          goal.postedBy === currentUserId ||
          (goal.user && goal.user._id === currentUserId)
        );
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        this.myRecentGoals = myGoals.filter(goal => 
          new Date(goal.createdAt) >= sevenDaysAgo
        ).length;
      }
    },
    
    selectPeriod(period) {
      this.selectedPeriod = period;
      this.updateCharts();
    },
    
    initCharts() {
      this.$nextTick(() => {
        if (this.$refs.performanceChart) {
          this.createPerformanceChart();
        }
        if (this.$refs.distributionChart) {
          this.createDistributionChart();
        }
      });
    },
    
    createPerformanceChart() {
      const ctx = this.$refs.performanceChart.getContext('2d');
      
      if (this.performanceChart) {
        this.performanceChart.destroy();
      }
      
      const data = this.getChartData();
      
      this.performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [{
            label: 'Performance (%)',
            data: data.values,
            borderColor: '#db2323',
            backgroundColor: 'rgba(219, 35, 35, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#db2323',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
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
    
    createDistributionChart() {
      const ctx = this.$refs.distributionChart.getContext('2d');
      
      if (this.distributionChart) {
        this.distributionChart.destroy();
      }
      
      const distribution = this.getPerformanceDistribution();
      
      this.distributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Excellent (80-100%)', 'Bien (60-79%)', 'Moyen (40-59%)', 'À améliorer (0-39%)'],
          datasets: [{
            data: distribution,
            backgroundColor: [
              '#28a745',
              '#17a2b8',
              '#ffc107',
              '#dc3545'
            ],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 20,
                usePointStyle: true
              }
            }
          }
        }
      });
    },
    
    getChartData() {
      const data = this.currentStatsData;
      
      if (!data || data.length === 0) {
        return { labels: [], values: [] };
      }
      
      switch (this.selectedPeriod) {
        case 'day':
          return {
            labels: data.map(stat => stat.day || stat.dayOfWeek || 'N/A'),
            values: data.map(stat => stat.averagePercentage || 0)
          };
        case 'week':
          return {
            labels: data.map(stat => `Semaine ${stat.weekNumber || 'N/A'}`),
            values: data.map(stat => stat.averagePercentage || 0)
          };
        case 'month':
          return {
            labels: data.map(stat => stat.monthName || `Mois ${stat.month}` || 'N/A'),
            values: data.map(stat => stat.averagePercentage || 0)
          };
        case 'year':
          return {
            labels: data.map(stat => `Année ${stat.year || 'N/A'}`),
            values: data.map(stat => stat.averagePercentage || 0)
          };
        default:
          return { labels: [], values: [] };
      }
    },
    
    getPerformanceDistribution() {
      if (!this.reportsStats || !this.reportsStats.reports) {
        return [0, 0, 0, 0];
      }
      
      const reports = this.reportsStats.reports;
      const distribution = [0, 0, 0, 0];
      
      reports.forEach(report => {
        const perf = report.pourcentage;
        if (perf >= 80) distribution[0]++;
        else if (perf >= 60) distribution[1]++;
        else if (perf >= 40) distribution[2]++;
        else distribution[3]++;
      });
      
      return distribution;
    },
    
    updateCharts() {
      if (this.performanceChart) {
        const data = this.getChartData();
        this.performanceChart.data.labels = data.labels;
        this.performanceChart.data.datasets[0].data = data.values;
        this.performanceChart.update();
      }
    },
    
    getAgeGroups(children) {
      if (!children || children.length === 0) return [];
      
      const ageGroups = {
        '0-5 ans': 0,
        '6-10 ans': 0,
        '11-15 ans': 0,
        '16+ ans': 0
      };
      
      children.forEach(child => {
        const age = child.age || 0;
        if (age <= 5) ageGroups['0-5 ans']++;
        else if (age <= 10) ageGroups['6-10 ans']++;
        else if (age <= 15) ageGroups['11-15 ans']++;
        else ageGroups['16+ ans']++;
      });
      
      return Object.entries(ageGroups).map(([range, count]) => ({ range, count }));
    },
    
    getLocationGroups(children) {
      if (!children || children.length === 0) return [];
      
      const locations = {};
      children.forEach(child => {
        const location = child.location || child.address || 'Non spécifié';
        locations[location] = (locations[location] || 0) + 1;
      });
      
      return Object.entries(locations)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    
    getStatusClass(percentage) {
      if (percentage >= 80) return 'excellent';
      if (percentage >= 60) return 'good';
      if (percentage >= 40) return 'average';
      return 'poor';
    },
    
    getStatusText(percentage) {
      if (percentage >= 80) return 'Excellent';
      if (percentage >= 60) return 'Bien';
      if (percentage >= 40) return 'Moyen';
      return 'À améliorer';
    }
  },
  
  beforeDestroy() {
    if (this.performanceChart) {
      this.performanceChart.destroy();
    }
    if (this.distributionChart) {
      this.distributionChart.destroy();
    }
  }
};
</script>

<style lang="scss" scoped>
.statistics-page {
  min-height: 100vh;
  padding: 0;
  background: #f8f9fa;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

// Loading and Error States
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #db2323;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  
  i {
    font-size: 2rem;
    color: #dc3545;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    margin-bottom: 1rem;
  }
}

.retry-button {
  background: #db2323;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #b31b1b;
  }
}

.statistics-header {
  text-align: center;
  margin-bottom: 1.5rem;
  width: 100%;
  padding: 1rem;

  h1 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 1rem;
    font-weight: 700;
  }
}

.date-filter {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  width: 100%;
  box-sizing: border-box;
}

.period-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.9rem;

  &:hover {
    background: #f8f9fa;
  }

  &.active {
    background: #db2323;
    color: white;
    border-color: #db2323;
  }
}

// Sections
.section {
  margin-bottom: 2rem;
  padding: 0 1rem;

  h2 {
    font-size: 1.4rem;
    color: #333;
    margin-bottom: 1rem;
    font-weight: 600;
    text-align: center;
  }
}

.statistics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);
  }
}

.stat-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  background: rgba(219, 35, 35, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #db2323;
  font-size: 1.2rem;
}

.stat-content {
  flex: 1;
  min-width: 0;

  h3 {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0.3rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-change {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;

  &.positive {
    color: #28a745;
  }

  &.negative {
    color: #dc3545;
  }
}

// Admin Dashboard
.admin-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.dashboard-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.1rem;
    font-weight: 600;
  }
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.activity-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
}

.activity-label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.activity-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #db2323;
}

.top-performers {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.performer-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
}

.performer-rank {
  width: 30px;
  height: 30px;
  background: #db2323;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.performer-info {
  flex: 1;
}

.performer-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.2rem;
}

.performer-stats {
  font-size: 0.8rem;
  color: #666;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

.chart-card {
  background: white;
  border-radius: 1rem;
  padding: 1.2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;

  h3 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.1rem;
  }
}

.chart-wrapper {
  height: 250px;
  width: 100%;
  position: relative;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.goal-card {
  background: linear-gradient(135deg, rgba(219, 35, 35, 0.1), rgba(219, 35, 35, 0.05));
  border: 1px solid rgba(219, 35, 35, 0.2);
  border-radius: 0.8rem;
  padding: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(219, 35, 35, 0.15);
  }
}

.goal-day {
  font-weight: 600;
  color: #db2323;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.goal-content {
  color: #333;
  font-size: 0.9rem;
  line-height: 1.4;
}

// Users Table
.users-table {
  background: white;
  border-radius: 1rem;
  padding: 1.2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto;

  .table-header {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr;
    padding: 0.8rem;
    background: #f8f9fa;
    border-radius: 0.5rem;
    font-weight: 500;
    color: #666;
    font-size: 0.9rem;
    gap: 1rem;
  }

  .table-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr;
    padding: 0.8rem;
    border-bottom: 1px solid #eee;
    align-items: center;
    font-size: 0.9rem;
    gap: 1rem;

    &:last-child {
      border-bottom: none;
    }
  }
}

.role-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;

  &.admin {
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
  }

  &.user {
    background: rgba(23, 162, 184, 0.1);
    color: #17a2b8;
  }

  &.moderator {
    background: rgba(255, 193, 7, 0.1);
    color: #ffc107;
  }
}

// Children Stats
.children-stats {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.children-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.summary-card {
  h4 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1rem;
    font-weight: 600;
  }
}

.age-group, .location-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  span:first-child {
    color: #666;
  }

  span:last-child {
    font-weight: 600;
    color: #db2323;
  }
}

.activities-table {
  background: white;
  border-radius: 1rem;
  padding: 1.2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;

  .table-header {
    display: grid;
    grid-template-columns: minmax(100px, 1fr) minmax(150px, 1.5fr) minmax(100px, 1fr) minmax(120px, 1fr);
    padding: 0.8rem;
    background: #f8f9fa;
    border-radius: 0.5rem;
    font-weight: 500;
    color: #666;
    font-size: 0.9rem;
  }

  .table-row {
    display: grid;
    grid-template-columns: minmax(100px, 1fr) minmax(150px, 1.5fr) minmax(100px, 1fr) minmax(120px, 1fr);
    padding: 0.8rem;
    border-bottom: 1px solid #eee;
    align-items: center;
    font-size: 0.9rem;

    &:last-child {
      border-bottom: none;
    }
  }
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #666;
  
  i {
    font-size: 2rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
}

.status {
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  text-align: center;

  &.excellent {
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
  }

  &.good {
    background: rgba(23, 162, 184, 0.1);
    color: #17a2b8;
  }

  &.average {
    background: rgba(255, 193, 7, 0.1);
    color: #ffc107;
  }

  &.poor {
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
  }
}

/* Dark theme */
:deep(.dark) {
  .statistics-page {
    background: #1a1a1a;
  }

  .statistics-header h1,
  .section h2 {
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
  .dashboard-card,
  .users-table,
  .children-stats,
  .activities-table,
  .error-message {
    background: #2d2d2d;
  }

  .stat-content h3,
  .chart-card h3,
  .dashboard-card h3,
  .summary-card h4 {
    color: #999;
  }

  .stat-value,
  .performer-name {
    color: #fff;
  }

  .activity-item,
  .performer-item {
    background: #1a1a1a;
  }

  .activity-label,
  .performer-stats {
    color: #999;
  }

  .goal-card {
    background: linear-gradient(135deg, rgba(219, 35, 35, 0.2), rgba(219, 35, 35, 0.1));
    border-color: rgba(219, 35, 35, 0.3);
  }

  .goal-content {
    color: #fff;
  }

  .users-table,
  .activities-table {
    .table-header {
      background: #1a1a1a;
      color: #999;
    }

    .table-row {
      border-bottom-color: #404040;
      color: #fff;
    }
  }

  .age-group, .location-group {
    border-bottom-color: #404040;

    span:first-child {
      color: #999;
    }

    span:last-child {
      color: #fff;
    }
  }

  .no-data {
    color: #999;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .statistics-header {
    padding: 0.8rem;

    h1 {
      font-size: 1.6rem;
    }
  }

  .section {
    padding: 0 0.8rem;

    h2 {
      font-size: 1.2rem;
    }
  }

  .charts-container,
  .admin-dashboard {
    grid-template-columns: 1fr;
  }

  .statistics-cards {
    grid-template-columns: 1fr;
  }

  .goals-grid {
    grid-template-columns: 1fr;
  }

  .activity-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .children-summary {
    grid-template-columns: 1fr;
  }

  .users-table {
    .table-header,
    .table-row {
      grid-template-columns: 1fr;
      gap: 0.5rem;
      text-align: left;
    }
  }

  .activities-table {
    .table-header,
    .table-row {
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }
  }
}

@media (max-width: 480px) {
  .statistics-header {
    padding: 0.5rem;

    h1 {
      font-size: 1.4rem;
    }
  }

  .section {
    padding: 0 0.5rem;

    h2 {
      font-size: 1.1rem;
    }
  }

  .stat-card,
  .dashboard-card,
  .chart-card {
    padding: 1rem;
  }

  .chart-wrapper {
    height: 200px;
  }

  .activity-grid {
    grid-template-columns: 1fr;
  }

  .performer-item {
    padding: 0.6rem;
  }

  .goal-card {
    padding: 0.8rem;
  }

  .users-table,
  .activities-table {
    padding: 1rem;

    .table-header,
    .table-row {
      padding: 0.6rem;
      font-size: 0.8rem;
    }
  }
}
</style>
  
  
  
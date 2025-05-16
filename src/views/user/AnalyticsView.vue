<!-- AnalyticsView.vue -->
<template>
  <div class="analytics-container">
    <h1>{{ getTranslatedTitle('analytics') }}</h1>
    <div class="analytics-grid">
      <!-- Statistiques des enfants -->
      <div class="analytics-card">
        <div class="card-header">
          <h3>{{ getTranslatedTitle('childrenStats') }}</h3>
        </div>
        <div class="card-content">
          <div class="stat-item">
            <span class="stat-label">{{ getTranslatedTitle('totalChildren') }}</span>
            <span class="stat-value">0</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">{{ getTranslatedTitle('activeChildren') }}</span>
            <span class="stat-value">0</span>
          </div>
        </div>
      </div>

      <!-- Activités récentes -->
      <div class="analytics-card">
        <div class="card-header">
          <h3>{{ getTranslatedTitle('recentActivities') }}</h3>
        </div>
        <div class="card-content">
          <p class="no-data">{{ getTranslatedTitle('noActivities') }}</p>
        </div>
      </div>

      <!-- Progression -->
      <div class="analytics-card">
        <div class="card-header">
          <h3>{{ getTranslatedTitle('progress') }}</h3>
        </div>
        <div class="card-content">
          <p class="no-data">{{ getTranslatedTitle('noProgress') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AnalyticsView',
  computed: {
    ...mapState(['language']),
    translatedTitles() {
      return {
        en: {
          analytics: 'Analytics',
          childrenStats: 'Children Statistics',
          totalChildren: 'Total Children',
          activeChildren: 'Active Children',
          recentActivities: 'Recent Activities',
          progress: 'Progress',
          noActivities: 'No recent activities',
          noProgress: 'No progress data available'
        },
        fr: {
          analytics: 'Analytiques',
          childrenStats: 'Statistiques des Enfants',
          totalChildren: 'Total des Enfants',
          activeChildren: 'Enfants Actifs',
          recentActivities: 'Activités Récentes',
          progress: 'Progression',
          noActivities: 'Aucune activité récente',
          noProgress: 'Aucune donnée de progression disponible'
        }
      };
    }
  },
  methods: {
    getTranslatedTitle(key) {
      return this.translatedTitles[this.language]?.[key] || key;
    }
  }
};
</script>

<style lang="scss" scoped>
.analytics-container {
  padding: 20px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.analytics-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
  }
}

.card-content {
  padding: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: #db2323;
}

.no-data {
  color: #666;
  text-align: center;
  font-style: italic;
}

/* Dark theme */
:deep(.dark) {
  .analytics-card {
    background: #2d2d2d;
  }

  .card-header {
    background: #1a1a1a;
    border-bottom-color: #333;

    h3 {
      color: #fff;
    }
  }

  .stat-label {
    color: #999;
  }

  .no-data {
    color: #999;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-container {
    padding: 15px;
  }

  .analytics-grid {
    grid-template-columns: 1fr;
  }
}
</style> 
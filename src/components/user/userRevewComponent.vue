<template>
  <div class="report-component" :class="theme">
    <div class="report-container">
      <!-- En-tête -->
      <div class="report-header">
        <div class="user-info">
          <div class="role-badge">
            👤 {{ role || 'Utilisateur' }}
          </div>
          <div class="report-date">
            📅 {{ formatDate(createdAt) }}
          </div>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="report-content">
        <!-- Section Objectif -->
        <div class="section-card objective-card">
          <div class="section-header">
            <h3>🎯 Objectif de la journée</h3>
            <div class="status-badge">
              {{ dailyGoal ? '✅' : '❓' }}
            </div>
          </div>
          <div class="section-content">
            <div class="info-grid">
              <div class="info-item">
                <span class="label">🕐 Heure d'arrivée</span>
                <span class="value">{{ arrivalTime || 'Non définie' }}</span>
              </div>
              <div class="info-item">
                <span class="label">📅 Date</span>
                <span class="value">{{ formatDate(date) || 'Non définie' }}</span>
              </div>
            </div>
            <div class="objective-text">
              <span class="label">💭 Objectif</span>
              <p class="value">{{ dailyGoal || 'Aucun objectif défini' }}</p>
            </div>
          </div>
        </div>

        <!-- Section Rapport -->
        <div class="section-card report-card">
          <div class="section-header">
            <h3>📊 Rapport d'évaluation</h3>
            <div class="completion-badge" :class="getCompletionClass()">
              {{ getCompletionText() }}
            </div>
          </div>
          <div class="section-content">
            <div class="info-grid">
              <div class="info-item">
                <span class="label">📊 Pourcentage réalisé</span>
                <div class="percentage-display">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: pourcentage + '%' }"></div>
                  </div>
                  <span class="percentage-text">{{ pourcentage || 0 }}%</span>
                </div>
              </div>
              <div class="info-item">
                <span class="label">✅ Objectif atteint</span>
                <span class="value decision" :class="choix">
                  {{ choix === 'oui' ? '✅ Oui' : choix === 'non' ? '❌ Non' : 'Non défini' }}
                </span>
              </div>
            </div>
            <div class="justification-text">
              <span class="label">💬 Commentaire</span>
              <p class="value">{{ justification || 'Aucun commentaire fourni' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';
import { mapState } from 'vuex';

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
      pourcentage: 0,
    };
  },
  computed: {
    ...mapState(['theme'])
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

          this.role = outObjective.role;
          this.createdAt = outObjective.createdAt;
          this.dailyGoal = enterObjective.dailyGoal;
          this.choix = outObjective.choix;
          this.justification = outObjective.justification;
          this.date = enterObjective.date;
          this.arrivalTime = enterObjective.arrivalTime;
          this.pourcentage = outObjective.pourcentage || 0;
        })
        .catch(error => {
          console.error('Error fetching report data from backend:', error);
        });
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    getCompletionClass() {
      if (this.pourcentage >= 80) return 'excellent';
      if (this.pourcentage >= 60) return 'good';
      if (this.pourcentage >= 40) return 'average';
      return 'poor';
    },
    
    getCompletionText() {
      if (this.pourcentage >= 80) return '🌟 Excellent';
      if (this.pourcentage >= 60) return '👍 Bien';
      if (this.pourcentage >= 40) return '⚡ Moyen';
      return '📈 À améliorer';
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.report-component {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 0.8rem;
}

.report-container {
  max-width: min(95vw, 800px);
  margin: 0 auto;
}

.report-header {
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 0.8rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 12px rgba(219, 35, 35, 0.08);
  border: 1px solid #e9ecef;
}

.role-badge {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.report-date {
  color: #666;
  font-size: 0.8rem;
  font-weight: 500;
}

.report-content {
  display: grid;
  gap: 1rem;
}

.section-card {
  background: white;
  border-radius: 0.8rem;
  padding: 1rem;
  box-shadow: 0 2px 12px rgba(219, 35, 35, 0.08);
  border: 1px solid #e9ecef;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid #e9ecef;

  h3 {
    margin: 0;
    font-size: 0.95rem;
    color: #333;
    font-weight: 600;
  }
}

.status-badge {
  font-size: 1.1rem;
  opacity: 0.8;
}

.completion-badge {
  padding: 0.25rem 0.7rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 600;

  &.excellent {
    background: linear-gradient(135deg, #28a745, #20c997);
    color: white;
  }

  &.good {
    background: linear-gradient(135deg, #17a2b8, #20c997);
    color: white;
  }

  &.average {
    background: linear-gradient(135deg, #ffc107, #fd7e14);
    color: white;
  }

  &.poor {
    background: linear-gradient(135deg, #dc3545, #e83e8c);
    color: white;
  }
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.8rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 600;
}

.value {
  font-size: 0.85rem;
  color: #333;
  font-weight: 500;

  &.decision {
    &.oui {
      color: #28a745;
    }

    &.non {
      color: #dc3545;
    }
  }
}

.objective-text,
.justification-text {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  p {
    margin: 0;
    padding: 0.6rem;
    background: #f8f9fa;
    border-radius: 0.6rem;
    border: 1px solid #e9ecef;
    line-height: 1.4;
    font-size: 0.85rem;
  }
}

.percentage-display {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.progress-bar {
  flex: 1;
  height: 0.5rem;
  background: #e9ecef;
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #db2323, #b31b1b);
  transition: width 0.3s ease;
}

.percentage-text {
  font-weight: 600;
  color: #db2323;
  font-size: 0.85rem;
  min-width: 35px;
}

/* Dark theme */
:deep(.dark) {
  .report-component {
    background: #1a1a1a;
  }

  .user-info,
  .section-card {
    background: #2d2d2d;
    border-color: #404040;
  }

  .section-header {
    border-color: #404040;

    h3 {
      color: #fff;
    }
  }

  .report-date {
    color: #888;
  }

  .label {
    color: #888;
  }

  .value {
    color: #fff;
  }

  .objective-text p,
  .justification-text p {
    background: #1a1a1a;
    border-color: #404040;
    color: #ccc;
  }

  .progress-bar {
    background: #404040;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .report-component {
    padding: 0.4rem;
  }

  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
    padding: 0.6rem;
  }

  .section-card {
    padding: 0.8rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
    margin-bottom: 0.6rem;
    padding-bottom: 0.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }

  .percentage-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }

  .progress-bar {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .report-container {
    padding: 0;
  }

  .section-card {
    padding: 0.6rem;
  }

  .user-info {
    padding: 0.6rem;
  }

  .role-badge {
    padding: 0.25rem 0.6rem;
    font-size: 0.75rem;
  }

  .section-header h3 {
    font-size: 0.85rem;
  }

  .completion-badge {
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
  }

  .objective-text p,
  .justification-text p {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
}
</style>
  
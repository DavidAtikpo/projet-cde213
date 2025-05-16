<!-- UserDashboard.vue -->
<template>
  <div class="dashboard-wrapper" :class="theme">
    <div class="dashboard-content">
      <div class="dashboard-header">
        <h1>{{ getTranslatedTitle('dashboard') }}</h1>
        <div class="quick-actions">
          <button class="action-button" @click="showNotification">
            <i class="fas fa-bell"></i>
            <span>{{ getTranslatedTitle('notifications') }}</span>
          </button>
          <button class="action-button" @click="showSearch">
            <i class="fas fa-search"></i>
            <span>{{ getTranslatedTitle('search') }}</span>
          </button>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Gestion des Enfants -->
        <div class="dashboard-card" @click="navigateTo('analytics')">
          <div class="card-icon">
            <i class="fas fa-child"></i>
          </div>
          <div class="card-content">
            <h3>{{ getTranslatedTitle('childrenManagement') }}</h3>
            <p>{{ getTranslatedTitle('childrenManagementDesc') }}</p>
          </div>
        </div>

        <!-- Planification & Suivi -->
        <div class="dashboard-card" @click="navigateTo('review')">
          <div class="card-icon">
            <i class="fas fa-tasks"></i>
          </div>
          <div class="card-content">
            <h3>{{ getTranslatedTitle('planningAndTracking') }}</h3>
            <p>{{ getTranslatedTitle('planningAndTrackingDesc') }}</p>
          </div>
        </div>

        <!-- Activités & Événements -->
        <div class="dashboard-card" @click="navigateTo('feedback')">
          <div class="card-icon">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div class="card-content">
            <h3>{{ getTranslatedTitle('activitiesAndEvents') }}</h3>
            <p>{{ getTranslatedTitle('activitiesAndEventsDesc') }}</p>
          </div>
        </div>

        <!-- Profil -->
        <div class="dashboard-card" @click="navigateTo('profile')">
          <div class="card-icon">
            <i class="fas fa-user"></i>
          </div>
          <div class="card-content">
            <h3>{{ getTranslatedTitle('profile') }}</h3>
            <p>{{ getTranslatedTitle('profileDesc') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'UserDashboard',
  computed: {
    ...mapState(['theme', 'language']),
    translatedTitles() {
      return {
        en: {
          dashboard: 'Dashboard',
          notifications: 'Notifications',
          search: 'Search',
          childrenManagement: 'Children Management',
          childrenManagementDesc: 'Individual data and global monitoring of children',
          planningAndTracking: 'Planning & Tracking',
          planningAndTrackingDesc: 'Daily and weekly objectives and reports',
          activitiesAndEvents: 'Activities & Events',
          activitiesAndEventsDesc: 'Activity programming and monitoring',
          profile: 'Profile',
          profileDesc: 'Manage your account settings and preferences'
        },
        fr: {
          dashboard: 'Tableau de Bord',
          notifications: 'Notifications',
          search: 'Recherche',
          childrenManagement: 'Gestion des Enfants',
          childrenManagementDesc: 'Données individuelles et suivi global des enfants',
          planningAndTracking: 'Planification & Suivi',
          planningAndTrackingDesc: 'Objectifs quotidiens et rapports',
          activitiesAndEvents: 'Activités & Événements',
          activitiesAndEventsDesc: 'Programmation et suivi des activités',
          profile: 'Profil',
          profileDesc: 'Gérez vos paramètres de compte et préférences'
        }
      };
    }
  },
  methods: {
    getTranslatedTitle(key) {
      return this.translatedTitles[this.language]?.[key] || key;
    },
    navigateTo(route) {
      const userId = localStorage.getItem('userId');
      this.$router.push(`/user/${userId}/${route}`);
    },
    showNotification() {
      // Implémenter l'affichage des notifications
    },
    showSearch() {
      // Implémenter la recherche
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard-wrapper {
  min-height: 100vh;
  transition: all 0.3s ease;
}

.dashboard-content {
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.quick-actions {
  display: flex;
  gap: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  background: #f8f9fa;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  i {
    font-size: 1rem;
  }

  &:hover {
    background: #e9ecef;
    color: #db2323;
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.dashboard-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: 1.5rem;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 1rem;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #db2323;
  flex-shrink: 0;
}

.card-content {
  flex: 1;

  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
    line-height: 1.4;
  }
}

/* Dark theme */
:deep(.dark) {
  .dashboard-header {
    h1 {
      color: #fff;
    }
  }

  .action-button {
    background: #2d2d2d;
    color: #999;

    &:hover {
      background: #1a1a1a;
      color: #db2323;
    }
  }

  .dashboard-card {
    background: #2d2d2d;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

    &:hover {
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
  }

  .card-icon {
    background: #1a1a1a;
  }

  .card-content {
    h3 {
      color: #fff;
    }

    p {
      color: #999;
    }
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .quick-actions {
    width: 100%;
    justify-content: space-between;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-card {
    padding: 1rem;
  }
}
</style>

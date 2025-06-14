<template>
  <div class="monitor-dashboard">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'collapsed': isCollapsed, 'mobile-open': isMobileOpen }">
      <div class="sidebar-header">
        <div class="logo-container">
          <img :src="logoUrl" alt="Logo" class="logo" @error="handleLogoError" v-if="!logoError">
          <div v-else class="logo-placeholder">
            <i class="fas fa-graduation-cap"></i>
          </div>
        </div>
        <h1 v-show="!isCollapsed">CDE213</h1>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-section">
          <h2 v-show="!isCollapsed">{{ getTranslatedTitle('mainMenu') }}</h2>
          <router-link to="/monitor/dashboard" class="nav-item" active-class="active">
            <i class="fas fa-home"></i>
            <span v-show="!isCollapsed">{{ getTranslatedTitle('dashboard') }}</span>
          </router-link>
          <router-link to="/monitor/reports" class="nav-item" active-class="active">
            <i class="fas fa-clipboard-list"></i>
            <span v-show="!isCollapsed">{{ getTranslatedTitle('reports') }}</span>
          </router-link>
          <router-link to="/monitor/profile" class="nav-item" active-class="active">
            <i class="fas fa-user"></i>
            <span v-show="!isCollapsed">{{ getTranslatedTitle('profile') }}</span>
          </router-link>
          <router-link to="/monitor/settings" class="nav-item" active-class="active">
            <i class="fas fa-cog"></i>
            <span v-show="!isCollapsed">{{ getTranslatedTitle('settings') }}</span>
          </router-link>
        </div>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="main-content" :class="{ 'sidebar-collapsed': isCollapsed }">
      <!-- Top Navbar -->
      <div class="navbar">
        <div class="navbar-left">
          <button class="menu-toggle" @click="toggleSidebar">
            <i class="fas" :class="isCollapsed ? 'fa-bars' : 'fa-times'"></i>
          </button>
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              :placeholder="getTranslatedTitle('searchPlaceholder')"
              v-model="searchQuery"
              @input="handleSearch"
            >
          </div>
        </div>

        <div class="navbar-right">
          <div class="notifications">
            <button class="icon-button" @click="toggleNotifications">
              <i class="fas fa-bell"></i>
              <span class="notification-badge" v-if="unreadNotifications">{{ unreadNotifications }}</span>
            </button>
            <div class="notifications-dropdown" v-if="showNotifications">
              <div class="notifications-header">
                <h3>{{ getTranslatedTitle('notifications') }}</h3>
                <button @click="markAllAsRead">{{ getTranslatedTitle('markAllAsRead') }}</button>
              </div>
              <div class="notifications-list">
                <div v-for="notification in notifications" 
                     :key="notification.id" 
                     class="notification-item"
                     :class="{ unread: !notification.read }">
                  <i :class="notification.icon"></i>
                  <div class="notification-content">
                    <p>{{ notification.message }}</p>
                    <span class="notification-time">{{ notification.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="user-menu">
            <button class="user-button" @click="toggleUserMenu">
              <div class="user-avatar">
                {{ getUserInitial() }}
              </div>
              <span class="user-name">{{ userName }}</span>
              <i class="fas fa-chevron-down"></i>
            </button>
            <div class="user-dropdown" v-if="showUserMenu">
              <div class="user-info">
                <div class="user-avatar-large">
                  {{ getUserInitial() }}
                </div>
                <div class="user-details">
                  <h4>{{ userName }}</h4>
                  <p>{{ userRole }}</p>
                </div>
              </div>
              <div class="dropdown-menu">
                <button @click="navigateTo('profile')">
                  <i class="fas fa-user"></i>
                  {{ getTranslatedTitle('profile') }}
                </button>
                <button @click="navigateTo('settings')">
                  <i class="fas fa-cog"></i>
                  {{ getTranslatedTitle('settings') }}
                </button>
                <button @click="logout">
                  <i class="fas fa-sign-out-alt"></i>
                  {{ getTranslatedTitle('logout') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div class="dashboard-content">
        <!-- Welcome Header -->
        <div class="welcome-header">
          <div class="welcome-content">
            <div class="welcome-text">
              <h1>{{ getTranslatedTitle('welcomeBack') }}, {{ userName }}</h1>
              <p class="role-badge">{{ userRole }}</p>
            </div>
            <div class="quick-stats">
              <div class="stat-card">
                <div class="stat-header">
                  <i class="fas fa-users"></i>
                </div>
                <div class="stat-body">
                  <div class="stat-value">{{ classData?.childIds?.length || 0 }}</div>
                  <div class="stat-label">{{ getTranslatedTitle('children') }}</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-header">
                  <i class="fas fa-clipboard-list"></i>
                </div>
                <div class="stat-body">
                  <div class="stat-value">{{ reports.length }}</div>
                  <div class="stat-label">{{ getTranslatedTitle('reports') }}</div>
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-header">
                  <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stat-body">
                  <div class="stat-value">{{ todayActivities }}</div>
                  <div class="stat-label">{{ getTranslatedTitle('todayActivities') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Dashboard Grid -->
        <div class="dashboard-grid">
          <!-- Class Section -->
          <div class="dashboard-card main-card">
            <div class="card-header">
              <h2>
                <i class="fas fa-chalkboard-teacher"></i>
                {{ getTranslatedTitle('myClass') }}
              </h2>
            </div>
            <div class="card-content">
              <MonitorClassViewComponent />
            </div>
          </div>

          <!-- Recent Reports Section -->
          <div class="dashboard-card">
            <div class="card-header">
              <h2>
                <i class="fas fa-history"></i>
                {{ getTranslatedTitle('recentReports') }}
              </h2>
              <router-link to="/monitor/reports" class="view-all-btn">
                {{ getTranslatedTitle('viewAll') }}
                <i class="fas fa-arrow-right"></i>
              </router-link>
            </div>
            <div class="card-content">
              <div v-if="loading" class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <span>{{ getTranslatedTitle('loading') }}</span>
              </div>
              <div v-else-if="error" class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <span>{{ error }}</span>
              </div>
              <div v-else-if="reports.length === 0" class="empty-state">
                <i class="fas fa-clipboard"></i>
                <span>{{ getTranslatedTitle('noRecentReports') }}</span>
              </div>
              <div v-else class="reports-list">
                <div v-for="report in reports.slice(0, 5)" :key="report._id" class="report-item">
                  <div class="report-icon">
                    <i class="fas fa-file-alt"></i>
                  </div>
                  <div class="report-details">
                    <h4>{{ report.title }}</h4>
                    <p class="report-theme">{{ report.subTheme }}</p>
                    <div class="report-meta">
                      <span class="report-date">
                        <i class="fas fa-calendar"></i>
                        {{ formatDate(report.date) }}
                      </span>
                      <span class="report-attendance">
                        <i class="fas fa-user-check"></i>
                        {{ Object.values(report.presences).filter(p => p).length }} présents
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="dashboard-card">
            <div class="card-header">
              <h2>
                <i class="fas fa-bolt"></i>
                {{ getTranslatedTitle('quickActions') }}
              </h2>
            </div>
            <div class="card-content">
              <div class="quick-actions">
                <router-link to="/monitor/reports/new" class="action-btn primary">
                  <i class="fas fa-plus"></i>
                  <span>{{ getTranslatedTitle('newReport') }}</span>
                </router-link>
                <router-link to="/monitor/attendance" class="action-btn secondary">
                  <i class="fas fa-check-circle"></i>
                  <span>{{ getTranslatedTitle('takeAttendance') }}</span>
                </router-link>
                <router-link to="/monitor/activities" class="action-btn tertiary">
                  <i class="fas fa-calendar-plus"></i>
                  <span>{{ getTranslatedTitle('planActivity') }}</span>
                </router-link>
              </div>
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
import MonitorClassViewComponent from '@/components/monitor/MonitorClassViewComponent.vue';

export default {
  name: 'MonitorDashboard',
  components: {
    MonitorClassViewComponent
  },
  data() {
    return {
      loading: false,
      error: null,
      reports: [],
      monitor: {},
      classData: null,
      isCollapsed: false,
      showNotifications: false,
      showUserMenu: false,
      unreadNotifications: 3,
      isMobileOpen: false,
      searchQuery: '',
      userName: '',
      userRole: 'Moniteur',
      todayActivities: 2,
      logoUrl: '/logo.png',
      logoError: false,
      notifications: [
        {
          id: 1,
          icon: 'fas fa-child',
          message: 'Nouvelle inscription dans votre classe',
          time: 'Il y a 5 minutes',
          read: false
        },
        {
          id: 2,
          icon: 'fas fa-calendar-check',
          message: 'Activité planifiée pour demain',
          time: 'Il y a 1 heure',
          read: false
        },
        {
          id: 3,
          icon: 'fas fa-clipboard-list',
          message: 'Rapport hebdomadaire à compléter',
          time: 'Il y a 2 heures',
          read: false
        }
      ]
    };
  },
  methods: {
    getTranslatedTitle(key) {
      const translations = {
        mainMenu: 'Menu Principal',
        dashboard: 'Tableau de bord',
        reports: 'Mes Rapports',
        profile: 'Mon Profil',
        settings: 'Paramètres',
        searchPlaceholder: 'Rechercher...',
        notifications: 'Notifications',
        markAllAsRead: 'Tout marquer comme lu',
        welcomeBack: 'Bienvenue',
        children: 'Enfants',
        todayActivities: 'Activités Aujourd\'hui',
        myClass: 'Ma Classe',
        recentReports: 'Rapports Récents',
        viewAll: 'Voir tout',
        loading: 'Chargement...',
        noRecentReports: 'Aucun rapport récent',
        quickActions: 'Actions Rapides',
        newReport: 'Nouveau Rapport',
        takeAttendance: 'Prendre Présences',
        planActivity: 'Planifier Activité',
        logout: 'Déconnexion'
      };
      return translations[key] || key;
    },
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
      this.showUserMenu = false;
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
      this.showNotifications = false;
    },
    markAllAsRead() {
      this.notifications.forEach(notification => notification.read = true);
      this.unreadNotifications = 0;
    },
    navigateTo(route) {
      const monitorId = localStorage.getItem('userId') || this.$route.params.id;
      this.$router.push(`/monitor/${monitorId}/${route}`);
      this.showUserMenu = false;
    },
    handleSearch() {
      console.log('Recherche :', this.searchQuery);
    },
    handleLogoError() {
      this.logoError = true;
      this.logoUrl = 'https://via.placeholder.com/32x32?text=CDE';
    },
    getUserInitial() {
      if (this.userName && this.userName.length > 0) {
        return this.userName.charAt(0).toUpperCase();
      }
      return 'M';
    },
    loadUserData() {
      const storedUserName = localStorage.getItem('user');
      if (storedUserName) {
        this.userName = storedUserName;
      } else {
        this.userName = 'Moniteur';
      }
    },
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Non authentifié');
        }
        const headers = { Authorization: `Bearer ${token}` };

        // Récupérer les informations du moniteur
        const monitorRes = await axios.get(`${API_BASE_URL}/monitor/profile`, { headers });
        this.monitor = monitorRes.data;

        // Récupérer la classe du moniteur
        const classRes = await axios.get(`${API_BASE_URL}/class/monitor`, { headers });
        this.classData = classRes.data;

        // Récupérer les rapports récents
        const reportsRes = await axios.get(`${API_BASE_URL}/monitor-report/recent`, { headers });
        this.reports = reportsRes.data;
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        this.error = err.response?.data?.error || err.message || 'Une erreur est survenue';
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    async logout() {
      try {
        localStorage.removeItem('token');
        this.$router.push('/login');
      } catch (err) {
        console.error('Erreur lors de la déconnexion:', err);
      }
    }
  },
  mounted() {
    this.loadUserData();
    this.fetchData();
  }
};
</script>

<style lang="scss" scoped>
.monitor-dashboard {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
  transition: all 0.3s ease;
}

.main-content {
  flex: 1;
  margin-left: 240px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.sidebar-collapsed {
    margin-left: 65px;

    .navbar {
      left: 65px;
    }
  }
}

.sidebar {
  width: 240px;
  background: white;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 1000;

  &.collapsed {
    width: 65px;
  }

  .sidebar-header {
    padding: 0.8rem;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    display: flex;
    align-items: center;
    gap: 0.6rem;

    .logo {
      width: 28px;
      height: 28px;
      border-radius: 4px;
    }

    .logo-placeholder {
      width: 28px;
      height: 28px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.9rem;
    }

    h1 {
      font-size: 1rem;
      margin: 0;
      white-space: nowrap;
      font-weight: 600;
    }
  }

  .sidebar-nav {
    flex: 1;
    padding: 0.5rem 0;
    overflow-y: auto;

    .nav-section {
      padding: 0.8rem 0;

      h2 {
        color: #666;
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0 1rem;
        margin-bottom: 0.3rem;
        font-weight: 600;
      }
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.55rem 1rem;
      color: #333;
      text-decoration: none;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
      cursor: pointer;
      font-size: 0.85rem;

      &:hover {
        background: rgba(59, 130, 246, 0.05);
        color: #3b82f6;
      }

      &.active {
        background: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
        border-left-color: #3b82f6;
      }

      i {
        font-size: 0.9rem;
        margin-right: 0.6rem;
        width: 18px;
        text-align: center;
      }

      span {
        white-space: nowrap;
      }
    }
  }
}

.navbar {
  position: fixed;
  top: 0;
  left: 240px;
  right: 0;
  height: 50px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.2rem;
  z-index: 999;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 0.8rem;

    .menu-toggle {
      background: none;
      border: none;
      color: #666;
      font-size: 1rem;
      cursor: pointer;
      padding: 0.4rem;
      border-radius: 0.4rem;
      transition: all 0.3s ease;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: rgba(59, 130, 246, 0.05);
        color: #3b82f6;
      }
    }

    .search-bar {
      position: relative;
      display: flex;
      align-items: center;
      background: #f8fafc;
      border-radius: 0.4rem;
      padding: 0.4rem 0.8rem;
      width: 250px;
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;

      &:focus-within {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      i {
        color: #94a3b8;
        margin-right: 0.5rem;
        font-size: 0.85rem;
      }

      input {
        border: none;
        background: none;
        outline: none;
        flex: 1;
        font-size: 0.85rem;
        color: #334155;

        &::placeholder {
          color: #94a3b8;
        }
      }
    }
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 0.6rem;

    .notifications {
      position: relative;

      .icon-button {
        background: none;
        border: none;
        color: #666;
        font-size: 1rem;
        cursor: pointer;
        padding: 0.4rem;
        border-radius: 0.4rem;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(59, 130, 246, 0.05);
          color: #3b82f6;
        }
      }

      .notification-badge {
        position: absolute;
        top: 0;
        right: 0;
        background: #3b82f6;
        color: white;
        font-size: 0.6rem;
        padding: 0.15rem 0.3rem;
        border-radius: 0.8rem;
        transform: translate(50%, -50%);
      }
    }

    .user-menu {
      position: relative;

      .user-button {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        background: none;
        border: none;
        padding: 0.4rem;
        border-radius: 0.4rem;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(59, 130, 246, 0.05);
        }

        .user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
          transition: all 0.3s ease;
        }

        .user-name {
          color: #333;
          font-size: 0.85rem;
          font-weight: 500;
        }

        i {
          color: #666;
          font-size: 0.8rem;
        }
      }
    }
  }
}

.dashboard-content {
  margin-top: 50px;
  padding: 1.5rem;
  min-height: calc(100vh - 50px);
}

.welcome-header {
  background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
  border-radius: 1rem;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.1);

  .welcome-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .welcome-text {
    h1 {
      color: #1e293b;
      font-size: 1.5rem;
      margin: 0 0 0.5rem;
      font-weight: 700;
    }

    .role-badge {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      padding: 0.3rem 0.8rem;
      border-radius: 1rem;
      font-size: 0.8rem;
      font-weight: 600;
      display: inline-block;
      margin: 0;
    }
  }

  .quick-stats {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .stat-card {
    background: white;
    border-radius: 0.8rem;
    padding: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    min-width: 120px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .stat-header {
      i {
        font-size: 1.2rem;
        color: #3b82f6;
        background: rgba(59, 130, 246, 0.1);
        padding: 0.6rem;
        border-radius: 0.6rem;
      }
    }

    .stat-body {
      .stat-value {
        font-size: 1.4rem;
        font-weight: 700;
        color: #1e293b;
        line-height: 1;
        display: block;
      }

      .stat-label {
        font-size: 0.75rem;
        color: #64748b;
        margin-top: 0.2rem;
        display: block;
      }
    }
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.dashboard-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  &.main-card {
    grid-row: span 2;
  }

  .card-header {
    padding: 1rem 1.2rem;
    border-bottom: 1px solid #e2e8f0;
    background: #fafbfc;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      color: #1e293b;
      font-size: 1rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-weight: 600;

      i {
        color: #3b82f6;
        font-size: 1.1rem;
      }
    }

    .view-all-btn {
      color: #3b82f6;
      text-decoration: none;
      font-size: 0.8rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.3rem 0.6rem;
      border-radius: 0.4rem;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(59, 130, 246, 0.1);
      }

      i {
        font-size: 0.7rem;
      }
    }
  }

  .card-content {
    padding: 1.2rem;
  }
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.report-item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 0.8rem;
  border-radius: 0.6rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    background: #f8fafc;
    border-color: #3b82f6;
    transform: translateY(-1px);
  }

  .report-icon {
    i {
      font-size: 1rem;
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      padding: 0.5rem;
      border-radius: 0.5rem;
    }
  }

  .report-details {
    flex: 1;

    h4 {
      color: #1e293b;
      font-size: 0.9rem;
      margin: 0 0 0.3rem;
      font-weight: 600;
    }

    .report-theme {
      color: #64748b;
      font-size: 0.8rem;
      margin: 0 0 0.5rem;
    }

    .report-meta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;

      span {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.75rem;
        color: #64748b;

        i {
          color: #3b82f6;
        }
      }
    }
  }
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  border-radius: 0.6rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  border: 1px solid transparent;

  &.primary {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
    }
  }

  &.secondary {
    background: #f1f5f9;
    color: #475569;
    border-color: #e2e8f0;

    &:hover {
      background: #e2e8f0;
      color: #334155;
    }
  }

  &.tertiary {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;

    &:hover {
      background: rgba(59, 130, 246, 0.2);
    }
  }

  i {
    font-size: 1rem;
  }
}

.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  padding: 2rem 1rem;
  text-align: center;
  color: #64748b;

  i {
    font-size: 2rem;
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    padding: 0.8rem;
    border-radius: 0.8rem;
  }
}

.error-state {
  color: #dc2626;

  i {
    color: #dc2626;
    background: rgba(220, 38, 38, 0.1);
  }
}

.notifications-dropdown,
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 0.6rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  z-index: 1000;
  margin-top: 0.4rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.notifications-header {
  padding: 0.8rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 0.9rem;
    color: #333;
    font-weight: 600;
  }

  button {
    background: none;
    border: none;
    color: #3b82f6;
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.3rem;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(59, 130, 246, 0.1);
    }
  }
}

.notifications-list {
  max-height: 350px;
  overflow-y: auto;
  padding: 0.4rem;

  .notification-item {
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
    padding: 0.6rem;
    border-radius: 0.4rem;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: #f8f9fa;
    }

    &.unread {
      background: rgba(59, 130, 246, 0.05);
    }

    i {
      font-size: 1rem;
      color: #3b82f6;
      padding: 0.4rem;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 0.4rem;
    }

    .notification-content {
      flex: 1;

      p {
        margin: 0 0 0.2rem;
        color: #333;
        font-size: 0.85rem;
      }

      .notification-time {
        font-size: 0.75rem;
        color: #666;
      }
    }
  }
}

.user-dropdown {
  min-width: 230px;
  padding: 0.8rem;

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 0.8rem;

    .user-avatar-large {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      font-weight: 700;
      box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
    }

    .user-details {
      h4 {
        margin: 0 0 0.2rem;
        color: #333;
        font-size: 0.9rem;
        font-weight: 600;
      }

      p {
        margin: 0;
        color: #666;
        font-size: 0.8rem;
      }
    }
  }

  .dropdown-menu {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    button {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.65rem;
      border: none;
      background: none;
      color: #333;
      cursor: pointer;
      border-radius: 0.4rem;
      transition: all 0.3s ease;
      width: 100%;
      text-align: left;
      font-size: 0.9rem;

      &:hover {
        background: #f8fafc;
        color: #3b82f6;
      }

      i {
        width: 16px;
        text-align: center;
      }
    }
  }
}

// Responsive Design
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .main-content {
    margin-left: 0;
  }

  .navbar {
    left: 0;
  }

  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;

    &.mobile-open {
      transform: translateX(0);
    }
  }
}

@media (max-width: 768px) {
  .navbar {
    height: 45px;
    padding: 0 1rem;

    .search-bar {
      width: 200px;
    }

    .user-button {
      .user-name {
        display: none;
      }

      .user-avatar {
        width: 24px;
        height: 24px;
        font-size: 0.7rem;
      }
    }
  }

  .dashboard-content {
    margin-top: 45px;
    padding: 1rem;
  }

  .welcome-header {
    padding: 1rem;

    .welcome-content {
      flex-direction: column;
      align-items: flex-start;
    }

    .quick-stats {
      width: 100%;
      justify-content: space-between;
    }

    .stat-card {
      min-width: 100px;
      padding: 0.6rem;

      .stat-header i {
        padding: 0.4rem;
        font-size: 1rem;
      }

      .stat-body {
        .stat-value {
          font-size: 1.2rem;
        }

        .stat-label {
          font-size: 0.7rem;
        }
      }
    }
  }

  .dashboard-card .card-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    height: 40px;

    .search-bar {
      width: 150px;
    }
  }

  .dashboard-content {
    margin-top: 40px;
    padding: 0.75rem;
  }

  .welcome-header {
    padding: 0.75rem;

    .welcome-text h1 {
      font-size: 1.2rem;
    }
  }

  .quick-stats {
    gap: 0.5rem;
  }

  .stat-card {
    min-width: 80px;
    padding: 0.5rem;
  }
}
</style>
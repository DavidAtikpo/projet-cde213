<template>
  <div class="dashboard-layout">
    <!-- Mobile Menu Button -->
    <button class="mobile-menu-btn" @click="toggleSidebar">
      <i class="fas fa-bars"></i>
    </button>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'collapsed': isSidebarCollapsed, 'mobile-open': isMobileOpen }">
      <div class="sidebar-header">
        <h2 class="app-title">CDE213</h2>
        <button class="collapse-btn" @click="toggleSidebar">
          <i :class="isSidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
        </button>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/monitor/dashboard" class="nav-item" active-class="active">
          <i class="fas fa-home"></i>
          <span v-show="!isSidebarCollapsed">Tableau de bord</span>
        </router-link>
        <router-link to="/monitor/reports" class="nav-item" active-class="active">
          <i class="fas fa-clipboard-list"></i>
          <span v-show="!isSidebarCollapsed">Mes rapports</span>
        </router-link>
        <router-link to="/monitor/profile" class="nav-item" active-class="active">
          <i class="fas fa-user"></i>
          <span v-show="!isSidebarCollapsed">Mon profil</span>
        </router-link>
        <router-link to="/monitor/settings" class="nav-item" active-class="active">
          <i class="fas fa-cog"></i>
          <span v-show="!isSidebarCollapsed">Paramètres</span>
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <div class="main-content" :class="{ 'expanded': isSidebarCollapsed }">
      <!-- Header -->
      <header class="main-header">
        <div class="header-left">
          <h1>Tableau de bord</h1>
        </div>
        <div class="header-right">
          <div class="notifications">
            <button class="notification-btn">
              <i class="fas fa-bell"></i>
              <span class="notification-badge" v-if="unreadNotifications">3</span>
            </button>
          </div>
          <div class="profile-menu" ref="profileMenu">
            <div class="profile-info" @click.stop="toggleProfileMenu">
              <img :src="monitor.profilePhotoURL || '/default-avatar.png'" alt="Profile" class="profile-photo" />
              <span class="profile-name">{{ monitor.firstName }} {{ monitor.lastName }}</span>
            </div>
            <div v-if="isProfileMenuOpen" class="profile-dropdown" :class="{ 'show': isProfileMenuOpen }">
              <router-link to="/monitor/profile" class="dropdown-item" @click="isProfileMenuOpen = false">
                <i class="fas fa-user"></i> Mon profil
              </router-link>
              <router-link to="/monitor/settings" class="dropdown-item" @click="isProfileMenuOpen = false">
                <i class="fas fa-cog"></i> Paramètres
              </router-link>
              <div class="dropdown-divider"></div>
              <button @click="logout" class="dropdown-item logout">
                <i class="fas fa-sign-out-alt"></i> Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Dashboard Content -->
      <div class="monitor-dashboard">
        <!-- En-tête avec informations du moniteur -->
        <div class="dashboard-header">
          <div class="header-content">
            <div class="welcome-section">
              <h1>Bienvenue, {{ monitor.firstName }} {{ monitor.lastName }}</h1>
              <p class="role">Moniteur</p>
            </div>
            <div class="quick-stats">
              <div class="stat-card">
                <i class="fas fa-users"></i>
                <div class="stat-info">
                  <span class="stat-value">{{ classData?.childIds?.length || 0 }}</span>
                  <span class="stat-label">Enfants</span>
                </div>
              </div>
              <div class="stat-card">
                <i class="fas fa-clipboard-list"></i>
                <div class="stat-info">
                  <span class="stat-value">{{ reports.length }}</span>
                  <span class="stat-label">Rapports</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-content">
          <!-- Section principale avec la classe -->
          <div class="main-section">
            <div class="section-header">
              <h2><i class="fas fa-chalkboard-teacher"></i> Ma Classe</h2>
            </div>
            <div class="section-content">
              <MonitorClassViewComponent />
            </div>
          </div>

          <!-- Section latérale avec les rapports récents -->
          <div class="sidebar-section">
            <div class="section-header">
              <h2><i class="fas fa-history"></i> Rapports Récents</h2>
            </div>
            <div class="section-content">
              <div v-if="loading" class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Chargement...</span>
              </div>
              <div v-else-if="error" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>{{ error }}</span>
              </div>
              <div v-else-if="reports.length === 0" class="no-data">
                <i class="fas fa-clipboard"></i>
                <span>Aucun rapport récent</span>
              </div>
              <div v-else class="reports-list">
                <div v-for="report in reports" :key="report._id" class="report-card">
                  <div class="report-header">
                    <h3>{{ report.title }}</h3>
                    <span class="report-date">{{ formatDate(report.date) }}</span>
                  </div>
                  <div class="report-content">
                    <p class="sub-theme">{{ report.subTheme }}</p>
                    <div class="report-stats">
                      <span class="stat">
                        <i class="fas fa-user-check"></i>
                        {{ Object.values(report.presences).filter(p => p).length }} présents
                      </span>
                    </div>
                  </div>
                </div>
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
      isSidebarCollapsed: false,
      isProfileMenuOpen: false,
      unreadNotifications: 3,
      isMobileOpen: false
    };
  },
  methods: {
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
    toggleSidebar() {
      if (window.innerWidth <= 1024) {
        this.isMobileOpen = !this.isMobileOpen;
      } else {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
      }
    },
    toggleProfileMenu() {
      this.isProfileMenuOpen = !this.isProfileMenuOpen;
    },
    handleClickOutside(event) {
      if (this.$refs.profileMenu && !this.$refs.profileMenu.contains(event.target)) {
        this.isProfileMenuOpen = false;
      }
    },
    async logout() {
      try {
        localStorage.removeItem('token');
        this.$router.push('/login');
      } catch (err) {
        console.error('Erreur lors de la déconnexion:', err);
      }
    },
    handleResize() {
      if (window.innerWidth > 1024) {
        this.isMobileOpen = false;
      }
    }
  },
  mounted() {
    this.fetchData();
    document.addEventListener('click', this.handleClickOutside);
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('resize', this.handleResize);
  }
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  position: relative;
  overflow-x: hidden;
  width: 100%;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background: #ffffff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  color: #1e293b;
  transition: all 0.2s ease;
}

.mobile-menu-btn:hover {
  background: #f1f5f9;
  color: #db2323;
}

.app-title {
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  margin-left: 60px;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

.sidebar.collapsed .app-title {
  opacity: 0;
  visibility: hidden;
}

.collapse-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1001;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar.collapsed .collapse-btn {
  right: 50%;
  transform: translate(50%, -50%);
}

/* Sidebar Styles */
.sidebar {
  width: 250px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  flex-shrink: 0;
  overflow-y: auto;
}

.sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
  min-height: 60px;

}

.logo {
  height: 40px;
  width: auto;
}

.sidebar-nav {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s ease;
  gap: 1rem;
  white-space: nowrap;
}

.nav-item:hover {
  background: #f1f5f9;
  color: #db2323;
}

.nav-item.active {
  background: #fff5f5;
  color: #db2323;
  border-right: 3px solid #db2323;
}

.nav-item i {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 100%;
  overflow-x: hidden;
  margin-left: 250px;
  width: calc(100% - 250px);
  transition: all 0.3s ease;
}

.main-content.expanded {
  margin-left: 70px;
  width: calc(100% - 70px);
}

/* Header Styles */
.main-header {
  background: #ffffff;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  width: 100%;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-sizing: border-box;
}

.header-left h1 {
  color: #1e293b;
  font-size: 1.25rem;
  margin: 0;
  margin-left: 60px;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.notification-btn {
  position: relative;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.notification-btn:hover {
  background: #f1f5f9;
  color: #db2323;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #db2323;
  color: white;
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
  border-radius: 1rem;
  transform: translate(50%, -50%);
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-menu {
  position: relative;
  z-index: 1000;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
}

.profile-info:hover {
  background: #f1f5f9;
  border-color: #db2323;
}

.profile-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-name {
  color: #1e293b;
  font-weight: 500;
  font-size: 0.9rem;
  white-space: nowrap;
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 220px;
  max-width: calc(100vw - 2rem);
  z-index: 1001;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #1e293b;
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  border-bottom: 1px solid #f1f5f9;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #db2323;
}

.dropdown-item i {
  width: 20px;
  text-align: center;
  font-size: 1rem;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0.5rem 0;
}

.logout {
  color: #db2323;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 0.875rem 1rem;
}

.logout:hover {
  background: #fff5f5;
}

/* Existing Dashboard Styles */
.monitor-dashboard {
  flex: 1;
  overflow-x: hidden;
  padding: 1rem;
  box-sizing: border-box;
  width: 100%;
}

.dashboard-header {
  background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%);
  border-radius: 1.5rem;
  box-shadow: 0 4px 20px rgba(219, 35, 35, 0.08);
  margin-bottom: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.dashboard-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(219, 35, 35, 0.12);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.welcome-section h1 {
  color: #1e293b;
  font-size: 1.75rem;
  margin: 0;
  font-weight: 700;
  line-height: 1.2;
}

.role {
  color: #db2323;
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(219, 35, 35, 0.1);
  border-radius: 2rem;
}

.quick-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
}

.stat-card {
  flex: 1;
  min-width: 160px;
  max-width: 200px;
  box-sizing: border-box;
  padding: 1rem;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(219, 35, 35, 0.1);
  border-color: rgba(219, 35, 35, 0.2);
}

.stat-card i {
  font-size: 1.4rem;
  color: #db2323;
  background: rgba(219, 35, 35, 0.1);
  padding: 0.75rem;
  border-radius: 1rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 0.3rem;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.main-section, .sidebar-section {
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
}

.main-section:hover, .sidebar-section:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
}

.section-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}

.section-header h2 {
  color: #1e293b;
  font-size: 1.2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
}

.section-header h2 i {
  color: #db2323;
  font-size: 1.3rem;
}

.section-content {
  padding: 1.25rem;
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.report-card {
  background: #ffffff;
  border-radius: 1rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.report-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: rgba(219, 35, 35, 0.2);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.report-header h3 {
  color: #1e293b;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 600;
}

.report-date {
  font-size: 0.8rem;
  color: #64748b;
  background: #f8fafc;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
}

.report-content {
  color: #475569;
}

.sub-theme {
  margin-bottom: 0.75rem;
  font-weight: 500;
  color: #334155;
  font-size: 0.9rem;
}

.report-stats {
  display: flex;
  gap: 1.5rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: #64748b;
  background: #f8fafc;
  padding: 0.4rem 0.75rem;
  border-radius: 1rem;
}

.stat i {
  color: #db2323;
}

.loading, .error-message, .no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1.5rem;
  text-align: center;
  color: #64748b;
  background: #f8fafc;
  border-radius: 1rem;
}

.loading i, .error-message i, .no-data i {
  font-size: 2rem;
  color: #db2323;
  background: rgba(219, 35, 35, 0.1);
  padding: 0.75rem;
  border-radius: 1rem;
}

.error-message {
  color: #db2323;
  background: #fef2f2;
  border: 1px solid rgba(219, 35, 35, 0.2);
}

@media (min-width: 1025px) {
  .mobile-menu-btn {
    display: none;
  }

  .main-content {
    margin-left: 250px;
    width: calc(100% - 250px);
  }

  .main-content.expanded {
    margin-left: 70px;
    width: calc(100% - 70px);
  }

  .dashboard-content {
    grid-template-columns: 2fr 1fr;
  }
}

@media (max-width: 1024px) {
  .mobile-menu-btn {
    display: block;
  }

  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
    width: 100%;
  }

  .main-content.expanded {
    margin-left: 0;
    width: 100%;
  }

  .main-header {
    padding: 1rem;
    height: 60px;
  }

  .monitor-dashboard {
    padding: 1rem;
  }

  .collapse-btn {
    position: relative;
    right: 0;
    transform: none;
  }

  .sidebar.collapsed .collapse-btn {
    right: 0;
    transform: none;
  }
}

@media (max-width: 768px) {
  .main-header {
    padding: 0.75rem;
    height: 50px;
  }

  .header-left h1 {
    font-size: 1.1rem;
  }

  .welcome-section h1 {
    font-size: 1.5rem;
  }

  .profile-name {
    display: none;
  }

  .profile-info {
    padding: 0.5rem;
  }

  .profile-dropdown {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 1rem 1rem 0 0;
    min-width: 60%;
    max-width: 60%;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  }

  .profile-dropdown.show {
    transform: translateX(0);
  }

  .dropdown-item {
    padding: 0.875rem;
    font-size: 1rem;
  }

  .dropdown-divider {
    margin: 0.5rem 0;
  }

  .monitor-dashboard {
    padding: 1rem;
  }

  .stat-card {
    min-width: 140px;
    max-width: 100%;
  }

  .header-right {
    gap: 1rem;
  }
}

/* Overlay for mobile */
.sidebar::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background: rgba(0, 0, 0, 0.5); */
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: -1;
}

@media (max-width: 1024px) {
  .sidebar.mobile-open::before {
    opacity: 1;
    visibility: visible;
  }
}

/* Ensure all elements use border-box */
* {
  box-sizing: border-box;
}
</style>
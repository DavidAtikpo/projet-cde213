<!-- adminDashboard.vue -->
<template>
  <div class="admin-dashboard" :class="theme">
    <!-- Overlay pour mobile -->
    <div 
      v-if="isMobile && !isCollapsed" 
      class="sidebar-overlay" 
      @click="toggleSidebar"
    ></div>

    <!-- Sidebar -->
    <div 
      class="sidebar" 
      :class="{ 
        'collapsed': isCollapsed, 
        'mobile': isMobile,
        [theme]: true 
      }"
    >
      <div class="sidebar-header">
        <div class="logo-container">
          <img :src="logoUrl" alt="Logo" class="logo" @error="handleLogoError">
        </div>
        <h1 v-if="!isCollapsed" class="sidebar-title">{{ getTranslatedTitle('adminPanel') }}</h1>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <h2 v-if="!isCollapsed" class="section-title">{{ getTranslatedTitle('mainMenu') }}</h2>
          <router-link to="/admin/dashboard" class="nav-item" active-class="active">
            <i class="fas fa-home"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('dashboard') }}</span>
          </router-link>
          <router-link to="/admin/users" class="nav-item" active-class="active">
            <i class="fas fa-users-cog"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('userManagement') }}</span>
          </router-link>
          <router-link to="/admin/children" class="nav-item" active-class="active">
            <i class="fas fa-child"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('childrenManagement') }}</span>
          </router-link>
        </div>

        <div class="nav-section">
          <h2 v-if="!isCollapsed" class="section-title">{{ getTranslatedTitle('activities') }}</h2>
          <router-link to="/admin/activities" class="nav-item" active-class="active">
            <i class="fas fa-calendar-check"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('activityManagement') }}</span>
          </router-link>
          <router-link to="/admin/staff" class="nav-item" active-class="active">
            <i class="fas fa-user-tie"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('staffManagement') }}</span>
          </router-link>
        </div>

        <div class="nav-section">
          <h2 v-if="!isCollapsed" class="section-title">{{ getTranslatedTitle('finance') }}</h2>
          <router-link to="/admin/finance" class="nav-item" active-class="active">
            <i class="fas fa-chart-pie"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('financeManagement') }}</span>
          </router-link>
          <router-link to="/admin/reports" class="nav-item" active-class="active">
            <i class="fas fa-file-alt"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('reportsAndStats') }}</span>
          </router-link>
        </div>

        <div class="nav-section">
          <h2 v-if="!isCollapsed" class="section-title">{{ getTranslatedTitle('system') }}</h2>
          <router-link to="/admin/settings" class="nav-item" active-class="active">
            <i class="fas fa-cogs"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('systemSettings') }}</span>
          </router-link>
          <router-link to="/admin/permissions" class="nav-item" active-class="active">
            <i class="fas fa-shield-alt"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('permissionManagement') }}</span>
          </router-link>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button class="theme-toggle" @click="toggleTheme">
          <i :class="themeIcon"></i>
          <span v-if="!isCollapsed">{{ getTranslatedTitle('toggleTheme') }}</span>
        </button>
        <button class="language-toggle" @click="toggleLanguage">
          <i class="fas fa-globe"></i>
          <span v-if="!isCollapsed">{{ currentLanguage }}</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div 
      class="main-content" 
      :class="{ 
        'sidebar-collapsed': isCollapsed,
        'mobile': isMobile
      }"
    >
      <!-- Navbar -->
      <div class="navbar" :class="theme">
        <div class="navbar-left">
          <button 
            class="menu-toggle" 
            @click="toggleSidebar"
            :aria-label="isCollapsed ? 'Open menu' : 'Close menu'"
          >
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
              <img :src="userAvatar" :alt="userName" class="user-avatar">
              <span class="user-name">{{ userName }}</span>
              <i class="fas fa-chevron-down"></i>
            </button>
            <div class="user-dropdown" v-if="showUserMenu">
              <div class="user-info">
                <img :src="userAvatar" :alt="userName" class="user-avatar-large">
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
        <div class="dashboard-header">
          <h1>{{ getTranslatedTitle('dashboard') }}</h1>
          <div class="quick-actions">
            <button class="action-button" @click="showSystemStatus">
              <i class="fas fa-server"></i>
              <span>{{ getTranslatedTitle('systemStatus') }}</span>
            </button>
            <button class="action-button" @click="showDatabaseStats">
              <i class="fas fa-database"></i>
              <span>{{ getTranslatedTitle('databaseStats') }}</span>
            </button>
            <button class="action-button" @click="showBackup">
              <i class="fas fa-cloud-upload-alt"></i>
              <span>{{ getTranslatedTitle('backup') }}</span>
            </button>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-header">
              <h3>{{ getTranslatedTitle('totalUsers') }}</h3>
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-value">1,234</div>
            <div class="stat-change positive">
              <i class="fas fa-arrow-up"></i>
              +12.5%
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <h3>{{ getTranslatedTitle('totalChildren') }}</h3>
              <i class="fas fa-child"></i>
            </div>
            <div class="stat-value">567</div>
            <div class="stat-change positive">
              <i class="fas fa-arrow-up"></i>
              +8.3%
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <h3>{{ getTranslatedTitle('totalActivities') }}</h3>
              <i class="fas fa-calendar-check"></i>
            </div>
            <div class="stat-value">89</div>
            <div class="stat-change negative">
              <i class="fas fa-arrow-down"></i>
              -2.1%
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-header">
              <h3>{{ getTranslatedTitle('totalStaff') }}</h3>
              <i class="fas fa-user-tie"></i>
            </div>
            <div class="stat-value">45</div>
            <div class="stat-change positive">
              <i class="fas fa-arrow-up"></i>
              +5.7%
            </div>
          </div>
        </div>

        <div class="recent-activity">
          <h2>{{ getTranslatedTitle('recentActivity') }}</h2>
          <div class="activity-list">
            <div class="activity-item">
              <i class="fas fa-user-plus"></i>
              <div class="activity-content">
                <h4>{{ getTranslatedTitle('newStaffMember') }}</h4>
                <p>{{ getTranslatedTitle('newStaffMemberDesc') }}</p>
              </div>
              <span class="activity-time">5 min ago</span>
            </div>

            <div class="activity-item">
              <i class="fas fa-child"></i>
              <div class="activity-content">
                <h4>{{ getTranslatedTitle('newChildRegistration') }}</h4>
                <p>{{ getTranslatedTitle('newChildRegistrationDesc') }}</p>
              </div>
              <span class="activity-time">1 hour ago</span>
            </div>

            <div class="activity-item">
              <i class="fas fa-calendar-check"></i>
              <div class="activity-content">
                <h4>{{ getTranslatedTitle('newActivityScheduled') }}</h4>
                <p>{{ getTranslatedTitle('newActivityScheduledDesc') }}</p>
              </div>
              <span class="activity-time">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      isCollapsed: false,
      isMobile: false,
      searchQuery: '',
      showNotifications: false,
      showUserMenu: false,
      unreadNotifications: 3,
      notifications: [
        {
          id: 1,
          icon: 'fas fa-user-plus',
          message: 'New staff member registered',
          time: '5 min ago',
          read: false
        },
        {
          id: 2,
          icon: 'fas fa-child',
          message: 'New child registration completed',
          time: '1 hour ago',
          read: false
        },
        {
          id: 3,
          icon: 'fas fa-calendar-check',
          message: 'New activity scheduled',
          time: '2 hours ago',
          read: true
        }
      ],
      userName: 'Admin User',
      userRole: 'Administrator',
      userAvatar: '/path/to/avatar.jpg',
      logoUrl: '/path/to/logo.png'
    };
  },
  computed: {
    ...mapState(['theme', 'language']),
    currentLanguage() {
      return this.language === 'en' ? 'English' : 'Français';
    },
    themeIcon() {
      return this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
    toggleTheme() {
      this.$store.commit('toggleTheme');
    },
    toggleLanguage() {
      this.$store.commit('toggleLanguage');
    },
    handleSearch() {
      // Implement search functionality
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
      this.notifications.forEach(notification => {
        notification.read = true;
      });
      this.unreadNotifications = 0;
    },
    navigateTo(route) {
      this.$router.push(`/admin/${route}`);
    },
    logout() {
      // Implement logout functionality
    },
    handleLogoError() {
      this.logoUrl = '/path/to/default-logo.png';
    },
    showSystemStatus() {
      // Implement system status functionality
    },
    showDatabaseStats() {
      // Implement database stats functionality
    },
    showBackup() {
      // Implement backup functionality
    },
    getTranslatedTitle(key) {
      const translations = {
        en: {
          adminPanel: 'Admin Panel',
          dashboard: 'Dashboard',
          mainMenu: 'Main Menu',
          userManagement: 'User Management',
          childrenManagement: 'Children Management',
          activities: 'Activities',
          activityManagement: 'Activity Management',
          staffManagement: 'Staff Management',
          finance: 'Finance',
          financeManagement: 'Finance Management',
          reportsAndStats: 'Reports & Statistics',
          system: 'System',
          systemSettings: 'System Settings',
          permissionManagement: 'Permission Management',
          toggleTheme: 'Toggle Theme',
          searchPlaceholder: 'Search...',
          notifications: 'Notifications',
          markAllAsRead: 'Mark all as read',
          profile: 'Profile',
          settings: 'Settings',
          logout: 'Logout',
          systemStatus: 'System Status',
          databaseStats: 'Database Stats',
          backup: 'Backup',
          totalUsers: 'Total Users',
          totalChildren: 'Total Children',
          totalActivities: 'Total Activities',
          totalStaff: 'Total Staff',
          recentActivity: 'Recent Activity',
          newStaffMember: 'New Staff Member',
          newStaffMemberDesc: 'John Doe has joined the team',
          newChildRegistration: 'New Child Registration',
          newChildRegistrationDesc: 'New child registered in the system',
          newActivityScheduled: 'New Activity Scheduled',
          newActivityScheduledDesc: 'Art workshop scheduled for next week'
        },
        fr: {
          adminPanel: 'Panneau Admin',
          dashboard: 'Tableau de bord',
          mainMenu: 'Menu Principal',
          userManagement: 'Gestion des Utilisateurs',
          childrenManagement: 'Gestion des Enfants',
          activities: 'Activités',
          activityManagement: 'Gestion des Activités',
          staffManagement: 'Gestion du Personnel',
          finance: 'Finance',
          financeManagement: 'Gestion Financière',
          reportsAndStats: 'Rapports & Statistiques',
          system: 'Système',
          systemSettings: 'Paramètres Système',
          permissionManagement: 'Gestion des Permissions',
          toggleTheme: 'Changer de thème',
          searchPlaceholder: 'Rechercher...',
          notifications: 'Notifications',
          markAllAsRead: 'Tout marquer comme lu',
          profile: 'Profil',
          settings: 'Paramètres',
          logout: 'Déconnexion',
          systemStatus: 'État du Système',
          databaseStats: 'Statistiques Base de Données',
          backup: 'Sauvegarde',
          totalUsers: 'Total Utilisateurs',
          totalChildren: 'Total Enfants',
          totalActivities: 'Total Activités',
          totalStaff: 'Total Personnel',
          recentActivity: 'Activité Récente',
          newStaffMember: 'Nouveau Membre',
          newStaffMemberDesc: 'John Doe a rejoint l\'équipe',
          newChildRegistration: 'Nouvelle Inscription',
          newChildRegistrationDesc: 'Nouvel enfant inscrit dans le système',
          newActivityScheduled: 'Nouvelle Activité',
          newActivityScheduledDesc: 'Atelier d\'art programmé pour la semaine prochaine'
        }
      };
      return translations[this.language][key] || key;
    }
  },
  mounted() {
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    });
  }
};
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: var(--bg-color);
  color: var(--text-color);
}

.sidebar {
  width: 280px;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 1000;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar.mobile {
  transform: translateX(-100%);
}

.sidebar.mobile:not(.collapsed) {
  transform: translateX(0);
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.logo-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  max-width: 100%;
  max-height: 100%;
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0 1.5rem;
  margin-bottom: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.2s ease;
  gap: 1rem;
}

.nav-item:hover {
  background: var(--hover-bg);
}

.nav-item.active {
  background: var(--primary-color);
  color: white;
}

.nav-item i {
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.theme-toggle,
.language-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border: none;
  background: none;
  color: var(--text-color);
  cursor: pointer;
  width: 100%;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.theme-toggle:hover,
.language-toggle:hover {
  background: var(--hover-bg);
}

.main-content {
  flex: 1;
  margin-left: 280px;
  transition: all 0.3s ease;
}

.main-content.sidebar-collapsed {
  margin-left: 80px;
}

.main-content.mobile {
  margin-left: 0;
}

.navbar {
  height: 64px;
  background: var(--navbar-bg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  padding: 0.5rem;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }
}

.search-bar {
  display: flex;
  align-items: center;
  background: var(--search-bg);
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  gap: 0.5rem;
}

.search-bar input {
  border: none;
  background: none;
  color: var(--text-color);
  outline: none;
  width: 200px;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.notifications {
  position: relative;
}

.icon-button {
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  padding: 0.5rem;
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--primary-color);
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  min-width: 1.5rem;
  text-align: center;
}

.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--dropdown-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 320px;
  z-index: 1000;
}

.notifications-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.notifications-header h3 {
  margin: 0;
  font-size: 1rem;
}

.notifications-header button {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.875rem;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.notification-item:hover {
  background: var(--hover-bg);
}

.notification-item.unread {
  background: var(--unread-bg);
}

.notification-item i {
  color: var(--primary-color);
  font-size: 1.25rem;
}

.notification-content {
  flex: 1;
}

.notification-content p {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  padding: 0.5rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: 0.875rem;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--dropdown-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 280px;
  z-index: 1000;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details h4 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
}

.user-details p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.dropdown-menu {
  padding: 0.5rem;
}

.dropdown-menu button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.dropdown-menu button:hover {
  background: var(--hover-bg);
}

.dashboard-content {
  padding: 1.5rem;
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.quick-actions {
  display: flex;
  gap: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--button-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: var(--button-hover-bg);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.stat-header h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-secondary);
}

.stat-header i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.stat-change.positive {
  color: var(--success-color);
}

.stat-change.negative {
  color: var(--error-color);
}

.recent-activity {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.recent-activity h2 {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: var(--hover-bg);
}

.activity-item i {
  font-size: 1.25rem;
  color: var(--primary-color);
}

.activity-content {
  flex: 1;
}

.activity-content h4 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
}

.activity-content p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Dark theme variables */
.dark {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
  --text-secondary: #a0aec0;
  --sidebar-bg: #2d3748;
  --navbar-bg: #2d3748;
  --card-bg: #2d3748;
  --border-color: #4a5568;
  --hover-bg: #4a5568;
  --primary-color: #4299e1;
  --search-bg: #4a5568;
  --dropdown-bg: #2d3748;
  --unread-bg: #2c5282;
  --button-bg: #4a5568;
  --button-hover-bg: #2d3748;
  --success-color: #48bb78;
  --error-color: #f56565;
}

/* Light theme variables */
.light {
  --bg-color: #f7fafc;
  --text-color: #2d3748;
  --text-secondary: #718096;
  --sidebar-bg: #ffffff;
  --navbar-bg: #ffffff;
  --card-bg: #ffffff;
  --border-color: #e2e8f0;
  --hover-bg: #f7fafc;
  --primary-color: #4299e1;
  --search-bg: #f7fafc;
  --dropdown-bg: #ffffff;
  --unread-bg: #ebf8ff;
  --button-bg: #f7fafc;
  --button-hover-bg: #edf2f7;
  --success-color: #48bb78;
  --error-color: #f56565;
}
</style>
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
            :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
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
      isTransitioning: false,
      logoUrl: '/logo.png',
      logoError: false,
      searchQuery: '',
      showNotifications: false,
      showUserMenu: false,
      unreadNotifications: 3,
      notifications: [
        {
          id: 1,
          icon: 'fas fa-user-plus',
          message: 'Nouveau membre du personnel ajouté',
          time: 'Il y a 5 minutes',
          read: false
        },
        {
          id: 2,
          icon: 'fas fa-child',
          message: "Nouvelle inscription d'enfant",
          time: 'Il y a 1 heure',
          read: false
        },
        {
          id: 3,
          icon: 'fas fa-calendar-check',
          message: 'Activité planifiée pour demain',
          time: 'Il y a 2 heures',
          read: false
        }
      ],
      userName: 'Administrateur',
      userRole: 'Administrateur',
      userAvatar: 'https://via.placeholder.com/40',
      translatedTitles: {
        fr: {
          adminPanel: 'Panneau Administrateur',
          mainMenu: 'Menu Principal',
          dashboard: 'Tableau de Bord',
          userManagement: 'Gestion des Utilisateurs',
          childrenManagement: 'Gestion des Enfants',
          activities: 'Activités',
          activityManagement: 'Gestion des Activités',
          staffManagement: 'Gestion du Personnel',
          finance: 'Finances',
          financeManagement: 'Gestion Financière',
          reportsAndStats: 'Rapports & Statistiques',
          system: 'Système',
          systemSettings: 'Configuration Système',
          permissionManagement: 'Gestion des Permissions',
          toggleTheme: 'Changer le Thème',
          searchPlaceholder: 'Rechercher...',
          notifications: 'Notifications',
          markAllAsRead: 'Tout marquer comme lu',
          profile: 'Profil',
          settings: 'Paramètres',
          logout: 'Déconnexion',
          totalUsers: 'Utilisateurs Totaux',
          totalChildren: 'Enfants Totaux',
          totalActivities: 'Activités Totales',
          totalStaff: 'Personnel Total',
          recentActivity: 'Activité Récente',
          newStaffMember: 'Nouveau Membre du Personnel',
          newStaffMemberDesc: 'Un nouveau membre a rejoint l\'équipe',
          newChildRegistration: 'Nouvelle Inscription',
          newChildRegistrationDesc: 'Un nouvel enfant a été inscrit',
          newActivityScheduled: 'Nouvelle Activité',
          newActivityScheduledDesc: 'Une nouvelle activité a été planifiée'
        },
        en: {
          adminPanel: 'Admin Panel',
          mainMenu: 'Main Menu',
          dashboard: 'Dashboard',
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
          totalUsers: 'Total Users',
          totalChildren: 'Total Children',
          totalActivities: 'Total Activities',
          totalStaff: 'Total Staff',
          recentActivity: 'Recent Activity',
          newStaffMember: 'New Staff Member',
          newStaffMemberDesc: 'A new staff member has joined',
          newChildRegistration: 'New Registration',
          newChildRegistrationDesc: 'A new child has been registered',
          newActivityScheduled: 'New Activity',
          newActivityScheduledDesc: 'A new activity has been scheduled'
        }
      }
    };
  },
  computed: {
    ...mapState(['theme', 'language']),
    themeIcon() {
      return this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    },
    currentLanguage() {
      return this.language === 'fr' ? 'FR' : 'EN';
    }
  },
  methods: {
    getTranslatedTitle(key) {
      return this.translatedTitles[this.language]?.[key] || key;
    },
    toggleTheme() {
      this.$store.commit('toggleTheme');
    },
    toggleLanguage() {
      this.$store.commit('toggleLanguage');
    },
    handleLogoError() {
      this.logoError = true;
      this.logoUrl = 'https://via.placeholder.com/50?text=Logo';
    },
    toggleSidebar() {
      if (this.isMobile) {
        this.isCollapsed = !this.isCollapsed;
        document.body.style.overflow = this.isCollapsed ? '' : 'hidden';
      } else {
        this.isCollapsed = !this.isCollapsed;
        localStorage.setItem('sidebarCollapsed', JSON.stringify(this.isCollapsed));
      }
    },
    checkScreenSize() {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 1024;
      
      if (!wasMobile && this.isMobile) {
        this.isCollapsed = true;
        document.body.style.overflow = '';
      } else if (wasMobile && !this.isMobile) {
        document.body.style.overflow = '';
        const savedState = localStorage.getItem('sidebarCollapsed');
        this.isCollapsed = savedState ? JSON.parse(savedState) : false;
      }
    },
    handleSearch() {
      console.log('Recherche :', this.searchQuery);
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
      this.$router.push(`/admin/${route}`);
      this.showUserMenu = false;
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    }
  },
  mounted() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
    
    if (!this.isMobile) {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState) {
        this.isCollapsed = JSON.parse(savedState);
      }
    }

    document.addEventListener('click', (e) => {
      if (this.isMobile && !this.isCollapsed) {
        const sidebar = document.querySelector('.sidebar');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (!sidebar?.contains(e.target) && !menuToggle?.contains(e.target)) {
          this.toggleSidebar();
        }
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenSize);
    document.body.style.overflow = '';
  },
  watch: {
    isCollapsed(newValue) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newValue));
    }
  }
};
</script>

<style lang="scss" scoped>
.admin-dashboard {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content {
  flex: 1;
  margin-left: 280px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.sidebar-collapsed {
    margin-left: 80px;
  }
  
  &.mobile {
    margin-left: 0 !important;
  }
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1001;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  border-right: 1px solid rgba(0, 0, 0, 0.05);

  &.collapsed {
    width: 80px;
  }

  .sidebar-header {
    padding: 1.5rem;
    background: linear-gradient(135deg, #db2323 0%, #b31b1b 100%);
    color: white;

    .logo-container {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 0.5rem;
    }

    .sidebar-title {
      color: white;
      font-size: 1.2rem;
      margin-top: 1rem;
    }
  }

  .nav-section {
    padding: 1rem 0;

    .section-title {
      color: #666;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0 1.5rem;
      margin-bottom: 0.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.8rem 1.5rem;
      color: #333;
      text-decoration: none;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;

      &:hover {
        background: rgba(219, 35, 35, 0.05);
        color: #db2323;
      }

      &.active {
        background: rgba(219, 35, 35, 0.1);
        color: #db2323;
        border-left-color: #db2323;
      }

      i {
        font-size: 1.2rem;
        margin-right: 1rem;
        width: 24px;
        text-align: center;
      }
    }
  }
}

.navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 280px;
  height: 70px;
  background: white;
  padding: 0 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-bar {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  width: 300px;

  &:focus-within {
    background: white;
    box-shadow: 0 0 0 2px rgba(219, 35, 35, 0.2);
  }

  input {
    border: none;
    background: none;
    outline: none;
    color: #333;
    width: 100%;

    &::placeholder {
      color: #666;
    }
  }
}

.dashboard-content {
  margin-top: 70px;
  padding: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h3 {
      font-size: 1rem;
      color: #64748b;
      font-weight: 500;
      margin: 0;
    }

    i {
      font-size: 1.2rem;
      color: #2c3e50;
      padding: 0.8rem;
      background: linear-gradient(135deg, #db2323 0%, #b31b1b 100%);
      border-radius: 0.8rem;
      transition: all 0.3s ease;
    }
  }

  .stat-value {
    font-size: 2rem;
    color: #333;
    font-weight: 700;
    margin: 0 0 0.5rem;
  }

  .stat-change {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;

    &.positive {
      color: #28a745;
    }

    &.negative {
      color: #dc3545;
    }

    i {
      font-size: 0.8rem;
    }
  }
}

.recent-activity {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.5rem;
    color: #333;
    font-weight: 600;
    margin: 0 0 1.5rem;
  }
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
  border-radius: 0.8rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    background: #f1f5f9;
    transform: translateX(5px);
  }

  i {
    font-size: 1.2rem;
    color: #2c3e50;
    padding: 0.8rem;
    background: linear-gradient(135deg, #db2323 0%, #b31b1b 100%);
    border-radius: 0.8rem;
    transition: all 0.3s ease;
  }

  .activity-content {
    flex: 1;

    h4 {
      margin: 0 0 0.3rem;
      font-size: 1rem;
      color: #2c3e50;
      font-weight: 500;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      color: #64748b;
    }
  }

  .activity-time {
    font-size: 0.85rem;
    color: #64748b;
    white-space: nowrap;
  }
}

/* Dark theme */
:deep(.dark) {
  .admin-dashboard {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }

  .main-content {
    background: #0f172a;
  }

  .sidebar {
    background: #1e293b;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .navbar {
    background: #1e293b;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .stat-card {
    background: #1e293b;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.1);

    &:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .stat-header {
      h3 {
        color: #94a3b8;
      }

      i {
        color: #e2e8f0;
        background: linear-gradient(135deg, #db2323 0%, #b31b1b 100%);
      }
    }

    .stat-value {
      color: #e2e8f0;
    }
  }

  .recent-activity {
    background: #1e293b;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.1);

    h2 {
      color: #e2e8f0;
    }
  }

  .activity-item {
    border-color: rgba(255, 255, 255, 0.1);

    &:hover {
      background: #0f172a;
    }

    i {
      color: #e2e8f0;
      background: linear-gradient(135deg, #db2323 0%, #b31b1b 100%);
    }

    .activity-content {
      h4 {
        color: #e2e8f0;
      }

      p {
        color: #94a3b8;
      }
    }

    .activity-time {
      color: #94a3b8;
    }
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .navbar {
    left: 0;
  }

  .main-content {
    margin-left: 0;
    padding: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .navbar {
    left: 0;
    padding: 0 1rem;
  }

  .main-content {
    margin-top: 60px;
    padding: 1rem;
  }

  .sidebar {
    width: 100%;
    max-width: 300px;
  }

  .menu-toggle {
    margin-right: 1rem;
  }

  .notifications-dropdown,
  .user-dropdown {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    width: 100%;
    margin: 0;
    border-radius: 0;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.5rem;

    h1 {
      font-size: 1.5rem;
    }
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 1.2rem;
  }

  .recent-activity {
    padding: 1.2rem;
  }

  .activity-item {
    flex-direction: column;
    gap: 0.8rem;

    .activity-time {
      align-self: flex-start;
    }
  }
}

/* Ajout d'un overlay pour le mobile */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(2px);
}

@media (max-width: 768px) {
  .sidebar-overlay {
    display: block;
    opacity: 1;
  }
}

.menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--button-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  margin-right: 1rem;
}

.menu-toggle:hover {
  background: var(--button-hover-bg);
  transform: scale(1.05);
}

.menu-toggle i {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .navbar {
    left: 0;
    padding: 0 1rem;
  }
  
  .search-bar {
    width: 200px;
  }
}
</style> 
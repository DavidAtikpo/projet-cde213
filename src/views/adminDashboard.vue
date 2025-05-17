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
          <div class="nav-item" @click="toggleSubmenu('users')">
            <i class="fas fa-users-cog"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('userManagement') }}</span>
            <i class="fas fa-chevron-right" :class="{ 'rotated': activeSubmenu === 'users' }"></i>
          </div>
          <div class="submenu" v-if="activeSubmenu === 'users' && !isCollapsed">
            <router-link :to="`/admin/${$route.params.id}/users/list`" class="submenu-item" active-class="active">
              <i class="fas fa-list"></i>
              <span>{{ getTranslatedTitle('userList') }}</span>
            </router-link>
            <router-link :to="`/admin/${$route.params.id}/users/roles`" class="submenu-item" active-class="active">
              <i class="fas fa-user-tag"></i>
              <span>{{ getTranslatedTitle('roleManagement') }}</span>
            </router-link>
            <router-link :to="`/admin/${$route.params.id}/users/permissions`" class="submenu-item" active-class="active">
              <i class="fas fa-key"></i>
              <span>{{ getTranslatedTitle('permissions') }}</span>
            </router-link>
          </div>
        </div>

        <div class="nav-section">
          <h2 v-if="!isCollapsed" class="section-title">{{ getTranslatedTitle('children') }}</h2>
          <div class="nav-item" @click="toggleSubmenu('children')">
            <i class="fas fa-child"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('childrenManagement') }}</span>
            <i class="fas fa-chevron-right" :class="{ 'rotated': activeSubmenu === 'children' }"></i>
          </div>
          <div class="submenu" v-if="activeSubmenu === 'children' && !isCollapsed">
            <router-link :to="`/admin/${$route.params.id}/ListeEnfant`" class="submenu-item" active-class="active">
              <i class="fas fa-list"></i>
              <span>{{ getTranslatedTitle('listOfChildren') }}</span>
            </router-link>
            <router-link :to="`/admin/${$route.params.id}/Registration`" class="submenu-item" active-class="active">
              <i class="fas fa-user-plus"></i>
              <span>{{ getTranslatedTitle('inscription') }}</span>
            </router-link>
            <router-link :to="`/admin/${$route.params.id}/children/groups`" class="submenu-item" active-class="active">
              <i class="fas fa-users"></i>
              <span>{{ getTranslatedTitle('groups') }}</span>
            </router-link>
          </div>

          <div class="nav-item" @click="toggleSubmenu('attendance')">
            <i class="fas fa-calendar-check"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('attendance') }}</span>
            <i class="fas fa-chevron-right" :class="{ 'rotated': activeSubmenu === 'attendance' }"></i>
          </div>
          <div class="submenu" v-if="activeSubmenu === 'attendance' && !isCollapsed">
            <router-link :to="`/admin/${$route.params.id}/attendance/present`" class="submenu-item" active-class="active">
              <i class="fas fa-check-circle"></i>
              <span>{{ getTranslatedTitle('present') }}</span>
            </router-link>
            <router-link :to="`/admin/${$route.params.id}/attendance/absent`" class="submenu-item" active-class="active">
              <i class="fas fa-times-circle"></i>
              <span>{{ getTranslatedTitle('absent') }}</span>
            </router-link>
            <router-link :to="`/admin/${$route.params.id}/attendance/history`" class="submenu-item" active-class="active">
              <i class="fas fa-history"></i>
              <span>{{ getTranslatedTitle('attendanceHistory') }}</span>
            </router-link>
          </div>
        </div>

        <div class="nav-section">
          <h2 v-if="!isCollapsed" class="section-title">{{ getTranslatedTitle('activities') }}</h2>
          <div class="nav-item" @click="toggleSubmenu('activities')">
            <i class="fas fa-calendar-alt"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('activityManagement') }}</span>
            <i class="fas fa-chevron-right" :class="{ 'rotated': activeSubmenu === 'activities' }"></i>
          </div>
          <div class="submenu" v-if="activeSubmenu === 'activities' && !isCollapsed">
            <router-link :to="`/admin/${$route.params.id}/activities/schedule`" class="submenu-item" active-class="active">
              <i class="fas fa-clock"></i>
              <span>{{ getTranslatedTitle('schedule') }}</span>
            </router-link>
            <router-link :to="`/admin/${$route.params.id}/activities/calendar`" class="submenu-item" active-class="active">
              <i class="fas fa-calendar"></i>
              <span>{{ getTranslatedTitle('calendar') }}</span>
            </router-link>
            <router-link :to="`/admin/${$route.params.id}/activities/create`" class="submenu-item" active-class="active">
              <i class="fas fa-plus-circle"></i>
              <span>{{ getTranslatedTitle('createActivity') }}</span>
            </router-link>
          </div>

          <div class="nav-item" @click="toggleSubmenu('staff')">
            <i class="fas fa-user-tie"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('staffManagement') }}</span>
            <i class="fas fa-chevron-right" :class="{ 'rotated': activeSubmenu === 'staff' }"></i>
          </div>
          <div class="submenu" v-if="activeSubmenu === 'staff' && !isCollapsed">
            <router-link :to="`/admin/${$route.params.id}/staff/list`" class="submenu-item" active-class="active">
              <i class="fas fa-list"></i>
              <span>{{ getTranslatedTitle('staffList') }}</span>
            </router-link>
            <router-link :to="`/admin/${$route.params.id}/staff/schedule`" class="submenu-item" active-class="active">
              <i class="fas fa-calendar-alt"></i>
              <span>{{ getTranslatedTitle('staffSchedule') }}</span>
            </router-link>
            <router-link :to="`/admin/${$route.params.id}/staff/performance`" class="submenu-item" active-class="active">
              <i class="fas fa-chart-line"></i>
              <span>{{ getTranslatedTitle('staffPerformance') }}</span>
            </router-link>
          </div>
        </div>

        <div class="nav-section">
          <h2 v-if="!isCollapsed" class="section-title">{{ getTranslatedTitle('reports') }}</h2>
          <div class="nav-item" @click="toggleSubmenu('reports')">
            <i class="fas fa-chart-line"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('reportsAndStats') }}</span>
            <i class="fas fa-chevron-right" :class="{ 'rotated': activeSubmenu === 'reports' }"></i>
          </div>
          <div class="submenu" v-if="activeSubmenu === 'reports' && !isCollapsed">
            <div class="submenu-item" @click="toggleNestedSubmenu('daily')">
              <i class="fas fa-calendar-day"></i>
              <span>{{ getTranslatedTitle('daily') }}</span>
              <i class="fas fa-chevron-right"></i>
            </div>
            <div class="submenu daily-submenu" v-if="activeNestedSubmenu === 'daily'">
              <router-link :to="`/admin/${$route.params.id}/objectif`" class="submenu-item" active-class="active">
                <i class="fas fa-bullseye"></i>
                <span>{{ getTranslatedTitle('objectives') }}</span>
              </router-link>
              <router-link :to="`/admin/${$route.params.id}/rapport`" class="submenu-item" active-class="active">
                <i class="fas fa-file-alt"></i>
                <span>{{ getTranslatedTitle('reports') }}</span>
              </router-link>
            </div>
            <router-link :to="`/admin/${$route.params.id}/Weekly`" class="submenu-item" active-class="active">
              <i class="fas fa-calendar-week"></i>
              <span>{{ getTranslatedTitle('weekly') }}</span>
            </router-link>
            <router-link :to="`/admin/${$route.params.id}/monthly`" class="submenu-item" active-class="active">
              <i class="fas fa-calendar-alt"></i>
              <span>{{ getTranslatedTitle('monthly') }}</span>
            </router-link>
          </div>
        </div>

        <div class="nav-section">
          <h2 v-if="!isCollapsed" class="section-title">{{ getTranslatedTitle('settings') }}</h2>
          <div class="nav-item" @click="toggleSubmenu('settings')">
            <i class="fas fa-cog"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('systemSettings') }}</span>
            <i class="fas fa-chevron-right" :class="{ 'rotated': activeSubmenu === 'settings' }"></i>
          </div>
          <div class="submenu" v-if="activeSubmenu === 'settings' && !isCollapsed">
            <router-link :to="`/admin/${$route.params.id}/settings/general`" class="submenu-item" active-class="active">
              <i class="fas fa-sliders-h"></i>
              <span>{{ getTranslatedTitle('generalSettings') }}</span>
            </router-link>
            <router-link :to="`/admin/${$route.params.id}/settings/security`" class="submenu-item" active-class="active">
              <i class="fas fa-shield-alt"></i>
              <span>{{ getTranslatedTitle('securitySettings') }}</span>
            </router-link>
            <router-link :to="`/admin/${$route.params.id}/settings/backup`" class="submenu-item" active-class="active">
              <i class="fas fa-database"></i>
              <span>{{ getTranslatedTitle('backupSettings') }}</span>
            </router-link>
          </div>
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
        <router-view></router-view>
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
      activeSubmenu: null,
      activeNestedSubmenu: null,
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
        en: {
          adminPanel: 'Admin Panel',
          mainMenu: 'Main Menu',
          dashboard: 'Dashboard',
          userManagement: 'User Management',
          childrenManagement: 'Children Management',
          listOfChildren: 'List of Children',
          presence: 'Presence',
          absence: 'Absence',
          inscription: 'Registration',
          activities: 'Activities',
          activityManagement: 'Activity Management',
          staffManagement: 'Staff Management',
          attendance: 'Attendance',
          reportsAndStats: 'Reports & Statistics',
          daily: 'Daily',
          objectives: 'Objectives',
          reports: 'Reports',
          weekly: 'Weekly',
          monthly: 'Monthly',
          finance: 'Finance',
          financeManagement: 'Finance Management',
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
          newActivityScheduledDesc: 'A new activity has been scheduled',
          hebdomadaire: 'Weekly',
          userList: 'User List',
          roleManagement: 'Role Management',
          permissions: 'Permissions',
          groups: 'Groups',
          staffList: 'Staff List',
          staffSchedule: 'Staff Schedule',
          staffPerformance: 'Staff Performance',
          generalSettings: 'General Settings',
          securitySettings: 'Security Settings',
          backupSettings: 'Backup Settings',
          schedule: 'Schedule',
          calendar: 'Calendar',
          createActivity: 'Create Activity',
        },
        fr: {
          adminPanel: 'Panneau Administrateur',
          mainMenu: 'Menu Principal',
          dashboard: 'Tableau de Bord',
          userManagement: 'Gestion des Utilisateurs',
          childrenManagement: 'Gestion des Enfants',
          listOfChildren: 'Liste des Enfants',
          presence: 'Présence',
          absence: 'Absence',
          inscription: 'Inscription',
          activities: 'Activités',
          activityManagement: 'Gestion des Activités',
          staffManagement: 'Gestion du Personnel',
          attendance: 'Présence',
          reportsAndStats: 'Rapports & Statistiques',
          daily: 'Journalier',
          objectives: 'Objectifs',
          reports: 'Rapports',
          weekly: 'Hebdomadaire',
          monthly: 'Mensuel',
          finance: 'Finances',
          financeManagement: 'Gestion Financière',
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
          newActivityScheduledDesc: 'Une nouvelle activité a été planifiée',
          hebdomadaire: 'Hebdomadaire',
          userList: 'Liste des Utilisateurs',
          roleManagement: 'Gestion des Rôles',
          permissions: 'Permissions',
          groups: 'Groupes',
          staffList: 'Liste du Personnel',
          staffSchedule: 'Emploi du Temps du Personnel',
          staffPerformance: 'Performance du Personnel',
          generalSettings: 'Paramètres Généraux',
          securitySettings: 'Paramètres de Sécurité',
          backupSettings: 'Paramètres de Sauvegarde',
          schedule: 'Emploi du Temps',
          calendar: 'Calendrier',
          createActivity: 'Créer une Activité',
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
    },
    toggleSubmenu(submenu) {
      if (this.activeSubmenu === submenu) {
        this.activeSubmenu = null;
        this.activeNestedSubmenu = null;
      } else {
        this.activeSubmenu = submenu;
      }
    },
    toggleNestedSubmenu(submenu) {
      if (this.activeNestedSubmenu === submenu) {
        this.activeNestedSubmenu = null;
      } else {
        this.activeNestedSubmenu = submenu;
      }
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
  background: #f5f7fa;
  transition: all 0.3s ease;
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
  width: 280px;
  background: white;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 1000;

  &.collapsed {
    width: 80px;
  }

  .sidebar-header {
    padding: 1.5rem;
    background: linear-gradient(135deg, #db2323 0%, #b31b1b 100%);
    color: white;
    display: flex;
    align-items: center;
    gap: 1rem;

    .logo {
      width: 40px;
      height: 40px;
      border-radius: 8px;
    }

    h1 {
      font-size: 1.4rem;
      margin: 0;
      white-space: nowrap;
    }
  }

  .sidebar-nav {
    flex: 1;
    padding: 1rem 0;
    overflow-y: auto;

    .nav-section {
      padding: 1rem 0;

      h2 {
        color: #666;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0 1.5rem;
        margin-bottom: 0.5rem;
      }
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.8rem 1.5rem;
      color: #333;
      text-decoration: none;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
      cursor: pointer;

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

      .fa-chevron-right {
        margin-left: auto;
        transition: transform 0.3s ease;
        
        &.rotated {
          transform: rotate(90deg);
        }
      }
    }
  }

  .sidebar-footer {
    padding: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    button {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.8rem;
      border: none;
      background: none;
      color: #666;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 0.5rem;

      &:hover {
        background: rgba(219, 35, 35, 0.05);
        color: #db2323;
      }

      i {
        font-size: 1.2rem;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
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

.menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #db2323 0%, #b31b1b 100%);
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  margin-right: 1rem;
  box-shadow: 0 4px 12px rgba(219, 35, 35, 0.2);
}

.menu-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(219, 35, 35, 0.3);
}

.menu-toggle i {
  font-size: 1.2rem;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
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
      color: white;
      padding: 1rem;
      background: linear-gradient(135deg, #db2323 0%, #b31b1b 100%);
      border-radius: 1rem;
      box-shadow: 0 4px 12px rgba(219, 35, 35, 0.2);
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
      color: #4035dc;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

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
    color: white;
    padding: 0.8rem;
    background: linear-gradient(135deg, #db2323 0%, #b31b1b 100%);
    border-radius: 0.8rem;
    box-shadow: 0 4px 12px rgba(219, 35, 35, 0.2);
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
    background: #1a1a1a;
  }

  .main-content {
    background: #0f172a;
  }

  .sidebar {
    background: #2d2d2d;
    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.3);

    .nav-item {
      color: #e2e8f0;

      &:hover {
        background: rgba(219, 35, 35, 0.1);
      }

      &.active {
        background: rgba(219, 35, 35, 0.15);
      }
    }

    .sidebar-footer {
      border-color: rgba(255, 255, 255, 0.1);

      button {
        color: #e2e8f0;

        &:hover {
          background: rgba(219, 35, 35, 0.1);
        }
      }
    }
  }

  .submenu {
    background: rgba(255, 255, 255, 0.05);

    .submenu-item {
      color: #94a3b8;

      &:hover {
        background: rgba(219, 35, 35, 0.1);
        color: #db2323;
      }

      &.active {
        background: rgba(219, 35, 35, 0.15);
        color: #db2323;
      }
    }
  }

  .daily-submenu {
    background: rgba(255, 255, 255, 0.03);
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

.nav-submenu {
  .nav-item {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem 1.5rem;
    color: #333;
    transition: all 0.3s ease;
    border-left: 3px solid transparent;

    &:hover {
      background: rgba(219, 35, 35, 0.05);
      color: #db2323;
    }

    i.fa-chevron-down {
      font-size: 0.8rem;
      transition: transform 0.3s ease;
    }

    &.active i.fa-chevron-down {
      transform: rotate(180deg);
    }
  }

  .submenu {
    background: rgba(0, 0, 0, 0.02);
    padding: 0.5rem 0;

    .submenu-item {
      display: flex;
      align-items: center;
      padding: 0.6rem 1.5rem 0.6rem 3.5rem;
      color: #333;
      text-decoration: none;
      transition: all 0.3s ease;
      font-size: 0.9rem;

      &:hover {
        background: rgba(219, 35, 35, 0.05);
        color: #db2323;
      }

      &.active {
        background: rgba(219, 35, 35, 0.1);
        color: #db2323;
      }

      i {
        font-size: 1rem;
        margin-right: 0.8rem;
        width: 20px;
        text-align: center;
      }
    }

    .daily-submenu {
      background: rgba(0, 0, 0, 0.03);
      padding: 0.5rem 0;

      .submenu-item {
        padding-left: 4.5rem;
      }
    }
  }
}

// Dark theme adjustments
:deep(.dark) {
  .nav-submenu {
    .submenu {
      background: rgba(255, 255, 255, 0.05);

      .daily-submenu {
        background: rgba(255, 255, 255, 0.03);
      }
    }
  }
}

.submenu {
  background: rgba(0, 0, 0, 0.02);
  overflow: hidden;
  transition: all 0.3s ease;
  margin-left: 1rem;
  border-left: 1px solid rgba(0, 0, 0, 0.1);

  .submenu-item {
    display: flex;
    align-items: center;
    padding: 0.8rem 1rem;
    color: #666;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    border-left: 3px solid transparent;
    font-size: 0.9rem;

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
      font-size: 1rem;
      margin-right: 0.8rem;
      width: 20px;
      text-align: center;
    }

    .fa-chevron-right {
      margin-left: auto;
      font-size: 0.8rem;
      transition: transform 0.3s ease;
    }
  }
}

.daily-submenu {
  background: rgba(0, 0, 0, 0.02);
  margin-left: 1rem;
  border-left: 1px solid rgba(0, 0, 0, 0.1);

  .submenu-item {
    padding-left: 2rem;
    font-size: 0.85rem;
  }
}

/* Dark theme */
:deep(.dark) {
  .submenu {
    background: rgba(255, 255, 255, 0.05);
    border-left-color: rgba(255, 255, 255, 0.1);

    .submenu-item {
      color: #94a3b8;

      &:hover {
        background: rgba(219, 35, 35, 0.1);
        color: #db2323;
      }

      &.active {
        background: rgba(219, 35, 35, 0.15);
        color: #db2323;
      }
    }
  }

  .daily-submenu {
    background: rgba(255, 255, 255, 0.03);
    border-left-color: rgba(255, 255, 255, 0.1);
  }
}

/* Animation pour les sous-menus */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  opacity: 1;
}

.submenu-enter-from,
.submenu-leave-to {
  max-height: 0;
  opacity: 0;
  padding: 0;
}

/* Ajustement pour le mode collapsed */
.sidebar.collapsed {
  .submenu {
    position: absolute;
    left: 80px;
    top: 0;
    width: 200px;
    background: white;
    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
    border-left: none;
    border-radius: 0 4px 4px 0;
    margin-left: 0;

    .submenu-item {
      padding: 0.8rem 1rem;
    }
  }

  .daily-submenu {
    left: 200px;
    width: 180px;
  }
}

:deep(.dark) .sidebar.collapsed {
  .submenu {
    background: #2d2d2d;
    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.3);
  }
}
</style> 
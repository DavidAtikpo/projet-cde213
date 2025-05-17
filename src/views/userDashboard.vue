<!-- UserDashboard.vue -->
<template>
  <div class="dashboard-wrapper" :class="theme">
    <!-- Sidebar -->
    <div class="sidebar" :class="{ 'collapsed': isCollapsed }">
      <div class="sidebar-header">
        <!-- <img src="/logo.png" alt="Logo" class="logo" @error="handleLogoError"> -->
        <h1 v-if="!isCollapsed">{{ getTranslatedTitle('dashboard') }}</h1>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/user/dashboard" class="nav-item" active-class="active">
          <i class="fas fa-home"></i>
          <span v-if="!isCollapsed">{{ getTranslatedTitle('dashboard') }}</span>
        </router-link>

        <div class="nav-section">
          <h2 v-if="!isCollapsed">{{ getTranslatedTitle('children') }}</h2>
          <div class="nav-item" @click="toggleSubmenu('children')">
            <i class="fas fa-child"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('childrenManagement') }}</span>
            <i class="fas fa-chevron-right" :class="{ 'rotated': activeSubmenu === 'children' }"></i>
          </div>
          <div class="submenu" v-if="activeSubmenu === 'children' && !isCollapsed">
            <router-link :to="`/user/${$route.params.id}/children/list`" class="submenu-item" active-class="active">
              <i class="fas fa-list"></i>
              <span>{{ getTranslatedTitle('childrenList') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/Registration`" class="submenu-item" active-class="active">
              <i class="fas fa-user-plus"></i>
              <span>{{ getTranslatedTitle('registration') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/children/groups`" class="submenu-item" active-class="active">
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
            <router-link :to="`/user/${$route.params.id}/attendance/present`" class="submenu-item" active-class="active">
              <i class="fas fa-check-circle"></i>
              <span>{{ getTranslatedTitle('present') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/attendance/absent`" class="submenu-item" active-class="active">
              <i class="fas fa-times-circle"></i>
              <span>{{ getTranslatedTitle('absent') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/attendance/history`" class="submenu-item" active-class="active">
              <i class="fas fa-history"></i>
              <span>{{ getTranslatedTitle('attendanceHistory') }}</span>
            </router-link>
          </div>
        </div>

        <div class="nav-section">
          <h2 v-if="!isCollapsed">{{ getTranslatedTitle('activities') }}</h2>
          <div class="nav-item" @click="toggleSubmenu('activities')">
            <i class="fas fa-calendar-alt"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('activitiesAndEvents') }}</span>
            <i class="fas fa-chevron-right" :class="{ 'rotated': activeSubmenu === 'activities' }"></i>
          </div>
          <div class="submenu" v-if="activeSubmenu === 'activities' && !isCollapsed">
            <router-link :to="`/user/${$route.params.id}/activities/schedule`" class="submenu-item" active-class="active">
              <i class="fas fa-clock"></i>
              <span>{{ getTranslatedTitle('schedule') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/activities/calendar`" class="submenu-item" active-class="active">
              <i class="fas fa-calendar"></i>
              <span>{{ getTranslatedTitle('calendar') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/activities/create`" class="submenu-item" active-class="active">
              <i class="fas fa-plus-circle"></i>
              <span>{{ getTranslatedTitle('createActivity') }}</span>
            </router-link>
          </div>

          <div class="nav-item" @click="toggleSubmenu('communication')">
            <i class="fas fa-comments"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('communication') }}</span>
            <i class="fas fa-chevron-right" :class="{ 'rotated': activeSubmenu === 'communication' }"></i>
          </div>
          <div class="submenu" v-if="activeSubmenu === 'communication' && !isCollapsed">
            <router-link :to="`/user/${$route.params.id}/communication/messages`" class="submenu-item" active-class="active">
              <i class="fas fa-envelope"></i>
              <span>{{ getTranslatedTitle('messages') }}</span>
              <span class="badge" v-if="unreadMessages">{{ unreadMessages }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/communication/announcements`" class="submenu-item" active-class="active">
              <i class="fas fa-bullhorn"></i>
              <span>{{ getTranslatedTitle('announcements') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/communication/parents`" class="submenu-item" active-class="active">
              <i class="fas fa-user-friends"></i>
              <span>{{ getTranslatedTitle('parentCommunication') }}</span>
            </router-link>
          </div>

          <div class="nav-item" @click="toggleSubmenu('settings')">
            <i class="fas fa-cog"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('settings') }}</span>
            <i class="fas fa-chevron-right" :class="{ 'rotated': activeSubmenu === 'settings' }"></i>
          </div>
          <div class="submenu" v-if="activeSubmenu === 'settings' && !isCollapsed">
            <router-link :to="`/user/${$route.params.id}/settings/profile`" class="submenu-item" active-class="active">
              <i class="fas fa-user-cog"></i>
              <span>{{ getTranslatedTitle('profileSettings') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/settings/preferences`" class="submenu-item" active-class="active">
              <i class="fas fa-sliders-h"></i>
              <span>{{ getTranslatedTitle('preferences') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/settings/notifications`" class="submenu-item" active-class="active">
              <i class="fas fa-bell"></i>
              <span>{{ getTranslatedTitle('notificationSettings') }}</span>
            </router-link>
          </div>
        </div>

        <div class="nav-section">
          <h2 v-if="!isCollapsed">{{ getTranslatedTitle('reports') }}</h2>
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
              <router-link :to="`/user/${$route.params.id}/objectif`" class="submenu-item" active-class="active">
                <i class="fas fa-bullseye"></i>
                <span>{{ getTranslatedTitle('objectives') }}</span>
              </router-link>
              <router-link :to="`/user/${$route.params.id}/rapport`" class="submenu-item" active-class="active">
                <i class="fas fa-file-alt"></i>
                <span>{{ getTranslatedTitle('reports') }}</span>
              </router-link>
              <div class="submenu-item" @click="toggleNestedSubmenu('hebdomadaire')">
                <i class="fas fa-calendar-week"></i>
                <span>{{ getTranslatedTitle('hebdomadaire') }}</span>
                <i class="fas fa-chevron-right"></i>
              </div>
              <div class="submenu hebdomadaire-submenu" v-if="activeNestedSubmenu === 'hebdomadaire'">
                <router-link :to="`/user/${$route.params.id}/hebdomadaire/objectifs`" class="submenu-item" active-class="active">
                  <i class="fas fa-bullseye"></i>
                  <span>{{ getTranslatedTitle('objectives') }}</span>
                </router-link>
                <router-link :to="`/user/${$route.params.id}/hebdomadaire/rapports`" class="submenu-item" active-class="active">
                  <i class="fas fa-file-alt"></i>
                  <span>{{ getTranslatedTitle('reports') }}</span>
                </router-link>
              </div>
            </div>
            <router-link :to="`/user/${$route.params.id}/Weekly`" class="submenu-item" active-class="active">
              <i class="fas fa-calendar-week"></i>
              <span>{{ getTranslatedTitle('weekly') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/monthly`" class="submenu-item" active-class="active">
              <i class="fas fa-calendar-alt"></i>
              <span>{{ getTranslatedTitle('monthly') }}</span>
            </router-link>
          </div>
        </div>

        <div class="nav-section">
          <h2 v-if="!isCollapsed">{{ getTranslatedTitle('resources') }}</h2>
          <div class="nav-item" @click="toggleSubmenu('resources')">
            <i class="fas fa-book"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('resources') }}</span>
            <i class="fas fa-chevron-right" :class="{ 'rotated': activeSubmenu === 'resources' }"></i>
          </div>
          <div class="submenu" v-if="activeSubmenu === 'resources' && !isCollapsed">
            <router-link :to="`/user/${$route.params.id}/resources/materials`" class="submenu-item" active-class="active">
              <i class="fas fa-pencil-ruler"></i>
              <span>{{ getTranslatedTitle('materials') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/resources/lessons`" class="submenu-item" active-class="active">
              <i class="fas fa-chalkboard-teacher"></i>
              <span>{{ getTranslatedTitle('lessons') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/resources/library`" class="submenu-item" active-class="active">
              <i class="fas fa-book-open"></i>
              <span>{{ getTranslatedTitle('library') }}</span>
            </router-link>
          </div>

          <div class="nav-item" @click="toggleSubmenu('health')">
            <i class="fas fa-heartbeat"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('health') }}</span>
            <i class="fas fa-chevron-right" :class="{ 'rotated': activeSubmenu === 'health' }"></i>
          </div>
          <div class="submenu" v-if="activeSubmenu === 'health' && !isCollapsed">
            <router-link :to="`/user/${$route.params.id}/health/records`" class="submenu-item" active-class="active">
              <i class="fas fa-notes-medical"></i>
              <span>{{ getTranslatedTitle('healthRecords') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/health/medications`" class="submenu-item" active-class="active">
              <i class="fas fa-pills"></i>
              <span>{{ getTranslatedTitle('medications') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/health/allergies`" class="submenu-item" active-class="active">
              <i class="fas fa-allergies"></i>
              <span>{{ getTranslatedTitle('allergies') }}</span>
            </router-link>
          </div>

          <div class="nav-item" @click="toggleSubmenu('finance')">
            <i class="fas fa-money-bill-wave"></i>
            <span v-if="!isCollapsed">{{ getTranslatedTitle('finance') }}</span>
            <i class="fas fa-chevron-right" :class="{ 'rotated': activeSubmenu === 'finance' }"></i>
          </div>
          <div class="submenu" v-if="activeSubmenu === 'finance' && !isCollapsed">
            <router-link :to="`/user/${$route.params.id}/finance/payments`" class="submenu-item" active-class="active">
              <i class="fas fa-credit-card"></i>
              <span>{{ getTranslatedTitle('payments') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/finance/invoices`" class="submenu-item" active-class="active">
              <i class="fas fa-file-invoice-dollar"></i>
              <span>{{ getTranslatedTitle('invoices') }}</span>
            </router-link>
            <router-link :to="`/user/${$route.params.id}/finance/reports`" class="submenu-item" active-class="active">
              <i class="fas fa-chart-pie"></i>
              <span>{{ getTranslatedTitle('financialReports') }}</span>
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
  name: 'UserDashboard',
  data() {
    return {
      isCollapsed: false,
      searchQuery: '',
      showNotifications: false,
      showUserMenu: false,
      unreadNotifications: 3,
      unreadMessages: 5,
      userName: 'John Doe',
      userRole: 'Educateur',
      userAvatar: 'https://via.placeholder.com/40',
      totalChildren: 25,
      presentToday: 22,
      attendanceRate: 88,
      activitiesToday: 5,
      nextActivityTime: '14:30',
      notifications: [
        {
          id: 1,
          icon: 'fas fa-child',
          message: 'Nouvelle inscription d\'enfant',
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
          icon: 'fas fa-user-plus',
          message: 'Nouveau membre du personnel',
          time: 'Il y a 2 heures',
          read: false
        }
      ],
      recentActivities: [
        {
          id: 1,
          icon: 'fas fa-child',
          title: 'Nouvelle inscription',
          description: 'Marie a été inscrite dans le groupe A',
          time: 'Il y a 5 minutes'
        },
        {
          id: 2,
          icon: 'fas fa-calendar-check',
          title: 'Activité terminée',
          description: 'L\'activité "Peinture" a été complétée',
          time: 'Il y a 1 heure'
        },
        {
          id: 3,
          icon: 'fas fa-user-plus',
          title: 'Nouveau membre',
          description: 'Sophie a rejoint l\'équipe',
          time: 'Il y a 2 heures'
        }
      ],
      activeSubmenu: null,
      activeNestedSubmenu: null,
    };
  },
  computed: {
    ...mapState(['theme', 'language']),
    themeIcon() {
      return this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    },
    currentLanguage() {
      return this.language === 'fr' ? 'FR' : 'EN';
    },
    currentDate() {
      return new Date().toLocaleDateString(this.language, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    translatedTitles() {
      return {
        en: {
          dashboard: 'Dashboard',
          welcomeBack: 'Welcome back',
          children: 'Children',
          childrenManagement: 'Children Management',
          childrenManagementDesc: 'Individual data and global monitoring of children',
          attendance: 'Attendance',
          activities: 'Activities',
          activitiesAndEvents: 'Activities & Events',
          activitiesAndEventsDesc: 'Activity programming and monitoring',
          planningAndTracking: 'Planning & Tracking',
          planningAndTrackingDesc: 'Daily and weekly objectives and reports',
          reports: 'Reports',
          dailyReports: 'Daily Reports',
          weeklyReports: 'Weekly Reports',
          reportsAndStats: 'Reports & Statistics',
          reportsAndStatsDesc: 'View and analyze performance data',
          totalChildren: 'Total Children',
          presentToday: 'Present Today',
          attendanceRate: 'Attendance Rate',
          activitiesToday: 'Activities Today',
          nextActivity: 'Next Activity',
          thisWeek: 'this week',
          recentActivity: 'Recent Activity',
          notifications: 'Notifications',
          markAllAsRead: 'Mark all as read',
          profile: 'Profile',
          settings: 'Settings',
          logout: 'Logout',
          toggleTheme: 'Toggle Theme',
          searchPlaceholder: 'Search...',
          daily: 'Daily',
          objectives: 'Objectives',
          hebdomadaire: 'Weekly',
          monthly: 'Monthly',
          childrenList: 'Children List',
          registration: 'Registration',
          groups: 'Groups',
          present: 'Present',
          absent: 'Absent',
          attendanceHistory: 'Attendance History',
          schedule: 'Schedule',
          calendar: 'Calendar',
          createActivity: 'Create Activity',
          communication: 'Communication',
          messages: 'Messages',
          announcements: 'Announcements',
          parentCommunication: 'Parent Communication',
          profileSettings: 'Profile Settings',
          preferences: 'Preferences',
          notificationSettings: 'Notification Settings',
          resources: 'Resources',
          materials: 'Materials',
          lessons: 'Lessons',
          library: 'Library',
          health: 'Health',
          healthRecords: 'Health Records',
          medications: 'Medications',
          allergies: 'Allergies',
          finance: 'Finance',
          payments: 'Payments',
          invoices: 'Invoices',
          financialReports: 'Financial Reports',
        },
        fr: {
          dashboard: 'Tableau de Bord',
          welcomeBack: 'Bon retour',
          children: 'Enfants',
          childrenManagement: 'Gestion des Enfants',
          childrenManagementDesc: 'Données individuelles et suivi global des enfants',
          attendance: 'Présence',
          activities: 'Activités',
          activitiesAndEvents: 'Activités & Événements',
          activitiesAndEventsDesc: 'Programmation et suivi des activités',
          planningAndTracking: 'Planification & Suivi',
          planningAndTrackingDesc: 'Objectifs quotidiens et rapports',
          reports: 'Rapports',
          dailyReports: 'Rapports Journaliers',
          weeklyReports: 'Rapports Hebdomadaires',
          reportsAndStats: 'Rapports & Statistiques',
          reportsAndStatsDesc: 'Consulter et analyser les données de performance',
          totalChildren: 'Total Enfants',
          presentToday: 'Présents Aujourd\'hui',
          attendanceRate: 'Taux de Présence',
          activitiesToday: 'Activités Aujourd\'hui',
          nextActivity: 'Prochaine Activité',
          thisWeek: 'cette semaine',
          recentActivity: 'Activité Récente',
          notifications: 'Notifications',
          markAllAsRead: 'Tout marquer comme lu',
          profile: 'Profil',
          settings: 'Paramètres',
          logout: 'Déconnexion',
          toggleTheme: 'Changer le Thème',
          searchPlaceholder: 'Rechercher...',
          daily: 'Journalier',
          objectives: 'Objectifs',
          hebdomadaire: 'Hebdomadaire',
          monthly: 'Mensuel',
          childrenList: 'Liste des Enfants',
          registration: 'Inscription',
          groups: 'Groupes',
          present: 'Présents',
          absent: 'Absents',
          attendanceHistory: 'Historique des Présences',
          schedule: 'Emploi du Temps',
          calendar: 'Calendrier',
          createActivity: 'Créer une Activité',
          communication: 'Communication',
          messages: 'Messages',
          announcements: 'Annonces',
          parentCommunication: 'Communication Parents',
          profileSettings: 'Paramètres du Profil',
          preferences: 'Préférences',
          notificationSettings: 'Paramètres des Notifications',
          resources: 'Ressources',
          materials: 'Matériels',
          lessons: 'Leçons',
          library: 'Bibliothèque',
          health: 'Santé',
          healthRecords: 'Dossiers Médicaux',
          medications: 'Médicaments',
          allergies: 'Allergies',
          finance: 'Finance',
          payments: 'Paiements',
          invoices: 'Factures',
          financialReports: 'Rapports Financiers',
        }
      };
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
      this.logoUrl = 'https://via.placeholder.com/50?text=Logo';
    },
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
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
      const userId = localStorage.getItem('userId');
      this.$router.push(`/user/${userId}/${route}`);
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
    },
  }
};
</script>

<style lang="scss" scoped>
.dashboard-wrapper {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
  transition: all 0.3s ease;
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

.main-content {
  flex: 1;
  margin-left: 280px;
  transition: margin-left 0.3s ease;

  &.sidebar-collapsed {
    margin-left: 80px;
  }
}

.navbar {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 900;

  .navbar-left {
    display: flex;
    align-items: center;
    gap: 1rem;

    .menu-toggle {
      background: none;
      border: none;
      color: #666;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.5rem;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(219, 35, 35, 0.05);
        color: #db2323;
      }
    }

    .search-bar {
      background: #f5f7fa;
      border-radius: 8px;
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 300px;

      input {
        border: none;
        background: none;
        outline: none;
        width: 100%;
        color: #333;

        &::placeholder {
          color: #666;
        }
      }
    }
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;

    .notifications {
      position: relative;

      .icon-button {
        background: none;
        border: none;
        color: #666;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 0.5rem;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(219, 35, 35, 0.05);
          color: #db2323;
        }
      }

      .notification-badge {
        position: absolute;
        top: 0;
        right: 0;
        background: #db2323;
        color: white;
        font-size: 0.7rem;
        padding: 0.2rem 0.4rem;
        border-radius: 1rem;
        transform: translate(50%, -50%);
      }

      .notifications-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 300px;
        margin-top: 0.5rem;

        .notifications-header {
          padding: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;

          h3 {
            margin: 0;
            font-size: 1rem;
          }

          button {
            background: none;
            border: none;
            color: #db2323;
            cursor: pointer;
            font-size: 0.9rem;

            &:hover {
              text-decoration: underline;
            }
          }
        }

        .notifications-list {
          max-height: 300px;
          overflow-y: auto;

          .notification-item {
            padding: 1rem;
            display: flex;
            gap: 1rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;

            &:hover {
              background: #f5f7fa;
            }

            &.unread {
              background: rgba(219, 35, 35, 0.05);
            }

            i {
              font-size: 1.2rem;
              color: #db2323;
            }

            .notification-content {
              flex: 1;

              p {
                margin: 0 0 0.3rem;
                font-size: 0.9rem;
                color: #333;
              }

              .notification-time {
                font-size: 0.8rem;
                color: #666;
              }
            }
          }
        }
      }
    }

    .user-menu {
      position: relative;

      .user-button {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        background: none;
        border: none;
        padding: 0.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(219, 35, 35, 0.05);
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }

        .user-name {
          color: #333;
          font-size: 0.9rem;
        }
      }

      .user-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 250px;
        margin-top: 0.5rem;

        .user-info {
          padding: 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          gap: 1rem;
          align-items: center;

          .user-avatar-large {
            width: 48px;
            height: 48px;
            border-radius: 50%;
          }

          .user-details {
            h4 {
              margin: 0 0 0.3rem;
              font-size: 1rem;
              color: #333;
            }

            p {
              margin: 0;
              font-size: 0.9rem;
              color: #666;
            }
          }
        }

        .dropdown-menu {
          padding: 0.5rem;

          button {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            width: 100%;
            padding: 0.8rem;
            background: none;
            border: none;
            color: #333;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 0.5rem;

            &:hover {
              background: rgba(219, 35, 35, 0.05);
              color: #db2323;
            }

            i {
              font-size: 1.1rem;
              width: 24px;
              text-align: center;
            }
          }
        }
      }
    }
  }
}

.dashboard-content {
  padding: 2rem;

  .dashboard-header {
    margin-bottom: 2rem;

    h1 {
      font-size: 1.8rem;
      color: #333;
      margin: 0 0 0.5rem;
    }

    .date {
      color: #666;
      margin: 0;
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h3 {
      font-size: 1rem;
      color: #666;
      margin: 0;
    }

    i {
      font-size: 1.2rem;
      color: #db2323;
      padding: 0.8rem;
      background: rgba(219, 35, 35, 0.1);
      border-radius: 0.8rem;
    }
  }

  .stat-value {
    font-size: 2rem;
    color: #333;
    font-weight: 600;
    margin: 0 0 0.5rem;
  }

  .stat-change {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #666;

    &.positive {
      color: #28a745;
    }

    i {
      font-size: 0.8rem;
    }
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
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

  .card-icon {
    width: 50px;
    height: 50px;
    border-radius: 1rem;
    background: rgba(219, 35, 35, 0.1);
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
      color: #333;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      color: #666;
      line-height: 1.4;
    }
  }
}

.recent-activity {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.4rem;
    color: #333;
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
    background: #f5f7fa;
    transform: translateX(5px);
  }

  i {
    font-size: 1.2rem;
    color: #db2323;
    padding: 0.8rem;
    background: rgba(219, 35, 35, 0.1);
    border-radius: 0.8rem;
  }

  .activity-content {
    flex: 1;

    h4 {
      margin: 0 0 0.3rem;
      font-size: 1rem;
      color: #333;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      color: #666;
    }
  }

  .activity-time {
    font-size: 0.85rem;
    color: #666;
    white-space: nowrap;
  }
}

/* Dark theme */
:deep(.dark) {
  .dashboard-wrapper {
    background: #1a1a1a;
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

  .navbar {
    background: #2d2d2d;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

    .search-bar {
      background: #1a1a1a;

      input {
        color: #e2e8f0;

        &::placeholder {
          color: #94a3b8;
        }
      }
    }

    .icon-button {
      color: #e2e8f0;

      &:hover {
        background: rgba(219, 35, 35, 0.1);
      }
    }

    .user-button {
      .user-name {
        color: #e2e8f0;
      }
    }
  }

  .dashboard-content {
    .dashboard-header {
      h1 {
        color: #e2e8f0;
      }

      .date {
        color: #94a3b8;
      }
    }
  }

  .stat-card {
    background: #2d2d2d;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

    .stat-header {
      h3 {
        color: #94a3b8;
      }
    }

    .stat-value {
      color: #e2e8f0;
    }

    .stat-change {
      color: #94a3b8;
    }
  }

  .dashboard-card {
    background: #2d2d2d;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

    .card-content {
      h3 {
        color: #e2e8f0;
      }

      p {
        color: #94a3b8;
      }
    }
  }

  .recent-activity {
    background: #2d2d2d;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

    h2 {
      color: #e2e8f0;
    }
  }

  .activity-item {
    border-color: rgba(255, 255, 255, 0.1);

    &:hover {
      background: #1a1a1a;
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
  .sidebar {
    transform: translateX(-100%);

    &.collapsed {
      transform: translateX(0);
    }
  }

  .main-content {
    margin-left: 0;

    &.sidebar-collapsed {
      margin-left: 0;
    }
  }

  .navbar {
    .search-bar {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .activity-item {
    flex-direction: column;
    gap: 0.8rem;

    .activity-time {
      align-self: flex-start;
    }
  }
}

.submenu {
  padding-left: 2.5rem;
  background: rgba(0, 0, 0, 0.02);
  overflow: hidden;
  transition: all 0.3s ease;

  .submenu-item {
    display: flex;
    align-items: center;
    padding: 0.8rem 1rem;
    color: #666;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
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

.daily-submenu,
.hebdomadaire-submenu {
  padding-left: 1rem;
  background: rgba(0, 0, 0, 0.02);
}

:deep(.dark) {
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
}

.badge {
  background: #db2323;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 1rem;
  margin-left: auto;
}

.submenu-item {
  .badge {
    margin-left: auto;
    margin-right: 0.5rem;
  }
}
</style>

<!-- AdminDashSidebarComponent.vue -->
<template>
  <div class="sidebar" :class="{ 'collapsed': isCollapsed, [theme]: true }">
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
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AdminDashSidebarComponent',
  data() {
    return {
      isCollapsed: false,
      logoUrl: '/logo.png', // URL par défaut
      logoError: false
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
    translatedTitles() {
      return {
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
          toggleTheme: 'Changer le Thème'
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
          toggleTheme: 'Toggle Theme'
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
      this.logoError = true;
      this.logoUrl = 'https://via.placeholder.com/50?text=Logo';
    }
  },
  mounted() {
    // Récupérer l'état du sidebar depuis le localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      this.isCollapsed = JSON.parse(savedState);
    }
  },
  watch: {
    isCollapsed(newValue) {
      // Sauvegarder l'état du sidebar dans le localStorage
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newValue));
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);

  &.collapsed {
    width: 80px;
    transform: translateX(0);

    .logo {
      width: 40px;
      height: 40px;
    }
  }
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: #fafafa;

  .logo-container {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    .logo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: all 0.3s ease;
    }
  }

  .sidebar-title {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    color: #2c3e50;
    white-space: nowrap;
    letter-spacing: 0.5px;
  }
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 0;
  scrollbar-width: thin;
  scrollbar-color: #2c3e50 #fafafa;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #fafafa;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #2c3e50;
    border-radius: 2px;
  }
}

.nav-section {
  margin-bottom: 2rem;

  .section-title {
    padding: 0 1.5rem;
    margin: 0 0 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1.5rem;
  color: #2c3e50;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border-radius: 0.5rem;
  margin: 0 0.5rem;
  font-weight: 500;

  i {
    font-size: 1.2rem;
    width: 1.5rem;
    text-align: center;
    transition: transform 0.3s ease;
  }

  span {
    font-size: 0.95rem;
    white-space: nowrap;
  }

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
    transform: translateX(5px);

    i {
      transform: scale(1.1);
    }
  }

  &.active {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #0f172a;
      border-radius: 3px 0 0 3px;
    }

    i {
      transform: scale(1.1);
    }
  }
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  background: #fafafa;
}

.theme-toggle,
.language-toggle {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.8rem;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  text-align: left;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  i {
    font-size: 1.2rem;
    width: 1.5rem;
    text-align: center;
    transition: transform 0.3s ease;
  }

  span {
    font-size: 0.95rem;
  }

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
    border-color: #0f172a;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    i {
      transform: scale(1.1);
    }
  }
}

/* Dark theme */
:deep(.dark) {
  .sidebar {
    background: #0f172a;
    border-right-color: rgba(255, 255, 255, 0.08);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  }

  .sidebar-header {
    background: #1e293b;
    border-bottom-color: rgba(255, 255, 255, 0.08);

    .logo-container {
      background: #0f172a;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .sidebar-title {
      color: #e2e8f0;
    }
  }

  .sidebar-nav {
    scrollbar-color: #64748b #1e293b;

    &::-webkit-scrollbar-track {
      background: #1e293b;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #64748b;
    }
  }

  .nav-section .section-title {
    color: #94a3b8;
  }

  .nav-item {
    color: #e2e8f0;

    &:hover {
      background: #1e293b;
      color: #fff;
    }

    &.active {
      background: #1e293b;
      color: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

      &::before {
        background: #fff;
      }
    }
  }

  .sidebar-footer {
    background: #1e293b;
    border-top-color: rgba(255, 255, 255, 0.08);
  }

  .theme-toggle,
  .language-toggle {
    background: #0f172a;
    border-color: rgba(255, 255, 255, 0.08);
    color: #e2e8f0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
      background: #1e293b;
      color: #fff;
      border-color: #fff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sidebar {
    transform: translateX(-100%);
    width: 260px;

    &.collapsed {
      transform: translateX(0);
      width: 260px;
    }
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    max-width: 300px;

    &.collapsed {
      width: 100%;
    }
  }

  .nav-item {
    padding: 1rem 1.5rem;
  }
}
</style> 
<template>
  <div class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <div class="logo">
        <img src="@/assets/images/logo.jpeg" alt="CDE koinonia" />
      </div>
      <button class="toggle-button" @click="toggleSidebar">
        <i :class="['fas', isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <router-link 
        v-for="(item, index) in menuItems" 
        :key="index"
        :to="item.path"
        class="nav-item"
        :class="{ 'active': isActive(item.path) }"
      >
        <i :class="['fas', item.icon]"></i>
        <span class="nav-text">{{ item.title }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <img :src="userAvatar" alt="User Avatar" class="user-avatar" />
        <div class="user-details">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">{{ userRole }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      isCollapsed: false,
      menuItems: [
        { title: 'Tableau de bord', path: '/user/analytics', icon: 'fa-chart-line' },
        { title: 'Revue', path: '/user/review', icon: 'fa-clipboard-check' },
        { title: 'Feedback', path: '/user/feedback', icon: 'fa-comment-alt' },
        { title: 'Messages', path: '/user/Message', icon: 'fa-envelope' },
        { title: 'Statistiques', path: '/user/statistic', icon: 'fa-chart-bar' },
        { title: 'Paramètres', path: '/user/setting', icon: 'fa-cog' }
      ]
    };
  },
  computed: {
    ...mapState(['theme']),
    userAvatar() {
      return localStorage.getItem('userAvatar') || '@/assets/images/default-avatar.png';
    },
    userName() {
      return localStorage.getItem('user') || 'Utilisateur';
    },
    userRole() {
      return localStorage.getItem('userRole') || 'Membre';
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
    },
    isActive(path) {
      return this.$route.path === path;
    }
  }
};
</script>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 260px;
  background: linear-gradient(180deg, #db2323 0%, #ff4d4d 100%);
  color: white;
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);

  &.collapsed {
    width: 80px;

    .nav-text,
    .user-details,
    .toggle-button i {
      display: none;
    }

    .logo img {
      width: 40px;
    }

    .nav-item {
      padding: 1rem;
      justify-content: center;
    }

    .user-info {
      justify-content: center;
    }
  }
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  img {
    width: 120px;
    height: auto;
    transition: all 0.3s ease;
  }
}

.toggle-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  i {
    font-size: 1rem;
  }
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  margin: 0.5rem 0;
  border-radius: 0.5rem;
  margin: 0.5rem 1rem;

  i {
    font-size: 1.2rem;
    margin-right: 1rem;
    width: 20px;
    text-align: center;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background: rgba(255, 255, 255, 0.2);
    font-weight: 500;
  }
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.user-role {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* Dark theme */
:deep(.dark) {
  .sidebar {
    background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);

    &.collapsed {
      transform: translateX(0);
      width: 260px;
    }
  }

  .nav-text,
  .user-details,
  .toggle-button i {
    display: block !important;
  }

  .nav-item {
    padding: 1rem 1.5rem !important;
    justify-content: flex-start !important;
  }

  .user-info {
    justify-content: flex-start !important;
  }
}
</style>

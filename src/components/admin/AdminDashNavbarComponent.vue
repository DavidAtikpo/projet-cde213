<!-- AdminDashNavbarComponent.vue -->
<template>
  <div class="navbar" :class="theme">
    <div class="navbar-left">
      <button class="menu-toggle" @click="toggleSidebar">
        <i class="fas fa-bars"></i>
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
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AdminDashNavbarComponent',
  data() {
    return {
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
      userAvatar: 'https://via.placeholder.com/40'
    };
  },
  computed: {
    ...mapState(['theme', 'language']),
    translatedTitles() {
      return {
        fr: {
          searchPlaceholder: 'Rechercher...',
          notifications: 'Notifications',
          markAllAsRead: 'Tout marquer comme lu',
          profile: 'Profil',
          settings: 'Paramètres',
          logout: 'Déconnexion'
        },
        en: {
          searchPlaceholder: 'Search...',
          notifications: 'Notifications',
          markAllAsRead: 'Mark all as read',
          profile: 'Profile',
          settings: 'Settings',
          logout: 'Logout'
        }
      };
    }
  },
  methods: {
    getTranslatedTitle(key) {
      return this.translatedTitles[this.language]?.[key] || key;
    },
    toggleSidebar() {
      this.$store.commit('toggleSidebar');
    },
    handleSearch() {
      // Implémenter la recherche
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
      // Implémenter la déconnexion
      this.$store.dispatch('logout');
      this.$router.push('/login');
    }
  },
  mounted() {
    // Fermer les menus lors d'un clic à l'extérieur
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.notifications') && !e.target.closest('.user-menu')) {
        this.showNotifications = false;
        this.showUserMenu = false;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #2c3e50;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0.5rem;

  &:hover {
    color: #0f172a;
    background: #f1f5f9;
    transform: scale(1.1);
  }
}

.search-bar {
  display: flex;
  align-items: center;
  background: #fafafa;
  border-radius: 0.8rem;
  padding: 0.6rem 1rem;
  width: 300px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  &:focus-within {
    border-color: #0f172a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background: #fff;
  }

  i {
    color: #2c3e50;
    margin-right: 0.5rem;
    font-size: 1rem;
    transition: transform 0.3s ease;
  }

  input {
    border: none;
    background: none;
    outline: none;
    width: 100%;
    font-size: 0.95rem;
    color: #2c3e50;
    font-weight: 500;

    &::placeholder {
      color: #64748b;
      font-weight: 400;
    }
  }
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.notifications {
  position: relative;
}

.icon-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #2c3e50;
  cursor: pointer;
  padding: 0.5rem;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0.5rem;

  &:hover {
    color: #0f172a;
    background: #f1f5f9;
    transform: scale(1.1);
  }
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 1rem;
  min-width: 1.2rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 320px;
  margin-top: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transform-origin: top right;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: #fafafa;
  border-radius: 1rem 1rem 0 0;

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #2c3e50;
    font-weight: 600;
  }

  button {
    background: none;
    border: none;
    color: #ef4444;
    font-size: 0.85rem;
    cursor: pointer;
    font-weight: 500;
    padding: 0.4rem 0.8rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;

    &:hover {
      background: #f1f5f9;
    }
  }
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
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

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    background: #f1f5f9;
  }

  &.unread {
    background: #f1f5f9;
  }

  i {
    color: #ef4444;
    font-size: 1.2rem;
    margin-top: 0.2rem;
    transition: transform 0.3s ease;
  }

  &:hover i {
    transform: scale(1.1);
  }
}

.notification-content {
  flex: 1;

  p {
    margin: 0 0 0.3rem;
    font-size: 0.95rem;
    color: #2c3e50;
    font-weight: 500;
  }

  .notification-time {
    font-size: 0.85rem;
    color: #64748b;
  }
}

.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0.8rem;

  &:hover {
    background: #f1f5f9;
    transform: translateY(-2px);
  }
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #2c3e50;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-name {
  font-size: 0.95rem;
  color: #2c3e50;
  font-weight: 600;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 280px;
  margin-top: 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transform-origin: top right;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: #fafafa;
  border-radius: 1rem 1rem 0 0;
}

.user-avatar-large {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #2c3e50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-details {
  h4 {
    margin: 0 0 0.3rem;
    font-size: 1rem;
    color: #2c3e50;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: #64748b;
  }
}

.dropdown-menu {
  padding: 0.8rem;

  button {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    width: 100%;
    padding: 0.8rem 1rem;
    background: none;
    border: none;
    text-align: left;
    font-size: 0.95rem;
    color: #2c3e50;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
    border-radius: 0.8rem;

    i {
      width: 1.2rem;
      color: #2c3e50;
      transition: transform 0.3s ease;
    }

    &:hover {
      background: #f1f5f9;
      color: #0f172a;
      transform: translateX(5px);

      i {
        color: #0f172a;
        transform: scale(1.1);
      }
    }
  }
}

/* Dark theme */
:deep(.dark) {
  .navbar {
    background: #0f172a;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-bottom-color: rgba(255, 255, 255, 0.08);
  }

  .menu-toggle {
    color: #e2e8f0;

    &:hover {
      background: #1e293b;
      color: #fff;
    }
  }

  .search-bar {
    background: #1e293b;
    border-color: rgba(255, 255, 255, 0.08);

    &:focus-within {
      border-color: #fff;
      background: #0f172a;
    }

    i {
      color: #e2e8f0;
    }

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
      background: #1e293b;
      color: #fff;
    }
  }

  .notifications-dropdown,
  .user-dropdown {
    background: #0f172a;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .notifications-header {
    background: #1e293b;
    border-bottom-color: rgba(255, 255, 255, 0.08);

    h3 {
      color: #e2e8f0;
    }

    button:hover {
      background: #0f172a;
    }
  }

  .notifications-list {
    scrollbar-color: #64748b #1e293b;

    &::-webkit-scrollbar-track {
      background: #1e293b;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #64748b;
    }
  }

  .notification-item {
    border-bottom-color: rgba(255, 255, 255, 0.08);

    &:hover {
      background: #1e293b;
    }

    &.unread {
      background: #1e293b;
    }
  }

  .notification-content {
    p {
      color: #e2e8f0;
    }
  }

  .user-button:hover {
    background: #1e293b;
  }

  .user-avatar {
    border-color: #e2e8f0;
  }

  .user-name {
    color: #e2e8f0;
  }

  .user-info {
    background: #1e293b;
    border-bottom-color: rgba(255, 255, 255, 0.08);
  }

  .user-avatar-large {
    border-color: #e2e8f0;
  }

  .user-details {
    h4 {
      color: #e2e8f0;
    }
  }

  .dropdown-menu button {
    color: #e2e8f0;

    i {
      color: #e2e8f0;
    }

    &:hover {
      background: #1e293b;
      color: #fff;

      i {
        color: #fff;
      }
    }
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .navbar {
    padding: 1rem;
  }

  .search-bar {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0.8rem;
  }

  .search-bar {
    width: 200px;
  }

  .user-name {
    display: none;
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
}
</style> 
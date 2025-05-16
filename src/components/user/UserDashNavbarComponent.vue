<template>
  <nav class="navbar" :class="theme">
    <div class="navbar-left">
      <div class="logo">
        <img src="@/assets/images/logo.jpeg" alt="Logo" @error="handleImageError" />
      </div>
      <div class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          :placeholder="getTranslatedTitle('search')"
          class="search-input"
          @input="handleSearch"
        />
        <div v-if="searchResults.length > 0" class="search-results">
          <div v-for="(result, index) in searchResults" 
               :key="index" 
               class="search-result-item"
               @click="handleResultClick(result)">
            <i class="fas fa-user"></i>
            <span>{{ result.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="navbar-right">
      <div class="nav-actions">
        <div class="notification-wrapper" @click="toggleNotificationDropdown">
          <i class="fas fa-bell"></i>
          <span v-if="notifications.length > 0" class="notification-badge">
            {{ notifications.length }}
          </span>
          <transition name="fade">
            <div v-if="isNotificationDropdownOpen" class="dropdown-menu notification-dropdown">
              <div class="dropdown-header">
                <h3>{{ getTranslatedTitle('notifications') }}</h3>
                <button @click="markAllAsRead" v-if="notifications.length > 0">
                  {{ getTranslatedTitle('markAllRead') }}
                </button>
              </div>
              <div class="dropdown-content">
                <div v-if="notifications.length === 0" class="empty-state">
                  <i class="fas fa-bell-slash"></i>
                  <p>{{ getTranslatedTitle('noNotifications') }}</p>
                </div>
                <div v-for="(notification, index) in notifications" 
                     :key="index"
                     class="notification-item"
                     :class="{ 'unread': !notification.read }"
                     @click="handleNotificationClick(notification)">
                  <div class="notification-icon">
                    <i class="fas" :class="getNotificationIcon(notification.type)"></i>
                  </div>
                  <div class="notification-content">
                    <p class="notification-text">{{ notification.message }}</p>
                    <span class="notification-time">{{ formatTime(notification.time) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div class="profile-wrapper" @click="toggleProfileDropdown">
          <img
            :src="profilePhotoURL || require('@/assets/images/default-avatar.png')"
            alt="Profile"
            class="profile-image"
            @error="handleImageError"
          />
          <div class="profile-info">
            <span class="profile-name">{{ userName }}</span>
            <span class="profile-role">{{ userRole }}</span>
          </div>
          <i class="fas fa-chevron-down"></i>
          <transition name="fade">
            <div v-if="isProfileDropdownOpen" class="dropdown-menu profile-dropdown">
              <router-link to="/user/userInfo" class="dropdown-item">
                <i class="fas fa-user"></i>
                <span>{{ getTranslatedTitle('editPhoto') }}</span>
              </router-link>
              <router-link to="/user/gererCount" class="dropdown-item">
                <i class="fas fa-cog"></i>
                <span>{{ getTranslatedTitle('manageAccount') }}</span>
              </router-link>
              <div class="dropdown-divider"></div>
              <router-link to="/user/logout" class="dropdown-item logout">
                <i class="fas fa-sign-out-alt"></i>
                <span>{{ getTranslatedTitle('logout') }}</span>
              </router-link>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </nav>
  <div>
    <div class="menu-toggle" @click="toggleMenu">
      <div class="hamburger" :class="{ 'active': isMenuOpen }"></div>
    </div>
    <div :class="['side-bar', { 'active': isMenuOpen }]">
      <div class="content">
        <div class="side-buttons">
          <router-link to="/user/analytics" class="nav-item" active-class="active">
            <i class="fas fa-chart-line"></i>
            <span>{{ getTranslatedTitle('board') }}</span>
          </router-link>
          <router-link to="/user/review" class="nav-item" active-class="active">
            <i class="fas fa-users"></i>
            <span>{{ getTranslatedTitle('users') }}</span>
          </router-link>
          <router-link to="/user/feedback" class="nav-item" active-class="active">
            <i class="fas fa-tasks"></i>
            <span>{{ getTranslatedTitle('activities') }}</span>
          </router-link>
          <router-link to="/user/message" class="nav-item" active-class="active">
            <i class="fas fa-envelope"></i>
            <span>{{ getTranslatedTitle('messages') }}</span>
          </router-link>
          <router-link to="/user/statistic" class="nav-item" active-class="active">
            <i class="fas fa-chart-bar"></i>
            <span>{{ getTranslatedTitle('statistics') }}</span>
          </router-link>
          <router-link to="/user/setting" class="nav-item" active-class="active">
            <i class="fas fa-cog"></i>
            <span>{{ getTranslatedTitle('settings') }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { notificationsMixin } from '@/mixins/notificationMixins';
import { mapState } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  name: 'UserDashNavbarComponent',
  mixins: [notificationsMixin],
  data() {
    return {
      isMenuOpen: false,
      searchQuery: '',
      searchResults: [],
      isNotificationDropdownOpen: false,
      isProfileDropdownOpen: false,
      profilePhotoURL: '',
      userName: localStorage.getItem('user') || 'Utilisateur',
      userRole: localStorage.getItem('userRole') || 'Membre',
      translatedTitles: {
        en: {
          search: 'Search...',
          notifications: 'Notifications',
          markAllRead: 'Mark all as read',
          noNotifications: 'No notifications',
          editPhoto: 'Edit Profile',
          manageAccount: 'Manage Account',
          logout: 'Logout',
          board: 'Board',
          users: 'Users',
          activities: 'Activities',
          messages: 'Messages',
          statistics: 'Statistics',
          settings: 'Settings'
        },
        fr: {
          search: 'Rechercher...',
          notifications: 'Notifications',
          markAllRead: 'Tout marquer comme lu',
          noNotifications: 'Aucune notification',
          editPhoto: 'Modifier le profil',
          manageAccount: 'Gérer le compte',
          logout: 'Déconnexion',
          board: 'Tableau',
          users: 'Utilisateurs',
          activities: 'Activités',
          messages: 'Messages',
          statistics: 'Statistiques',
          settings: 'Paramètres'
        }
      }
    };
  },
  computed: {
    ...mapState(['theme', 'language']),
    currentTranslations() {
      return this.translatedTitles[this.language] || this.translatedTitles.en;
    }
  },
  methods: {
    getTranslatedTitle(key) {
      return this.currentTranslations[key] || key;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleNotificationDropdown() {
      this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
      if (this.isNotificationDropdownOpen) {
        this.isProfileDropdownOpen = false;
      }
    },
    toggleProfileDropdown() {
      this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
      if (this.isProfileDropdownOpen) {
        this.isNotificationDropdownOpen = false;
      }
    },
    fetchProfilePicture() {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      axios.get(`${API_BASE_URL}/admin/getprofil`, { headers })
        .then(res => {
          this.profilePhotoURL = res.data.profilePhotoUrl;
        })
        .catch(error => {
          console.error('Error fetching profile picture:', error);
        });
    },
    handleSearch() {
      if (this.searchQuery.length > 2) {
        // Implémenter la logique de recherche
        this.searchResults = [];
      } else {
        this.searchResults = [];
      }
    },
    handleResultClick(result) {
      // Implémenter la logique de clic sur un résultat
      this.searchResults = [];
      this.searchQuery = '';
    },
    handleNotificationClick(notification) {
      // Marquer la notification comme lue
      if (!notification.read) {
        this.markAsRead(notification.id);
      }
      // Naviguer vers la page appropriée
      if (notification.link) {
        this.$router.push(notification.link);
      }
    },
    getNotificationIcon(type) {
      const icons = {
        message: 'fa-envelope',
        task: 'fa-tasks',
        alert: 'fa-exclamation-circle',
        success: 'fa-check-circle'
      };
      return icons[type] || 'fa-bell';
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      
      if (diff < 60000) return 'À l\'instant';
      if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
      if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`;
      return date.toLocaleDateString();
    },
    async logout() {
      try {
        await axios.post(`${API_BASE_URL}/user/logout`, {}, { withCredentials: true });
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        this.$router.push('/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    },
    confirmLogout() {
      if (confirm(this.getTranslatedTitle('confirmLogout'))) {
        this.logout();
      }
    },
    markAllAsRead() {
      // Implement mark all as read functionality
    },
    handleImageError(e) {
      e.target.src = 'https://via.placeholder.com/150x150?text=User';
    }
  },
  mounted() {
    this.fetchProfilePicture();
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.notification-wrapper')) {
        this.isNotificationDropdownOpen = false;
      }
      if (!e.target.closest('.profile-wrapper')) {
        this.isProfileDropdownOpen = false;
      }
    });
  },
  beforeMount() {
    document.removeEventListener('click', (e) => {
      if (!e.target.closest('.notification-wrapper')) {
        this.isNotificationDropdownOpen = false;
      }
      if (!e.target.closest('.profile-wrapper')) {
        this.isProfileDropdownOpen = false;
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
  padding: 0.5rem 1rem;
  background: white;
  transition: all 0.3s ease;
}

.navbar-left {
  flex: 1;
  max-width: 400px;
}

.logo {
  img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
}

.search-container {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 2rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #db2323;
    box-shadow: 0 0 0 2px rgba(219, 35, 35, 0.1);
  }
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  z-index: 1000;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  i {
    margin-right: 0.8rem;
    color: #666;
  }

  &:hover {
    background: #f8f9fa;
  }
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.notification-wrapper,
.profile-wrapper {
  position: relative;
  cursor: pointer;
}

.notification-wrapper {
  i {
    font-size: 1.2rem;
    color: #666;
    transition: all 0.3s ease;

    &:hover {
      color: #db2323;
    }
  }
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #db2323;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 1rem;
  min-width: 1.2rem;
  text-align: center;
}

.profile-wrapper {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem;
  border-radius: 2rem;
  transition: all 0.3s ease;

  &:hover {
    background: #f8f9fa;
  }
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #db2323;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-weight: 500;
  font-size: 0.9rem;
}

.profile-role {
  font-size: 0.8rem;
  color: #666;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 280px;
  margin-top: 0.5rem;
  z-index: 1000;
}

.notification-dropdown {
  right: -1rem;
}

.profile-dropdown {
  right: 0;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;

  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
  }

  button {
    background: none;
    border: none;
    color: #db2323;
    font-size: 0.8rem;
    cursor: pointer;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  }
}

.dropdown-content {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }

  &.unread {
    background: #f8f9fa;

    .notification-text {
      font-weight: 500;
    }
  }
}

.notification-icon {
  margin-right: 1rem;
  color: #db2323;
}

.notification-content {
  flex: 1;
}

.notification-text {
  margin: 0 0 0.3rem;
  font-size: 0.9rem;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.8rem;
  color: #666;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #666;

  i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #ddd;
  }

  p {
    margin: 0;
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: #333;
  text-decoration: none;
  transition: all 0.2s ease;

  i {
    margin-right: 0.8rem;
    width: 1rem;
    text-align: center;
  }

  &:hover {
    background: #f8f9fa;
  }

  &.logout {
    color: #dc3545;
  }
}

.dropdown-divider {
  height: 1px;
  background: #eee;
  margin: 0.5rem 0;
}

/* Dark theme */
:deep(.dark) {
  .navbar {
    background: #2d2d2d;
  }

  .search-input {
    background: #1a1a1a;
    border-color: #404040;
    color: #fff;

    &:focus {
      border-color: #db2323;
    }
  }

  .search-results,
  .dropdown-menu {
    background: #2d2d2d;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }

  .search-result-item,
  .notification-item,
  .dropdown-item {
    &:hover {
      background: #1a1a1a;
    }
  }

  .notification-item.unread {
    background: #1a1a1a;
  }

  .dropdown-header {
    border-bottom-color: #404040;
  }

  .dropdown-divider {
    background: #404040;
  }

  .profile-role,
  .notification-time {
    color: #999;
  }

  .empty-state {
    color: #999;

    i {
      color: #404040;
    }
  }
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar {
    padding: 0.5rem;
  }

  .navbar-left {
    max-width: 200px;
  }

  .profile-info {
    display: none;
  }

  .dropdown-menu {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    margin: 0;
    border-radius: 0;
  }
}

/* seconde nav bar */

.side-bar {
  margin-top: 20px;
  /* margin-left: 30px; */
  width: 100%;
  height: 4rem;
  background-color: #ccc;
}

.logo {
  margin-left: 10px;
  /* text-align: center; */
  /* margin-bottom: 20px; */
}

.logo-rr {
  width: 100px;
  height: auto;
}

.side-buttons {
  display: flex;
  /* flex-direction: column; */
}

.nav {
  padding: 20px;
  cursor: pointer;
  margin-left: 30px;
  color: rgb(12, 11, 11);
  font-size: 20px;

}

.default-link {
  text-decoration: none;
  color: inherit;
}

.active {
  font-weight: bold;
}
.content{
  text-align: justify;
}
@media screen and ( max-width: 768px){
  .nav {
    width: 2px;
    margin-bottom: 0px;
  margin: 5px;
  color: rgb(12, 11, 11);
  font-size: 10px;

}
.side-bar {

  /* margin-left: 30px; */
  width: 100%;
  height: 4rem;
  background-color: #ccc;
}

}

/* Menu Toggle Button */
.menu-toggle {
  display: none;
  cursor: pointer;
  padding: 1rem;
  z-index: 1000;
}

.hamburger {
  width: 24px;
  height: 2px;
  background-color: #333;
  position: relative;
  transition: all 0.3s ease;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background-color: #333;
    transition: all 0.3s ease;
  }

  &::before {
    top: -8px;
  }

  &::after {
    bottom: -8px;
  }

  &.active {
    background-color: transparent;

    &::before {
      transform: rotate(45deg);
      top: 0;
    }

    &::after {
      transform: rotate(-45deg);
      bottom: 0;
    }
  }
}

/* Sidebar */
.side-bar {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.content {
  padding: 1rem;
}

.side-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.2rem;
  color: #666;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  white-space: nowrap;

  i {
    font-size: 1.1rem;
    width: 20px;
    text-align: center;
  }

  &:hover {
    background-color: #f8f9fa;
    color: #db2323;
  }

  &.active {
    background-color: #db2323;
    color: white;

    i {
      color: white;
    }
  }
}

/* Dark theme */
:deep(.dark) {
  .side-bar {
    background: #2d2d2d;
  }

  .hamburger,
  .hamburger::before,
  .hamburger::after {
    background-color: #fff;
  }

  .nav-item {
    color: #999;

    &:hover {
      background-color: #1a1a1a;
      color: #db2323;
    }

    &.active {
      background-color: #db2323;
      color: white;
    }
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
    position: fixed;
    top: 1rem;
    right: 1rem;
  }

  .side-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 250px;
    transform: translateX(-100%);
    z-index: 999;
    background: white;
    padding-top: 4rem;

    &.active {
      transform: translateX(0);
    }
  }

  .side-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .nav-item {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>

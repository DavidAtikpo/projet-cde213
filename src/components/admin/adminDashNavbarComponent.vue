<template>
  <nav class="navigation">
    
    <button class="menu-btn" @click="toggleMenu">More</button>

   
    <ul :class="{ 'show-menu': isMenuOpen }">
      <li>
        <router-link to="/admin/analytics" class="nav-link" active-class="active">{{ getTranslatedTitle('dashboard') }}</router-link>
      </li>
      <li>
        <router-link to="/admin/suivi" class="nav-link" active-class="active">{{ getTranslatedTitle('goal') }}</router-link>
      </li>
      <li>
        <router-link to="/admin/rapport" class="nav-link" active-class="active">{{ getTranslatedTitle('report') }}</router-link>
      </li>
      <li>
        <router-link to="/admin/ActiviteHebdomadaire" class="nav-link" active-class="active">{{ getTranslatedTitle('weeklyGoal') }}</router-link>
      </li>
      <li>
        <router-link to="/admin/inscription" class="nav-link" active-class="active">{{ getTranslatedTitle('registration') }}</router-link>
      </li>
      <li>
        <router-link to="/admin/weekGoal" class="nav-link" active-class="active">{{ getTranslatedTitle('week') }}</router-link>
      </li>
      <li>
        <router-link to="/admin/listOfchildren" class="nav-link" active-class="active">{{ getTranslatedTitle('present') }}</router-link>
      </li>
      <li>
        <router-link to="/admin/Absent" class="nav-link" active-class="active">{{ getTranslatedTitle('absent') }}</router-link>
      </li>
    </ul>

    <div class="search">
      <input type="text" v-model="searchQuery" @input="search" placeholder="Search...">
      <ul v-if="searchResults.length > 0" class="dropdown">
        <li v-for="(result, index) in searchResults" :key="index" @click="displayResult(result)">{{ result }}</li>
      </ul>
      <p v-if="searchQuery.length > 0 && searchResults.length === 0" class="dropdown">No results found.</p>
    </div>

    <div class="icons">
      <div class="notification-wrapper" @click="toggleNotificationDropdown">
        <img src="@/assets/icons/new-message-icon.svg" alt="Notification" class="notification-icon">
        <span :class="{'notification-count': true, 'few-notifications': notifications.length <= 2}">
          {{ notifications.length }}
        </span>
      </div>
      <div v-if="isNotificationDropdownOpen" class="dropdown">
        <ul>
          <li v-if="notifications.length === 0">No notifications</li>
          <li v-for="(notification, index) in notifications" :key="index">{{ notification.user }},{{ notification.entry }}</li>
        </ul>
      </div>
      <div class="profile-dropdown-container">
    <img :src="profilePhotoURL" @click="toggleProfileDropdown" alt="Profile Icon" class="profile-icon">
    
    <div v-if="isProfileDropdownOpen" class="dropdown">
      <div class="profile-info">
        <div class="profile-photo">
          <img :src="profilePhotoURL" alt="Profile Photo" />
        </div>
        <div class="profile-details">
          <h4>{{ userName }}</h4>
          <p>{{ userEmail }}</p>
        </div>
      </div>
      <hr>
      <ul>
        <li>
          <router-link to="/admin/userInfo">{{ getTranslatedTitle('editPhoto') }}</router-link>
        </li>
        <li>
          <router-link to="/admin/gererCount">{{ getTranslatedTitle('manageAccount') }}</router-link>
        </li>
        <li>
          <router-link to="/admin/Parametre">{{ getTranslatedTitle('setting') }}</router-link>
        </li>
      </ul>
      <hr>
      <div @click="confirmLogout" class="logout-btn">{{ getTranslatedTitle('logout') }}</div>
    </div>
  </div>
    </div>
  </nav>
  <div>
    <div class="menu-toggle" @click="toggleMenu">
      <div class="hamburger"></div>
    </div>
    <div :class="['side-bar', { 'hide-menu': isMobile && !menuVisible }]">
      <div class="content">
       
        <div class="side-buttons">
          <router-link to="/admin/userActivity" active-class="active" exact-active-class="exact-active" class="default-link">
            <div class="nav">{{ getTranslatedTitle('board') }}</div>
          </router-link>
          <router-link to="/admin/Review" active-class="active" exact-active-class="exact-active" class="default-link">
            <div class="nav">{{ getTranslatedTitle('users') }}</div>
          </router-link>
          <router-link to="/admin/dailyObject" active-class="active" exact-active-class="exact-active" class="default-link">
            <div class="nav">{{ getTranslatedTitle('activities') }}</div>
          </router-link>
          <router-link to="/admin/report" active-class="active" exact-active-class="exact-active" class="default-link">
            <div class="nav">{{ getTranslatedTitle('report') }}</div>
          </router-link>
          <router-link to="/admin/statistic" active-class="active" exact-active-class="exact-active" class="default-link">
            <div class="nav">{{ getTranslatedTitle('statistics') }}</div>
          </router-link>
          <router-link to="/admin/message" active-class="active" exact-active-class="exact-active" class="default-link">
            <div class="nav">{{ getTranslatedTitle('messages') }}</div>
          </router-link>
          <router-link to="/admin/setting" active-class="active" exact-active-class="exact-active" class="default-link">
            <div class="nav">{{ getTranslatedTitle('settings') }}</div>
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
  mixins: [notificationsMixin],
  data() {
    return {
      isMenuOpen: false,
      searchQuery: '',
      searchResults: [],
      isNotificationDropdownOpen: false,
      isProfileDropdownOpen: false,
      profilePhotoURL: ''
    };
  },
  computed: {
    ...mapState(['theme', 'language']),
    translatedTitles() {
      return {
        en: {
          dashboard: 'Dashboard',
          goal: 'Goal',
          report: 'Report',
          weeklyGoal: 'Weekly Goal',
          registration: 'Registration',
          week: 'Week',
          present: 'Present',
          absent: 'Absent',
          board: 'Board',
          users: 'Users',
          activities: 'Activities',
          statistics: 'Statistics',
          messages: 'Messages',
          settings: 'Settings',
          editPhoto:'Edit Photo',
          manageAccount: 'Manage Account',
          setting:'Settings',
          logout:'Logout'
        },
        fr: {
          dashboard: 'Accueil',
          goal: 'Objectif',
          report: 'Rapport',
          weeklyGoal: 'Objectifs Heb',
          registration: 'Inscription',
          week: 'Semaine',
          present: 'Presents',
          absent: 'Absents',
          board:'Tableau',
          users: 'Utilisateurs',
          activities: 'Activites',
          statistics: 'Statistique',
          messages: 'Message',
          settings: 'Paramètre',
          editPhoto:'Modifier Photo',
          manageAccount:'Gestion de compte',
          setting:'Parametre',
          logout:'Deconnexion'
        }
      };
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleNotificationDropdown() {
      this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
    },
    toggleProfileDropdown() {
      this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    },
    fetchProfilePicture() {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      axios.get(`${API_BASE_URL}/admin/getprofil`, { headers })
        .then(res => {
          this.profilePhotoURL = res.data.profilePhotoUrl; // Assuming the response contains the profile photo URL
          console.log('profilePicture', this.profilePhotoURL);
        })
        .catch(error => {
          console.error('Error fetching profile picture:', error);
        });
    },
    search() {
      this.searchResults = [];
      if (this.searchQuery.length === 0) {
        return;
      }
      axios.get(`${API_BASE_URL}/search?q=` + this.searchQuery)
        .then(response => {
          this.searchResults = response.data;
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
        });
    },
    displayResult(result) {
      console.log('Selected result info:', result);
    },
    async logout() {
  try {
    const token = localStorage.getItem('token');
    await axios.post(`${API_BASE_URL}/user/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
    });
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    this.$router.push('/login');
  } catch (error) {
    console.error('Error during logout:', error);
  }
},

    confirmLogout() {
      if (confirm('Are you sure you want to log out?')) {
        this.logout();
      }
    },
    handleClickOutside(event) {
      const notificationWrapper = this.$refs.notificationWrapper;
      const profileIcon = this.$refs.profileIcon;
      const clickedOutsideNotification = notificationWrapper && !notificationWrapper.contains(event.target);
      const clickedOutsideProfile = profileIcon && !profileIcon.contains(event.target);

      if (clickedOutsideNotification && this.isNotificationDropdownOpen) {
        this.isNotificationDropdownOpen = false;
      }
      if (clickedOutsideProfile && this.isProfileDropdownOpen) {
        this.isProfileDropdownOpen = false;
      }
    },
    getTranslatedTitle(key) {
      return this.translatedTitles[this.language][key];
    },
    shouldReceiveNotification(notification) {
      return notification.role != 'Coordinateur';
    }
  },
  mounted() {
    this.fetchProfilePicture();
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeMount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
 
};
</script>


<style scoped>
/* Votre style ici */
.navigation {
  background-color:#1d1c1c;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icons {
  display: flex;
  align-items: center;
}

.notification-icon {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.notification-wrapper {
  position: relative;
}

.notification-count {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: grey;
  color: white;
  border-radius: 50%;
  padding: 5px;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}

.few-notifications {
  background-color: red;
}



.menu-btn {
  display: none; /* Masquer le bouton "Plus" par défaut */
  margin-left: 55%;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  display: inline;
  margin-right: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
}

.active {
  font-weight: bold;
}

/* Afficher la liste des éléments de navigation lorsque le bouton "Plus" est cliqué */


/* Media query pour afficher le bouton "Plus" lorsque l'écran est réduit */
@media (max-width: 600px) {
  .menu-btn {
    display: block;
    margin-left: 0px;
  }
  .show-menu {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50px;
    background-color: yellowgreen;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    height: 15%;
    text-align: center;
  }
  ul {
    display: none;
  }
  .search {
    width: 80px;
  }
}

.search {
  max-width: 500px;
  margin: auto;
}

input[type="text"] {
  width: 100%;
  padding: 1px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}


.dropdownCDE {
  position: absolute;
  top: 50px;
  right: 55%;
  background-color: #f9f9f9;
  width: 10%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1;
  text-align: center;
}
.dropdownAC {
  position: absolute;
  top: 50px;
  right: 61%;
  background-color: #f9f9f9;
  width: 10%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1;
  text-align: center;
}
@media screen and (max-width: 768px) {
  .dropdownCDE li {
    display: block;
  }
  .navigation {
    width: 93.2%;
  }
  .dropdownAC {
    display: block;
    margin-left: 2px;
  }
}


.dropdownCDE li {
  padding: 10px;
  cursor: pointer;
  display: flex;
}

.dropdownAC li {
  padding: 10px;
  cursor: pointer;
  display: flex;
}




.li {
  flex-direction: column;
} 

@media screen and (max-width: 768px) {
  .dropdown {
    display: block;
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
/* modification */
.profile-dropdown-container {
  position: relative;
  display: inline-block;
}

.profile-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}

.dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  width: 250px;
  background-color: #2b2b2b;
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.profile-info {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #1a1a1a;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.profile-photo img {
  /* position: absolute; */
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: 80px;
}

.profile-details h4 {
  margin: 0;
  font-size: 16px;
}

.profile-details p {
  margin: 0;
  font-size: 12px;
  color: #aaa;
}

.dropdown ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.dropdown ul li {
  padding: 10px 15px;
  cursor: pointer;
}

.dropdown ul li:hover {
  background-color: #333;
}

.logout-btn {
  text-align: center;
  padding: 15px;
  background-color: #ff4c4c;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #e23b3b;
}

</style>

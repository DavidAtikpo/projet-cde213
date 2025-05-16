<!-- ProfileView.vue -->
<template>
  <div class="profile-container">
    <h1>{{ getTranslatedTitle('profile') }}</h1>
    <div class="profile-content">
      <div class="profile-header">
        <div class="profile-avatar">
          <img :src="profilePhotoURL || require('@/assets/images/default-avatar.png')" alt="Profile" @error="handleImageError" />
        </div>
        <div class="profile-info">
          <h2>{{ userName }}</h2>
          <p class="user-role">{{ userRole }}</p>
        </div>
      </div>

      <div class="profile-details">
        <div class="detail-group">
          <label>{{ getTranslatedTitle('email') }}</label>
          <p>{{ userEmail }}</p>
        </div>
        <div class="detail-group">
          <label>{{ getTranslatedTitle('phone') }}</label>
          <p>{{ userPhone || getTranslatedTitle('notProvided') }}</p>
        </div>
        <div class="detail-group">
          <label>{{ getTranslatedTitle('location') }}</label>
          <p>{{ userLocation || getTranslatedTitle('notProvided') }}</p>
        </div>
      </div>

      <div class="profile-actions">
        <button class="action-button" @click="editProfile">
          <i class="fas fa-edit"></i>
          {{ getTranslatedTitle('editProfile') }}
        </button>
        <button class="action-button" @click="changePassword">
          <i class="fas fa-key"></i>
          {{ getTranslatedTitle('changePassword') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ProfileView',
  data() {
    return {
      profilePhotoURL: null,
      userName: localStorage.getItem('user') || '',
      userEmail: '',
      userPhone: '',
      userLocation: '',
      userRole: localStorage.getItem('userRole') || ''
    };
  },
  computed: {
    ...mapState(['language']),
    translatedTitles() {
      return {
        en: {
          profile: 'Profile',
          email: 'Email',
          phone: 'Phone',
          location: 'Location',
          notProvided: 'Not provided',
          editProfile: 'Edit Profile',
          changePassword: 'Change Password'
        },
        fr: {
          profile: 'Profil',
          email: 'Email',
          phone: 'Téléphone',
          location: 'Localisation',
          notProvided: 'Non renseigné',
          editProfile: 'Modifier le Profil',
          changePassword: 'Changer le Mot de Passe'
        }
      };
    }
  },
  methods: {
    getTranslatedTitle(key) {
      return this.translatedTitles[this.language]?.[key] || key;
    },
    handleImageError(e) {
      e.target.src = require('@/assets/images/default-avatar.png');
    },
    editProfile() {
      // Implémenter la modification du profil
    },
    changePassword() {
      // Implémenter le changement de mot de passe
    }
  }
};
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 20px;
}

.profile-content {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #db2323;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.profile-info {
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }

  .user-role {
    margin: 5px 0 0;
    color: #666;
    font-size: 0.9rem;
  }
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.detail-group {
  label {
    display: block;
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  p {
    margin: 0;
    color: #333;
    font-size: 1rem;
  }
}

.profile-actions {
  display: flex;
  gap: 15px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: #f8f9fa;
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  i {
    font-size: 1rem;
  }

  &:hover {
    background: #e9ecef;
    color: #db2323;
  }
}

/* Dark theme */
:deep(.dark) {
  .profile-content {
    background: #2d2d2d;
  }

  .profile-info {
    h2 {
      color: #fff;
    }

    .user-role {
      color: #999;
    }
  }

  .detail-group {
    label {
      color: #999;
    }

    p {
      color: #fff;
    }
  }

  .action-button {
    background: #1a1a1a;
    color: #fff;

    &:hover {
      background: #333;
      color: #db2323;
    }
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .profile-container {
    padding: 15px;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }
}
</style> 
<template>
  <div class="page">
    <div class="header">
      <h2>Liste des utilisateurs</h2>
      <p>Effectif total: {{ users.length }}</p>
    </div>

    <div class="user-list">
      <div v-for="user in users" 
           :key="user._id" 
           class="user-item"
           :class="{ 'active': isDropdownOpen === user._id }">
        <!-- Main Content Row -->
        <div class="main-content-row">
          <!-- Profile Section -->
          <div class="profile-section">
            <div class="profile-avatar" :style="{ backgroundColor: getAvatarColor(user.firstName) }">
              <span class="avatar-initials">
                {{ user.firstName ? user.firstName.charAt(0).toUpperCase() : '?' }}
              </span>
            </div>
            <div class="profile-info" @click="toggleDropdown(user._id)">
              <h3>{{ user.firstName }} {{ user.lastName }}</h3>
              <div class="info-row">
                <span class="info-item">
                  <i class="fas fa-user-tag"></i>
                  {{ user.role }}
                </span>
                <span class="info-item user-status">
                  <i class="fas fa-user"></i>
                  Utilisateur actif
                </span>
              </div>
            </div>
          </div>

          <!-- Action Section -->
          <div class="action-section">
            <button class="action-button" @click="toggleDropdown(user._id)">
              <i class="fas" :class="isDropdownOpen === user._id ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
              {{ isDropdownOpen === user._id ? 'Masquer' : 'Détails' }}
            </button>
          </div>
        </div>

        <!-- Dropdown Content -->
        <div v-if="isDropdownOpen === user._id" class="dropdown">
          <div class="user-details">
            <div class="detail-group">
              <h4>Informations personnelles</h4>
              <p><strong>Nom complet:</strong> {{ user.firstName }} {{ user.lastName }}</p>
              <p><strong>Rôle:</strong> {{ user.role }}</p>
            </div>

            <div class="detail-group">
              <h4>Objectif du jour</h4>
              <p class="objective-text">{{ user.dailyObjective || 'Aucun objectif défini' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import {API_BASE_URL}  from '@/config.js';

export default {
  data() {
    return {
      users: [], // Liste pour stocker les données de tous les utilisateurs
      isDropdownOpen: null, // Variable pour stocker l'id de l'utilisateur dont la dropdown est ouverte
      imageErrors: {} // Pour tracker les erreurs d'images
    };
  },
  methods: {
    toggleDropdown(userId) {
      // Pour ouvrir/fermer la dropdown pour un utilisateur spécifique
      this.isDropdownOpen = this.isDropdownOpen === userId ? null : userId;
    },
    handleImageError(userId) {
      // Marquer cette image comme en erreur
      this.$set(this.imageErrors, userId, true);
    },
    getInitials(firstName, lastName) {
      // Récupérer les initiales
      const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
      const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
      return firstInitial + lastInitial;
    },
    getAvatarColor(name) {
      // Générer une couleur basée sur le nom
      const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
        '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
        '#54A0FF', '#2E86AB', '#A23B72', '#F18F01', '#C73E1D'
      ];
      
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    },
    fetchDataFromBackend() {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      axios.get(`${API_BASE_URL}/admin/allusers`, { headers })
      .then(res => {
      // Update the profilePhotoURL for each user
      this.users = res.data.map(user => ({
        ...user,
        profilePhotoURL: `${API_BASE_URL}` + user.profilePhotoURL
      }));
    })
        .catch(error => {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        });
    }
  },
  mounted() {
    // Appel à la méthode pour récupérer les données de tous les utilisateurs depuis le backend au moment du montage du composant
    this.fetchDataFromBackend();
  }
};
</script>

<style scoped>
.page {
  padding: 1.2rem;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.header h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.3rem;
  font-weight: 600;
}

.header p {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

.user-list {
  display: grid;
  gap: 0.8rem;
}

.user-item {
  background-color: #fff;
  border-radius: 0.6rem;
  padding: 0.8rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid #db2323;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.user-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(219, 35, 35, 0.12);
  border-left-width: 6px;
}

.user-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #db2323, #b31b1b);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.user-item:hover::before {
  opacity: 1;
}

.main-content-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 1;
}

.profile-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  border: 2px solid #f1f5f9;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(219, 35, 35, 0.2);
  position: relative;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-initials {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.user-item:hover .profile-avatar {
  border-color: #db2323;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(219, 35, 35, 0.3);
}

.profile-info {
  flex: 1;
  cursor: pointer;
  min-width: 0;
}

.profile-info h3 {
  margin: 0 0 0.3rem 0;
  font-size: 0.95rem;
  color: #1a202c;
  font-weight: 600;
  transition: color 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-info:hover h3 {
  color: #db2323;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #718096;
  white-space: nowrap;
}

.info-item i {
  font-size: 0.75rem;
  color: #db2323;
  width: 12px;
  text-align: center;
}

.info-item.user-status {
  color: #db2323;
  font-weight: 600;
  background: rgba(219, 35, 35, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  border: 1px solid rgba(219, 35, 35, 0.2);
}

.action-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-button {
  background: rgba(219, 35, 35, 0.1);
  border: 1px solid rgba(219, 35, 35, 0.2);
  color: #db2323;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  border-radius: 0.3rem;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
}

.action-button:hover {
  background: #db2323;
  color: white;
  transform: translateY(-1px);
}

.dropdown {
  margin-top: 0.8rem;
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  background: rgba(248, 249, 250, 0.5);
  border-radius: 0 0 0.6rem 0.6rem;
}

.user-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.detail-group {
  background: white;
  padding: 0.8rem;
  border-radius: 0.4rem;
  border-left: 3px solid #db2323;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.detail-group h4 {
  color: #db2323;
  margin-bottom: 0.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.detail-group h4::before {
  content: '';
  width: 6px;
  height: 6px;
  background: #db2323;
  border-radius: 50%;
}

.detail-group p {
  margin: 0.4rem 0;
  color: #4a5568;
  font-size: 0.85rem;
  line-height: 1.4;
}

.detail-group p strong {
  color: #2d3748;
  font-weight: 600;
}

.objective-text {
  background: #f3f4f6;
  padding: 0.75rem;
  border-radius: 10px;
  border-left: 4px solid #667eea;
  font-style: italic;
  color: #374151;
  margin: 0.5rem 0 0 0 !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page {
    padding: 0.8rem;
  }

  .header h2 {
    font-size: 1.3rem;
  }

  .user-item {
    padding: 0.6rem;
  }

  .main-content-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .profile-section {
    width: 100%;
    gap: 0.6rem;
  }

  .profile-avatar {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .profile-info h3 {
    font-size: 0.9rem;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }

  .info-item {
    font-size: 0.75rem;
  }

  .action-section {
    width: 100%;
    justify-content: center;
  }

  .action-button {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }

  .user-details {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .detail-group {
    padding: 0.6rem;
  }
}
</style>
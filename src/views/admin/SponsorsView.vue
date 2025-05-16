<!-- SponsorsView.vue -->
<template>
  <div class="sponsors-container">
    <h1>{{ getTranslatedTitle('sponsors') }}</h1>
    <div class="sponsors-content">
      <div class="sponsors-header">
        <div class="search-bar">
          <input 
            type="text" 
            :placeholder="getTranslatedTitle('searchSponsors')"
            v-model="searchQuery"
            @input="handleSearch"
          />
          <i class="fas fa-search"></i>
        </div>
        <button class="add-button" @click="showAddSponsorModal">
          <i class="fas fa-plus"></i>
          {{ getTranslatedTitle('addSponsor') }}
        </button>
      </div>

      <div class="sponsors-table">
        <table>
          <thead>
            <tr>
              <th>{{ getTranslatedTitle('name') }}</th>
              <th>{{ getTranslatedTitle('email') }}</th>
              <th>{{ getTranslatedTitle('phone') }}</th>
              <th>{{ getTranslatedTitle('sponsoredChildren') }}</th>
              <th>{{ getTranslatedTitle('status') }}</th>
              <th>{{ getTranslatedTitle('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="sponsors.length === 0">
              <td colspan="6" class="no-data">
                {{ getTranslatedTitle('noSponsors') }}
              </td>
            </tr>
            <tr v-for="sponsor in sponsors" :key="sponsor._id">
              <td>
                <div class="sponsor-info">
                  <img :src="sponsor.photo || require('@/assets/images/default-avatar.png')" :alt="sponsor.name" @error="handleImageError" />
                  <span>{{ sponsor.name }}</span>
                </div>
              </td>
              <td>{{ sponsor.email }}</td>
              <td>{{ sponsor.phone || getTranslatedTitle('notProvided') }}</td>
              <td>
                <span class="children-count">{{ sponsor.sponsoredChildren?.length || 0 }}</span>
              </td>
              <td>
                <span :class="['status-badge', sponsor.status]">
                  {{ getTranslatedTitle(sponsor.status) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-button view" @click="viewSponsor(sponsor)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="action-button edit" @click="editSponsor(sponsor)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="action-button delete" @click="deleteSponsor(sponsor)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SponsorsView',
  data() {
    return {
      searchQuery: '',
      sponsors: []
    };
  },
  computed: {
    ...mapState(['language']),
    translatedTitles() {
      return {
        en: {
          sponsors: 'Sponsors Management',
          searchSponsors: 'Search sponsors...',
          addSponsor: 'Add Sponsor',
          name: 'Name',
          email: 'Email',
          phone: 'Phone',
          sponsoredChildren: 'Sponsored Children',
          status: 'Status',
          actions: 'Actions',
          noSponsors: 'No sponsors found',
          notProvided: 'Not provided',
          active: 'Active',
          inactive: 'Inactive',
          pending: 'Pending'
        },
        fr: {
          sponsors: 'Gestion des Parrains',
          searchSponsors: 'Rechercher des parrains...',
          addSponsor: 'Ajouter un Parrain',
          name: 'Nom',
          email: 'Email',
          phone: 'Téléphone',
          sponsoredChildren: 'Enfants Parrainés',
          status: 'Statut',
          actions: 'Actions',
          noSponsors: 'Aucun parrain trouvé',
          notProvided: 'Non renseigné',
          active: 'Actif',
          inactive: 'Inactif',
          pending: 'En attente'
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
    handleSearch() {
      // Implémenter la recherche
    },
    showAddSponsorModal() {
      // Implémenter l'ajout de parrain
    },
    viewSponsor(sponsor) {
      // Implémenter la vue détaillée du parrain
    },
    editSponsor(sponsor) {
      // Implémenter la modification du parrain
    },
    deleteSponsor(sponsor) {
      // Implémenter la suppression du parrain
    }
  }
};
</script>

<style lang="scss" scoped>
.sponsors-container {
  padding: 20px;
}

.sponsors-content {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
}

.sponsors-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  position: relative;
  width: 300px;

  input {
    width: 100%;
    padding: 10px 35px 10px 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: #db2323;
    }
  }

  i {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
}

.add-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #db2323;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #b31b1b;
  }
}

.sponsors-table {
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    font-weight: 600;
    color: #333;
    background: #f8f9fa;
  }

  td {
    color: #666;
  }
}

.sponsor-info {
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
}

.children-count {
  display: inline-block;
  padding: 4px 8px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;

  &.active {
    background: #e8f5e9;
    color: #2e7d32;
  }

  &.inactive {
    background: #f5f5f5;
    color: #757575;
  }

  &.pending {
    background: #fff3e0;
    color: #f57c00;
  }
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &.view {
    background: #e3f2fd;
    color: #1976d2;

    &:hover {
      background: #bbdefb;
    }
  }

  &.edit {
    background: #e3f2fd;
    color: #1976d2;

    &:hover {
      background: #bbdefb;
    }
  }

  &.delete {
    background: #ffebee;
    color: #c62828;

    &:hover {
      background: #ffcdd2;
    }
  }
}

.no-data {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

/* Dark theme */
:deep(.dark) {
  .sponsors-content {
    background: #2d2d2d;
  }

  .search-bar {
    input {
      background: #1a1a1a;
      border-color: #333;
      color: #fff;

      &:focus {
        border-color: #db2323;
      }
    }

    i {
      color: #999;
    }
  }

  .sponsors-table {
    th {
      background: #1a1a1a;
      color: #fff;
    }

    td {
      color: #999;
      border-bottom-color: #333;
    }
  }

  .children-count {
    background: #0d47a1;
    color: #90caf9;
  }

  .status-badge {
    &.active {
      background: #1b5e20;
      color: #81c784;
    }

    &.inactive {
      background: #424242;
      color: #bdbdbd;
    }

    &.pending {
      background: #e65100;
      color: #ffb74d;
    }
  }

  .action-button {
    &.view, &.edit {
      background: #0d47a1;
      color: #90caf9;

      &:hover {
        background: #1565c0;
      }
    }

    &.delete {
      background: #b71c1c;
      color: #ef9a9a;

      &:hover {
        background: #c62828;
      }
    }
  }

  .no-data {
    color: #999;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .sponsors-container {
    padding: 15px;
  }

  .sponsors-header {
    flex-direction: column;
    gap: 15px;
  }

  .search-bar {
    width: 100%;
  }

  .add-button {
    width: 100%;
    justify-content: center;
  }
}
</style> 
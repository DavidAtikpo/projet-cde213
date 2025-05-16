<!-- ChildrenView.vue -->
<template>
  <div class="children-container">
    <h1>{{ getTranslatedTitle('children') }}</h1>
    <div class="children-content">
      <div class="children-header">
        <div class="search-bar">
          <input 
            type="text" 
            :placeholder="getTranslatedTitle('searchChildren')"
            v-model="searchQuery"
            @input="handleSearch"
          />
          <i class="fas fa-search"></i>
        </div>
        <button class="add-button" @click="showAddChildModal">
          <i class="fas fa-plus"></i>
          {{ getTranslatedTitle('addChild') }}
        </button>
      </div>

      <div class="children-grid">
        <div v-if="children.length === 0" class="no-data">
          {{ getTranslatedTitle('noChildren') }}
        </div>
        <div v-for="child in children" :key="child._id" class="child-card">
          <div class="child-header">
            <img :src="child.photo || require('@/assets/images/default-child.png')" :alt="child.name" @error="handleImageError" />
            <div class="child-info">
              <h3>{{ child.name }}</h3>
              <span class="child-id">ID: {{ child._id }}</span>
            </div>
          </div>
          <div class="child-details">
            <div class="detail-item">
              <i class="fas fa-birthday-cake"></i>
              <span>{{ child.age }} {{ getTranslatedTitle('years') }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ child.location }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-user"></i>
              <span>{{ child.sponsor || getTranslatedTitle('noSponsor') }}</span>
            </div>
          </div>
          <div class="child-status">
            <span :class="['status-badge', child.status]">
              {{ getTranslatedTitle(child.status) }}
            </span>
          </div>
          <div class="child-actions">
            <button class="action-button edit" @click="editChild(child)">
              <i class="fas fa-edit"></i>
              {{ getTranslatedTitle('edit') }}
            </button>
            <button class="action-button delete" @click="deleteChild(child)">
              <i class="fas fa-trash"></i>
              {{ getTranslatedTitle('delete') }}
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
  name: 'ChildrenView',
  data() {
    return {
      searchQuery: '',
      children: []
    };
  },
  computed: {
    ...mapState(['language']),
    translatedTitles() {
      return {
        en: {
          children: 'Children Management',
          searchChildren: 'Search children...',
          addChild: 'Add Child',
          noChildren: 'No children found',
          years: 'years',
          noSponsor: 'No sponsor',
          edit: 'Edit',
          delete: 'Delete',
          active: 'Active',
          inactive: 'Inactive',
          sponsored: 'Sponsored',
          unsponsored: 'Unsponsored'
        },
        fr: {
          children: 'Gestion des Enfants',
          searchChildren: 'Rechercher des enfants...',
          addChild: 'Ajouter un Enfant',
          noChildren: 'Aucun enfant trouvé',
          years: 'ans',
          noSponsor: 'Pas de parrain',
          edit: 'Modifier',
          delete: 'Supprimer',
          active: 'Actif',
          inactive: 'Inactif',
          sponsored: 'Parrainé',
          unsponsored: 'Non parrainé'
        }
      };
    }
  },
  methods: {
    getTranslatedTitle(key) {
      return this.translatedTitles[this.language]?.[key] || key;
    },
    handleImageError(e) {
      e.target.src = require('@/assets/images/default-child.png');
    },
    handleSearch() {
      // Implémenter la recherche
    },
    showAddChildModal() {
      // Implémenter l'ajout d'enfant
    },
    editChild(child) {
      // Implémenter la modification d'enfant
    },
    deleteChild(child) {
      // Implémenter la suppression d'enfant
    }
  }
};
</script>

<style lang="scss" scoped>
.children-container {
  padding: 20px;
}

.children-content {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
}

.children-header {
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

.children-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.child-card {
  background: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
}

.child-header {
  position: relative;
  height: 150px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .child-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 15px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
    color: white;

    h3 {
      margin: 0;
      font-size: 1.2rem;
    }

    .child-id {
      font-size: 0.8rem;
      opacity: 0.8;
    }
  }
}

.child-details {
  padding: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  color: #666;
  font-size: 0.9rem;

  i {
    width: 20px;
    color: #db2323;
  }
}

.child-status {
  padding: 0 15px 15px;
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

  &.sponsored {
    background: #e3f2fd;
    color: #1976d2;
  }

  &.unsponsored {
    background: #fff3e0;
    color: #f57c00;
  }
}

.child-actions {
  display: flex;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid #eee;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

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
  grid-column: 1 / -1;
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px;
}

/* Dark theme */
:deep(.dark) {
  .children-content {
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

  .child-card {
    background: #1a1a1a;
  }

  .detail-item {
    color: #999;
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

    &.sponsored {
      background: #0d47a1;
      color: #90caf9;
    }

    &.unsponsored {
      background: #e65100;
      color: #ffb74d;
    }
  }

  .child-actions {
    border-top-color: #333;
  }

  .action-button {
    &.edit {
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
  .children-container {
    padding: 15px;
  }

  .children-header {
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

  .children-grid {
    grid-template-columns: 1fr;
  }
}
</style> 
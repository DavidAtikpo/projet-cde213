<!-- UsersView.vue -->
<template>
  <div class="users-container">
    <h1>{{ getTranslatedTitle('users') }}</h1>
    <div class="users-content">
      <div class="users-header">
        <div class="search-bar">
          <input 
            type="text" 
            :placeholder="getTranslatedTitle('searchUsers')"
            v-model="searchQuery"
            @input="handleSearch"
          />
          <i class="fas fa-search"></i>
        </div>
        <button class="add-button" @click="showAddUserModal">
          <i class="fas fa-plus"></i>
          {{ getTranslatedTitle('addUser') }}
        </button>
      </div>

      <div class="users-table">
        <table>
          <thead>
            <tr>
              <th>{{ getTranslatedTitle('name') }}</th>
              <th>{{ getTranslatedTitle('email') }}</th>
              <th>{{ getTranslatedTitle('role') }}</th>
              <th>{{ getTranslatedTitle('status') }}</th>
              <th>{{ getTranslatedTitle('actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="users.length === 0">
              <td colspan="5" class="no-data">
                {{ getTranslatedTitle('noUsers') }}
              </td>
            </tr>
            <tr v-for="user in users" :key="user._id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <span :class="['status-badge', user.status]">
                  {{ getTranslatedTitle(user.status) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-button edit" @click="editUser(user)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="action-button delete" @click="deleteUser(user)">
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
  name: 'UsersView',
  data() {
    return {
      searchQuery: '',
      users: []
    };
  },
  computed: {
    ...mapState(['language']),
    translatedTitles() {
      return {
        en: {
          users: 'Users Management',
          searchUsers: 'Search users...',
          addUser: 'Add User',
          name: 'Name',
          email: 'Email',
          role: 'Role',
          status: 'Status',
          actions: 'Actions',
          noUsers: 'No users found',
          active: 'Active',
          inactive: 'Inactive',
          suspended: 'Suspended'
        },
        fr: {
          users: 'Gestion des Utilisateurs',
          searchUsers: 'Rechercher des utilisateurs...',
          addUser: 'Ajouter un Utilisateur',
          name: 'Nom',
          email: 'Email',
          role: 'Rôle',
          status: 'Statut',
          actions: 'Actions',
          noUsers: 'Aucun utilisateur trouvé',
          active: 'Actif',
          inactive: 'Inactif',
          suspended: 'Suspendu'
        }
      };
    }
  },
  methods: {
    getTranslatedTitle(key) {
      return this.translatedTitles[this.language]?.[key] || key;
    },
    handleSearch() {
      // Implémenter la recherche
    },
    showAddUserModal() {
      // Implémenter l'ajout d'utilisateur
    },
    editUser(user) {
      // Implémenter la modification d'utilisateur
    },
    deleteUser(user) {
      // Implémenter la suppression d'utilisateur
    }
  }
};
</script>

<style lang="scss" scoped>
.users-container {
  padding: 20px;
}

.users-content {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
}

.users-header {
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

.users-table {
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

.status-badge {
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

  &.suspended {
    background: #ffebee;
    color: #c62828;
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
  .users-content {
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

  .users-table {
    th {
      background: #1a1a1a;
      color: #fff;
    }

    td {
      color: #999;
      border-bottom-color: #333;
    }
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

    &.suspended {
      background: #b71c1c;
      color: #ef9a9a;
    }
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
  .users-container {
    padding: 15px;
  }

  .users-header {
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
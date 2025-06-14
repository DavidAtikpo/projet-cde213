<template>
  <div class="monitor-registration">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <h1>
          <i class="fas fa-user-plus"></i>
          {{ getTranslatedTitle('monitorRegistration') }}
        </h1>
        <p class="header-description">{{ getTranslatedTitle('monitorRegistrationDesc') }}</p>
      </div>
    </div>

    <!-- Registration Form -->
    <div class="registration-card">
      <div class="card-header">
        <h2>
          <i class="fas fa-user-edit"></i>
          {{ form._id ? getTranslatedTitle('editMonitor') : getTranslatedTitle('addNewMonitor') }}
        </h2>
      </div>
      
      <div class="card-content">
        <form @submit.prevent="handleSubmit" class="registration-form">
        <div class="form-grid">
          <div class="form-group">
            <label>
              <i class="fas fa-user"></i>
              {{ getTranslatedTitle('firstName') }}
            </label>
            <input 
              v-model="form.firstName" 
              type="text" 
              :placeholder="getTranslatedTitle('firstNamePlaceholder')"
              required 
            />
          </div>
          
          <div class="form-group">
            <label>
              <i class="fas fa-user"></i>
              {{ getTranslatedTitle('lastName') }}
            </label>
            <input 
              v-model="form.lastName" 
              type="text" 
              :placeholder="getTranslatedTitle('lastNamePlaceholder')"
              required 
            />
          </div>
          
          <div class="form-group">
            <label>
              <i class="fas fa-envelope"></i>
              {{ getTranslatedTitle('email') }}
            </label>
            <input 
              v-model="form.email" 
              type="email" 
              :placeholder="getTranslatedTitle('emailPlaceholder')"
              required 
            />
          </div>
          
          <div class="form-group">
            <label>
              <i class="fas fa-phone"></i>
              {{ getTranslatedTitle('phone') }}
            </label>
            <input 
              v-model="form.phoneNumber" 
              type="text" 
              :placeholder="getTranslatedTitle('phonePlaceholder')"
              required 
            />
          </div>
        </div>
        
        <div class="form-actions">
          <button class="btn-primary" type="submit" :disabled="loading">
            <i class="fas" :class="form._id ? 'fa-save' : 'fa-plus'"></i>
            {{ form._id ? getTranslatedTitle('updateMonitor') : getTranslatedTitle('addMonitor') }}
          </button>
          <button 
            v-if="form._id" 
            class="btn-secondary" 
            type="button" 
            @click="resetForm"
          >
            <i class="fas fa-times"></i>
            {{ getTranslatedTitle('cancel') }}
          </button>
        </div>
      </form>
      </div>
    </div>

    <!-- Monitors List -->
    <div class="monitors-list-card">
      <div class="card-header">
        <h2>
          <i class="fas fa-users"></i>
          {{ getTranslatedTitle('monitorsList') }}
        </h2>
        <div class="header-stats">
          <span class="stat-badge">
            <i class="fas fa-user-check"></i>
            {{ monitors.length }} {{ getTranslatedTitle('monitors') }}
          </span>
        </div>
      </div>
      
      <div class="card-content">
        <div v-if="loading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          <span>{{ getTranslatedTitle('loading') }}</span>
        </div>
        
        <div v-else-if="monitors.length === 0" class="empty-state">
          <i class="fas fa-user-slash"></i>
          <h3>{{ getTranslatedTitle('noMonitors') }}</h3>
          <p>{{ getTranslatedTitle('noMonitorsDesc') }}</p>
        </div>
        
        <div v-else class="monitors-grid">
          <div 
            v-for="monitor in monitors" 
            :key="monitor._id" 
            class="monitor-card"
            :class="{ 'editing': form._id === monitor._id }"
          >
            <div class="monitor-header">
              <div class="monitor-avatar">
                {{ getInitials(monitor.firstName, monitor.lastName) }}
              </div>
              <div class="monitor-info">
                <h4>{{ monitor.firstName }} {{ monitor.lastName }}</h4>
                <span class="monitor-role">{{ getTranslatedTitle('monitor') }}</span>
              </div>
              <div class="monitor-actions">
                <button 
                  class="action-btn edit-btn" 
                  @click="editMonitor(monitor)"
                  :title="getTranslatedTitle('edit')"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  class="action-btn delete-btn" 
                  @click="deleteMonitor(monitor._id)"
                  :title="getTranslatedTitle('delete')"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            
            <div class="monitor-details">
              <div class="detail-item">
                <i class="fas fa-envelope"></i>
                <span>{{ monitor.email }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-phone"></i>
                <span>{{ monitor.phoneNumber }}</span>
              </div>
              <div class="detail-item password-item">
                <i class="fas fa-key"></i>
                <span class="password-display">
                  {{ showPasswords[monitor._id] ? monitor.password : '••••••••' }}
                </span>
                <button 
                  class="toggle-password-btn"
                  @click="togglePassword(monitor._id)"
                  :title="showPasswords[monitor._id] ? getTranslatedTitle('hidePassword') : getTranslatedTitle('showPassword')"
                >
                  <i class="fas" :class="showPasswords[monitor._id] ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Password Modal -->
    <div v-if="showPasswordModal" class="modal-overlay" @click="closePasswordModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="fas fa-check-circle"></i>
            {{ getTranslatedTitle('monitorCreated') }}
          </h3>
        </div>
        
        <div class="modal-body">
          <p class="success-message">{{ getTranslatedTitle('monitorCreatedDesc') }}</p>
          
          <div class="credentials-card">
            <h4>{{ getTranslatedTitle('loginCredentials') }}</h4>
            <div class="credential-item">
              <label>{{ getTranslatedTitle('email') }}:</label>
              <div class="credential-value">
                <span>{{ createdMonitor.email }}</span>
                <button class="copy-btn" @click="copyToClipboard(createdMonitor.email)">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
            <div class="credential-item">
              <label>{{ getTranslatedTitle('password') }}:</label>
              <div class="credential-value">
                <span class="password-text">{{ createdMonitor.password }}</span>
                <button class="copy-btn" @click="copyToClipboard(createdMonitor.password)">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="warning-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>{{ getTranslatedTitle('passwordWarning') }}</p>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn-primary" @click="closePasswordModal">
            <i class="fas fa-check"></i>
            {{ getTranslatedTitle('understood') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  name: 'MonitorRegistrationComponent',
  data() {
    return {
      form: {
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
      },
      monitors: [],
      loading: false,
      showPasswordModal: false,
      createdMonitor: null,
      showPasswords: {}
    };
  },
  methods: {
    getTranslatedTitle(key) {
      const translations = {
        monitorRegistration: 'Inscription des Moniteurs',
        monitorRegistrationDesc: 'Gérez les inscriptions et les informations des moniteurs',
        editMonitor: 'Modifier le Moniteur',
        addNewMonitor: 'Nouveau Moniteur',
        firstName: 'Prénom',
        lastName: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        firstNamePlaceholder: 'Entrez le prénom',
        lastNamePlaceholder: 'Entrez le nom',
        emailPlaceholder: 'exemple@email.com',
        phonePlaceholder: '+33 1 23 45 67 89',
        updateMonitor: 'Mettre à jour',
        addMonitor: 'Ajouter le moniteur',
        cancel: 'Annuler',
        monitorsList: 'Liste des Moniteurs',
        monitors: 'moniteurs',
        loading: 'Chargement...',
        noMonitors: 'Aucun moniteur inscrit',
        noMonitorsDesc: 'Commencez par ajouter votre premier moniteur',
        monitor: 'Moniteur',
        edit: 'Modifier',
        delete: 'Supprimer',
        showPassword: 'Afficher le mot de passe',
        hidePassword: 'Masquer le mot de passe',
        monitorCreated: 'Moniteur créé avec succès',
        monitorCreatedDesc: 'Le moniteur a été créé avec succès. Voici ses informations de connexion :',
        loginCredentials: 'Informations de connexion',
        password: 'Mot de passe',
        passwordWarning: 'Notez bien ces informations, elles ne seront plus visibles après la fermeture de cette fenêtre.',
        understood: 'J\'ai noté',
        copied: 'Copié !',
        deleteConfirm: 'Êtes-vous sûr de vouloir supprimer ce moniteur ?'
      };
      return translations[key] || key;
    },
    
    generatePassword() {
      return 'cde213@25'; // Mot de passe fixe
    },
    
    getInitials(firstName, lastName) {
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    },
    
    togglePassword(monitorId) {
      this.$set(this.showPasswords, monitorId, !this.showPasswords[monitorId]);
    },
    
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        // Vous pouvez ajouter une notification toast ici
        console.log('Copié dans le presse-papiers');
      } catch (err) {
        console.error('Erreur lors de la copie:', err);
      }
    },
    
    async fetchMonitors() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${API_BASE_URL}/monitor`, { headers });
        // Ajouter le mot de passe à chaque moniteur
        this.monitors = res.data.map(monitor => ({
          ...monitor,
          password: 'cde213@25' // Afficher le mot de passe en clair
        }));
      } catch (err) {
        console.error('Erreur lors du chargement des moniteurs:', err);
        alert('Erreur lors du chargement des moniteurs : ' + err.message);
      } finally {
        this.loading = false;
      }
    },
    
    async handleSubmit() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        if (this.form._id) {
          await axios.put(`${API_BASE_URL}/monitor/${this.form._id}`, this.form, { headers });
        } else {
          const { _id, ...formToSend } = this.form;
          // Générer un mot de passe unique
          const password = this.generatePassword();
          const monitorData = {
            ...formToSend,
            password,
            role: 'monitor'
          };
          
          const response = await axios.post(`${API_BASE_URL}/monitor`, monitorData, { headers });
          this.createdMonitor = {
            ...response.data.monitor,
            password // Ajouter le mot de passe en clair pour l'affichage
          };
          this.showPasswordModal = true;
        }
        await this.fetchMonitors();
        this.resetForm();
      } catch (err) {
        console.error('Erreur lors de la sauvegarde:', err);
        alert('Erreur lors de la sauvegarde : ' + (err.response?.data?.error || err.message));
      } finally {
        this.loading = false;
      }
    },
    
    closePasswordModal() {
      this.showPasswordModal = false;
      this.createdMonitor = null;
    },
    
    editMonitor(monitor) {
      this.form = { ...monitor };
    },
    
    async deleteMonitor(id) {
      if (!confirm(this.getTranslatedTitle('deleteConfirm'))) return;
      
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        await axios.delete(`${API_BASE_URL}/monitor/${id}`, { headers });
        await this.fetchMonitors();
        if (this.form._id === id) this.resetForm();
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression : ' + err.message);
      }
    },
    
    resetForm() {
      this.form = { _id: '', firstName: '', lastName: '', email: '', phoneNumber: '' };
    }
  },
  
  mounted() {
    this.fetchMonitors();
  }
};
</script>

<style lang="scss" scoped>
.monitor-registration {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(219, 35, 35, 0.1);

  .header-content {
    h1 {
      color: #1e293b;
      font-size: 1.75rem;
      margin: 0 0 0.5rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.75rem;

      i {
        color: #db2323;
        font-size: 1.5rem;
      }
    }

    .header-description {
      color: #64748b;
      font-size: 1rem;
      margin: 0;
    }
  }
}

.registration-card,
.monitors-list-card {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  overflow: hidden;

  .card-header {
    background: #fafbfc;
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      color: #1e293b;
      font-size: 1.2rem;
      margin: 0;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.6rem;

      i {
        color: #db2323;
        font-size: 1.1rem;
      }
    }

    .header-stats {
      .stat-badge {
        background: linear-gradient(135deg, #db2323, #b31b1b);
        color: white;
        padding: 0.4rem 0.8rem;
        border-radius: 1rem;
        font-size: 0.85rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.4rem;

        i {
          font-size: 0.8rem;
        }
      }
    }
  }

  .card-content {
    padding: 1.5rem;
  }
}

.registration-form {
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.2rem;
    margin-bottom: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      color: #374151;
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      i {
        color: #db2323;
        font-size: 0.85rem;
        width: 16px;
      }
    }

    input {
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.6rem;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      background: #fafbfc;

      &:focus {
        outline: none;
        border-color: #db2323;
        background: white;
        box-shadow: 0 0 0 3px rgba(219, 35, 35, 0.1);
      }

      &::placeholder {
        color: #9ca3af;
      }
    }
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 0.6rem;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-decoration: none;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  i {
    font-size: 0.85rem;
  }
}

.btn-primary {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  box-shadow: 0 2px 4px rgba(219, 35, 35, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(219, 35, 35, 0.3);
  }
}

.btn-secondary {
  background: #f8fafc;
  color: #374151;
  border: 2px solid #e5e7eb;

  &:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
  }
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1.5rem;
  text-align: center;
  color: #64748b;

  i {
    font-size: 3rem;
    color: #db2323;
    background: rgba(219, 35, 35, 0.1);
    padding: 1rem;
    border-radius: 1rem;
  }

  h3 {
    color: #374151;
    font-size: 1.2rem;
    margin: 0;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.95rem;
  }
}

.monitors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.2rem;
}

.monitor-card {
  background: #fafbfc;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-color: rgba(219, 35, 35, 0.2);
  }

  &.editing {
    border-color: #db2323;
    background: rgba(219, 35, 35, 0.02);
    box-shadow: 0 0 0 3px rgba(219, 35, 35, 0.1);
  }

  .monitor-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;

    .monitor-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #db2323, #b31b1b);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: 700;
      box-shadow: 0 2px 6px rgba(219, 35, 35, 0.3);
    }

    .monitor-info {
      flex: 1;

      h4 {
        color: #1e293b;
        font-size: 1.1rem;
        margin: 0 0 0.2rem;
        font-weight: 600;
      }

      .monitor-role {
        color: #64748b;
        font-size: 0.85rem;
        background: rgba(219, 35, 35, 0.1);
        padding: 0.2rem 0.6rem;
        border-radius: 1rem;
        font-weight: 500;
      }
    }

    .monitor-actions {
      display: flex;
      gap: 0.5rem;
    }
  }

  .monitor-details {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.6rem;
      background: white;
      border-radius: 0.6rem;
      border: 1px solid #e5e7eb;

      i {
        color: #db2323;
        font-size: 0.9rem;
        width: 16px;
        text-align: center;
      }

      span {
        flex: 1;
        color: #374151;
        font-size: 0.9rem;
      }

      &.password-item {
        .password-display {
          font-family: monospace;
          font-size: 0.85rem;
        }

        .toggle-password-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.3rem;
          border-radius: 0.3rem;
          transition: all 0.3s ease;

          &:hover {
            background: #f3f4f6;
            color: #db2323;
          }

          i {
            font-size: 0.8rem;
          }
        }
      }
    }
  }
}

.action-btn {
  background: white;
  border: 2px solid #e5e7eb;
  color: #64748b;
  border-radius: 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &.edit-btn:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
  }

  &.delete-btn:hover {
    border-color: #ef4444;
    color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
  }

  i {
    font-size: 0.85rem;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);

  .modal-header {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    padding: 1.5rem;
    border-radius: 1rem 1rem 0 0;

    h3 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.75rem;

      i {
        font-size: 1.2rem;
      }
    }
  }

  .modal-body {
    padding: 1.5rem;

    .success-message {
      color: #374151;
      font-size: 1rem;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }

    .credentials-card {
      background: #f8fafc;
      border: 2px solid #e5e7eb;
      border-radius: 0.8rem;
      padding: 1.2rem;
      margin-bottom: 1.5rem;

      h4 {
        color: #1e293b;
        font-size: 1.1rem;
        margin: 0 0 1rem;
        font-weight: 600;
      }

      .credential-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;

        &:last-child {
          margin-bottom: 0;
        }

        label {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .credential-value {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.6rem;
          padding: 0.8rem;

          span {
            flex: 1;
            color: #1e293b;
            font-family: monospace;
            font-size: 0.95rem;
            word-break: break-all;

            &.password-text {
              font-weight: 600;
              color: #db2323;
            }
          }

          .copy-btn {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            color: #64748b;
            border-radius: 0.4rem;
            padding: 0.4rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;

            &:hover {
              background: #e5e7eb;
              color: #374151;
            }

            i {
              font-size: 0.8rem;
            }
          }
        }
      }
    }

    .warning-message {
      background: rgba(245, 101, 101, 0.1);
      border: 2px solid rgba(245, 101, 101, 0.2);
      border-radius: 0.8rem;
      padding: 1rem;
      display: flex;
      align-items: flex-start;
      gap: 0.8rem;

      i {
        color: #f56565;
        font-size: 1.2rem;
        margin-top: 0.1rem;
      }

      p {
        color: #742a2a;
        font-size: 0.9rem;
        margin: 0;
        line-height: 1.5;
      }
    }
  }

  .modal-footer {
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;

    .btn-primary {
      width: 100%;
      justify-content: center;
    }
  }
}

// Responsive Design
@media (max-width: 1024px) {
  .registration-form .form-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .monitor-registration {
    padding: 1rem;
  }

  .page-header {
    padding: 1rem;

    .header-content h1 {
      font-size: 1.4rem;
    }
  }

  .registration-card,
  .monitors-list-card {
    margin-bottom: 1rem;
    
    .card-header {
      padding: 1rem;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.8rem;

      h2 {
        font-size: 1.1rem;
      }
    }

    .card-content {
      padding: 1rem;
    }
  }

  .registration-form {
    .form-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .form-actions {
      flex-direction: column;

      .btn-primary,
      .btn-secondary {
        width: 100%;
        justify-content: center;
      }
    }
  }

  .monitors-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .monitor-card {
    padding: 1rem;

    .monitor-header {
      .monitor-avatar {
        width: 40px;
        height: 40px;
        font-size: 1rem;
      }

      .monitor-info h4 {
        font-size: 1rem;
      }
    }

    .monitor-details {
      gap: 0.6rem;

      .detail-item {
        padding: 0.5rem;
        font-size: 0.85rem;
      }
    }
  }

  .modal-content {
    width: 95%;
    margin: 1rem;

    .modal-header {
      padding: 1rem;

      h3 {
        font-size: 1.1rem;
      }
    }

    .modal-body {
      padding: 1rem;

      .credentials-card {
        padding: 1rem;

        .credential-item .credential-value {
          padding: 0.6rem;
          font-size: 0.85rem;
        }
      }
    }

    .modal-footer {
      padding: 1rem;
    }
  }
}

@media (max-width: 480px) {
  .page-header .header-content h1 {
    font-size: 1.2rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .monitor-card .monitor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;

    .monitor-actions {
      align-self: flex-end;
    }
  }
}
</style> 
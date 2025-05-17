<template>
  <div class="chat-app">
    <aside class="sidebar">
      <div class="search-bar">
        <i class="fas fa-search search-icon"></i>
        <input 
          type="text" 
          placeholder="Rechercher un utilisateur..." 
          v-model="searchTerm" 
          @input="searchUsers" 
        />
      </div>
      <div class="chat-list">
        <div v-if="loading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i> Chargement...
        </div>
        <div v-else-if="error" class="error-state">
          <i class="fas fa-exclamation-circle"></i> {{ error }}
        </div>
        <div v-else-if="filteredUsers.length === 0" class="empty-state">
          <i class="fas fa-users"></i> Aucun utilisateur trouvé
        </div>
        <div v-else v-for="user in filteredUsers" 
             :key="user._id" 
             class="chat-item" 
             :class="{ 'active': activeUser?._id === user._id }"
             @click="selectUser(user)">
          <div class="avatar">
            <img :src="user.profilePhotoURL" alt="Avatar" />
            <span class="status-indicator" :class="{ 'online': user.isOnline }"></span>
          </div>
          <div class="chat-info">
            <h4 class="chat-name">{{ user.firstName }} {{ user.lastName }}</h4>
            <p class="last-message">{{ user.lastMessage || 'Aucun message' }}</p>
          </div>
        </div>
      </div>
    </aside>
    
    <main class="chat-window">
      <header class="chat-header">
        <div v-if="activeUser" class="contact-info">
          <div class="avatar">
            <img :src="activeUser.profilePhotoURL" alt="Avatar" />
            <span class="status-indicator" :class="{ 'online': activeUser.isOnline }"></span>
          </div>
          <div class="contact-details">
            <div class="contact-name">{{ activeUser.firstName }} {{ activeUser.lastName }}</div>
            <div class="contact-status">{{ activeUser.isOnline ? 'En ligne' : 'Hors ligne' }}</div>
          </div>
        </div>
        <div v-else class="welcome-message">
          <i class="fas fa-comments"></i>
          <h2>Bienvenue dans la messagerie</h2>
          <p>Sélectionnez un contact pour commencer à discuter</p>
        </div>
      </header>

      <div class="messages" ref="messagesContainer">
        <div v-if="!activeUser" class="empty-chat">
          <i class="fas fa-comment-slash"></i>
          <p>Sélectionnez un contact pour voir vos messages</p>
        </div>
        <template v-else>
          <div v-if="loading" class="loading-messages">
            <i class="fas fa-spinner fa-spin"></i> Chargement des messages...
          </div>
          <div v-else-if="error" class="error-messages">
            <i class="fas fa-exclamation-circle"></i> {{ error }}
          </div>
          <div v-else-if="messages.length === 0" class="no-messages">
            <i class="fas fa-comment-dots"></i>
            <p>Aucun message. Commencez la conversation !</p>
          </div>
          <div v-else v-for="message in messages" 
               :key="message._id" 
               :class="{'message received': message.senderId !== currentUser.id, 'message sent': message.senderId === currentUser.id}">
            <div class="message-content">
              <p>{{ message.content }}</p>
              <span class="message-time">{{ formatTime(message.createdAt) }}</span>
            </div>
          </div>
        </template>
      </div>

      <div class="message-input" v-if="activeUser">
        <input 
          type="text" 
          placeholder="Écrivez votre message..." 
          v-model="newMessage"
          @keyup.enter="sendMessage"
          :disabled="loading"
        />
        <button 
          @click="sendMessage" 
          :disabled="!newMessage.trim() || loading"
          class="send-button"
        >
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import { API_BASE_URL } from '@/config.js';

export default {
  name: 'MessageComponent',
  
  data() {
    // Vérifier toutes les clés possibles pour l'ID utilisateur
    const userId = localStorage.getItem('user_id') || 
                  localStorage.getItem('userId') || 
                  localStorage.getItem('_id') ||
                  localStorage.getItem('id');
    
    console.log('All possible user IDs from localStorage:', {
      'user_id': localStorage.getItem('user_id'),
      'userId': localStorage.getItem('userId'),
      '_id': localStorage.getItem('_id'),
      'id': localStorage.getItem('id')
    });
    
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
    }
    
    return {
      users: [],
      filteredUsers: [],
      activeUser: null,
      messages: [],
      newMessage: '',
      currentUser: {
        id: userId,
        profilePhotoURL: localStorage.getItem('profilePhotoURL') || '',
        firstName: localStorage.getItem('user') || ''
      },
      searchTerm: '',
      loading: false,
      error: null
    };
  },

  methods: {
    async getUsers() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('Current user ID before API call:', this.currentUser.id);
        
        const response = await axios.get(`${API_BASE_URL}/user/getUsers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Filtrer l'utilisateur actuel de la liste
        this.users = response.data
          .filter(user => user._id !== this.currentUser.id)
          .map(user => ({
            ...user,
            profilePhotoURL: user.profilePhotoURL ? `${API_BASE_URL}${user.profilePhotoURL}` : '',
            isOnline: false,
            lastMessage: null
          }));
        
        this.filteredUsers = this.users;
        console.log("Users loaded:", this.filteredUsers);
        console.log("Current user ID:", this.currentUser.id);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        this.error = error.message === 'No authentication token found' 
          ? 'Vous devez être connecté pour accéder à la messagerie'
          : 'Erreur lors du chargement des utilisateurs';
      } finally {
        this.loading = false;
      }
    },

    searchUsers() {
      if (!this.searchTerm.trim()) {
        this.filteredUsers = this.users;
        return;
      }
      this.filteredUsers = this.users.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },

    async selectUser(user) {
      this.activeUser = user;
      this.error = null;
      await this.getMessagesBetweenUsers(user._id);
      this.scrollToBottom();
    },

    async getMessagesBetweenUsers(receiverId) {
      console.log('Getting messages between users:', {
        currentUserId: this.currentUser.id,
        receiverId: receiverId
      });

      if (!this.currentUser.id) {
        console.error('Current user ID is missing');
        this.error = 'Erreur: ID utilisateur manquant. Veuillez vous reconnecter.';
        return;
      }

      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(
          `${API_BASE_URL}/messages?senderId=${this.currentUser.id}&receiverId=${receiverId}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        if (response.data && response.data.data) {
          this.messages = response.data.data;
        } else {
          this.messages = [];
        }
        this.scrollToBottom();
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        if (error.response && error.response.status === 404) {
          this.error = 'Aucun message trouvé';
          this.messages = [];
        } else {
          this.error = error.message === 'No authentication token found'
            ? 'Vous devez être connecté pour accéder aux messages'
            : 'Erreur lors du chargement des messages';
        }
      } finally {
        this.loading = false;
      }
    },

    async sendMessage() {
      console.log('Sending message:', {
        currentUserId: this.currentUser.id,
        receiverId: this.activeUser?._id,
        content: this.newMessage
      });

      if (!this.newMessage.trim() || !this.activeUser || this.loading) return;
      if (!this.currentUser.id) {
        console.error('Current user ID is missing');
        this.error = 'Erreur: ID utilisateur manquant';
        return;
      }

      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.post(
          `${API_BASE_URL}/messages`,
          {
            senderId: this.currentUser.id,
            receiverId: this.activeUser._id,
            content: this.newMessage
          },
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        if (response.data && response.data.data) {
          this.messages.push(response.data.data);
          this.newMessage = '';
          this.scrollToBottom();
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        this.error = error.message === 'No authentication token found'
          ? 'Vous devez être connecté pour envoyer des messages'
          : 'Erreur lors de l\'envoi du message';
      } finally {
        this.loading = false;
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    formatTime(date) {
      if (!date) return '';
      return new Date(date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },

  created() {
    this.getUsers();
  },

  mounted() {
    this.scrollToBottom();
  }
};
</script>

<style scoped>
.chat-app {
  display: flex;
  width: 100%;
  height: calc(100vh - 64px);
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar {
  width: 30%;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #dee2e6;
}

.search-bar {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  position: relative;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-bar input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.search-icon {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.chat-list {
  overflow-y: auto;
  flex-grow: 1;
}

.chat-item {
  display: flex;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid #dee2e6;
}

.chat-item:hover {
  background-color: #e9ecef;
}

.chat-item.active {
  background-color: #e3f2fd;
}

.avatar {
  position: relative;
  margin-right: 1rem;
}

.avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #dc3545;
  border: 2px solid #fff;
}

.status-indicator.online {
  background-color: #28a745;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-name {
  margin: 0;
  font-size: 1rem;
  color: #212529;
  font-weight: 500;
}

.chat-window {
  display: flex;
  flex-direction: column;
  width: 70%;
  background-color: #fff;
}

.chat-header {
  padding: 1rem;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
}

.contact-info {
  display: flex;
  align-items: center;
}

.contact-details {
  margin-left: 1rem;
}

.contact-name {
  font-weight: 500;
  color: #212529;
}

.contact-status {
  font-size: 0.875rem;
  color: #6c757d;
}

.welcome-message {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.welcome-message i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #f8f9fa;
}

.empty-chat,
.loading-messages,
.error-messages,
.no-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
  text-align: center;
  padding: 2rem;
}

.empty-chat i,
.loading-messages i,
.error-messages i,
.no-messages i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.message {
  display: flex;
  margin-bottom: 0.5rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.sent {
  justify-content: flex-end;
}

.message.received {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

.message-content p {
  margin: 0;
  color: #212529;
}

.message-time {
  font-size: 0.75rem;
  color: #6c757d;
  margin-top: 0.25rem;
  display: block;
}

.sent .message-content {
  background-color: #007bff;
  color: #fff;
}

.sent .message-content p {
  color: #fff;
}

.sent .message-time {
  color: rgba(255, 255, 255, 0.8);
}

.message-input {
  display: flex;
  padding: 1rem;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  gap: 0.5rem;
}

.message-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.message-input input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.message-input input:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.send-button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.send-button:hover:not(:disabled) {
  background-color: #0056b3;
  transform: scale(1.05);
}

.send-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .chat-app {
    flex-direction: column;
    height: calc(100vh - 56px);
  }

  .sidebar {
    width: 100%;
    height: 40%;
  }

  .chat-window {
    width: 100%;
    height: 60%;
  }

  .message-content {
    max-width: 85%;
  }

  .chat-item {
    padding: 0.75rem;
  }

  .avatar img {
    width: 40px;
    height: 40px;
  }
}
</style>

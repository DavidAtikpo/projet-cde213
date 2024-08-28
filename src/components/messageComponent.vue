<!-- <template>
  <div class="container">
    <h1>Messages</h1>
    <div>
      <h2>Users</h2>
      <ul class="user-list">
        <li v-for="user in users" :key="user._id" @click="toggleDropdown(user)">
          <img class="icon" :src="user.profilePhotoURL" alt="profile">{{ user.firstName }}
          <div v-if="selectedUser && selectedUser._id === user._id && showDropdown" class="dropdown1" @click.stop>
            <h3>{{ selectedUser.firstName }}</h3>
            <hr>
            <ul>
              <li v-for="msg in userMessages" :key="msg._id" :class="{'sent': msg.type === 'sent', 'received': msg.type === 'received'}">
                <div :class="{'message-content': true, 'sent-content': msg.type === 'sent', 'received-content': msg.type === 'received'}">
                  <strong>{{ msg.type === 'sent' ? 'You' : msg.sender_id.firstName }}:</strong> {{ msg.content }}
                </div>
              </li>
            </ul>
            <div class="message-input">
              <input type="text" placeholder="Ecrire votre message ici" v-model="content" @click.stop />
              <button @click="sendMessage" @click.stop>Send</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  data() {
    return {
      users: [],
      userMessages: [],
      content: '',
      selectedUser: null,
      showDropdown: false,
      currentUserId: localStorage.getItem('user_id')
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/allusers`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const mappedUsers = response.data.map(user => ({
          ...user,
          profilePhotoURL: `${API_BASE_URL}` + user.profilePhotoURL
        }));
        this.users = mappedUsers;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async fetchMessages(userId) {
      try {
        const response = await axios.get(`${API_BASE_URL}/message/messages/${userId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        
        const transformedMessages = response.data.map(msg => {
          if (msg.receiver_id._id === this.currentUserId) {
            return { ...msg, type: 'received' };
          } else if (msg.sender_id._id === this.currentUserId) {
            return { ...msg, type: 'sent' };
          }
          console.log('message data',response.data);
          return msg;
        });
        this.userMessages = transformedMessages;
        console.log('get message', this.userMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    async sendMessage() {
      if (!this.selectedUser) {
        alert("Please select a user to send the message to.");
        return;
      }
      try {
        await axios.post(`${API_BASE_URL}/message/message`, {
          receiver_id: this.selectedUser._id,
          content: this.content
        }, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        this.content = '';
        this.fetchMessages(this.selectedUser._id); 
      } catch (error) {
        console.error('Error sending message:', error);
      }
    },
    toggleDropdown(user) {
      if (this.selectedUser && this.selectedUser._id === user._id) {
        this.showDropdown = !this.showDropdown;
      } else {
        this.selectedUser = user;
        this.showDropdown = true;
        this.fetchMessages(user._id); 
      }
    }
  }
};
</script>

<style>

.container {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  max-width: 100%;
  margin: auto;
}

h1, h2 {
  text-align: center;
  color: #333;
}

.user-list {
  list-style-type: none;
  padding: 0;
}

.user-list li {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: #fff;
  transition: background-color 0.3s;
}

.user-list li:hover {
  background-color: #e0e0e0;
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}


.dropdown1 {
  position: relative;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 90%;
  margin-top: 10px;
}

.dropdown1 h3 {
  margin-top: 0;
}

.dropdown1 hr {
  margin: 10px 0;
}

.dropdown1 ul {
  list-style-type: none;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown1 ul li {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.sent-content {
  text-align: right;
  color: green;
}

.received-content {
  text-align: left;
  color: blue;
}

.message-input {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.message-input input {
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
}

.message-input button {
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  background-color: #333;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

.message-input button:hover {
  background-color: #555;
}


@media only screen and (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .user-list li {
    flex-direction: column;
    align-items: flex-start;
  }

  .dropdown1 {
    width: 100%;
    margin-left: 0;
  }

  .message-input {
    flex-direction: column;
  }

  .message-input input {
    margin-bottom: 10px;
  }
}
</style> -->

<template>
  <div class="chat-app">
    <aside class="sidebar">
      <div class="search-bar">
        <input type="text" placeholder="Search" v-model="searchTerm" @input="searchUsers" />
      </div>
      <div class="chat-list">
        <div v-for="user in filteredUsers" :key="user._id" class="chat-item" @click="selectUser(user)">
          <div class="avatar">
            <img :src="user.profilePhotoURL" alt="Avatar" />
          </div>
          <div class="chat-info">
            <h4 class="chat-name">{{ user.firstName }} {{ user.lastName }}</h4>
            <p class="last-message">Last message preview...</p>
          </div>
        </div>
      </div>
    </aside>
    
    <main class="chat-window">
      <header class="chat-header">
        <div class="contact-info" v-if="activeUser">
          <div class="avatar">
            <img :src="activeUser.profilePhotoURL" alt="Avatar" />
          </div>
          <div class="contact-name">{{ activeUser.firstName }} {{ activeUser.lastName }}</div>
        </div>
      </header>

      <div class="messages">
        <div v-for="message in messages" :key="message._id" :class="{'message received': message.senderId !== currentUser.id, 'message sent': message.senderId === currentUser.id}">
          <div class="message-content">
            <p>{{ message.content }}</p>
          </div>
        </div>
      </div>

      <div class="message-input">
        <input type="text" placeholder="Enter your message" v-model="newMessage" />
        <button @click="sendMessage">Send</button>
      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import { API_BASE_URL } from '@/config.js';

export default {
  data() {
    return {
      users: [],
      filteredUsers: [],
      activeUser: null,
      messages: [],
      newMessage: '',
      currentUser: {
        id: localStorage.getItem('id'),
        profilePhotoURL: localStorage.getItem('profilePhotoURL'),
        firstName: localStorage.getItem('user')
      },
      searchTerm: ''
    };
  },
  methods: {
    // Fetch all users
    async getUsers() {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/getUsers`);
        this.users = response.data;
        
        // Map the users for display and search
        this.filteredUsers = this.users;
        console.log("users", this.filteredUsers);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    },

    // Filter users based on search term
    searchUsers() {
      this.filteredUsers = this.users.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },

    // Select a user to chat with
    async selectUser(user) {
      this.activeUser = user;
      await this.getMessagesBetweenUsers(user._id);
    },

    // Fetch messages between the current user and selected user
    async getMessagesBetweenUsers(receiverId) {
      try {
        const response = await axios.get(`${API_BASE_URL}/message/getMessage/${this.currentUser.id}/${receiverId}`);
        this.messages = response.data.data;
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    },

    // Send a new message
    async sendMessage() {
      if (this.newMessage.trim() !== '') {
        try {
          const response = await axios.post(`${API_BASE_URL}/message/createMessage`, {
            senderId: this.currentUser.id,
            receiverId: this.activeUser._id,
            content: this.newMessage,
          });
          console.log("sendId",this.currentUser.id);
          this.messages.push(response.data.data);
          this.newMessage = '';
        } catch (error) {
          console.error('Failed to send message', error);
        }
      }
    }
  },
  created() {
    this.getUsers();
  }
};
</script>






<style scoped>
.chat-app {
  display: flex;
  width: 100%;
  height: 100vh;
}

.sidebar {
  width: 30%;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ddd;
}

.chat-list {
  overflow-y: auto;
  flex-grow: 1;
}

.chat-item {
  display: flex;
  padding: 10px;
  cursor: pointer;
}

.chat-item:hover {
  background-color: #e0e0e0;
}

.avatar {
  margin-right: 10px;
}

.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.chat-info {
  display: flex;
  flex-direction: column;
}

.chat-name {
  font-weight: bold;
}

.chat-window {
  display: flex;
  flex-direction: column;
  width: 70%;
  background-color: #ece5dd;
}

.chat-header {
  padding: 10px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.message {
  display: flex;
  margin-bottom: 15px;
}

.message.sent {
  justify-content: flex-end;
}

.message.received {
  justify-content: flex-start;
}

.message-content {
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
}

.sent .message-content {
  background-color: #dcf8c6;
}

.message-input {
  display: flex;
  padding: 10px;
  background-color: #f0f0f0;
  border-top: 1px solid #ddd;
}

.message-input input {
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 20px;
  margin-right: 10px;
}

.message-input button {
  background-color: #34b7f1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
}
</style>

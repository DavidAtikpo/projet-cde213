<template>
  <div :class="[theme, 'page']">
    <div class="stud-dash">
      <div class="welcome">
        <div class="right">
          <p class="up-welcome animate__animated animate__fadeInDown">
            Bienvenue <span>{{ firstName }}</span>
          </p>
          <p class="under-welcome animate__animated animate__fadeInUp">
            N'oubliez pas de générer le rapport à la fin de la journée. Votre rapport reflète le travail accompli et ne peut être rempli qu'une fois par jour.
          </p>
        </div>
        <div class="left">
          <img class="welcome-img" src="@/assets/images/logo.jpeg" alt="dashboard" />
        </div>
      </div>

      <!-- Section des Publications de l'UNICEF avec Carrousel -->
      <div class="unicef-section">
        <h3>Suivre les Publications de l'UNICEF</h3>
        <div class="carousel">
          <img :src="currentImage" alt="Publication" />
          <div class="carousel-buttons">
            <button @click="prevImage">←</button>
            <button @click="nextImage">→</button>
          </div>
        </div>
        <p><a href="https://www.unicef.org" target="_blank">Visitez le site de l'UNICEF</a></p>
      </div>

      <!-- Section des Actualités et Articles -->
      <div class="news-section">
        <h3>Actualités et Articles</h3>
        <ul>
          <li v-for="(article, index) in articles" :key="index">
            <a :href="article.url" target="_blank">{{ article.title }}</a>
          </li>
        </ul>
      </div>

      <!-- Chat Bar -->
      <div class="chat-bar">
        <div class="chat-header" @click="toggleChat">
          <h4>Chat Support</h4>
        </div>
        <div v-if="chatOpen" class="chat-content">
          <div class="chat-messages">
            <p v-for="message in messages" :key="message.id">{{ message.text }}</p>
          </div>
          <input type="text" v-model="newMessage" placeholder="Type a message..." @keyup.enter="sendMessage" />
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import image1 from '@/assets/images/20220902_080000.jpg';
import image2 from '@/assets/images/348955217_778152960616511_1981663321848763521_n.jpg';
import image3 from '@/assets/images/Screenshot from 2024-08-16 03-50-01.png';
import image4 from '@/assets/images/Screenshot from 2024-08-16 03-50-44.png';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      firstName: '',
      chatOpen: false,
      messages: [],
      newMessage: '',
      articles: [
        { title: "L'éducation des enfants en Afrique - UNICEF", url: "https://www.unicef.org/education" },
        { title: "Santé mondiale et prévention des maladies - OMS", url: "https://www.who.int" },
        { title: "L'impact de Compassion International sur les communautés", url: "https://www.compassion.com" },
        { title: "Accès à la lecture en milieu rural - Bibliothèques Sans Frontières", url: "https://www.bibliosansfrontieres.org" },
        { title: "Actualités sur l'éducation au Togo", url: "https://www.republicoftogo.com/Toutes-les-rubriques" },
        { title: "Actualités globales sur l'éducation - BBC News", url: "https://www.bbc.com/news/education" }
      ],
      images: [
      image1,
        image2,
        image3,
        image4
      ],
      currentIndex: 0
    };
  },
  computed: {
    ...mapState(['theme']),
    currentImage() {
      return this.images[this.currentIndex];
    }
  },
  mounted() {
    this.firstName = localStorage.getItem('user');
    document.querySelector('.page').classList.add('animate__animated', 'animate__fadeIn');
  },
  methods: {
    toggleChat() {
      this.chatOpen = !this.chatOpen;
    },
    sendMessage() {
      if (this.newMessage) {
        this.messages.push({ id: Date.now(), text: this.newMessage });
        this.newMessage = '';
      }
    },
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    },
    prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }
  }
};
</script>


<style scoped>
/* Thèmes */
.dark.page {
  background-color: #2E2E2E;
  color: #F5F5F5;
}
.light.page {
  background-color: #F5F5F5;
  color: #2E2E2E;
}
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background: transparent;
 } 
/* Section de bienvenue */
.welcome {
  height: 10rem;
  width: 100%;
  background-color: #4A90E2;
  border-bottom: 2px solid #333;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  color: white;
  transition: background-color 0.3s ease;
}

.welcome-img {
  width: 8rem;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.welcome-img:hover {
  transform: scale(1.1);
}

.up-welcome {
  font-weight: bold;
  font-size: 2.5rem;
  padding-top: 1rem;
}

.under-welcome {
  font-size: 1.2rem;
  max-width: 600px;
  margin-top: 10px;
}

/* Section des Publications de l'UNICEF avec Carrousel */
.unicef-section {
  text-align: center;
  margin-top: 20px;
  padding: 15px;
  background-color: #F0F0F0;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.unicef-section img {
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 10px;
  margin-bottom: 15px;
}

.carousel-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.carousel-buttons button {
  background-color: #4A90E2;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.carousel-buttons button:hover {
  background-color: #357ABD;
}

.unicef-section a {
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.unicef-section a:hover {
  color: #0056b3;
}

/* Section des Actualités et Articles */
.news-section {
  background-color: #FFF;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.news-section h3 {
  margin-bottom: 15px;
  color: #4A90E2;
}

.news-section ul {
  list-style: none;
  padding: 0;
}

.news-section li {
  margin-bottom: 10px;
}

.news-section a {
  color: #2E2E2E;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.news-section a:hover {
  color: #007bff;
}

/* Chat Bar */
.chat-bar {
  position: fixed;
  bottom: 0;
  right: 20px;
  width: 300px;
  border: 1px solid #ccc;
  background-color: #FFF;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px 10px 0 0;
  overflow: hidden;
}

.chat-header {
  background-color: #4A90E2;
  color: white;
  padding: 10px;
  cursor: pointer;
  text-align: center;
}

.chat-content {
  display: flex;
  flex-direction: column;
  height: 250px;
}

.chat-messages {
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: #F5F5F5;
}

input[type="text"] {
  padding: 10px;
  border: none;
  border-top: 1px solid #ccc;
  border-radius: 0 0 10px 10px;
}
</style>


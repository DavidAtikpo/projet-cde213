<template>
  <div :class="[theme, 'page']">
    <div class="dashboard">
      <!-- Section de bienvenue -->
      <div class="welcome-section">
        <div class="welcome-content">
          <div class="welcome-text">
            <h1 class="welcome-title animate__animated animate__fadeInDown">
              Bienvenue <span>{{ firstName }}</span>
            </h1>
            <p class="welcome-message animate__animated animate__fadeInUp">
              N'oubliez pas de générer le rapport à la fin de la journée. Votre rapport reflète le travail accompli et ne peut être rempli qu'une fois par jour.
            </p>
          </div>
          <div class="welcome-image">
            <img src="@/assets/images/logo.jpeg" alt="dashboard" />
          </div>
        </div>
      </div>

      <!-- Section des Publications de l'UNICEF -->
      <div class="unicef-section">
        <div class="section-header">
          <h2>Publications de l'UNICEF</h2>
          <a href="https://www.unicef.org" target="_blank" class="visit-link">
            Visiter le site
            <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
        <div class="carousel">
          <div class="carousel-container">
            <img :src="currentImage" alt="Publication" class="carousel-image" />
            <div class="carousel-overlay">
              <button @click="prevImage" class="carousel-button prev">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button @click="nextImage" class="carousel-button next">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Section des Actualités -->
      <div class="news-section">
        <div class="section-header">
          <h2>Actualités et Articles</h2>
        </div>
        <div class="news-grid">
          <a v-for="(article, index) in articles" 
             :key="index" 
             :href="article.url" 
             target="_blank" 
             class="news-card">
            <div class="news-icon">
              <i class="fas fa-newspaper"></i>
            </div>
            <h3 class="news-title">{{ article.title }}</h3>
          </a>
        </div>
      </div>

      <!-- Chat Support -->
      <div class="chat-section" :class="{ 'chat-open': chatOpen }">
        <div class="chat-header" @click="toggleChat">
          <div class="chat-header-content">
            <i class="fas fa-comments"></i>
            <h3>Chat Support</h3>
          </div>
          <i :class="['fas', chatOpen ? 'fa-chevron-down' : 'fa-chevron-up']"></i>
        </div>
        <div v-if="chatOpen" class="chat-content">
          <div class="chat-messages">
            <div v-for="message in messages" 
                 :key="message.id" 
                 class="message">
              {{ message.text }}
            </div>
          </div>
          <div class="chat-input">
            <input 
              type="text" 
              v-model="newMessage" 
              placeholder="Écrivez votre message..." 
              @keyup.enter="sendMessage"
            />
            <button @click="sendMessage" class="send-button">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
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

<style lang="scss" scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Section de bienvenue */
.welcome-section {
  background: linear-gradient(135deg, #db2323 0%, #ff4d4d 100%);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.welcome-text {
  flex: 1;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;

  span {
    font-weight: 800;
  }
}

.welcome-message {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 1rem;
  line-height: 1.6;
}

.welcome-image {
  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
}

/* Section UNICEF */
.unicef-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.5rem;
    color: #333;
    margin: 0;
  }
}

.visit-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #db2323;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #ff4d4d;
  }
}

.carousel {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  aspect-ratio: 16/9;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(to right, rgba(0,0,0,0.3), transparent, rgba(0,0,0,0.3));
}

.carousel-button {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    transform: scale(1.1);
  }

  i {
    color: #333;
  }
}

/* Section Actualités */
.news-section {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.news-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.news-icon {
  width: 48px;
  height: 48px;
  background: #db2323;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.news-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
}

/* Chat Support */
.chat-section {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 350px;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.chat-header {
  padding: 1rem;
  background: #db2323;
  color: white;
  border-radius: 1rem 1rem 0 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header-content {
  display: flex;
  align-items: center;
  gap: 0.8rem;

  i {
    font-size: 1.2rem;
  }

  h3 {
    margin: 0;
    font-size: 1.1rem;
  }
}

.chat-content {
  height: 400px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.message {
  background: #f8f9fa;
  padding: 0.8rem 1rem;
  border-radius: 1rem;
  margin-bottom: 0.8rem;
  max-width: 80%;
  word-break: break-word;
}

.chat-input {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 0.8rem;
}

.chat-input input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #db2323;
  }
}

.send-button {
  background: #db2323;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff4d4d;
    transform: scale(1.05);
  }
}

/* Dark theme */
:deep(.dark) {
  .unicef-section,
  .news-section,
  .chat-section {
    background: #2d2d2d;
  }

  .section-header h2 {
    color: #fff;
  }

  .news-card {
    background: #1a1a1a;
    color: #fff;
  }

  .chat-input input {
    background: #1a1a1a;
    border-color: #404040;
    color: #fff;
  }

  .message {
    background: #1a1a1a;
    color: #fff;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .welcome-content {
    flex-direction: column;
    text-align: center;
  }

  .welcome-image {
    order: -1;
  }

  .news-grid {
    grid-template-columns: 1fr;
  }

  .chat-section {
    width: 100%;
    bottom: 0;
    right: 0;
    border-radius: 1rem 1rem 0 0;
  }
}
</style>


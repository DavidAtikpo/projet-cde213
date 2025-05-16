<template>
  <section class="testimonials-section">
    <div class="hero-banner">
      <div class="hero-content">
        <h2 class="hero-title">
          <TypewriterText class="typewriter" text="CDE 213 Aneho Togo Nlessi" />
        </h2>
        <h3 class="hero-subtitle">CDE KOINONIA</h3>
        <p class="hero-mission">Délivrer les enfants de la pauvreté</p>
      </div>
    </div>

    <div class="testimonials-container">
      <h2 class="section-title">Témoignages</h2>
      <div class="testimonials-grid">
        <div v-for="(testimonial, index) in testimonials" 
             :key="index" 
             class="testimonial-card"
             :class="{ 'fade-in': true }"
             :style="{ animationDelay: `${index * 0.2}s` }">
          <div class="testimonial-content">
            <div class="testimonial-image">
              <img :src="testimonial.image" :alt="testimonial.name" />
            </div>
            <div class="testimonial-info">
              <h3>{{ testimonial.name }}</h3>
              <p>{{ testimonial.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="programs-section">
      <h2 class="section-title">Nos Programmes</h2>
      <div class="programs-grid">
        <div v-for="(program, index) in programs" 
             :key="index" 
             class="program-card"
             :class="{ 'fade-in': true }"
             :style="{ animationDelay: `${index * 0.2}s` }">
          <div class="program-image">
            <img :src="program.image" :alt="program.title" />
          </div>
          <div class="program-content">
            <h3>{{ program.title }}</h3>
            <p>{{ program.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="gallery-section">
      <h2 class="section-title">Galerie Photos</h2>
      <div class="gallery-grid">
        <div v-for="(photo, index) in photos" 
             :key="index" 
             class="gallery-item"
             :class="{ 'fade-in': true }"
             :style="{ animationDelay: `${index * 0.1}s` }">
          <img :src="photo.src" :alt="'Photo ' + (index + 1)" />
        </div>
      </div>
    </div>

    <div class="events-section">
      <h2 class="section-title">Événements à Venir</h2>
      <div class="events-grid">
        <div v-for="(event, index) in events" 
             :key="index" 
             class="event-card"
             :class="{ 'fade-in': true }"
             :style="{ animationDelay: `${index * 0.2}s` }">
          <h3>{{ event.title }}</h3>
          <div class="event-details">
            <p><i class="fas fa-calendar"></i> {{ event.date }}</p>
            <p><i class="fas fa-map-marker-alt"></i> {{ event.location }}</p>
          </div>
          <button class="event-button" @click="signIn">
            S'inscrire
          </button>
        </div>
      </div>
    </div>

    <div class="contact-section">
      <h2 class="section-title">Contactez-Nous</h2>
      <div class="contact-container">
        <form class="contact-form">
          <div class="form-group">
            <input type="text" placeholder="Nom" required />
          </div>
          <div class="form-group">
            <input type="email" placeholder="Email" required />
          </div>
          <div class="form-group">
            <textarea placeholder="Message" rows="4" required></textarea>
          </div>
          <button type="submit" class="submit-button">Envoyer</button>
        </form>
        <div class="contact-info">
          <div class="info-item">
            <i class="fas fa-envelope"></i>
            <p>coordinateur213@gmail.com</p>
          </div>
          <div class="info-item">
            <i class="fas fa-phone"></i>
            <p>+228 90 70 74 35</p>
          </div>
          <div class="info-item">
            <i class="fas fa-map-marker-alt"></i>
            <p>Rue N2, Aneho, Lome-Togo</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import TypewriterText from '@/components/TypewriterText.vue';
import image1 from '@/assets/images/Screenshot from 2024-08-16 03-50-44.png';
import image2 from '@/assets/images/Screenshot from 2024-08-16 03-50-01.png';
import image3 from '@/assets/images/309430577_431589382413805_5270125874633532938_n.jpg';
import image4 from '@/assets/images/379063963_653750866864321_1198646998069922534_n.jpg';

import programImage1 from '@/assets/images/Screenshot from 2024-08-16 03-54-36.png';
import programImage2 from '@/assets/images/Screenshot from 2024-08-16 03-50-44.png';
import programImage3 from '@/assets/images/419124740_719134673659273_130166699053893667_n.jpg';

import photo1 from '@/assets/images/309084922_431587569080653_7848551493997462143_n.jpg';
import photo2 from '@/assets/images/414067493_709542027951871_8960487969138995909_n.jpg';
import photo3 from '@/assets/images/348955217_778152960616511_1981663321848763521_n.jpg';
import photo4 from '@/assets/images/351383360_263196149601539_6741866346631895392_n.jpg';
import photo5 from '@/assets/images/309430577_431589382413805_5270125874633532938_n.jpg';
import photo6 from '@/assets/images/419124740_719134673659273_130166699053893667_n.jpg';

export default {
  name: "TestimonialComponent",
  components: {
    TypewriterText
  },
  data() {
    return {
      currentText: 0,
      testimonials: [
        {
          name: "Yayra POLO",
          message: "Grâce à Compassion Togo, j'ai découvert mon talent pour la musique. Ils m'ont aidé à m'entraîner et à améliorer mes compétences. Aujourd'hui, je suis capable de chanter devant un public.",
          image: image1,
        },
        {
          name: "Pauline GBETOUNOU",
          message: "Compassion Togo m'a donné l'opportunité de développer mes talents en chant. Leur soutien et encouragement m'ont permis de chanter avec confiance devant un public.",
          image: image2,
        },
        {
          name: "Kofi Mensah",
          message: "Participer aux ateliers de musique organisés par Compassion Togo m'a permis d'améliorer mes compétences en composition musicale. Je suis maintenant capable de créer mes propres morceaux.",
          image: image3,
        },
        {
          name: "Adjoa Agbeko",
          message: "Compassion Togo m'a appris à jouer de la guitare. Leur dévouement à aider les jeunes à développer leurs talents musicaux est incroyable.",
          image: image4,
        },
      ],
      programs: [
        {
          title: "Atelier de Musique",
          description: "Apprenez à jouer d'un instrument et à composer vos propres morceaux avec notre équipe d'experts en musique.",
          image: programImage1,
        },
        {
          title: "Entraînement Vocal",
          description: "Développez vos compétences vocales grâce à nos cours personnalisés qui vous aident à atteindre de nouvelles hauteurs.",
          image: programImage2,
        },
        {
          title: "Foot",
          description: "Une équipe féminine très compétente en partage des moments inoubliables.",
          image: programImage3,
        },
      ],
      photos: [
        { src: photo1 },
        { src: photo2 },
        { src: photo3 },
        { src: photo4 },
        { src: photo5 },
        { src: photo6 },
      ],
      events: [
        {
          title: "Concert de Noël",
          date: "20 Décembre 2024",
          location: "Centre Culturel de Lomé",
        },
        {
          title: "Atelier de Composition",
          date: "15 Janvier 2025",
          location: "Salle de Musique Aneho",
        },
      ],
    };
  },
  mounted() {
    setInterval(() => {
      this.currentText = (this.currentText + 1) % 3;
    }, 5000);
  },
  methods: {
    signIn() {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.testimonials-section {
  padding: 4rem 2rem;
  background-color: #f8f9fa;
}

.hero-banner {
  background: linear-gradient(135deg, #db2323 0%, #ff6b6b 100%);
  padding: 4rem 2rem;
  text-align: center;
  color: white;
  margin-bottom: 4rem;
  border-radius: 1rem;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.hero-mission {
  font-size: 1.2rem;
  opacity: 0.9;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.testimonial-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
}

.testimonial-content {
  padding: 1.5rem;
}

.testimonial-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.testimonial-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.testimonial-info h3 {
  color: #333;
  margin: 1rem 0;
}

.testimonial-info p {
  color: #666;
  line-height: 1.6;
}

.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.program-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.program-card:hover {
  transform: translateY(-5px);
}

.program-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.program-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.program-content {
  padding: 1.5rem;
}

.program-content h3 {
  color: #333;
  margin-bottom: 1rem;
}

.program-content p {
  color: #666;
  line-height: 1.6;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  aspect-ratio: 1;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover img {
  transform: scale(1.1);
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.event-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.event-details {
  margin: 1rem 0;
}

.event-details p {
  color: #666;
  margin: 0.5rem 0;
}

.event-button {
  background-color: #db2323;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.event-button:hover {
  background-color: #b31b1b;
}

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.submit-button {
  background-color: #db2323;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #b31b1b;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.info-item i {
  font-size: 1.5rem;
  color: #db2323;
}

.fade-in {
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 2rem;
  }
}
</style>

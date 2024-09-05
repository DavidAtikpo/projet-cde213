<template>
   <div class="container">
    <div class="text">
      <!-- First Text -->
      <h2 v-if="currentText == 0"><TypewriterText class="typewriter" text="CDE 213 Aneho Togo Nlessi" /></h2>
      <!-- Second Text -->
      <p v-if="currentText == 2">Délivrer les enfants de la pauvrete</p>
      <!-- Third Text -->
      <h3 v-if="currentText == 1"> CDE KOINONIA </h3>
    </div>
  </div>
  <div class="page-content">
    <h1>Réalisations Musicales de Compassion Togo Aneho Nlessi</h1>
    <div class="content">
      <div class="rows">
        <div class="row1">
          <div class="testimony" v-for="(testimonial, index) in testimonials" :key="index">
            <div class="user-info">
              <div class="profile-pic">
                <img :src="testimonial.image" :alt="'Témoignage ' + (index + 1)" />
              </div>
              <p>{{ testimonial.name }}</p>
            </div>
            <div class="message">
              <p>{{ testimonial.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <section class="about-us" id="about">
      <h2>À Propos de Nous</h2>
      <div class="about-content">
        <img src="../assets/images/355713643_608254518080623_8305770702300599736_n.jpg" alt="Notre Équipe" class="about-image" />
        <div class="about-text">
          <p>
            Compassion Togo est dédiée à aider les jeunes à découvrir et développer leurs talents dans la musique.
            Grâce à nos programmes et ateliers, nous offrons un soutien précieux pour les inspirer et les encadrer.
          </p>
          <p>
            Depuis notre fondation, nous avons touché la vie de nombreux jeunes, en leur fournissant des outils et des
            ressources pour réaliser leurs rêves musicaux.
          </p>
        </div>
      </div>
    </section>

    <section class="our-programs" id="programs">
      <h2>Nos Programmes</h2>
      <div class="program-list">
        <div class="program-item" v-for="(program, index) in programs" :key="index">
          <img :src="program.image" :alt="program.title" class="program-photo" />
          <h3>{{ program.title }}</h3>
          <p>{{ program.description }}</p>
        </div>
      </div>
    </section>

    <section class="photo-gallery" id="gallery">
      <h2>Galerie de Photos</h2>
      <vue-magnific-popup>
        <div class="gallery-grid">
          <a v-for="(photo, index) in photos" :key="index" :href="photo.src" class="gallery-item">
            <img :src="photo.src" :alt="'Événement ' + (index + 1)" />
          </a>
        </div>
      </vue-magnific-popup>
    </section>

    <section class="upcoming-events" id="events">
      <h2>Événements à Venir</h2>
      <div class="event-list">
        <div class="event-item" v-for="(event, index) in events" :key="index">
          <h3>{{ event.title }}</h3>
          <p>Date: {{ event.date }}</p>
          <p>Lieu: {{ event.location }}</p>
          <button class="event-button">
            <a href="#" @click="signIn">S'inscrire</a>
          </button>
        </div>
      </div>
    </section>

    <section class="contact-us" id="contact">
      <h2>Contactez-Nous</h2>
      <form class="contact-form">
        <input type="text" placeholder="Nom" required />
        <input type="email" placeholder="Email" required />
        <textarea placeholder="Message" rows="4" required></textarea>
        <button type="submit">Envoyer</button>
      </form>
      <div class="contact-info">
        <p>Email: coordinateur213@gmail.com</p>
        <p>Téléphone: +228 90 70 74 35</p>
        <p>Adresse: Rue N2, Aneho , Lome-Togo</p>
      </div>
    </section>
  </div>
</template>

<!-- <script>
// import VueMagnificPopup from 'vue-magnific-popup';
// import 'magnific-popup/dist/magnific-popup.css';
import visuel from '@/assets/images/379063963_653750866864321_1198646998069922534_n.jpg'
import TypewriterText from '@/components/TypewriterText.vue';
export default {
  name: "MainContent",
  components:{
    
    // VueMagnificPopup,
  
    TypewriterText
  },
  data() {
    return {
      currentText :0,
      image:visuel,

            testimonials: [
        {
          name: "Yayra POLO",
          message: "Grâce à Compassion Togo, j'ai découvert mon talent pour la musique. Ils m'ont aidé à m'entraîner et à améliorer mes compétences. Aujourd'hui, je suis capable de chanter devant un public.",
          image: '@/assets/images/Screenshot from 2024-08-16 03-50-44.png',
        },
        {
          name: "Pauline GBETOUNOU",
          message: "Compassion Togo m'a donné l'opportunité de développer mes talents en chant. Leur soutien et encouragement m'ont permis de chanter avec confiance devant un public.",
          image: '@/assets/images/Screenshot from 2024-08-16 03-50-01.png',
        },
        {
          name: "Kofi Mensah",
          message: "Participer aux ateliers de musique organisés par Compassion Togo m'a permis d'améliorer mes compétences en composition musicale. Je suis maintenant capable de créer mes propres morceaux.",
          image: '@/assets/images/309430577_431589382413805_5270125874633532938_n.jpg',
        },
        {
          name: "Adjoa Agbeko",
          message: "Compassion Togo m'a appris à jouer de la guitare. Leur dévouement à aider les jeunes à développer leurs talents musicaux est incroyable.",
          image: '@/assets/images/379063963_653750866864321_1198646998069922534_n.jpg',
        },
      ],
      programs: [
        {
          title: "Atelier de Musique",
          description: "Apprenez à jouer d'un instrument et à composer vos propres morceaux avec notre équipe d'experts en musique.",
          image: '@/assets/images/Screenshot from 2024-08-16 03-54-36.png',
        },
        {
          title: "Entraînement Vocal",
          description: "Développez vos compétences vocales grâce à nos cours personnalisés qui vous aident à atteindre de nouvelles hauteurs.",
          image:'@/assets/images/Screenshot from 2024-08-16 03-50-44.png',
        },
        {
          title: "Foot",
          description: "Une equipe femine tres competente  en partage des moments inoubliables.",
          image: '@/assets/images/419124740_719134673659273_130166699053893667_n.jpg',
        },
      ],
      photos: [
        { src: '@/assets/images/309084922_431587569080653_7848551493997462143_n.jpg' },
        { src: '@/assets/images/414067493_709542027951871_8960487969138995909_n.jpg' },
        { src: '@/assets/images/348955217_778152960616511_1981663321848763521_n.jpg' },
        { src: '@/assets/images/351383360_263196149601539_6741866346631895392_n.jpg' },
        { src: '@/assets/images/309430577_431589382413805_5270125874633532938_n.jpg' },
        { src: '@/assets/images/419124740_719134673659273_130166699053893667_n.jpg' },
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
</script> -->
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
  name: "MainContent",
  components: {
    TypewriterText
  },
  data() {
    return {
      currentText: 0,
      testimonials: [
        {
          name: "Yayra POLO",
          message: "Grâce à Compassion Togo, j'ai découvert mon talent pour la musique...",
          image: image1,
        },
        {
          name: "Pauline GBETOUNOU",
          message: "Compassion Togo m'a donné l'opportunité de développer mes talents...",
          image: image2,
        },
        {
          name: "Kofi Mensah",
          message: "Participer aux ateliers de musique organisés par Compassion Togo...",
          image: image3,
        },
        {
          name: "Adjoa Agbeko",
          message: "Compassion Togo m'a appris à jouer de la guitare...",
          image: image4,
        },
      ],
      programs: [
        {
          title: "Atelier de Musique",
          description: "Apprenez à jouer d'un instrument...",
          image: programImage1,
        },
        {
          title: "Entraînement Vocal",
          description: "Développez vos compétences vocales...",
          image: programImage2,
        },
        {
          title: "Foot",
          description: "Une équipe féminine très compétente...",
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
 html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background: transparent;
 } 
.page-content {
  background-image: url("@/assets/images/images.jpeg");
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  min-height: 200vh;
}

h1 {
  padding-bottom: 2rem;
  padding-top: 3rem;
  font-size: 2.5rem;
  color: #fff;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

@keyframes backgroundCycle {
  0% {
    background-image: url('@/assets/images/20220902_080000.jpg');
  }
  33% {
    background-image: url('@/assets/images/2022-09-07.jpg');
  }
  66% {
    background-image: url('@/assets/images/419124740_719134673659273_130166699053893667_n.jpg');
  }
  100% {
    background-image: url('@/assets/images/2024-08-07.jpg');
  }
}

@keyframes slideUp {
  0%, 100% {
    opacity: 0;
    transform: translateY(200%);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 2;
    transform: translateY(0);
  }
}

.typewriter {
  position: absolute;
  font-size: 3rem;
  width: 23%;
  padding: 40px;
  color: #f8f9fa;
  margin-left: 900px;
  /* border-radius: 10px; */
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); */
}

.container {
  margin-top: 5rem;
  width: 100%;
  height: 100vh;
  background-size: cover;
  /* background-position: center; */
  animation: backgroundCycle 15s infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* flex-direction: column; */
  /* align-items: center; */
  padding: 2.3rem;
}

.text {
  position: absolute;
  width: 100%;
  text-align: center;
}

.text h2,
.text h3,
.text p {
  margin-top: -300px;
  font-size: 3rem;
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  animation: slideUp 2s ease forwards;
  transform: translateY(100%);
}

.content {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.row1,
.row2 {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.testimony {
  width: 300px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgb(41, 40, 40);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.testimony:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.program-photo {
  width: 200px;
  height: 150px;
  border-radius: 10%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.profile-pic img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.user-info p {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}

.message {
  line-height: 1.5rem;
  color: #555;
  font-size: 1rem;
}

.video {
  padding-top: 12%;
  background-color: #16325b;
}

.about-us,
.our-programs,
.photo-gallery,
.upcoming-events,
.contact-us {
  margin-top: 3rem;
  width: 100%;
  /* max-width: 1100px; */
  padding: 2rem;
  background-color: rgba(155, 144, 144, 0.9);
  border-radius: 10px;
}

.about-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.about-image {
  width: 200px;
  border-radius: 10px;
}

.program-list {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.program-item {
  width: 200px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.gallery-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.event-list {
  display: flex;
  gap: 2rem;
  flex-direction: column;
  align-items: center;
}

.event-item {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.event-button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.event-button:hover {
  background-color: #0056b3;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.contact-form input,
.contact-form textarea {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.contact-form button {
  padding: 0.8rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.contact-form button:hover {
  background-color: #0056b3;
}

/* Responsive Styles */
@media only screen and (max-width: 600px) {

  .container {
    padding:  0rem;
    height: 40vh;
  display: flex;
  }

  .text h2,
  .text h3,
  .text p {
    font-size: 1rem;
    margin-top: 0;
  }

  h1 {
    font-size: 1rem;
  }

  .typewriter {
    font-size: 1.5rem;
    width: 90%;
    margin: 0;
    padding: 1rem;
    text-align: center;
  }

  .rows {
    gap: 1rem;
  }

  .testimony {
    width: 100%;
    padding: 1rem;
  }

  .user-info p {
    font-size: 1rem;
  }

  .message {
    font-size: 0.9rem;
  }

  .about-content {
    flex-direction: column;
  }

  .about-image {
    width: 100%;
  }

  .program-item {
    width: 100%;
  }

  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }

  .gallery-item img {
    height: 100px;
  }
}

.mySlides {
  display: none;
  position: absolute;
  width: 100%;
}

.mySlides img {
  width: 100%;
  object-fit: cover;
}

.mySlides.active {
  display: block;
  animation: fade 1.5s;
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

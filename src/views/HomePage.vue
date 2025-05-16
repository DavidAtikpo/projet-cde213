<template>
  <div class="home">
    <NavigationComponent />
    
    <main class="main-content">
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Bienvenue sur CDE Koinonia</h1>
          <p class="hero-subtitle">Votre plateforme de gestion et de suivi des enfants</p>
          <div class="hero-buttons">
            <router-link to="/login" class="btn btn-primary">Se connecter</router-link>
            <router-link to="/user/signup" class="btn btn-secondary">S'inscrire</router-link>
          </div>
        </div>
      </section>

      <section class="features">
        <h2 class="section-title">Nos Services</h2>
        <div class="features-grid">
          <div class="feature-card">
            <i class="feature-icon">👥</i>
            <h3>Gestion des Enfants</h3>
            <p>Suivez facilement les informations et le développement de chaque enfant.</p>
          </div>
          <div class="feature-card">
            <i class="feature-icon">📊</i>
            <h3>Rapports Détaillés</h3>
            <p>Générez des rapports complets sur les activités et le progrès.</p>
          </div>
          <div class="feature-card">
            <i class="feature-icon">🔔</i>
            <h3>Notifications</h3>
            <p>Restez informé des mises à jour importantes en temps réel.</p>
          </div>
        </div>
      </section>

      <TestimonialComponent />
    </main>

    <FooterComponent />
  </div>
</template>

<script>
import NavigationComponent from '@/components/NavigationComponent.vue';
import TestimonialComponent from '@/components/TestimonialComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';

export default {
  name: 'HomePage',
  components: {
    NavigationComponent,
    FooterComponent
  }
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  margin-top: 70px;
}

.hero {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 4rem 2rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  color: #333;
  margin-bottom: 1rem;
  animation: fadeInUp 0.8s ease;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 2rem;
  animation: fadeInUp 0.8s ease 0.2s;
  animation-fill-mode: both;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  animation: fadeInUp 0.8s ease 0.4s;
  animation-fill-mode: both;
}

.btn {
  padding: 0.8rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #db2323;
  color: white;
}

.btn-primary:hover {
  background-color: #b31b1b;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: white;
  color: #db2323;
  border: 2px solid #db2323;
}

.btn-secondary:hover {
  background-color: #db2323;
  color: white;
  transform: translateY(-2px);
}

.features {
  padding: 4rem 2rem;
  background-color: white;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #333;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

@keyframes fadeInUp {
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
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>


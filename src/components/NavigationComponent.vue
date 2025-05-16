<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-logo" @click="closeMenu">
        <img src="../assets/images/logo.jpeg" alt="CDE koinonia" />
      </router-link>
      
      <div class="menu-toggle" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div class="navbar-menu" :class="{ 'active': isMenuOpen }">
        <router-link to="/" class="nav-item" @click="closeMenu">Accueil</router-link>
        <router-link to="/login" class="nav-item" @click="closeMenu">Connexion</router-link>
        <router-link to="/user/signup" class="nav-item" @click="closeMenu">Inscription</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.navbar-logo {
  display: flex;
  align-items: center;
}

.navbar-logo img {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.navbar-logo img:hover {
  transform: scale(1.05);
}

.navbar-menu {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-item {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: #db2323;
  background: rgba(219, 35, 35, 0.1);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 6px;
  cursor: pointer;
  padding: 10px;
}

.menu-toggle span {
  display: block;
  width: 25px;
  height: 2px;
  background-color: #333;
  transition: all 0.3s ease;
}

.menu-toggle.active span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .navbar-menu {
    position: fixed;
    top: 70px;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.98);
    padding: 2rem;
    flex-direction: column;
    gap: 1rem;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .navbar-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-item {
    width: 100%;
    text-align: center;
    padding: 1rem;
  }
}
</style>

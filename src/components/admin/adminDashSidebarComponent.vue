<template>
  <div>
    <div class="menu-toggle" @click="toggleMenu">
      <div class="hamburger"></div>
    </div>
    <div :class="['side-bar', { 'hide-menu': isMobile && !menuVisible }]">
      <div class="content">
        <div class="logo">
          <img class="logo-rr" src="@/assets/images/logo.jpeg" alt="CDE koinonia" />
        </div>
        <div class="side-buttons">
          <router-link to="/admin/userActivity" active-class="active" exact-active-class="exact-active" class="default-link">
            <div class="nav">Tableau</div>
          </router-link>
          <router-link to="/admin/Review" active-class="active" exact-active-class="exact-active" class="default-link">
            <div class="nav">Utilisateurs</div>
          </router-link>
          <router-link to="/admin/dailyObject" active-class="active" exact-active-class="exact-active" class="default-link">
            <div class="nav">Activites</div>
          </router-link>
          <router-link to="/admin/report" active-class="active" exact-active-class="exact-active" class="default-link">
            <div class="nav">Rapport</div>
          </router-link>
          <router-link to="/admin/statistic" active-class="active" exact-active-class="exact-active" class="default-link">
            <div class="nav">Statistique</div>
          </router-link>
          <router-link to="/admin/message" active-class="active" exact-active-class="exact-active" class="default-link">
            <div class="nav">Message</div>
          </router-link>
          <router-link to="/admin/setting" active-class="active" exact-active-class="exact-active" class="default-link">
            <div class="nav">Paramètre</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>


  
<script>
export default {
  data() {
    return {
      isMobile: false,
      menuVisible: false
    };
  },
  mounted() {
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', this.handleResize);
  },
  beforeMount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.isMobile = window.innerWidth < 768;
    },
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    }
  }
};
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.side-bar {
  width: 250px;
  height: 100vh;
  background-color: #333;
  border-right: 1.5px solid rgb(225, 219, 219);
  transition: transform 0.3s ease;
}

.hide-menu {
  transform: translateX(-100%);
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  text-align: center;
  margin: 20px 0;
}

.logo-rr {
  height: 2.5rem;
}

.side-buttons {
  width: 100%;
  padding-top: 1rem;
}

.default-link {
  color: white;
  text-decoration: none;
}

.nav {
  height: 2rem;
  font-size: 15px;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav:hover {
  background-color: #090b29;
}

.active,
.exact-active {
  background-color: #0014cc;
}

.menu-toggle {
  position: fixed;
  top: 20px;
  left: 20px;
  cursor: pointer;
  z-index: 1000;
}

.menu-toggle .hamburger {
  width: 30px;
  height: 3px;
  background-color: #333;
  position: relative;
  transition: background 0.3s;
}

.menu-toggle .hamburger::before,
.menu-toggle .hamburger::after {
  content: '';
  width: 100%;
  height: 100%;
  background-color: #333;
  position: absolute;
  left: 0;
  transition: transform 0.3s;
}

.menu-toggle .hamburger::before {
  top: -8px;
}

.menu-toggle .hamburger::after {
  bottom: -8px;
}

@media screen and (max-width: 768px) {
  .side-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 70%;
    max-width: 250px;
    transform: translateX(-100%);
  }

  .menu-toggle {
    display: block;
  }
}
</style>

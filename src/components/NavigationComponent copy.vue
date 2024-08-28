<!-- <template>
  <header class="header">
    <a href="#" class="logo">
      <img src="../assets/images/logo.jpeg" class="logoimage" alt="CDE koinonia" />
    </a>
    <input class="menu-btn" type="checkbox" id="menu-btn" />
    <label class="menu-icon" for="menu-btn">
      <span class="navicon"></span>
    </label>
    <ul class="menu">
      <li class="Home"><a href="#" @click="goToHomePage">Home</a></li>
      <li><a href="#" @click="signIn">Sign In</a></li>
      <li><a href="#" @click="register">Sign Up</a></li>
    </ul>
  </header>
</template>

<script>
export default {
  methods: {
    goToHomePage() {
      this.$router.push('/');
      this.closeMenu(); 
    },
    signIn() {
      this.$router.push('/login');
      this.closeMenu();  
    },
    register() {
      this.$router.push('/user/signup');
      this.closeMenu(); 
    },
    closeMenu() {
      const menuBtn = document.getElementById('menu-btn');
      if (menuBtn) menuBtn.checked = false;
    }
  }
}
</script>

<style scoped>
/* header */
.header {
  background-image: url('@/assets/images/Screenshot from 2024-08-10 08-42-50.png');
  background-size: cover;
  width: 100%;
  z-index: 3;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid red;
  border-radius: 0px 0px 20px 20px;
}

.header ul {
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
  background-color: transparent;
}

.header li a {
  display: block;
  padding: 20px 20px;
  text-decoration: none;
  font-weight: bold;
  color: #0a0a0a;
}

.header li a:hover,
.header .menu-btn:hover {
  color: #db2323;
}

.header .logo {
  display: block;
  float: left;
  padding: 10px 10px;
  text-decoration: none;
}

.logoimage {
  width: 50px;
  border-radius: 50px 50px;
}

/* menu */
.header .menu {
  clear: both;
  max-height: 0;
  transition: max-height 0.2s ease-out;
}

/* menu icon */
.header .menu-icon {
  cursor: pointer;
  display: inline-block;
  padding: 28px 20px;
  position: relative;
  user-select: none;
}

.header .menu-icon .navicon {
  background: #e5e0e0;
  display: block;
  height: 2px;
  transition: background 0.2s ease-out;
  width: 18px;
}

.header .menu-icon .navicon:before,
.header .menu-icon .navicon:after {
  background: #333;
  content: '';
  display: block;
  height: 100%;
  position: absolute;
  transition: all 0.2s ease-out;
  width: 100%;
}

.header .menu-icon .navicon:before {
  top: 5px;
}

.header .menu-icon .navicon:after {
  top: -5px;
}


.header .menu-btn {
  display: none;
}

.header .menu-btn:checked ~ .menu {
  max-height: 240px;
}

.header .menu-btn:checked ~ .menu-icon .navicon {
  background: transparent;
}

.header .menu-btn:checked ~ .menu-icon .navicon:before {
  transform: rotate(-45deg);
}

.header .menu-btn:checked ~ .menu-icon .navicon:after {
  transform: rotate(45deg);
}

.header .menu-btn:checked ~ .menu-icon:not(.steps) .navicon:before,
.header .menu-btn:checked ~ .menu-icon:not(.steps) .navicon:after {
  top: 0;
}


@media (min-width: 40em) {
  .header li {
    float: left;
  }
  .header li a {
    padding: 20px 30px;
  }
  .header .menu {
    clear: none;
    float: right;
    max-height: none;
  }
  .header .menu-icon {
    display: none;
  }
}

@media only screen and (max-width: 600px) {
  .menu {
    display: flex;
    flex-direction: column;
    align-items:right; 
  }
  .header {
    padding: 0 30px; 
  }
}
</style> -->

<template>
  <header class="header">
    <a href="#" class="logo" @click="toggleMenu">
      <img src="../assets/images/logo.jpeg" class="logoimage" alt="CDE koinonia" />
    </a>
    <ul class="menu" :class="{ 'menu-open': isMenuOpen }">
      <li class="Home"><a href="#" @click="goToHomePage">Home</a></li>
      <li><a href="#" @click="signIn">Sign In</a></li>
      <li><a href="#" @click="register">Sign Up</a></li>
    </ul>
  </header>
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
    goToHomePage() {
      this.$router.push('/');
      this.isMenuOpen = false; // Close menu after clicking
    },
    signIn() {
      this.$router.push('/login');
      this.isMenuOpen = false; // Close menu after clicking
    },
    register() {
      this.$router.push('/user/signup');
      this.isMenuOpen = false; // Close menu after clicking
    }
  }
}
</script>

<style scoped>
/* header */
.header {
  background-image: url('@/assets/images/Screenshot from 2024-08-10 08-42-50.png');
  background-size: cover;
  width: 100%;
  z-index: 3;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid red;
  border-radius: 0px 0px 20px 20px;
}

.header ul {
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
  background-color: transparent;
  display: none;
}

.header .menu.menu-open {
  display: flex;
  justify-content: center; /* Align menu items horizontally in front of the logo */
  position: absolute;
  top: 70px; /* Adjust based on the height of your header */
  left: 10px; /* Adjust to position the menu relative to the logo */
  width: auto;
  background: white; /* Optional: set a background color */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Optional: add shadow for better visibility */
}

.header li a {
  display: block;
  padding: 20px 20px;
  text-decoration: none;
  font-weight: bold;
  color: #0a0a0a;
}

.header li a:hover {
  color: #db2323;
}

.header .logo {
  display: block;
  float: left;
  padding: 10px 10px;
  text-decoration: none;
}

.logoimage {
  width: 50px;
  border-radius: 50px 50px;
}

/* Responsive Design */
@media (min-width: 40em) {
  .header li {
    float: left;
  }
  .header li a {
    padding: 20px 30px;
  }
  .header .menu {
    display: flex;
    justify-content: flex-end;
    position: static;
    background: transparent;
    box-shadow: none;
  }
}

@media only screen and (max-width: 600px) {
  .header .menu.menu-open {
    display: flex;
    /* flex-direction: column; */
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background: white;
  }
}
</style>

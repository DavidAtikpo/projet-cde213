<template>
  <div class="side-bar" >
    <div class="menu-toggle" @click="toggleMenu">
      <div class="hamburger"></div>
      </div>
    <div class="content"  :class="{'hide-menu': isMobile}">
      <div class="logo">
        <img class="logo-rr" src="@/assets/images/logo.jpeg" alt="CDE koinonia" />
      </div>
      
      <div class="side-buttons" >
        <router-link to="/user/analytics" active-class="active" exact-active-class="exact-active" class="default-link">
          <div class="nav">
            Dashboard
          </div></router-link
        >
       
        <router-link
          to="/user/review"
          :active-class="'active'"
          :exact-active-class="'exact-active'"
          class="default-link"
          ><div class="nav">
            Review
          </div></router-link
        >
        <router-link
          to="/user/feedback"
          :active-class="'active'"
          :exact-active-class="'exact-active'"
          class="default-link"
          ><div class="nav">
          feedback
          </div></router-link
        >
        <router-link
          to="/user/Message"
          :active-class="'active'"
          :exact-active-class="'exact-active'"
          class="default-link"
          ><div class="nav">
          Message
          </div></router-link
        >
        <router-link
          to="/user/statistic"
          :active-class="'active'"
          :exact-active-class="'exact-active'"
          class="default-link"
          ><div class="nav">
            Statistique
          </div></router-link
        >
        <router-link to="/user/setting" 
          :active-class="'active'"
          :exact-active-class="'exact-active'"
          class="default-link"
          ><div class="nav">
           Paramettre
          </div></router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
data(){
  return{
    isMobile:false
  };
},
mounted(){
  this.isMobile = window.innerWidth<768;
  window.addEventListener('resize', this.handleResize);
},
beforeMount() {
  window.addEventListener('resize', this.handleResize);
},

methods:{
  handleResize(){
    this.isMobile = window.innerWidth<768;
  },
toggleMenu() {
  this.isMobile =!this.isMobile;
}
}

}
</script>

<style lang="css" scoped>
* {
    margin:0;
    padding:0;
    box-sizing: border-box;
  
  }
  .side-bar {
    margin-top: 50px;
    width:100%;
    height: 100vh;
    background-color:rgb(6, 6, 83);
    border-right: 3.5px solid rgb(158, 6, 6);
  } 
  .side-buttons {
    width: 100%;
    height: 100vh;
    padding-top: 1rem;
  }
  .logo{
    text-align: center;
  }
  .logo-rr {
    height: 2.5rem;
    margin-top: 1rem;
  }
  .svgs {
    margin-right: 1.5rem;
    margin-left: 1rem;
  }
  .default-link {
    color: white;
    text-decoration: none;
  }
  .nav {
    height: 2rem;
    font-size: 15px;
   color:white; 
    vertical-align: middle;
    display: flex;
    margin-left: 40px;
    /* text-align: center; */
    align-items: center;
  }
  .nav:hover {
    color: #090b29;
  }
  
  .active,
  .exact-active {
    background-color: #0014cc;
  }
  
  @media screen and (max-width: 768px) {
    .hide-menu {
      display: none;
    }
    .side-bar{
      height: 139vh;
    }
    .nav {
    height: 2rem;
    font-size: 10px;
   color:white; 
    vertical-align: middle;
    display: flex;
    margin-left: 2px;
  
  }
  }
  
  .menu-toggle {
    display: none;
    cursor: pointer;
  }
  
  .menu-toggle .hamburger {
    background: #333;
    display: block;
    height: 2px;
    position: relative;
    transition: background 0.2s ease-out;
    width: 20px;
    margin-left: 30%;
    margin-top: 15px;
  }
  
  .menu-toggle .hamburger::before,
  .menu-toggle .hamburger::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background-color: black;
    margin: 3px 0;
    position: absolute;
  }
  .menu-toggle .hamburger::before{
    top: 8px;
  }
  .menu-toggle .hamburger::after{
    bottom: -8px;
  }
  /* Show hamburger button only on mobile */
  @media screen and (max-width: 768px) {
    .menu-toggle {
      display: block;
    }
  }

</style>

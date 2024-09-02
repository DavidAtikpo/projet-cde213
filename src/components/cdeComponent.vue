<template>
  <div class="container">
    <div class="text">
      <h2 v-if="currentText == 0">
        <TypewriterText class="typewriter" text="CDE 213 Aneho Togo Nlessi" />
      </h2>
      <p v-if="currentText == 2">Délivrer les enfants de la pauvreté</p>
      <h3 v-if="currentText == 1">CDE KOINONIA</h3>
    </div>
  </div>
</template>
<script>
import TypewriterText from '@/components/TypewriterText.vue';

export default {
  components: {
    TypewriterText,
  },
  data() {
    return {
      currentText: 0,
    };
  },
  mounted() {
    setInterval(() => {
      this.currentText = (this.currentText + 1) % 3;
    }, 5000);
  },
};
</script>


<style scoped>
/* html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background: transparent;
} */

.container {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  animation: backgroundCycle 15s infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}
.typewriter {
  position: absolute;
  font-size: 3rem;
  width: 23%;
  padding: 40px;
  color: #f8f9fa;
  margin-left: 950px;
  /* border-radius: 10px; */
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); */
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

/* Animation du cycle de fond */
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

/* Animation de montée */
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
@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Styles responsives */
@media only screen and (max-width: 600px) {
  .container {
    height: 40vh;
  }

  h2, h3, p {
    font-size: 1.5rem;
  }

  .typewriter {
    font-size: 1.5rem;
    padding: 1rem;
    width: 90%;
    text-align: center;
  }
}
</style>


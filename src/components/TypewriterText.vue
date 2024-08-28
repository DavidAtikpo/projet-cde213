<template>
    <div class="typewriter">
      <span v-for="(char, index) in displayedText" :key="index">{{ char }}</span>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      text: {
        type: String,
        required: true
      },
      speed: {
        type: Number,
        default: 50 // Vitesse de frappe en millisecondes
      }
    },
    data() {
      return {
        displayedText: ""
      };
    },
    mounted() {
      this.typeText();
    },
    methods: {
      typeText() {
        let currentIndex = 0;
        const interval = setInterval(() => {
          if (currentIndex < this.text.length) {
            this.displayedText += this.text[currentIndex];
            currentIndex++;
          } else {
            clearInterval(interval);
          }
        }, this.speed);
      }
    }
  };
  </script>
  
  <style scoped>
  .typewriter {
    font-size: 16px;
    font-family: 'Courier New', Courier, monospace;
    white-space: pre-wrap;
  }
  </style>
  
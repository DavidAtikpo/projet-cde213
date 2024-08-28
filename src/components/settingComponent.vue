<template>
  <div :class="[theme, 'page']">
    <div class="container">
      <h1>Paramètres</h1>
      <div class="button-group">
        <button @click="changeTheme('dark')">Thème Sombre</button>
        <button @click="changeTheme('light')">Thème Clair</button>
      </div>
      <div class="button-group">
        <button @click="changeLanguage('fr')">Changer en Français</button>
        <button @click="changeLanguage('en')">Switch to English</button>
      </div>
      <div class="button-group">
        <button @click="resetSettings">Réinitialiser les Paramètres</button>
      </div>
    </div>
  </div>
</template>



<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['theme'])
  },
  methods: {
    ...mapActions(['setTheme', 'setLanguage', 'resetSettings']),
    changeTheme(theme) {
      this.setTheme(theme);
    },
    changeLanguage(language) {
      this.setLanguage(language);
    },
    resetSettings() {
      this.setTheme('light');
      this.setLanguage('fr');
    }
  }
};
</script>



<style scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 10px;
  transition: background-color 0.3s, color 0.3s;
}

.container {
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  transition: background-color 0.3s, color 0.3s;
}

.button-group {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

button {
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s;
  width: 100%;
}

button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.dark.page {
  background-color: #333;
  color: #fff;
}

.light.page {
  background-color: #fff;
  color: #333;
}

.dark .container {
  background-color: #444;
  color: #fff;
}

.light .container {
  background-color: #f9f9f9;
  color: #333;
}

.dark button {
  background-color: #555;
  color: #fff;
}

.light button {
  background-color: #ddd;
  color: #333;
}

.dark button:hover {
  background-color: #666;
}

.light button:hover {
  background-color: #ccc;
}
</style>


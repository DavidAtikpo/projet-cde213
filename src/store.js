// store/index.js
import { createStore } from 'vuex';

const store = createStore({
  state: {
    theme: 'light',
    language: 'en' // Ajoutez l'état de la langue
  },
  mutations: {
    setTheme(state, theme) {
      state.theme = theme;
    },
    setLanguage(state, language) { // Ajoutez une mutation pour la langue
      state.language = language;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    toggleLanguage(state) {
      state.language = state.language === 'en' ? 'fr' : 'en';
    }
  },
  actions: {
    setTheme({ commit }, theme) {
      commit('setTheme', theme);
    },
    setLanguage({ commit }, language) { // Ajoutez une action pour la langue
      commit('setLanguage', language);
    }
  }
});

export default store;

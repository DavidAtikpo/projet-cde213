<template>
    <div class="search">
      <!-- <input type="text" v-model="searchQuery" @input="search" placeholder="Rechercher..."> -->
      <ul v-if="searchResults.length">
        <li v-for="(result, index) in searchResults" :key="index">{{ result }}</li>
      </ul>
      <p v-else>Aucun résultat trouvé.</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchQuery: '',
        searchData: ['Résultat 1', 'Résultat 2', 'Résultat 3', 'Résultat 4'], // Données de recherche simulées
        searchResults: []
      };
    },
    methods: {
      search() {
        this.searchResults = this.searchData.filter(item =>
          item.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    }
  };
  </script>
  
  <style scoped>
  .search {
    max-width: 400px;
    margin: auto;
  }
  
  input[type="text"] {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    background: #f9f9f9;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-bottom: 5px;
    cursor: pointer;
  }
  
  li:hover {
    background: #e0e0e0;
  }
  </style>
  
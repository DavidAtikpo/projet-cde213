<template>
  <div class="page">
    <div class="header">
      <h5>Liste des enfants absents</h5>
      <em>Effectif total: ({{ children.length }})</em>
    </div>
    <div v-for="child in children" :key="child._id" class="child-item" @click="toggleDropdown(child._id)">
      <div class="profile-info" @click="preventDropdownClose($event)">
        <img :src="child.profilePhotoURL" alt="Profile Icon" class="profile-icon">
        <div class="child-details">
          <p class="name">{{ child.firstName }}</p>
          <p class="class">Class: ({{ child.class }})</p>
          <p class="tel">Tel: ({{ child.phoneNumber }})</p>
          <p class="nbre">Nbre de fois: ({{ child.absentCount }})</p>
          <p class="date">Date: ({{ child.absentDates.join(', ') }})</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  data() {
    return {
      children: [],
    };
  },
  created() {
    this.fetchChildren();
  },
  methods: {
    async fetchChildren() {
      try {
        const response = await axios.get(`${API_BASE_URL}/absent/absent`);
        this.children = response.data.sort((a, b) => a.firstName.localeCompare(b.firstName));
        console.log('absentprofile',this.children);
      } catch (error) {
        console.error('Erreur lors de la récupération des enfants :', error);
      }
    },
    // toggleDropdown(childId) {
    //   // Votre logique pour basculer le dropdown (menu déroulant)
    // },
    preventDropdownClose(event) {
      // Votre logique pour empêcher la fermeture du dropdown
      event.stopPropagation();
    },
  },
};
</script>

<style scoped>
.page {
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.child-item {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.profile-info {
  display: flex;
  align-items: center;
}

.profile-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}

.child-details {
  flex-grow: 1;
}

.name {
  font-weight: bold;
}

.class,
.tel,
.nbre,
.date {
  color: #666;
}
</style>

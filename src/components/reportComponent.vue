<template>
  <div>
    <div class="report-component" v-for="user in users" :key="user._id">
      <div class="profile-info">
        <img class="icone" :src="user.profilePhotoURL" alt="Profile">
        <span><span>{{ user.firstName }}</span></span>
      </div>
      <div class="report-time"><span class="date">{{ user.createdAt }}</span></div>
      <div class="report-info">
        <p>Objectif défini:<span class="objectif">{{ user.dailyGoal }}</span></p>
        <h3>Rapport de l'utilisateur</h3>
        <div>Role:<span class="role">{{ user.role }}</span></div>
        <p>Percentage:<span :class="getPercentageClass(user)">{{user.pourcentage }}%</span></p>
        <p>Decision:<span :class="getDecisionClass(user)">{{ user.choix }}</span></p>
        <p>Justification:<span class="justification">{{ user.justification }}</span></p>
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
      users: []
    };
  },
  mounted() {
    this.fetchReportFromBackend();
  },
  methods: {
    fetchReportFromBackend() {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      axios.get(`${API_BASE_URL}/admin/allreport`, { headers })
        .then(res => {
          // Insérer les nouveaux utilisateurs au début de la liste
          this.users = res.data.map(user => ({
            ...user,
            profilePhotoURL: `${API_BASE_URL}` + user.profilePhotoURL
          })).reverse();
          console.log('users', this.users);
        })
        .catch(error => {
          console.error('Error fetching report data from backend:', error);
        });
    },
    getPercentageClass(user) {
      if (user.choix === 'non' && user.pourcentage <= 60) {
        return 'percentage-red';
      }
      return 'percentage-green';
    },
    getDecisionClass(user) {
      if (user.choix === 'non' && user.pourcentage >= 60) {
        return 'decision-red';
      }
      if (user.choix === 'oui' && user.pourcentage >= 100) {
        return 'decision-green';
      }
      return '';
    }
  }
};

  </script>
  
  <style scoped>
.date {
  color: blue;
}
.objectif {
  color: blue;
}
.pourcentage {
  color: rgb(28, 221, 28);
}
.role {
  color: rgb(185, 15, 15);
}
.choix {
  color: rgb(6, 247, 6);
}
.justification {
  color: rgb(12, 202, 12);
}
.profile-info img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}
.report-component {
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
  width: 40%;
  margin-left: 10px;
  margin-top: 5px;
  border: 1px solid red;
}
.report-time {
  font-size: 14px;
  margin-bottom: 10px;
}
.report-info h3 {
  margin: 0;
}
.report-info p {
  margin: 0;
  color: #666;
}
.percentage-red {
  color: red;
}
.percentage-green {
  color: rgb(28, 221, 28);
}
.decision-red {
  color: red;
}
.decision-green {
  color: rgb(6, 247, 6);
}
</style>

  
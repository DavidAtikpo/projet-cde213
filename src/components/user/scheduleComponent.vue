<template>
  <div class="schedule-page">
    <div class="header">
      <h2>Emploi du Temps</h2>
      <p>Gérez et consultez les horaires des activités</p>
    </div>

    <!-- Filters -->
    <div class="filters-container">
      <div class="filter-item">
        <label>Sélectionner la semaine</label>
        <input 
          type="week" 
          v-model="selectedWeek" 
          @change="loadSchedule"
          class="week-picker"
        >
      </div>
      <div class="filter-item">
        <label>Filtrer par groupe</label>
        <select v-model="selectedGroup" @change="filterSchedule" class="group-filter">
          <option value="">Tous les groupes</option>
          <option v-for="group in groups" :key="group.id" :value="group.id">
            {{ group.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Schedule Grid -->
    <div class="schedule-container">
      <div class="schedule-grid">
        <!-- Time column -->
        <div class="time-column">
          <div class="time-header">Heure</div>
          <div 
            v-for="time in timeSlots" 
            :key="time" 
            class="time-slot"
          >
            {{ time }}
          </div>
        </div>

        <!-- Days columns -->
        <div 
          v-for="day in weekDays" 
          :key="day.key" 
          class="day-column"
        >
          <div class="day-header">
            <span class="day-name">{{ day.name }}</span>
            <span class="day-date">{{ day.date }}</span>
          </div>
          
          <div 
            v-for="time in timeSlots" 
            :key="time" 
            class="schedule-cell"
            @click="openActivityModal(day.key, time)"
          >
            <div 
              v-if="getActivity(day.key, time)" 
              class="activity-block"
              :class="getActivity(day.key, time).type"
            >
              <div class="activity-title">{{ getActivity(day.key, time).title }}</div>
              <div class="activity-group">{{ getActivity(day.key, time).group }}</div>
              <div class="activity-time">{{ getActivity(day.key, time).duration }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Modifier l\'activité' : 'Nouvelle activité' }}</h3>
          <button @click="closeModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveActivity" class="activity-form">
          <div class="form-group">
            <label>Titre de l'activité</label>
            <input 
              type="text" 
              v-model="currentActivity.title" 
              required
              placeholder="Ex: Cours de musique"
            >
          </div>

          <div class="form-group">
            <label>Groupe</label>
            <select v-model="currentActivity.group" required>
              <option value="">Sélectionner un groupe</option>
              <option v-for="group in groups" :key="group.id" :value="group.name">
                {{ group.name }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Heure de début</label>
              <input 
                type="time" 
                v-model="currentActivity.startTime" 
                required
              >
            </div>
            <div class="form-group">
              <label>Heure de fin</label>
              <input 
                type="time" 
                v-model="currentActivity.endTime" 
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label>Type d'activité</label>
            <select v-model="currentActivity.type" required>
              <option value="education">Éducation</option>
              <option value="sport">Sport</option>
              <option value="art">Art</option>
              <option value="recreation">Récréation</option>
              <option value="meal">Repas</option>
            </select>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="currentActivity.description" 
              placeholder="Description de l'activité..."
              rows="3"
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">
              Annuler
            </button>
            <button type="submit" class="save-btn">
              <i class="fas fa-save"></i>
              {{ isEditing ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  name: 'ScheduleComponent',
  data() {
    return {
      selectedWeek: '',
      selectedGroup: '',
      showModal: false,
      isEditing: false,
      currentActivity: {
        title: '',
        group: '',
        startTime: '',
        endTime: '',
        type: 'education',
        description: '',
        day: '',
        time: ''
      },
      groups: [
        { id: 1, name: 'Groupe A (3-4 ans)' },
        { id: 2, name: 'Groupe B (5-6 ans)' },
        { id: 3, name: 'Groupe C (7-8 ans)' },
        { id: 4, name: 'Groupe D (9-10 ans)' }
      ],
      timeSlots: [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
      ],
      weekDays: [
        { key: 'monday', name: 'Lundi', date: '' },
        { key: 'tuesday', name: 'Mardi', date: '' },
        { key: 'wednesday', name: 'Mercredi', date: '' },
        { key: 'thursday', name: 'Jeudi', date: '' },
        { key: 'friday', name: 'Vendredi', date: '' },
        { key: 'saturday', name: 'Samedi', date: '' }
      ],
      activities: {
        monday: {
          '09:00': {
            title: 'Accueil et jeux libres',
            group: 'Tous les groupes',
            duration: '30min',
            type: 'recreation'
          },
          '10:00': {
            title: 'Activité éducative',
            group: 'Groupe A',
            duration: '45min',
            type: 'education'
          }
        },
        tuesday: {
          '10:30': {
            title: 'Sport et motricité',
            group: 'Groupe B',
            duration: '45min',
            type: 'sport'
          }
        }
      }
    };
  },
  mounted() {
    this.initializeWeek();
    this.loadSchedule();
  },
  methods: {
    initializeWeek() {
      const today = new Date();
      const year = today.getFullYear();
      const week = this.getWeekNumber(today);
      this.selectedWeek = `${year}-W${week.toString().padStart(2, '0')}`;
      this.updateWeekDates();
    },
    
    getWeekNumber(date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
      const week1 = new Date(d.getFullYear(), 0, 4);
      return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    },
    
    updateWeekDates() {
      const [year, week] = this.selectedWeek.split('-W');
      const firstDay = new Date(year, 0, 1 + (week - 1) * 7);
      const dayOfWeek = firstDay.getDay();
      const monday = new Date(firstDay);
      monday.setDate(firstDay.getDate() - dayOfWeek + 1);
      
      this.weekDays.forEach((day, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        day.date = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      });
    },
    
    loadSchedule() {
      this.updateWeekDates();
      // Simuler le chargement des données
      console.log('Chargement de l\'emploi du temps pour:', this.selectedWeek);
    },
    
    filterSchedule() {
      console.log('Filtrage par groupe:', this.selectedGroup);
    },
    
    getActivity(day, time) {
      return this.activities[day] && this.activities[day][time];
    },
    
    openActivityModal(day, time) {
      this.currentActivity.day = day;
      this.currentActivity.time = time;
      
      const existingActivity = this.getActivity(day, time);
      if (existingActivity) {
        this.isEditing = true;
        this.currentActivity = { ...existingActivity, day, time };
      } else {
        this.isEditing = false;
        this.currentActivity = {
          title: '',
          group: '',
          startTime: time,
          endTime: '',
          type: 'education',
          description: '',
          day,
          time
        };
      }
      
      this.showModal = true;
    },
    
    closeModal() {
      this.showModal = false;
      this.currentActivity = {
        title: '',
        group: '',
        startTime: '',
        endTime: '',
        type: 'education',
        description: '',
        day: '',
        time: ''
      };
    },
    
    saveActivity() {
      if (!this.activities[this.currentActivity.day]) {
        this.activities[this.currentActivity.day] = {};
      }
      
      this.activities[this.currentActivity.day][this.currentActivity.time] = {
        title: this.currentActivity.title,
        group: this.currentActivity.group,
        duration: this.calculateDuration(this.currentActivity.startTime, this.currentActivity.endTime),
        type: this.currentActivity.type,
        description: this.currentActivity.description
      };
      
      this.closeModal();
      // Ici, vous pourriez ajouter l'appel API pour sauvegarder
      console.log('Activité sauvegardée:', this.currentActivity);
    },
    
    calculateDuration(start, end) {
      const startTime = new Date(`1970-01-01T${start}:00`);
      const endTime = new Date(`1970-01-01T${end}:00`);
      const diff = endTime - startTime;
      const minutes = diff / (1000 * 60);
      return `${minutes}min`;
    }
  }
};
</script>

<style scoped>
.schedule-page {
  padding: 1.2rem;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.header h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.3rem;
  font-weight: 600;
}

.header p {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

.filters-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-item label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
}

.week-picker,
.group-filter {
  padding: 0.6rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
}

.week-picker:focus,
.group-filter:focus {
  outline: none;
  border-color: #db2323;
  box-shadow: 0 0 0 3px rgba(219, 35, 35, 0.1);
}

.schedule-container {
  background: white;
  border-radius: 0.6rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.schedule-grid {
  display: grid;
  grid-template-columns: 80px repeat(6, 1fr);
  min-height: 600px;
}

.time-column {
  background: #f8f9fa;
  border-right: 1px solid #e2e8f0;
}

.time-header {
  padding: 1rem 0.5rem;
  background: #db2323;
  color: white;
  font-weight: 600;
  text-align: center;
  font-size: 0.9rem;
}

.time-slot {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.8rem;
  color: #4a5568;
  text-align: center;
  background: #f8f9fa;
}

.day-column {
  border-right: 1px solid #e2e8f0;
}

.day-header {
  padding: 0.8rem;
  background: #db2323;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.day-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.day-date {
  font-size: 0.8rem;
  opacity: 0.9;
}

.schedule-cell {
  min-height: 60px;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
}

.schedule-cell:hover {
  background: #f8f9fa;
}

.activity-block {
  margin: 0.2rem;
  padding: 0.5rem;
  border-radius: 0.3rem;
  height: calc(100% - 0.4rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.activity-block:hover {
  transform: scale(1.02);
}

.activity-block.education {
  background: linear-gradient(135deg, #4299e1, #3182ce);
}

.activity-block.sport {
  background: linear-gradient(135deg, #48bb78, #38a169);
}

.activity-block.art {
  background: linear-gradient(135deg, #ed8936, #dd6b20);
}

.activity-block.recreation {
  background: linear-gradient(135deg, #9f7aea, #805ad5);
}

.activity-block.meal {
  background: linear-gradient(135deg, #38b2ac, #319795);
}

.activity-title {
  font-weight: 600;
  font-size: 0.75rem;
  margin-bottom: 0.2rem;
}

.activity-group {
  font-size: 0.7rem;
  opacity: 0.9;
}

.activity-time {
  font-size: 0.7rem;
  opacity: 0.8;
  margin-top: 0.2rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 0.6rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #718096;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 0.3rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f8f9fa;
  color: #db2323;
}

.activity-form {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #db2323;
  box-shadow: 0 0 0 3px rgba(219, 35, 35, 0.1);
}

.modal-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn,
.save-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cancel-btn {
  background: #e2e8f0;
  color: #4a5568;
}

.cancel-btn:hover {
  background: #cbd5e0;
}

.save-btn {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  box-shadow: 0 2px 4px rgba(219, 35, 35, 0.3);
}

.save-btn:hover {
  background: linear-gradient(135deg, #b31b1b, #991b1b);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(219, 35, 35, 0.4);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .schedule-grid {
    grid-template-columns: 70px repeat(6, 1fr);
  }
  
  .time-slot {
    font-size: 0.75rem;
    padding: 0.5rem 0.3rem;
  }
  
  .activity-block {
    font-size: 0.75rem;
  }
}

@media (max-width: 768px) {
  .schedule-page {
    padding: 0.8rem;
  }
  
  .filters-container {
    flex-direction: column;
  }
  
  .schedule-grid {
    grid-template-columns: 60px repeat(3, 1fr);
    font-size: 0.8rem;
  }
  
  .day-column:nth-child(n+5) {
    display: none;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style> 
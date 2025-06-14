<template>
  <div class="calendar-page">
    <div class="header">
      <h2>Calendrier</h2>
      <p>Consultez et gérez les événements et activités</p>
    </div>

    <!-- Calendar Controls -->
    <div class="calendar-controls">
      <div class="view-controls">
        <button 
          v-for="view in views" 
          :key="view.key"
          :class="['view-btn', { active: currentView === view.key }]"
          @click="currentView = view.key"
        >
          <i :class="view.icon"></i>
          {{ view.name }}
        </button>
      </div>

      <div class="navigation-controls">
        <button @click="previousPeriod" class="nav-btn">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h3 class="period-title">{{ periodTitle }}</h3>
        <button @click="nextPeriod" class="nav-btn">
          <i class="fas fa-chevron-right"></i>
        </button>
        <button @click="goToToday" class="today-btn">
          Aujourd'hui
        </button>
      </div>
    </div>

    <!-- Calendar View -->
    <div class="calendar-container">
      <!-- Month View -->
      <div v-if="currentView === 'month'" class="month-view">
        <div class="weekdays">
          <div v-for="day in weekDays" :key="day" class="weekday">
            {{ day }}
          </div>
        </div>
        <div class="calendar-grid">
          <div 
            v-for="day in calendarDays" 
            :key="day.date"
            :class="['calendar-day', {
              'other-month': !day.isCurrentMonth,
              'today': day.isToday,
              'selected': day.isSelected
            }]"
            @click="selectDay(day)"
          >
            <div class="day-number">{{ day.day }}</div>
            <div class="day-events">
              <div 
                v-for="event in day.events" 
                :key="event.id"
                :class="['event-dot', event.type]"
                @click.stop="openEventModal(event)"
                :title="event.title"
              >
                {{ event.title.substring(0, 20) }}{{ event.title.length > 20 ? '...' : '' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Week View -->
      <div v-if="currentView === 'week'" class="week-view">
        <div class="week-header">
          <div class="time-gutter"></div>
          <div 
            v-for="day in weekViewDays" 
            :key="day.date"
            :class="['week-day-header', { today: day.isToday }]"
          >
            <div class="day-name">{{ day.name }}</div>
            <div class="day-date">{{ day.date }}</div>
          </div>
        </div>
        
        <div class="week-content">
          <div class="time-slots">
            <div v-for="time in timeSlots" :key="time" class="time-slot">
              {{ time }}
            </div>
          </div>
          <div class="week-grid">
            <div 
              v-for="day in weekViewDays" 
              :key="day.date"
              class="week-day-column"
            >
              <div 
                v-for="time in timeSlots" 
                :key="time"
                class="time-cell"
                @click="openCreateModal(day.date, time)"
              >
                <div 
                  v-for="event in getEventsForTime(day.date, time)" 
                  :key="event.id"
                  :class="['week-event', event.type]"
                  @click.stop="openEventModal(event)"
                >
                  {{ event.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Day View -->
      <div v-if="currentView === 'day'" class="day-view">
        <div class="day-header">
          <h3>{{ selectedDay.name }} {{ selectedDay.date }}</h3>
        </div>
        <div class="day-schedule">
          <div class="time-column">
            <div v-for="time in extendedTimeSlots" :key="time" class="time-slot">
              {{ time }}
            </div>
          </div>
          <div class="events-column">
            <div 
              v-for="time in extendedTimeSlots" 
              :key="time"
              class="time-cell"
              @click="openCreateModal(selectedDay.date, time)"
            >
              <div 
                v-for="event in getEventsForTime(selectedDay.date, time)" 
                :key="event.id"
                :class="['day-event', event.type]"
                @click.stop="openEventModal(event)"
              >
                <div class="event-time">{{ event.startTime }} - {{ event.endTime }}</div>
                <div class="event-title">{{ event.title }}</div>
                <div class="event-description">{{ event.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Modal -->
    <div v-if="showEventModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingEvent ? 'Modifier l\'événement' : 'Nouvel événement' }}</h3>
          <button @click="closeEventModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveEvent" class="event-form">
          <div class="form-group">
            <label>Titre</label>
            <input 
              type="text" 
              v-model="currentEvent.title" 
              required
              placeholder="Titre de l'événement"
            >
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Date</label>
              <input 
                type="date" 
                v-model="currentEvent.date" 
                required
              >
            </div>
            <div class="form-group">
              <label>Type</label>
              <select v-model="currentEvent.type" required>
                <option value="activity">Activité</option>
                <option value="event">Événement</option>
                <option value="meeting">Réunion</option>
                <option value="holiday">Vacances</option>
                <option value="birthday">Anniversaire</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Heure de début</label>
              <input 
                type="time" 
                v-model="currentEvent.startTime"
              >
            </div>
            <div class="form-group">
              <label>Heure de fin</label>
              <input 
                type="time" 
                v-model="currentEvent.endTime"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="currentEvent.description" 
              placeholder="Description de l'événement..."
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Participants</label>
            <input 
              type="text" 
              v-model="currentEvent.participants" 
              placeholder="Liste des participants"
            >
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeEventModal" class="cancel-btn">
              Annuler
            </button>
            <button v-if="editingEvent" type="button" @click="deleteEvent" class="delete-btn">
              <i class="fas fa-trash"></i>
              Supprimer
            </button>
            <button type="submit" class="save-btn">
              <i class="fas fa-save"></i>
              {{ editingEvent ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CalendarComponent',
  data() {
    return {
      currentView: 'month',
      currentDate: new Date(),
      selectedDate: new Date(),
      showEventModal: false,
      editingEvent: null,
      currentEvent: {
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        type: 'activity',
        description: '',
        participants: ''
      },
      views: [
        { key: 'month', name: 'Mois', icon: 'fas fa-th' },
        { key: 'week', name: 'Semaine', icon: 'fas fa-calendar-week' },
        { key: 'day', name: 'Jour', icon: 'fas fa-calendar-day' }
      ],
      weekDays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      timeSlots: [
        '08:00', '09:00', '10:00', '11:00', '12:00', 
        '13:00', '14:00', '15:00', '16:00', '17:00'
      ],
      extendedTimeSlots: [
        '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
      ],
      events: [
        {
          id: 1,
          title: 'Réunion équipe',
          date: '2024-01-15',
          startTime: '09:00',
          endTime: '10:30',
          type: 'meeting',
          description: 'Réunion hebdomadaire de l\'équipe éducative',
          participants: 'Tous les éducateurs'
        },
        {
          id: 2,
          title: 'Activité peinture',
          date: '2024-01-16',
          startTime: '14:00',
          endTime: '15:30',
          type: 'activity',
          description: 'Atelier de peinture créative',
          participants: 'Groupe A'
        },
        {
          id: 3,
          title: 'Sortie parc',
          date: '2024-01-17',
          startTime: '10:00',
          endTime: '11:30',
          type: 'event',
          description: 'Sortie au parc municipal',
          participants: 'Tous les groupes'
        }
      ]
    };
  },
  computed: {
    periodTitle() {
      const date = this.currentDate;
      if (this.currentView === 'month') {
        return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      } else if (this.currentView === 'week') {
        const weekStart = this.getWeekStart(date);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.getDate()} - ${weekEnd.getDate()} ${weekEnd.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;
      } else {
        return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      }
    },
    calendarDays() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(firstDay.getDate() - (firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1));
      
      const days = [];
      const current = new Date(startDate);
      
      for (let i = 0; i < 42; i++) {
        const dayEvents = this.getEventsForDate(current.toISOString().split('T')[0]);
        days.push({
          date: current.toISOString().split('T')[0],
          day: current.getDate(),
          isCurrentMonth: current.getMonth() === month,
          isToday: this.isToday(current),
          isSelected: this.isSameDate(current, this.selectedDate),
          events: dayEvents
        });
        current.setDate(current.getDate() + 1);
      }
      
      return days;
    },
    weekViewDays() {
      const weekStart = this.getWeekStart(this.currentDate);
      const days = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + i);
        days.push({
          date: date.toISOString().split('T')[0],
          name: this.weekDays[i],
          isToday: this.isToday(date)
        });
      }
      
      return days;
    },
    selectedDay() {
      return {
        date: this.selectedDate.toISOString().split('T')[0],
        name: this.selectedDate.toLocaleDateString('fr-FR', { weekday: 'long' })
      };
    }
  },
  methods: {
    previousPeriod() {
      const date = new Date(this.currentDate);
      if (this.currentView === 'month') {
        date.setMonth(date.getMonth() - 1);
      } else if (this.currentView === 'week') {
        date.setDate(date.getDate() - 7);
      } else {
        date.setDate(date.getDate() - 1);
      }
      this.currentDate = date;
    },
    
    nextPeriod() {
      const date = new Date(this.currentDate);
      if (this.currentView === 'month') {
        date.setMonth(date.getMonth() + 1);
      } else if (this.currentView === 'week') {
        date.setDate(date.getDate() + 7);
      } else {
        date.setDate(date.getDate() + 1);
      }
      this.currentDate = date;
    },
    
    goToToday() {
      this.currentDate = new Date();
      this.selectedDate = new Date();
    },
    
    selectDay(day) {
      this.selectedDate = new Date(day.date);
      if (this.currentView === 'month') {
        this.currentView = 'day';
      }
    },
    
    getWeekStart(date) {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    },
    
    isToday(date) {
      const today = new Date();
      return this.isSameDate(date, today);
    },
    
    isSameDate(date1, date2) {
      return date1.toDateString() === date2.toDateString();
    },
    
    getEventsForDate(date) {
      return this.events.filter(event => event.date === date);
    },
    
    getEventsForTime(date, time) {
      return this.events.filter(event => 
        event.date === date && 
        event.startTime && 
        event.startTime.startsWith(time.substring(0, 2))
      );
    },
    
    openCreateModal(date, time = '') {
      this.editingEvent = null;
      this.currentEvent = {
        title: '',
        date: date,
        startTime: time,
        endTime: '',
        type: 'activity',
        description: '',
        participants: ''
      };
      this.showEventModal = true;
    },
    
    openEventModal(event) {
      this.editingEvent = event;
      this.currentEvent = { ...event };
      this.showEventModal = true;
    },
    
    closeEventModal() {
      this.showEventModal = false;
      this.editingEvent = null;
      this.currentEvent = {
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        type: 'activity',
        description: '',
        participants: ''
      };
    },
    
    saveEvent() {
      if (this.editingEvent) {
        const index = this.events.findIndex(e => e.id === this.editingEvent.id);
        this.events.splice(index, 1, { ...this.currentEvent, id: this.editingEvent.id });
      } else {
        const newEvent = { 
          ...this.currentEvent, 
          id: Date.now() 
        };
        this.events.push(newEvent);
      }
      this.closeEventModal();
    },
    
    deleteEvent() {
      if (this.editingEvent) {
        const index = this.events.findIndex(e => e.id === this.editingEvent.id);
        this.events.splice(index, 1);
        this.closeEventModal();
      }
    }
  }
};
</script>

<style scoped>
.calendar-page {
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

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.view-controls {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.4rem;
  background: white;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.view-btn:hover {
  background: #f8f9fa;
  border-color: #db2323;
}

.view-btn.active {
  background: #db2323;
  color: white;
  border-color: #db2323;
}

.navigation-controls {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.nav-btn {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.4rem;
  background: white;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: #f8f9fa;
  border-color: #db2323;
  color: #db2323;
}

.today-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #db2323;
  border-radius: 0.4rem;
  background: white;
  color: #db2323;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.today-btn:hover {
  background: #db2323;
  color: white;
}

.period-title {
  font-size: 1.2rem;
  color: #2d3748;
  margin: 0;
  font-weight: 600;
  text-transform: capitalize;
}

.calendar-container {
  background: white;
  border-radius: 0.6rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Month View */
.month-view {
  padding: 1rem;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 0.5rem;
}

.weekday {
  padding: 0.8rem;
  text-align: center;
  font-weight: 600;
  color: #db2323;
  background: #f8f9fa;
  border-bottom: 2px solid #db2323;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e2e8f0;
}

.calendar-day {
  background: white;
  min-height: 120px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.calendar-day:hover {
  background: #f8f9fa;
}

.calendar-day.other-month {
  color: #a0aec0;
  background: #f9f9f9;
}

.calendar-day.today {
  background: rgba(219, 35, 35, 0.1);
  border: 2px solid #db2323;
}

.calendar-day.selected {
  background: rgba(219, 35, 35, 0.2);
}

.day-number {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.day-events {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.event-dot {
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  font-size: 0.75rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.event-dot:hover {
  transform: scale(1.05);
}

.event-dot.activity {
  background: #4299e1;
}

.event-dot.event {
  background: #48bb78;
}

.event-dot.meeting {
  background: #ed8936;
}

.event-dot.holiday {
  background: #9f7aea;
}

.event-dot.birthday {
  background: #f56565;
}

/* Week View */
.week-view {
  padding: 1rem;
}

.week-header {
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  margin-bottom: 0.5rem;
}

.time-gutter {
  background: #f8f9fa;
}

.week-day-header {
  padding: 0.8rem;
  text-align: center;
  background: #f8f9fa;
  border-bottom: 2px solid #db2323;
}

.week-day-header.today {
  background: rgba(219, 35, 35, 0.1);
  color: #db2323;
  font-weight: 600;
}

.week-content {
  display: grid;
  grid-template-columns: 80px 1fr;
}

.time-slots {
  background: #f8f9fa;
  border-right: 1px solid #e2e8f0;
}

.time-slot {
  padding: 1rem 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
  font-size: 0.8rem;
  color: #4a5568;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.week-day-column {
  border-right: 1px solid #e2e8f0;
}

.time-cell {
  min-height: 60px;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
  padding: 0.2rem;
}

.time-cell:hover {
  background: #f8f9fa;
}

.week-event {
  background: #4299e1;
  color: white;
  padding: 0.3rem 0.5rem;
  border-radius: 0.3rem;
  font-size: 0.8rem;
  margin-bottom: 0.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.week-event:hover {
  transform: scale(1.02);
}

/* Day View */
.day-view {
  padding: 1rem;
}

.day-header {
  text-align: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.4rem;
}

.day-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.3rem;
  text-transform: capitalize;
}

.day-schedule {
  display: grid;
  grid-template-columns: 100px 1fr;
}

.time-column {
  background: #f8f9fa;
  border-right: 1px solid #e2e8f0;
}

.events-column {
  background: white;
}

.day-event {
  background: #4299e1;
  color: white;
  padding: 0.8rem;
  border-radius: 0.4rem;
  margin: 0.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.day-event:hover {
  transform: scale(1.02);
}

.event-time {
  font-size: 0.8rem;
  opacity: 0.9;
  margin-bottom: 0.3rem;
}

.event-title {
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.event-description {
  font-size: 0.85rem;
  opacity: 0.9;
}

/* Modal */
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

.event-form {
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
.save-btn,
.delete-btn {
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

.delete-btn {
  background: linear-gradient(135deg, #f56565, #e53e3e);
  color: white;
  box-shadow: 0 2px 4px rgba(245, 101, 101, 0.3);
}

.delete-btn:hover {
  background: linear-gradient(135deg, #e53e3e, #c53030);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(245, 101, 101, 0.4);
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
  .calendar-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .navigation-controls {
    justify-content: center;
  }
  
  .week-header,
  .week-grid {
    grid-template-columns: 60px repeat(7, 1fr);
  }
}

@media (max-width: 768px) {
  .calendar-page {
    padding: 0.8rem;
  }
  
  .view-controls {
    width: 100%;
    justify-content: center;
  }
  
  .calendar-day {
    min-height: 80px;
    font-size: 0.8rem;
  }
  
  .week-header,
  .week-grid {
    grid-template-columns: 50px repeat(5, 1fr);
  }
  
  .week-day-header:nth-child(n+7) {
    display: none;
  }
  
  .week-day-column:nth-child(n+6) {
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
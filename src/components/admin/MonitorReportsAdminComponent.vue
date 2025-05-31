<template>
  <div class="monitor-reports-admin-page">
    <h2>Rapports des Moniteurs</h2>
    <div class="filters">
      <select v-model="selectedClass">
        <option value="">Toutes les classes</option>
        <option v-for="classe in classes" :key="classe._id" :value="classe._id">
          {{ classe.name }}
        </option>
      </select>
      <select v-model="selectedMonitor">
        <option value="">Tous les moniteurs</option>
        <option v-for="monitor in monitors" :key="monitor._id" :value="monitor._id">
          {{ monitor.firstName }} {{ monitor.lastName }}
        </option>
      </select>
      <input 
        type="date" 
        v-model="selectedDate"
        :max="new Date().toISOString().split('T')[0]"
      />
    </div>
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else>
      <table class="reports-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Classe</th>
            <th>Moniteur</th>
            <th>Titre du cours</th>
            <th>Sous-thème</th>
            <th>Besoins</th>
            <th>Présences</th>
            <th>Comportements</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in filteredReports" :key="report._id">
            <td>{{ formatDate(report.date) }}</td>
            <td>{{ getClassName(report.classId) }}</td>
            <td>{{ getMonitorName(report.monitorId) }}</td>
            <td>{{ report.title }}</td>
            <td>{{ report.subTheme }}</td>
            <td>{{ report.need }}</td>
            <td>
              <ul>
                <li v-for="(present, childId) in report.presences" :key="childId">
                  {{ getChildName(childId) }} : <span :class="{ present: present, absent: !present }">{{ present ? 'Présent' : 'Absent' }}</span>
                </li>
              </ul>
            </td>
            <td>
              <ul>
                <li v-for="(behavior, childId) in report.behaviors" :key="childId">
                  {{ getChildName(childId) }} : {{ behavior }}
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredReports.length === 0" class="no-data">Aucun rapport trouvé.</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default {
  name: 'MonitorReportsAdminComponent',
  data() {
    return {
      loading: false,
      classes: [],
      monitors: [],
      children: [],
      reports: [],
      selectedClass: '',
      selectedMonitor: '',
      selectedDate: ''
    };
  },
  computed: {
    filteredReports() {
      return this.reports.filter(r => {
        const reportDate = new Date(r.date).toISOString().split('T')[0];
        return (!this.selectedClass || (r.classId?._id || r.classId) === this.selectedClass) &&
               (!this.selectedMonitor || (r.monitorId?._id || r.monitorId) === this.selectedMonitor) &&
               (!this.selectedDate || reportDate === this.selectedDate);
      });
    }
  },
  methods: {
    async fetchAll() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Non authentifié');
        }
        const headers = { Authorization: `Bearer ${token}` };

        const [classesRes, monitorsRes, childrenRes, reportsRes] = await Promise.all([
          axios.get(`http://localhost:8000/class`, { headers }),
          axios.get(`http://localhost:8000/monitor`, { headers }),
          axios.get(`http://localhost:8000/child/allchildren`, { headers }),
          axios.get(`http://localhost:8000/monitor-report`, { headers })
        ]);
        this.classes = classesRes.data;
        this.monitors = monitorsRes.data;
        this.children = childrenRes.data;
        this.reports = reportsRes.data;
      } catch (err) {
        alert('Erreur lors du chargement des données : ' + err.message);
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getClassName(id) {
      const c = this.classes.find(c => c._id === (id?._id || id));
      return c ? c.name : 'Non défini';
    },
    getMonitorName(id) {
      const m = this.monitors.find(m => m._id === (id?._id || id));
      return m ? `${m.firstName} ${m.lastName}` : 'Non défini';
    },
    getChildName(id) {
      const c = this.children.find(c => c._id === (id?._id || id));
      return c ? `${c.firstName} ${c.lastName}` : 'Non défini';
    }
  },
  mounted() {
    this.fetchAll();
  }
};
</script>

<style scoped>
.monitor-reports-admin-page {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  h2 {
    text-align: center;
    color: #1f2937;
    font-size: 1.75rem;
    margin-bottom: 2rem;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
    justify-content: center;

    select,
    input[type="date"] {
      padding: 0.7rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      background: #f9fafb;
      color: #1f2937;
      transition: border-color 0.2s ease;

      &:focus {
        outline: none;
        border-color: #db2323;
      }
    }
  }

  .loading,
  .no-data {
    text-align: center;
    color: #6b7280;
    font-size: 1rem;
    padding: 1.5rem;
  }

  .reports-table {
    width: 100%;
    border-collapse: collapse;
    overflow-x: auto;
    display: block;

    th, td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
      font-size: 0.95rem;
      vertical-align: top;
    }

    th {
      background: #f3f4f6;
      color: #374151;
      font-weight: 600;
    }

    td ul {
      padding-left: 1rem;
      margin: 0;
    }

    .present {
      color: #16a34a;
      font-weight: 600;
    }

    .absent {
      color: #db2323;
      font-weight: 600;
    }
  }

  @media (max-width: 768px) {
    .filters {
      flex-direction: column;
      align-items: stretch;
    }
  }
}

</style> 
<template>
  <div class="monitor-reports-admin">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <h1>
          📋 {{ getTranslatedTitle('monitorReports') }}
        </h1>
        <p class="header-description">{{ getTranslatedTitle('monitorReportsDesc') }}</p>
      </div>
      <div class="header-stats">
        <div class="stat-card">
          <div class="stat-icon reports">📄</div>
          <div class="stat-info">
            <span class="stat-number">{{ filteredReports.length }}</span>
            <span class="stat-label">{{ getTranslatedTitle('reports') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon monitors">👨‍🏫</div>
          <div class="stat-info">
            <span class="stat-number">{{ monitors.length }}</span>
            <span class="stat-label">{{ getTranslatedTitle('monitors') }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon classes">🏫</div>
          <div class="stat-info">
            <span class="stat-number">{{ classes.length }}</span>
            <span class="stat-label">{{ getTranslatedTitle('classes') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-card">
      <div class="card-header">
        <h2>
          🔍 {{ getTranslatedTitle('filters') }}
        </h2>
        <button 
          class="clear-filters-btn" 
          @click="clearFilters"
          v-if="hasActiveFilters"
        >
          🗑️ {{ getTranslatedTitle('clearFilters') }}
        </button>
      </div>
      
      <div class="card-content">
        <div class="filters-grid">
          <div class="filter-group">
            <label>
              🏫 {{ getTranslatedTitle('class') }}
            </label>
            <select v-model="selectedClass" class="filter-input">
              <option value="">{{ getTranslatedTitle('allClasses') }}</option>
              <option v-for="classe in classes" :key="classe._id" :value="classe._id">
                {{ classe.name }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>
              👨‍🏫 {{ getTranslatedTitle('monitor') }}
            </label>
            <select v-model="selectedMonitor" class="filter-input">
              <option value="">{{ getTranslatedTitle('allMonitors') }}</option>
              <option v-for="monitor in monitors" :key="monitor._id" :value="monitor._id">
                {{ monitor.firstName }} {{ monitor.lastName }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>
              📅 {{ getTranslatedTitle('date') }}
            </label>
            <input 
              type="date" 
              v-model="selectedDate"
              :max="new Date().toISOString().split('T')[0]"
              class="filter-input"
            />
          </div>
          
          <div class="filter-group">
            <label>
              🔍 {{ getTranslatedTitle('search') }}
            </label>
            <input 
              type="text" 
              v-model="searchQuery"
              :placeholder="getTranslatedTitle('searchPlaceholder')"
              class="filter-input"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Reports Section -->
    <div class="reports-card">
      <div class="card-header">
        <h2>
          <i class="fas fa-table"></i>
          {{ getTranslatedTitle('reportsList') }}
        </h2>
        <div class="header-actions">
          <button class="export-btn" @click="exportReports">
            <i class="fas fa-download"></i>
            {{ getTranslatedTitle('export') }}
          </button>
        </div>
      </div>
      
      <div class="card-content">
        <div v-if="loading" class="loading-state">
          <i class="fas fa-spinner fa-spin"></i>
          <span>{{ getTranslatedTitle('loading') }}</span>
        </div>
        
        <div v-else-if="filteredReports.length === 0" class="empty-state">
          <i class="fas fa-clipboard"></i>
          <h3>{{ getTranslatedTitle('noReports') }}</h3>
          <p>{{ getTranslatedTitle('noReportsDesc') }}</p>
        </div>
        
        <div v-else class="table-container">
          <div class="table-responsive">
            <table class="reports-table">
              <thead>
                <tr>
                  <th>
                    <i class="fas fa-calendar"></i>
                    {{ getTranslatedTitle('date') }}
                  </th>
                  <th>
                    <i class="fas fa-school"></i>
                    {{ getTranslatedTitle('class') }}
                  </th>
                  <th>
                    <i class="fas fa-user-tie"></i>
                    {{ getTranslatedTitle('monitor') }}
                  </th>
                  <th>
                    <i class="fas fa-book"></i>
                    {{ getTranslatedTitle('courseTitle') }}
                  </th>
                  <th>
                    <i class="fas fa-tags"></i>
                    {{ getTranslatedTitle('subTheme') }}
                  </th>
                  <th>
                    <i class="fas fa-exclamation-circle"></i>
                    {{ getTranslatedTitle('needs') }}
                  </th>
                  <th>
                    <i class="fas fa-user-check"></i>
                    {{ getTranslatedTitle('attendance') }}
                  </th>
                  <th>
                    <i class="fas fa-smile"></i>
                    {{ getTranslatedTitle('behaviors') }}
                  </th>
                  <th>
                    <i class="fas fa-cog"></i>
                    {{ getTranslatedTitle('actions') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="report in paginatedReports" :key="report._id" class="report-row">
                  <td class="date-cell">
                    <div class="date-display">
                      <span class="date-main">{{ formatDate(report.date) }}</span>
                      <span class="date-time">{{ formatTime(report.date) }}</span>
                    </div>
                  </td>
                  <td class="class-cell">
                    <div class="class-badge">
                      {{ getClassName(report.classId) }}
                    </div>
                  </td>
                  <td class="monitor-cell">
                    <div class="monitor-info">
                      <div class="monitor-avatar">
                        {{ getMonitorInitials(report.monitorId) }}
                      </div>
                      <span>{{ getMonitorName(report.monitorId) }}</span>
                    </div>
                  </td>
                  <td class="title-cell">
                    <div class="course-title">{{ report.title }}</div>
                  </td>
                  <td class="theme-cell">
                    <div class="sub-theme">{{ report.subTheme }}</div>
                  </td>
                  <td class="needs-cell">
                    <div class="needs-content">{{ report.need }}</div>
                  </td>
                  <td class="attendance-cell">
                    <div class="attendance-summary">
                      <div class="attendance-stats">
                        <span class="present-count">
                          <i class="fas fa-check"></i>
                          {{ getPresentCount(report.presences) }}
                        </span>
                        <span class="absent-count">
                          <i class="fas fa-times"></i>
                          {{ getAbsentCount(report.presences) }}
                        </span>
                      </div>
                      <button 
                        class="view-details-btn" 
                        @click="toggleAttendanceDetails(report._id)"
                      >
                        <i class="fas" :class="showAttendanceDetails[report._id] ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                      </button>
                    </div>
                    <div v-if="showAttendanceDetails[report._id]" class="attendance-details">
                      <div 
                        v-for="(present, childId) in report.presences" 
                        :key="childId"
                        class="attendance-item"
                        :class="{ present: present, absent: !present }"
                      >
                        <i class="fas" :class="present ? 'fa-check' : 'fa-times'"></i>
                        <span>{{ getChildName(childId) }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="behaviors-cell">
                    <div class="behaviors-summary">
                      <span class="behaviors-count">
                        <i class="fas fa-comment"></i>
                        {{ getBehaviorsCount(report.behaviors) }}
                      </span>
                      <button 
                        class="view-details-btn" 
                        @click="toggleBehaviorDetails(report._id)"
                        v-if="getBehaviorsCount(report.behaviors) > 0"
                      >
                        <i class="fas" :class="showBehaviorDetails[report._id] ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                      </button>
                    </div>
                    <div v-if="showBehaviorDetails[report._id]" class="behaviors-details">
                      <div 
                        v-for="(behavior, childId) in report.behaviors" 
                        :key="childId"
                        class="behavior-item"
                        v-if="behavior"
                      >
                        <strong>{{ getChildName(childId) }}:</strong>
                        <span>{{ behavior }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button 
                        class="action-btn view-btn" 
                        @click="viewReport(report)"
                        :title="getTranslatedTitle('view')"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        class="action-btn download-btn" 
                        @click="downloadReport(report)"
                        :title="getTranslatedTitle('download')"
                      >
                        <i class="fas fa-download"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="pagination" v-if="totalPages > 1">
            <button 
              class="pagination-btn" 
              @click="currentPage = 1" 
              :disabled="currentPage === 1"
            >
              <i class="fas fa-angle-double-left"></i>
            </button>
            <button 
              class="pagination-btn" 
              @click="currentPage--" 
              :disabled="currentPage === 1"
            >
              <i class="fas fa-angle-left"></i>
            </button>
            <span class="pagination-info">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <button 
              class="pagination-btn" 
              @click="currentPage++" 
              :disabled="currentPage === totalPages"
            >
              <i class="fas fa-angle-right"></i>
            </button>
            <button 
              class="pagination-btn" 
              @click="currentPage = totalPages" 
              :disabled="currentPage === totalPages"
            >
              <i class="fas fa-angle-double-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Detail Modal -->
    <div v-if="showReportModal" class="modal-overlay" @click="closeReportModal">
      <div class="modal-content report-modal" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="fas fa-file-alt"></i>
            {{ getTranslatedTitle('reportDetails') }}
          </h3>
          <button class="close-btn" @click="closeReportModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body" v-if="selectedReport">
          <div class="report-details-grid">
            <div class="detail-section">
              <h4>{{ getTranslatedTitle('generalInfo') }}</h4>
              <div class="detail-item">
                <label>{{ getTranslatedTitle('date') }}:</label>
                <span>{{ formatDate(selectedReport.date) }}</span>
              </div>
              <div class="detail-item">
                <label>{{ getTranslatedTitle('class') }}:</label>
                <span>{{ getClassName(selectedReport.classId) }}</span>
              </div>
              <div class="detail-item">
                <label>{{ getTranslatedTitle('monitor') }}:</label>
                <span>{{ getMonitorName(selectedReport.monitorId) }}</span>
              </div>
              <div class="detail-item">
                <label>{{ getTranslatedTitle('courseTitle') }}:</label>
                <span>{{ selectedReport.title }}</span>
              </div>
              <div class="detail-item">
                <label>{{ getTranslatedTitle('subTheme') }}:</label>
                <span>{{ selectedReport.subTheme }}</span>
              </div>
              <div class="detail-item">
                <label>{{ getTranslatedTitle('needs') }}:</label>
                <span>{{ selectedReport.need }}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>{{ getTranslatedTitle('attendance') }}</h4>
              <div class="attendance-list">
                <div 
                  v-for="(present, childId) in selectedReport.presences" 
                  :key="childId"
                  class="attendance-item"
                  :class="{ present: present, absent: !present }"
                >
                  <i class="fas" :class="present ? 'fa-check' : 'fa-times'"></i>
                  <span>{{ getChildName(childId) }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>{{ getTranslatedTitle('behaviors') }}</h4>
              <div class="behaviors-list">
                <div 
                  v-for="(behavior, childId) in selectedReport.behaviors" 
                  :key="childId"
                  class="behavior-item"
                  v-if="behavior"
                >
                  <strong>{{ getChildName(childId) }}:</strong>
                  <span>{{ behavior }}</span>
                </div>
                <div v-if="getBehaviorsCount(selectedReport.behaviors) === 0" class="no-behaviors">
                  {{ getTranslatedTitle('noBehaviors') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      selectedDate: '',
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      showAttendanceDetails: {},
      showBehaviorDetails: {},
      showReportModal: false,
      selectedReport: null
    };
  },
  computed: {
    filteredReports() {
      return this.reports.filter(r => {
        const reportDate = new Date(r.date).toISOString().split('T')[0];
        const matchesClass = !this.selectedClass || (r.classId?._id || r.classId) === this.selectedClass;
        const matchesMonitor = !this.selectedMonitor || (r.monitorId?._id || r.monitorId) === this.selectedMonitor;
        const matchesDate = !this.selectedDate || reportDate === this.selectedDate;
        const matchesSearch = !this.searchQuery || 
          r.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          r.subTheme.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          r.need.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        return matchesClass && matchesMonitor && matchesDate && matchesSearch;
      });
    },
    
    paginatedReports() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredReports.slice(start, end);
    },
    
    totalPages() {
      return Math.ceil(this.filteredReports.length / this.itemsPerPage);
    },
    
    hasActiveFilters() {
      return this.selectedClass || this.selectedMonitor || this.selectedDate || this.searchQuery;
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
          axios.get(`${API_BASE_URL}/class`, { headers }),
          axios.get(`${API_BASE_URL}/monitor`, { headers }),
          axios.get(`${API_BASE_URL}/child/allchildren`, { headers }),
          axios.get(`${API_BASE_URL}/monitor-report`, { headers })
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
    formatTime(date) {
      return new Date(date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
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
    },
    getMonitorInitials(id) {
      const m = this.monitors.find(m => m._id === (id?._id || id));
      if (m) {
        return m.firstName.charAt(0).toUpperCase() + m.lastName.charAt(0).toUpperCase();
      }
      return '?';
    },
    getPresentCount(presences) {
      return Object.values(presences).filter(Boolean).length;
    },
    getAbsentCount(presences) {
      return Object.values(presences).filter(p => !p).length;
    },
    getBehaviorsCount(behaviors) {
      return Object.values(behaviors).filter(Boolean).length;
    },
    toggleAttendanceDetails(reportId) {
      this.showAttendanceDetails = {
        ...this.showAttendanceDetails,
        [reportId]: !this.showAttendanceDetails[reportId]
      };
    },
    toggleBehaviorDetails(reportId) {
      this.showBehaviorDetails = {
        ...this.showBehaviorDetails,
        [reportId]: !this.showBehaviorDetails[reportId]
      };
    },
    viewReport(report) {
      this.selectedReport = report;
      this.showReportModal = true;
    },
    closeReportModal() {
      this.selectedReport = null;
      this.showReportModal = false;
    },
    exportReports() {
      // Créer un CSV des rapports filtrés
      const headers = ['Date', 'Classe', 'Moniteur', 'Titre', 'Sous-thème', 'Besoins', 'Présents', 'Absents'];
      const csvContent = [
        headers.join(','),
        ...this.filteredReports.map(report => [
          this.formatDate(report.date),
          this.getClassName(report.classId),
          this.getMonitorName(report.monitorId),
          report.title,
          report.subTheme,
          report.need,
          this.getPresentCount(report.presences),
          this.getAbsentCount(report.presences)
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapports-moniteurs-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    
    downloadReport(report) {
      // Télécharger un rapport individuel
      const reportData = {
        date: this.formatDate(report.date),
        classe: this.getClassName(report.classId),
        moniteur: this.getMonitorName(report.monitorId),
        titre: report.title,
        sousTheme: report.subTheme,
        besoins: report.need,
        presences: Object.entries(report.presences).map(([childId, present]) => ({
          enfant: this.getChildName(childId),
          present: present ? 'Présent' : 'Absent'
        })),
        comportements: Object.entries(report.behaviors).filter(([, behavior]) => behavior).map(([childId, behavior]) => ({
          enfant: this.getChildName(childId),
          comportement: behavior
        }))
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-${report._id}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    
    clearFilters() {
      this.selectedClass = '';
      this.selectedMonitor = '';
      this.selectedDate = '';
      this.searchQuery = '';
      this.currentPage = 1;
    },
    
    getTranslatedTitle(key) {
      const translations = {
        monitorReports: 'Rapports des Moniteurs',
        monitorReportsDesc: 'Consultez et gérez tous les rapports soumis par les moniteurs',
        reports: 'rapports',
        monitors: 'moniteurs',
        classes: 'classes',
        filters: 'Filtres',
        clearFilters: 'Effacer les filtres',
        class: 'Classe',
        allClasses: 'Toutes les classes',
        monitor: 'Moniteur',
        allMonitors: 'Tous les moniteurs',
        date: 'Date',
        search: 'Recherche',
        searchPlaceholder: 'Rechercher dans les rapports...',
        reportsList: 'Liste des Rapports',
        export: 'Exporter',
        loading: 'Chargement...',
        noReports: 'Aucun rapport trouvé',
        noReportsDesc: 'Aucun rapport ne correspond aux critères de recherche actuels.',
        courseTitle: 'Titre du cours',
        subTheme: 'Sous-thème',
        needs: 'Besoins',
        attendance: 'Présences',
        behaviors: 'Comportements',
        actions: 'Actions',
        view: 'Voir',
        download: 'Télécharger',
        reportDetails: 'Détails du Rapport',
        generalInfo: 'Informations Générales',
        noBehaviors: 'Aucun comportement signalé'
      };
      return translations[key] || key;
    }
  },
  mounted() {
    this.fetchAll();
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.monitor-reports-admin {
  max-width: min(95vw, 1200px);
  width: 100%;
  margin: 1rem auto;
  padding: 1rem;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(219, 35, 35, 0.1);
  min-height: calc(100vh - 2rem);
  box-sizing: border-box;
  overflow-x: hidden;
}

/* Header Section */
.page-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9fa, #fff);
  border-radius: 1rem;
  border: 1px solid #e9ecef;
}

.page-header h1 {
  color: #db2323;
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.header-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.2rem;
}

.header-stats {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: white;
  padding: 0.8rem 1.2rem;
  border-radius: 0.8rem;
  box-shadow: 0 2px 8px rgba(219, 35, 35, 0.08);
  border: 1px solid #e9ecef;
  min-width: 120px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.stat-icon.reports {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.stat-icon.monitors {
  background: linear-gradient(135deg, #db2323, #b31b1b);
}

.stat-icon.classes {
  background: linear-gradient(135deg, #16a34a, #15803d);
}

.stat-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-number {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Cards */
.filters-card,
.reports-card {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(219, 35, 35, 0.08);
  margin-bottom: 1.2rem;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #e9ecef;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #f8f9fa, #fff);
  border-radius: 1rem 1rem 0 0;
}

.card-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #db2323;
  margin: 0;
}

.card-content {
  padding: 1.2rem;
  width: 100%;
  box-sizing: border-box;
}

/* Filters */
.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
  gap: 0.4rem;
}

.filter-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.2rem;
}

.filter-input {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 0.6rem;
  font-size: 0.85rem;
  background: #ffffff;
  color: #1f2937;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
}

.filter-input:focus {
  outline: none;
  border-color: #db2323;
  box-shadow: 0 0 0 2px rgba(219, 35, 35, 0.1);
}

.clear-filters-btn,
.export-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #db2323;
  border-radius: 0.6rem;
  font-size: 0.85rem;
  background: #ffffff;
  color: #db2323;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.clear-filters-btn:hover,
.export-btn:hover {
  background: #db2323;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(219, 35, 35, 0.2);
}

/* Table */
.table-container {
  overflow: hidden;
  border-radius: 0.8rem;
  border: 1px solid #e9ecef;
  background: white;
}

.table-responsive {
  overflow-x: auto;
  width: 100%;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  font-size: 0.85rem;
}

.reports-table th,
.reports-table td {
  padding: 0.8rem 0.6rem;
  border-bottom: 1px solid #f0f0f0;
  text-align: left;
  vertical-align: top;
}

.reports-table th {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.report-row {
  transition: all 0.2s ease;
}

.report-row:hover {
  background-color: #f8f9fa;
  transform: scale(1.005);
}

/* Table Cells */
.date-display {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-main {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1f2937;
}

.date-time {
  font-size: 0.8rem;
  color: #6b7280;
}

.class-badge {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  display: inline-block;
}

.monitor-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.monitor-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  flex-shrink: 0;
}

.course-title,
.sub-theme,
.needs-content {
  font-size: 0.9rem;
  color: #374151;
  line-height: 1.4;
}

/* Attendance & Behaviors */
.attendance-summary,
.behaviors-summary {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.attendance-stats {
  display: flex;
  gap: 0.75rem;
}

.present-count {
  color: #16a34a;
  font-weight: 600;
  font-size: 0.85rem;
}

.present-count i {
  margin-right: 0.25rem;
}

.absent-count {
  color: #dc2626;
  font-weight: 600;
  font-size: 0.85rem;
}

.absent-count i {
  margin-right: 0.25rem;
}

.behaviors-count {
  color: #6b7280;
  font-weight: 600;
  font-size: 0.85rem;
}

.behaviors-count i {
  margin-right: 0.25rem;
}

.view-details-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.view-details-btn:hover {
  background: #f3f4f6;
  color: #db2323;
}

.attendance-details,
.behaviors-details {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border-left: 3px solid #db2323;
}

.attendance-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.attendance-item.present i {
  color: #16a34a;
}

.attendance-item.absent i {
  color: #dc2626;
}

.behavior-item {
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
}

.behavior-item strong {
  color: #374151;
  display: block;
  margin-bottom: 0.25rem;
}

.behavior-item span {
  color: #6b7280;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.view-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.view-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.download-btn {
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: white;
}

.download-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(22, 163, 74, 0.3);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.8rem;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 0.6rem;
  background: #ffffff;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #db2323;
  background: #db2323;
  color: white;
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #f8f9fa;
}

.pagination-info {
  padding: 0 1rem;
  font-weight: 600;
  color: #db2323;
  font-size: 0.9rem;
}

/* States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.loading-state i {
  font-size: 2rem;
  color: #db2323;
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;
}

.empty-state i {
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  border-radius: 1rem;
  max-width: 90vw;
  max-height: 90vh;
  width: 800px;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-header h3 i {
  margin-right: 0.5rem;
  color: #db2323;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #db2323;
  color: white;
}

.modal-body {
  padding: 1.5rem;
}

.report-details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .report-details-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.detail-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #db2323;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.detail-item label {
  font-weight: 600;
  color: #374151;
  min-width: 120px;
}

.detail-item span {
  color: #6b7280;
  text-align: right;
  flex: 1;
}

.attendance-list .attendance-item,
.behaviors-list .behavior-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.attendance-list .attendance-item i {
  width: 16px;
  text-align: center;
}

.attendance-list .attendance-item.present i {
  color: #16a34a;
}

.attendance-list .attendance-item.absent i {
  color: #dc2626;
}

.behaviors-list .behavior-item strong {
  color: #374151;
  min-width: 120px;
}

.behaviors-list .behavior-item span {
  color: #6b7280;
}

.no-behaviors {
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .monitor-reports-admin {
    margin: 0.5rem;
    padding: 0.8rem;
    border-radius: 0.8rem;
  }

  .page-header {
    padding: 0.8rem;
    margin-bottom: 1rem;
  }

  .page-header h1 {
    font-size: 1.4rem;
  }

  .header-stats {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .stat-card {
    min-width: auto;
    padding: 0.6rem 1rem;
  }

  .stat-icon {
    width: 36px;
    height: 36px;
  }

  .filters-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }

  .card-content {
    padding: 1rem;
  }

  .reports-table {
    min-width: 600px;
    font-size: 0.75rem;
  }

  .reports-table th,
  .reports-table td {
    padding: 0.5rem 0.3rem;
  }

  .monitor-info {
    flex-direction: column;
    gap: 0.4rem;
    text-align: center;
  }

  .monitor-avatar {
    width: 28px;
    height: 28px;
    font-size: 0.7rem;
  }

  .attendance-summary,
  .behaviors-summary {
    flex-direction: column;
    gap: 0.3rem;
    align-items: flex-start;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.3rem;
  }

  .action-btn {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }

  .modal-content {
    margin: 0.5rem;
    max-width: calc(100vw - 1rem);
    width: calc(100vw - 1rem);
    border-radius: 0.8rem;
  }

  .report-details-grid {
    grid-template-columns: 1fr;
  }

  .pagination {
    padding: 0.8rem;
    margin-top: 1rem;
  }

  .pagination-btn {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .monitor-reports-admin {
    margin: 0.25rem;
    padding: 0.6rem;
  }

  .page-header h1 {
    font-size: 1.2rem;
  }

  .header-description {
    font-size: 0.8rem;
  }

  .filters-grid {
    gap: 0.6rem;
  }

  .reports-table {
    min-width: 500px;
    font-size: 0.7rem;
  }

  .reports-table th,
  .reports-table td {
    padding: 0.4rem 0.2rem;
  }

  .stat-card {
    padding: 0.5rem 0.8rem;
  }

  .card-header {
    padding: 0.8rem;
  }

  .card-content {
    padding: 0.8rem;
  }
}
</style> 
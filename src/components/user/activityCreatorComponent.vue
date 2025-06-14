<template>
  <div class="activity-creator-page">
    <div class="header">
      <h2>Créer une Activité</h2>
      <p>Planifiez et organisez de nouvelles activités</p>
    </div>

    <!-- Activity Form -->
    <div class="form-container">
      <form @submit.prevent="createActivity" class="activity-form">
        <!-- Basic Information -->
        <div class="form-section">
          <h3>
            <i class="fas fa-info-circle"></i>
            Informations générales
          </h3>
          
          <div class="form-row">
            <div class="form-group">
              <label>Titre de l'activité *</label>
              <input 
                type="text" 
                v-model="activity.title" 
                required
                placeholder="Ex: Atelier de peinture créative"
              >
            </div>
            <div class="form-group">
              <label>Catégorie *</label>
              <select v-model="activity.category" required>
                <option value="">Sélectionner une catégorie</option>
                <option value="education">Éducation</option>
                <option value="sport">Sport & Motricité</option>
                <option value="art">Art & Créativité</option>
                <option value="music">Musique</option>
                <option value="science">Sciences & Découverte</option>
                <option value="cooking">Cuisine</option>
                <option value="reading">Lecture & Histoires</option>
                <option value="outdoor">Activités extérieures</option>
                <option value="games">Jeux & Loisirs</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea 
              v-model="activity.description" 
              placeholder="Décrivez l'activité, ses objectifs et son déroulement..."
              rows="4"
            ></textarea>
          </div>
        </div>

        <!-- Scheduling -->
        <div class="form-section">
          <h3>
            <i class="fas fa-calendar-alt"></i>
            Planification
          </h3>

          <div class="form-row">
            <div class="form-group">
              <label>Date *</label>
              <input 
                type="date" 
                v-model="activity.date" 
                required
                :min="today"
              >
            </div>
            <div class="form-group">
              <label>Heure de début *</label>
              <input 
                type="time" 
                v-model="activity.startTime" 
                required
              >
            </div>
            <div class="form-group">
              <label>Durée (minutes) *</label>
              <select v-model="activity.duration" required>
                <option value="">Durée</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">1 heure</option>
                <option value="90">1h30</option>
                <option value="120">2 heures</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Type de récurrence</label>
            <select v-model="activity.recurrence">
              <option value="none">Activité unique</option>
              <option value="daily">Quotidienne</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuelle</option>
            </select>
          </div>

          <div v-if="activity.recurrence !== 'none'" class="form-group">
            <label>Jusqu'au</label>
            <input 
              type="date" 
              v-model="activity.endDate"
              :min="activity.date"
            >
          </div>
        </div>

        <!-- Participants -->
        <div class="form-section">
          <h3>
            <i class="fas fa-users"></i>
            Participants
          </h3>

          <div class="form-row">
            <div class="form-group">
              <label>Groupe d'âge *</label>
              <select v-model="activity.ageGroup" required>
                <option value="">Sélectionner un groupe</option>
                <option value="3-4">3-4 ans</option>
                <option value="5-6">5-6 ans</option>
                <option value="7-8">7-8 ans</option>
                <option value="9-10">9-10 ans</option>
                <option value="mixed">Âges mélangés</option>
              </select>
            </div>
            <div class="form-group">
              <label>Nombre maximum de participants</label>
              <input 
                type="number" 
                v-model="activity.maxParticipants" 
                min="1" 
                max="50"
                placeholder="Ex: 12"
              >
            </div>
          </div>

          <div class="form-group">
            <label>Enfants spécifiques (optionnel)</label>
            <div class="children-selector">
              <div class="search-children">
                <input 
                  type="text" 
                  v-model="childSearch" 
                  placeholder="Rechercher un enfant..."
                  @input="filterChildren"
                >
              </div>
              <div class="children-list">
                <div 
                  v-for="child in filteredChildren" 
                  :key="child.id"
                  class="child-item"
                  @click="toggleChild(child)"
                  :class="{ selected: activity.selectedChildren.includes(child.id) }"
                >
                  <div class="child-avatar">
                    {{ child.firstName.charAt(0) }}
                  </div>
                  <span>{{ child.firstName }} {{ child.lastName }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Materials & Resources -->
        <div class="form-section">
          <h3>
            <i class="fas fa-tools"></i>
            Matériel et ressources
          </h3>

          <div class="form-group">
            <label>Matériel nécessaire</label>
            <div class="materials-input">
              <input 
                type="text" 
                v-model="newMaterial" 
                placeholder="Ajouter du matériel..."
                @keyup.enter="addMaterial"
              >
              <button type="button" @click="addMaterial" class="add-btn">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <div class="materials-list">
              <span 
                v-for="(material, index) in activity.materials" 
                :key="index"
                class="material-tag"
              >
                {{ material }}
                <button type="button" @click="removeMaterial(index)">
                  <i class="fas fa-times"></i>
                </button>
              </span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Lieu</label>
              <select v-model="activity.location">
                <option value="">Sélectionner un lieu</option>
                <option value="classroom">Salle de classe</option>
                <option value="playground">Cour de récréation</option>
                <option value="gym">Gymnase</option>
                <option value="garden">Jardin</option>
                <option value="kitchen">Cuisine</option>
                <option value="library">Bibliothèque</option>
                <option value="art-room">Salle d'art</option>
                <option value="outdoor">Extérieur</option>
              </select>
            </div>
            <div class="form-group">
              <label>Éducateur responsable *</label>
              <select v-model="activity.educator" required>
                <option value="">Sélectionner un éducateur</option>
                <option v-for="educator in educators" :key="educator.id" :value="educator.id">
                  {{ educator.name }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Objectives & Skills -->
        <div class="form-section">
          <h3>
            <i class="fas fa-target"></i>
            Objectifs et compétences
          </h3>

          <div class="form-group">
            <label>Objectifs pédagogiques</label>
            <textarea 
              v-model="activity.objectives" 
              placeholder="Quels sont les objectifs de cette activité ? Que vont apprendre les enfants ?"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Compétences développées</label>
            <div class="skills-grid">
              <label 
                v-for="skill in availableSkills" 
                :key="skill.id"
                class="skill-checkbox"
              >
                <input 
                  type="checkbox" 
                  :value="skill.id" 
                  v-model="activity.skills"
                >
                <span class="checkmark"></span>
                {{ skill.name }}
              </label>
            </div>
          </div>
        </div>

        <!-- Additional Options -->
        <div class="form-section">
          <h3>
            <i class="fas fa-cog"></i>
            Options supplémentaires
          </h3>

          <div class="form-row">
            <div class="form-group">
              <label>Niveau de difficulté</label>
              <select v-model="activity.difficulty">
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>
            </div>
            <div class="form-group">
              <label>Préparation nécessaire (minutes)</label>
              <input 
                type="number" 
                v-model="activity.preparationTime" 
                min="0" 
                placeholder="Ex: 15"
              >
            </div>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="activity.requiresParentConsent"
              >
              <span class="checkmark"></span>
              Nécessite l'autorisation des parents
            </label>
          </div>

          <div class="form-group">
            <label>Notes supplémentaires</label>
            <textarea 
              v-model="activity.notes" 
              placeholder="Informations complémentaires, conseils, adaptations..."
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" @click="resetForm" class="reset-btn">
            <i class="fas fa-undo"></i>
            Réinitialiser
          </button>
          <button type="button" @click="saveAsDraft" class="draft-btn">
            <i class="fas fa-save"></i>
            Sauvegarder comme brouillon
          </button>
          <button type="submit" class="create-btn">
            <i class="fas fa-plus-circle"></i>
            Créer l'activité
          </button>
        </div>
      </form>
    </div>

    <!-- Activity Preview -->
    <div class="preview-container">
      <div class="preview-header">
        <h3>Aperçu de l'activité</h3>
      </div>
      <div class="activity-preview">
        <div class="preview-card">
          <div class="activity-header">
            <h4>{{ activity.title || 'Titre de l\'activité' }}</h4>
            <span class="activity-category" :class="activity.category">
              {{ getCategoryName(activity.category) }}
            </span>
          </div>
          
          <div class="activity-details">
            <div class="detail-item">
              <i class="fas fa-calendar"></i>
              <span>{{ formatDate(activity.date) }}</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-clock"></i>
              <span>{{ activity.startTime }} ({{ activity.duration }}min)</span>
            </div>
            <div class="detail-item">
              <i class="fas fa-users"></i>
              <span>{{ activity.ageGroup }} ans</span>
            </div>
            <div class="detail-item" v-if="activity.location">
              <i class="fas fa-map-marker-alt"></i>
              <span>{{ getLocationName(activity.location) }}</span>
            </div>
          </div>

          <div class="activity-description" v-if="activity.description">
            <p>{{ activity.description }}</p>
          </div>

          <div class="activity-materials" v-if="activity.materials.length > 0">
            <h5>Matériel nécessaire :</h5>
            <ul>
              <li v-for="material in activity.materials" :key="material">
                {{ material }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityCreatorComponent',
  data() {
    return {
      activity: {
        title: '',
        category: '',
        description: '',
        date: '',
        startTime: '',
        duration: '',
        recurrence: 'none',
        endDate: '',
        ageGroup: '',
        maxParticipants: '',
        selectedChildren: [],
        materials: [],
        location: '',
        educator: '',
        objectives: '',
        skills: [],
        difficulty: 'medium',
        preparationTime: '',
        requiresParentConsent: false,
        notes: ''
      },
      newMaterial: '',
      childSearch: '',
      filteredChildren: [],
      educators: [
        { id: 1, name: 'Marie Dupont' },
        { id: 2, name: 'Jean Martin' },
        { id: 3, name: 'Sophie Bernard' },
        { id: 4, name: 'Pierre Durand' }
      ],
      availableSkills: [
        { id: 'motor', name: 'Motricité fine' },
        { id: 'gross-motor', name: 'Motricité globale' },
        { id: 'language', name: 'Développement du langage' },
        { id: 'social', name: 'Compétences sociales' },
        { id: 'creativity', name: 'Créativité' },
        { id: 'logic', name: 'Logique et raisonnement' },
        { id: 'autonomy', name: 'Autonomie' },
        { id: 'concentration', name: 'Concentration' },
        { id: 'cooperation', name: 'Coopération' },
        { id: 'confidence', name: 'Confiance en soi' }
      ],
      children: [
        { id: 1, firstName: 'Emma', lastName: 'Martin', age: 4 },
        { id: 2, firstName: 'Lucas', lastName: 'Dubois', age: 5 },
        { id: 3, firstName: 'Chloé', lastName: 'Bernard', age: 6 },
        { id: 4, firstName: 'Thomas', lastName: 'Petit', age: 7 },
        { id: 5, firstName: 'Léa', lastName: 'Roux', age: 4 },
        { id: 6, firstName: 'Nathan', lastName: 'Moreau', age: 5 }
      ]
    };
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    }
  },
  mounted() {
    this.filteredChildren = this.children;
  },
  methods: {
    addMaterial() {
      if (this.newMaterial.trim()) {
        this.activity.materials.push(this.newMaterial.trim());
        this.newMaterial = '';
      }
    },
    
    removeMaterial(index) {
      this.activity.materials.splice(index, 1);
    },
    
    filterChildren() {
      const search = this.childSearch.toLowerCase();
      this.filteredChildren = this.children.filter(child =>
        child.firstName.toLowerCase().includes(search) ||
        child.lastName.toLowerCase().includes(search)
      );
    },
    
    toggleChild(child) {
      const index = this.activity.selectedChildren.indexOf(child.id);
      if (index > -1) {
        this.activity.selectedChildren.splice(index, 1);
      } else {
        this.activity.selectedChildren.push(child.id);
      }
    },
    
    getCategoryName(category) {
      const categories = {
        education: 'Éducation',
        sport: 'Sport',
        art: 'Art',
        music: 'Musique',
        science: 'Sciences',
        cooking: 'Cuisine',
        reading: 'Lecture',
        outdoor: 'Extérieur',
        games: 'Jeux'
      };
      return categories[category] || category;
    },
    
    getLocationName(location) {
      const locations = {
        classroom: 'Salle de classe',
        playground: 'Cour de récréation',
        gym: 'Gymnase',
        garden: 'Jardin',
        kitchen: 'Cuisine',
        library: 'Bibliothèque',
        'art-room': 'Salle d\'art',
        outdoor: 'Extérieur'
      };
      return locations[location] || location;
    },
    
    formatDate(date) {
      if (!date) return 'Date non définie';
      return new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    
    resetForm() {
      this.activity = {
        title: '',
        category: '',
        description: '',
        date: '',
        startTime: '',
        duration: '',
        recurrence: 'none',
        endDate: '',
        ageGroup: '',
        maxParticipants: '',
        selectedChildren: [],
        materials: [],
        location: '',
        educator: '',
        objectives: '',
        skills: [],
        difficulty: 'medium',
        preparationTime: '',
        requiresParentConsent: false,
        notes: ''
      };
      this.newMaterial = '';
    },
    
    saveAsDraft() {
      console.log('Sauvegarde en brouillon:', this.activity);
      // Ici vous pourriez sauvegarder en local storage ou envoyer au serveur
      alert('Activité sauvegardée en brouillon !');
    },
    
    createActivity() {
      console.log('Création de l\'activité:', this.activity);
      // Ici vous pourriez envoyer les données au serveur
      alert('Activité créée avec succès !');
      this.resetForm();
    }
  }
};
</script>

<style scoped>
.activity-creator-page {
  padding: 1.2rem;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.header {
  grid-column: 1 / -1;
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

.form-container {
  background: white;
  border-radius: 0.6rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.activity-form {
  padding: 1.5rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section h3 {
  color: #db2323;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
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

.materials-input {
  display: flex;
  gap: 0.5rem;
}

.materials-input input {
  flex: 1;
}

.add-btn {
  padding: 0.6rem;
  background: #db2323;
  color: white;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: #b31b1b;
}

.materials-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.material-tag {
  background: rgba(219, 35, 35, 0.1);
  color: #db2323;
  padding: 0.3rem 0.6rem;
  border-radius: 0.3rem;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.material-tag button {
  background: none;
  border: none;
  color: #db2323;
  cursor: pointer;
  padding: 0;
  font-size: 0.7rem;
}

.children-selector {
  border: 1px solid #e2e8f0;
  border-radius: 0.4rem;
  overflow: hidden;
}

.search-children {
  padding: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.search-children input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 0.9rem;
}

.children-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem;
}

.child-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.child-item:hover {
  background: #f8f9fa;
}

.child-item.selected {
  background: rgba(219, 35, 35, 0.1);
  color: #db2323;
}

.child-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #db2323;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.8rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.8rem;
}

.skill-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.3rem;
  transition: all 0.3s ease;
}

.skill-checkbox:hover {
  background: #f8f9fa;
}

.skill-checkbox input[type="checkbox"] {
  margin: 0;
  width: auto;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500 !important;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
  width: auto;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.reset-btn,
.draft-btn,
.create-btn {
  padding: 0.8rem 1.5rem;
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

.reset-btn {
  background: #e2e8f0;
  color: #4a5568;
}

.reset-btn:hover {
  background: #cbd5e0;
}

.draft-btn {
  background: #38b2ac;
  color: white;
  box-shadow: 0 2px 4px rgba(56, 178, 172, 0.3);
}

.draft-btn:hover {
  background: #319795;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(56, 178, 172, 0.4);
}

.create-btn {
  background: linear-gradient(135deg, #db2323, #b31b1b);
  color: white;
  box-shadow: 0 2px 4px rgba(219, 35, 35, 0.3);
}

.create-btn:hover {
  background: linear-gradient(135deg, #b31b1b, #991b1b);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(219, 35, 35, 0.4);
}

/* Preview Container */
.preview-container {
  background: white;
  border-radius: 0.6rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  height: fit-content;
  position: sticky;
  top: 1rem;
}

.preview-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.preview-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
}

.activity-preview {
  padding: 1rem;
}

.preview-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.4rem;
  padding: 1rem;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.activity-header h4 {
  margin: 0;
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
}

.activity-category {
  padding: 0.2rem 0.6rem;
  border-radius: 0.3rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.activity-category.education {
  background: rgba(66, 153, 225, 0.1);
  color: #4299e1;
}

.activity-category.sport {
  background: rgba(72, 187, 120, 0.1);
  color: #48bb78;
}

.activity-category.art {
  background: rgba(237, 137, 54, 0.1);
  color: #ed8936;
}

.activity-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #4a5568;
}

.detail-item i {
  width: 16px;
  color: #db2323;
}

.activity-description {
  margin-bottom: 1rem;
  padding: 0.8rem;
  background: #f8f9fa;
  border-radius: 0.4rem;
  font-size: 0.85rem;
  color: #4a5568;
  line-height: 1.5;
}

.activity-materials h5 {
  margin: 0 0 0.5rem;
  color: #2d3748;
  font-size: 0.9rem;
  font-weight: 600;
}

.activity-materials ul {
  margin: 0;
  padding-left: 1.2rem;
  font-size: 0.85rem;
  color: #4a5568;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .activity-creator-page {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .preview-container {
    position: static;
  }
}

@media (max-width: 768px) {
  .activity-creator-page {
    padding: 0.8rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .skills-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .materials-input {
    flex-direction: column;
  }
}
</style> 
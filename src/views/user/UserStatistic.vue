<!-- UserStatistic.vue -->
<template>
  <div class="statistic-container">
    <div class="statistic-header">
      <h1>{{ getTranslatedTitle('statistic') }}</h1>
    </div>
    <div class="statistic-content">
      <!-- Le contenu sera ajouté ultérieurement -->
      <p>{{ getTranslatedTitle('comingSoon') }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'UserStatistic',
  computed: {
    ...mapState(['theme', 'language']),
    translatedTitles() {
      return {
        en: {
          statistic: 'Statistics',
          comingSoon: 'This section is under development'
        },
        fr: {
          statistic: 'Statistiques',
          comingSoon: 'Cette section est en cours de développement'
        }
      };
    }
  },
  methods: {
    getTranslatedTitle(key) {
      return this.translatedTitles[this.language]?.[key] || key;
    }
  }
};
</script>

<style lang="scss" scoped>
.statistic-container {
  padding: 2rem;
}

.statistic-header {
  margin-bottom: 2rem;

  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.statistic-content {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  p {
    color: #666;
    font-size: 1.1rem;
    text-align: center;
  }
}

/* Dark theme */
:deep(.dark) {
  .statistic-header h1 {
    color: #fff;
  }

  .statistic-content {
    background: #2d2d2d;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

    p {
      color: #999;
    }
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .statistic-container {
    padding: 1rem;
  }

  .statistic-content {
    padding: 1rem;
  }
}
</style> 
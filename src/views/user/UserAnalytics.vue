<!-- UserAnalytics.vue -->
<template>
  <div class="analytics-container">
    <div class="analytics-header">
      <h1>{{ getTranslatedTitle('analytics') }}</h1>
    </div>
    <div class="analytics-content">
      <!-- Le contenu sera ajouté ultérieurement -->
      <p>{{ getTranslatedTitle('comingSoon') }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'UserAnalytics',
  computed: {
    ...mapState(['theme', 'language']),
    translatedTitles() {
      return {
        en: {
          analytics: 'Analytics',
          comingSoon: 'This section is under development'
        },
        fr: {
          analytics: 'Analytiques',
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
.analytics-container {
  padding: 2rem;
}

.analytics-header {
  margin-bottom: 2rem;

  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.analytics-content {
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
  .analytics-header h1 {
    color: #fff;
  }

  .analytics-content {
    background: #2d2d2d;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

    p {
      color: #999;
    }
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .analytics-container {
    padding: 1rem;
  }

  .analytics-content {
    padding: 1rem;
  }
}
</style> 
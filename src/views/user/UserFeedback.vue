<!-- UserFeedback.vue -->
<template>
  <div class="feedback-container">
    <div class="feedback-header">
      <h1>{{ getTranslatedTitle('feedback') }}</h1>
    </div>
    <div class="feedback-content">
      <!-- Le contenu sera ajouté ultérieurement -->
      <p>{{ getTranslatedTitle('comingSoon') }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'UserFeedback',
  computed: {
    ...mapState(['theme', 'language']),
    translatedTitles() {
      return {
        en: {
          feedback: 'Feedback',
          comingSoon: 'This section is under development'
        },
        fr: {
          feedback: 'Retour d\'expérience',
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
.feedback-container {
  padding: 2rem;
}

.feedback-header {
  margin-bottom: 2rem;

  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.feedback-content {
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
  .feedback-header h1 {
    color: #fff;
  }

  .feedback-content {
    background: #2d2d2d;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

    p {
      color: #999;
    }
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .feedback-container {
    padding: 1rem;
  }

  .feedback-content {
    padding: 1rem;
  }
}
</style> 
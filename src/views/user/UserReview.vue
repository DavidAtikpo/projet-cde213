<!-- UserReview.vue -->
<template>
  <div class="review-container">
    <div class="review-header">
      <h1>{{ getTranslatedTitle('review') }}</h1>
    </div>
    <div class="review-content">
      <!-- Le contenu sera ajouté ultérieurement -->
      <p>{{ getTranslatedTitle('comingSoon') }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'UserReview',
  computed: {
    ...mapState(['theme', 'language']),
    translatedTitles() {
      return {
        en: {
          review: 'Review',
          comingSoon: 'This section is under development'
        },
        fr: {
          review: 'Revue',
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
.review-container {
  padding: 2rem;
}

.review-header {
  margin-bottom: 2rem;

  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.review-content {
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
  .review-header h1 {
    color: #fff;
  }

  .review-content {
    background: #2d2d2d;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

    p {
      color: #999;
    }
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .review-container {
    padding: 1rem;
  }

  .review-content {
    padding: 1rem;
  }
}
</style> 
<!-- ReviewView.vue -->
<template>
  <div class="review-container">
    <h1>{{ getTranslatedTitle('review') }}</h1>
    <div class="review-content">
      <p class="no-data">{{ getTranslatedTitle('noReviews') }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ReviewView',
  computed: {
    ...mapState(['language']),
    translatedTitles() {
      return {
        en: {
          review: 'Review',
          noReviews: 'No reviews available'
        },
        fr: {
          review: 'Révision',
          noReviews: 'Aucune révision disponible'
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
  padding: 20px;
}

.review-content {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 20px;
}

.no-data {
  color: #666;
  text-align: center;
  font-style: italic;
}

/* Dark theme */
:deep(.dark) {
  .review-content {
    background: #2d2d2d;
  }

  .no-data {
    color: #999;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .review-container {
    padding: 15px;
  }
}
</style> 
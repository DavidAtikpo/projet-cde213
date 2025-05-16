<!-- UserMessage.vue -->
<template>
  <div class="message-container">
    <div class="message-header">
      <h1>{{ getTranslatedTitle('message') }}</h1>
    </div>
    <div class="message-content">
      <!-- Le contenu sera ajouté ultérieurement -->
      <p>{{ getTranslatedTitle('comingSoon') }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'UserMessage',
  computed: {
    ...mapState(['theme', 'language']),
    translatedTitles() {
      return {
        en: {
          message: 'Messages',
          comingSoon: 'This section is under development'
        },
        fr: {
          message: 'Messages',
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
.message-container {
  padding: 2rem;
}

.message-header {
  margin-bottom: 2rem;

  h1 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
}

.message-content {
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
  .message-header h1 {
    color: #fff;
  }

  .message-content {
    background: #2d2d2d;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

    p {
      color: #999;
    }
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .message-container {
    padding: 1rem;
  }

  .message-content {
    padding: 1rem;
  }
}
</style> 
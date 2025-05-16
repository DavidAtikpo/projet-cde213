<!-- SettingsView.vue -->
<template>
  <div class="settings-container">
    <h1>{{ getTranslatedTitle('settings') }}</h1>
    <div class="settings-content">
      <!-- Paramètres généraux -->
      <div class="settings-section">
        <h2>{{ getTranslatedTitle('generalSettings') }}</h2>
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <h3>{{ getTranslatedTitle('language') }}</h3>
              <p>{{ getTranslatedTitle('languageDescription') }}</p>
            </div>
            <div class="setting-control">
              <select v-model="selectedLanguage" @change="updateLanguage">
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>{{ getTranslatedTitle('theme') }}</h3>
              <p>{{ getTranslatedTitle('themeDescription') }}</p>
            </div>
            <div class="setting-control">
              <select v-model="selectedTheme" @change="updateTheme">
                <option value="light">{{ getTranslatedTitle('lightTheme') }}</option>
                <option value="dark">{{ getTranslatedTitle('darkTheme') }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Paramètres de notification -->
      <div class="settings-section">
        <h2>{{ getTranslatedTitle('notificationSettings') }}</h2>
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <h3>{{ getTranslatedTitle('emailNotifications') }}</h3>
              <p>{{ getTranslatedTitle('emailNotificationsDescription') }}</p>
            </div>
            <div class="setting-control">
              <label class="switch">
                <input type="checkbox" v-model="emailNotifications" @change="updateEmailNotifications">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>{{ getTranslatedTitle('pushNotifications') }}</h3>
              <p>{{ getTranslatedTitle('pushNotificationsDescription') }}</p>
            </div>
            <div class="setting-control">
              <label class="switch">
                <input type="checkbox" v-model="pushNotifications" @change="updatePushNotifications">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Paramètres de sécurité -->
      <div class="settings-section">
        <h2>{{ getTranslatedTitle('securitySettings') }}</h2>
        <div class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <h3>{{ getTranslatedTitle('twoFactorAuth') }}</h3>
              <p>{{ getTranslatedTitle('twoFactorAuthDescription') }}</p>
            </div>
            <div class="setting-control">
              <label class="switch">
                <input type="checkbox" v-model="twoFactorAuth" @change="updateTwoFactorAuth">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>{{ getTranslatedTitle('sessionTimeout') }}</h3>
              <p>{{ getTranslatedTitle('sessionTimeoutDescription') }}</p>
            </div>
            <div class="setting-control">
              <select v-model="sessionTimeout" @change="updateSessionTimeout">
                <option value="15">15 {{ getTranslatedTitle('minutes') }}</option>
                <option value="30">30 {{ getTranslatedTitle('minutes') }}</option>
                <option value="60">1 {{ getTranslatedTitle('hour') }}</option>
                <option value="120">2 {{ getTranslatedTitle('hours') }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Boutons d'action -->
      <div class="settings-actions">
        <button class="save-button" @click="saveSettings">
          {{ getTranslatedTitle('saveChanges') }}
        </button>
        <button class="reset-button" @click="resetSettings">
          {{ getTranslatedTitle('resetToDefault') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SettingsView',
  data() {
    return {
      selectedLanguage: 'en',
      selectedTheme: 'light',
      emailNotifications: true,
      pushNotifications: true,
      twoFactorAuth: false,
      sessionTimeout: '30'
    };
  },
  computed: {
    ...mapState(['language']),
    translatedTitles() {
      return {
        en: {
          settings: 'Settings',
          generalSettings: 'General Settings',
          notificationSettings: 'Notification Settings',
          securitySettings: 'Security Settings',
          language: 'Language',
          languageDescription: 'Choose your preferred language',
          theme: 'Theme',
          themeDescription: 'Choose between light and dark theme',
          lightTheme: 'Light',
          darkTheme: 'Dark',
          emailNotifications: 'Email Notifications',
          emailNotificationsDescription: 'Receive notifications via email',
          pushNotifications: 'Push Notifications',
          pushNotificationsDescription: 'Receive push notifications',
          twoFactorAuth: 'Two-Factor Authentication',
          twoFactorAuthDescription: 'Add an extra layer of security to your account',
          sessionTimeout: 'Session Timeout',
          sessionTimeoutDescription: 'Set the duration of your session',
          minutes: 'minutes',
          hour: 'hour',
          hours: 'hours',
          saveChanges: 'Save Changes',
          resetToDefault: 'Reset to Default'
        },
        fr: {
          settings: 'Paramètres',
          generalSettings: 'Paramètres Généraux',
          notificationSettings: 'Paramètres de Notification',
          securitySettings: 'Paramètres de Sécurité',
          language: 'Langue',
          languageDescription: 'Choisissez votre langue préférée',
          theme: 'Thème',
          themeDescription: 'Choisissez entre le thème clair et sombre',
          lightTheme: 'Clair',
          darkTheme: 'Sombre',
          emailNotifications: 'Notifications par Email',
          emailNotificationsDescription: 'Recevoir des notifications par email',
          pushNotifications: 'Notifications Push',
          pushNotificationsDescription: 'Recevoir des notifications push',
          twoFactorAuth: 'Authentification à Deux Facteurs',
          twoFactorAuthDescription: 'Ajouter une couche de sécurité supplémentaire à votre compte',
          sessionTimeout: 'Délai de Session',
          sessionTimeoutDescription: 'Définir la durée de votre session',
          minutes: 'minutes',
          hour: 'heure',
          hours: 'heures',
          saveChanges: 'Enregistrer les Modifications',
          resetToDefault: 'Réinitialiser par Défaut'
        }
      };
    }
  },
  methods: {
    getTranslatedTitle(key) {
      return this.translatedTitles[this.language]?.[key] || key;
    },
    updateLanguage() {
      // Implémenter la mise à jour de la langue
    },
    updateTheme() {
      // Implémenter la mise à jour du thème
    },
    updateEmailNotifications() {
      // Implémenter la mise à jour des notifications email
    },
    updatePushNotifications() {
      // Implémenter la mise à jour des notifications push
    },
    updateTwoFactorAuth() {
      // Implémenter la mise à jour de l'authentification à deux facteurs
    },
    updateSessionTimeout() {
      // Implémenter la mise à jour du délai de session
    },
    saveSettings() {
      // Implémenter la sauvegarde des paramètres
    },
    resetSettings() {
      // Implémenter la réinitialisation des paramètres
    }
  }
};
</script>

<style lang="scss" scoped>
.settings-container {
  padding: 20px;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.settings-section {
  h2 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 1.2rem;
  }
}

.settings-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
}

.setting-info {
  flex: 1;

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #333;
  }

  p {
    margin: 5px 0 0 0;
    font-size: 0.9rem;
    color: #666;
  }
}

.setting-control {
  select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 0.9rem;
    color: #333;
    background: white;
    cursor: pointer;

    &:focus {
      outline: none;
      border-color: #db2323;
    }
  }
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider {
      background-color: #db2323;
    }

    &:checked + .slider:before {
      transform: translateX(26px);
    }
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }
}

.settings-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
}

.save-button,
.reset-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-button {
  background: #db2323;
  color: white;

  &:hover {
    background: #b31b1b;
  }
}

.reset-button {
  background: #f5f5f5;
  color: #666;

  &:hover {
    background: #e0e0e0;
  }
}

/* Dark theme */
:deep(.dark) {
  .settings-section h2 {
    color: #fff;
  }

  .settings-card {
    background: #2d2d2d;
  }

  .setting-item {
    border-bottom-color: #333;
  }

  .setting-info {
    h3 {
      color: #fff;
    }

    p {
      color: #999;
    }
  }

  .setting-control {
    select {
      background: #1a1a1a;
      border-color: #333;
      color: #fff;

      &:focus {
        border-color: #db2323;
      }
    }
  }

  .reset-button {
    background: #1a1a1a;
    color: #999;

    &:hover {
      background: #333;
    }
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .settings-container {
    padding: 15px;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .setting-control {
    width: 100%;

    select {
      width: 100%;
    }
  }

  .settings-actions {
    flex-direction: column;
  }

  .save-button,
  .reset-button {
    width: 100%;
  }
}
</style> 
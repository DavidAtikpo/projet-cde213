<template>
  <div :class="['main', theme]">
    <div class="side-bar" :class="{ 'collapsed': isSidebarCollapsed }">
      <slot name="sidebar"></slot>
      <button class="sidebar-toggle" @click="toggleSidebar">
        <i class="fas" :class="isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
      </button>
    </div>
    <div class="container" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <div class="top-bar">
        <slot name="topbar"></slot>
      </div>
      <div class="dashboard">
        <div class="dashboard-content">
          <slot name="dashboard"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'UserDashLayout',
  data() {
    return {
      isSidebarCollapsed: false
    };
  },
  computed: {
    ...mapState(['theme'])
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
      // Sauvegarder l'état dans le localStorage
      localStorage.setItem('sidebarCollapsed', this.isSidebarCollapsed);
    }
  },
  mounted() {
    // Récupérer l'état du sidebar depuis le localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      this.isSidebarCollapsed = savedState === 'true';
    }
  }
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  width: 100%;
  min-height: 100vh;
  position: relative;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.side-bar {
  width: 280px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);

  &.collapsed {
    width: 80px;
    transform: translateX(-200px);
  }
}

.sidebar-toggle {
  position: absolute;
  right: -12px;
  top: 20px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #db2323;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1001;

  &:hover {
    background: #b31b1b;
    transform: scale(1.1);
  }

  i {
    font-size: 12px;
  }
}

.container {
  flex: 1;
  margin-left: 280px;
  transition: all 0.3s ease;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &.sidebar-collapsed {
    margin-left: 80px;
  }
}

.top-bar {
  height: auto;
  min-height: 80px;
  padding: 1rem 2rem;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 900;
  transition: all 0.3s ease;
}

.dashboard {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  transition: all 0.3s ease;
}

/* Theme styles */
.dark {
  background-color: #1a1a1a;
  color: #fff;

  .top-bar {
    background: #2d2d2d;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  .dashboard {
    background-color: #1a1a1a;
  }

  .dashboard-content {
    background: #2d2d2d;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .side-bar {
    width: 240px;
  }

  .container {
    margin-left: 240px;
  }

  .dashboard-content {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .side-bar {
    transform: translateX(-100%);
    
    &.collapsed {
      transform: translateX(0);
      width: 240px;
    }
  }

  .container {
    margin-left: 0;
  }

  .top-bar {
    padding: 1rem;
  }

  .dashboard {
    padding: 1rem;
  }

  .dashboard-content {
    padding: 1rem;
    border-radius: 0.5rem;
  }
}

/* Scrollbar Styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #db2323;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b31b1b;
}

.dark {
  ::-webkit-scrollbar-track {
    background: #2d2d2d;
  }

  ::-webkit-scrollbar-thumb {
    background: #db2323;
  }
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.dashboard-content {
  animation: slideIn 0.3s ease;
}
</style>

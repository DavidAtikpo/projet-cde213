<!-- adminDashLayout.vue -->
<template>
  <div class="admin-layout">
    <div class="sidebar">
      <slot name="sidebar"></slot>
    </div>
    <div class="main-content">
      <div class="topbar">
        <slot name="topbar"></slot>
      </div>
      <div class="content">
        <slot name="dashboard"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashLayout'
}
</script>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.sidebar {
  width: 250px;
  background-color: #fff;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 99;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* Dark theme */
:deep(.dark) {
  .admin-layout {
    background-color: #1a1a1a;
  }

  .sidebar,
  .topbar {
    background-color: #2d2d2d;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
  }

  .content {
    padding: 15px;
  }
}
</style> 
<template>
  <div :class="['main', theme]">
    <div class="side-bar">
      <slot name="sidebar"></slot>
    </div>
    <div class="container">
      <div class="top-bar"><slot name="topbar"></slot></div>
      <div class="dashboard"><slot name="dashboard"></slot></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['theme'])
  }
};
</script>

<style lang="css" scoped>
.main {
  display: flex;
  width: 100%;
  height: 100vh;
}

.container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.top-bar {
  height: 15rem;
  /* Add your topbar styles here */
}

.dashboard {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
}

/* Define your theme styles */
.dark {
  background-color: #525050;
  color: #fff;
}

.light {
  background-color: #fff;
  color: #333;
}
</style>

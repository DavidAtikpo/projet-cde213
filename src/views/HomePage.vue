<template>
  <div>
    <NavigationComponent />
    <TestimonialComponent />
    <!-- <GeolocalisationForm/> -->
    <FooterComponent />
  </div>
</template>

<script>
import NavigationComponent from '@/components/NavigationComponent.vue';
import TestimonialComponent from '@/components/TestimonialComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
// import GeolocalisationForm from '@/components/GeolocalisationForm.vue';

export default {
  components: {
    NavigationComponent,
    TestimonialComponent,
    // GeolocalisationForm,
    FooterComponent
  }
};
</script>

<style scoped>
</style>


<template>
  <div>
    <NavigationComponent />
    <cdeComponent/>
    <TestimonialComponent />
    <!-- <GeolocalisationForm/> -->
    <FooterComponent />
  </div>
</template>

<script>
import NavigationComponent from '@/components/NavigationComponent.vue';
import TestimonialComponent from '@/components/TestimonialComponent.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import cdeComponent from '@/components/cdeComponent.vue';
// import GeolocalisationForm from '@/components/GeolocalisationForm.vue';

export default {
  components: {
    NavigationComponent,
    cdeComponent,
    TestimonialComponent,
    // GeolocalisationForm,
    FooterComponent
  }
};
</script>

<style scoped>
</style>


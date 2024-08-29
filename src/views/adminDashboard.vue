<!-- adminDashboard.vue -->
<template>
  <div>
    <userDashLayout>
      <template #topbar>
        <adminDashNavbarComponent></adminDashNavbarComponent>
      </template>
      <template #dashboard>
        <component :is="CurrentView"></component>
      </template>
    </userDashLayout>
  </div>
</template>

<script>

import userDashLayout from '@/layouts/userDashLayout.vue';
import adminDashNavbarComponent from '../components/admin/adminDashNavbarComponent.vue';
// import adminDashSidebarComponent from '@/components/admin/adminDashSidebarComponent.vue';
import childRegInfo from '../components/childRegInfo.vue';
import suiviComponent from '../components/admin/checkInComponent.vue';
import suiviOutcomponent from '@/components/admin/checkOutcomponent.vue';
import AnalyticsView from '@/components/admin/accueillComponent.vue';
import settingComponent from '@/components/settingComponent.vue';
import searchComponent from '../components/searchComponent.vue';
import adminComponent from '@/components/admin/adminCompneent.vue';
import adminparaComponent from '@/components/admin/adminparaComponent.vue';
import aideComponent from '../components/aideComponent.vue';
import changeCountComponent from '@/components/changeCountComponent.vue';
import editProfilComponent from '@/components/editProfilComponent.vue';
import gererCountComponent from '@/components/gererCountComponent.vue';
import LogoutComponent from '@/components/LogoutComponent.vue';
import reviewComponent from '@/components/reviewComponent.vue';
import dailyObjectiveComponent from '@/components/dailyObjectiveComponent.vue';
import reportComponent from '@/components/reportComponent.vue';
import statisticComponent from '@/components/admin/statisticComponent.vue';
import uploadPictureComponent from '@/components/uploadPictureComponent.vue';
import absentComponent from '@/components/absentComponent.vue';
import listOfChildComponent from '@/components/listOfChildComponent.vue';
import userEditInfoComponent from '@/components/user/userEditInfoComponent.vue';
import createActivityComponent from '@/components/admin/createActivityComponent.vue';
import weekGoalComponent from '@/components/admin/weekGoalComponent.vue';
import uploadChildPictureComponent from '@/components/uploadChildPictureComponent.vue';
import messageComponent from '@/components/messageComponent.vue';


export default {
  components: {
    userDashLayout,
    adminDashNavbarComponent,
    analytics: AnalyticsView,
    inscription: childRegInfo,
    suivi: suiviComponent,
    rapport: suiviOutcomponent,
    setting: settingComponent,
    search: searchComponent,
    userActivity: adminComponent,
    editphoto: editProfilComponent,
    changeCount: changeCountComponent,
    gererCount: gererCountComponent,
    aide: aideComponent,
    logout: LogoutComponent,
    Parametre: adminparaComponent,
    Review: reviewComponent,
    dailyObject: dailyObjectiveComponent,
    report: reportComponent,
    statistic: statisticComponent,
    uploadPicture: uploadPictureComponent,
    Absent: absentComponent,
    listOfchildren: listOfChildComponent,
    userInfo: userEditInfoComponent,
    ActiviteHebdomadaire: createActivityComponent,
    weekGoal: weekGoalComponent,
    childPicture: uploadChildPictureComponent,
    message: messageComponent,
  },
  data() {
    return {
      CurrentView: 'userActivity',
    };
  },
  watch: {
    $route(to) {
      this.CurrentView = to.params.id;
    },
  },
  mounted() {
    // Set the current view when the component is mounted based on the route
    this.CurrentView = this.$route.params.id || 'userActivity';
  },
};
</script>

<style lang="scss" scoped>
</style>

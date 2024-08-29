<!-- UserDashboard.vue -->
<template>
  <div>
      <userDashLayout>
          <template #topbar>
              <UserDashNavbarComponent></UserDashNavbarComponent>
          </template>
          <template #dashboard>
              <component :is="CurrentView"></component>
          </template>
      </userDashLayout>
  </div>
</template>

<script>
import userDashLayout from '@/layouts/userDashLayout.vue';
import UserDashNavbarComponent from '../components/user/UserDashNavbarComponent.vue';
import UserDashSidebarComponent from '../components/user/UserDashSidebarComponent.vue';
import childRegInfo from '../components/childRegInfo.vue';
import suiviComponent from '../components/user/checkInComponent.vue';
import suiviOutcomponent from '@/components/user/checkOutcomponent.vue';
import AnalyticsView from '@/components/user/accueillComponent.vue';
import settingComponent from '../components/settingComponent.vue';
import searchComponent from '../components/searchComponent.vue';
import aideComponent from '@/components/aideComponent.vue';
import changeCountComponent from '@/components/changeCountComponent.vue';
import userEditInfoComponent from '@/components/user/userEditInfoComponent.vue';
import gererCountComponent from '@/components/gererCountComponent.vue';
import LogoutComponent from '@/components/LogoutComponent.vue';
import AdminparaComponent from '@/components/admin/adminparaComponent.vue';
import userReportComponent from '@/components/user/userReportComponent.vue';
import userRevewComponent from '@/components/user/userRevewComponent.vue';
import userStatisticComponent from '@/components/user/userStatisticComponent.vue';
import listOfChildComponent from '@/components/listOfChildComponent.vue';
import createActivityComponent from '@/components/user/createActivityComponent.vue';
import messageComponent from '@/components/messageComponent.vue';
import absentComponent from '@/components/absentComponent.vue';
import uploadChildPictureComponent from '@/components/uploadChildPictureComponent.vue';

export default {
  components: {
      userDashLayout,
      UserDashSidebarComponent,
      UserDashNavbarComponent,
      analytics: AnalyticsView,
      inscription: childRegInfo,
      suivi: suiviComponent,
      rapport: suiviOutcomponent,
      setting: settingComponent,
      search: searchComponent,
      userInfo: userEditInfoComponent,
      gererCount: gererCountComponent,
      aide: aideComponent,
      changeCount: changeCountComponent,
      logout: LogoutComponent,
      Parametre: AdminparaComponent,
      userReport: userReportComponent,
      review: userRevewComponent,
      statistic: userStatisticComponent,
      listOfchildren: listOfChildComponent,
      ActiviteHebdomadaire: createActivityComponent,
      Message: messageComponent,
      Absent: absentComponent,
      childPicture: uploadChildPictureComponent,
  },
  data() {
      return {
          CurrentView: '',
      };
  },
  watch: {
      $route(to) {
          this.CurrentView = to.params.id;
      },
  },
  // methods: {
  //   saveData() {
  //     // Save the data to a database or perform any required action
  //   }
  // }
};
</script>

<style lang="scss" scoped>
</style>

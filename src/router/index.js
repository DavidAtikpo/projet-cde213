import { createRouter, createWebHistory } from 'vue-router';

// Lazy load components using dynamic imports
const HomePage = () => import('@/views/HomePage.vue');
const Login = () => import('@/views/LoginView.vue');
const Register = () => import('@/views/RegisterView.vue');
const UserDashboard = () => import('@/views/userDashboard.vue');
const AdminDashboard = () => import('@/views/adminDashboard.vue');
const ChildPicture = () => import('@/components/uploadChildPictureComponent.vue');
const ForgotPassword = ()=> import('@/views/ForgotPassword.vue')
const RessetPassword = () => import('@/views/ResetPassword.vue')
const CheckOutComponent = () => import('@/components/checkOutcomponent.vue')
const ListeEnfant = () => import('@/components/listOfChildComponent.vue')
const Presence = () => import('@/components/listOfpresentComponent.vue')
const Absence = () => import('@/components/absentComponent.vue')
const Registration = () => import('@/components/childRegInfo.vue')
const Daily = () => import('@/components/dailyObjectiveComponent.vue')
const Report = () => import('@/components/reportComponent.vue')
const Objetif = () => import('@/components/user/userRevewComponent.vue')
const Rapport = () => import('@/components/user/userReportComponent.vue')
const MessageComponent = () => import('@/components/messageComponent.vue')
const checking = () => import('@/components/admin/checkInComponent.vue')
const Weekly = () => import('@/components/admin/weekGoalComponent.vue')
const HebdomadaireObjectifs = () => import('@/components/user/createActivityComponent.vue')
const CreateActivity = () => import('@/components/admin/createActivityComponent.vue')
const accueil = () => import('@/components/user/accueillComponent.vue')
const checkin = () => import('@/components/user/checkInComponent.vue')
const checkOutcomponent = () => import('@/components/user/checkOutcomponent.vue')
const createActivityComponent = () => import('@/components/user/createActivityComponent.vue')
const userReportComponent = () => import('@/components/user/userReportComponent.vue')
const userRevewComponent = () => import('@/components/user/userRevewComponent.vue')
const userStatisticComponent = () => import('@/components/user/userStatisticComponent.vue')
const UserView = () => import('@/components/UsersView.vue')
const MonitorClassViewComponent = () => import('@/components/monitor/MonitorClassViewComponent.vue')
const MonitorDashboard = () => import('@/views/MonitorDashboard.vue')
const MonitorRegistrationComponent = () => import('@/components/admin/MonitorRegistrationComponent.vue')
const MonitorReportsAdminComponent = () => import('@/components/admin/MonitorReportsAdminComponent.vue')
const ClassManagementComponent = () => import('@/components/admin/ClassManagementComponent.vue')
const router = createRouter({
  history: createWebHistory('/'), 
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: Login,
    },
    {
      path: '/user/signup',
      name: 'Register',
      component: Register,
    },

    {
      path: '/monitor/:id',
      name: 'monitorDashboard',
      component: MonitorDashboard,
    },


    {
      path: '/user/:id',
      name: 'userDashboard',
      component: UserDashboard,
      children: [
        {
          path: '',
          name: 'userHome',
          component: CheckOutComponent
        },
        {
          path: 'Registration',
          name: 'userRegistration',
          component: Registration
        },
        {
          path: 'children/list',
          name: 'userChildrenList',
          component: ListeEnfant
        },
        {
          path: 'attendance/present',
          name: 'userPresent',
          component: Presence
        },
        {
          path: 'attendance/absent',
          name: 'userAbsent',
          component: Absence
        },
        {
          path: 'objectif',
          name: 'userObjectif',
          component: Objetif
        },
        {
          path: 'rapport',
          name: 'userRapport',
          component: Rapport
        },
        {
          path: 'hebdomadaire/objectifs',
          name: 'userHebdomadaireObjectifs',
          component: HebdomadaireObjectifs
        },
        {
          path: 'communication/messages',
          name: 'userMessages',
          component: MessageComponent
        }
      ]
    },

    {
      path: '/admin/:id',
      name: 'dashboard',
      component: AdminDashboard,
      children: [
        {
          path: '',
          name: 'adminHome',
          component: CheckOutComponent
        },
        {
          path: 'ListeEnfant',
          name: 'ListeEnfant',
          component: ListeEnfant
        },
        {
          path: 'Present',
          name: 'Present',
          component: Presence
        },
        {
          path: 'Absent',
          name: 'Absent',
          component: Absence
        },
        {
          path: 'Registration',
          name: 'Registration',
          component: Registration
        },
        {
          path: 'Daily',
          name: 'Daily',
          component: Daily
        },
        {
          path: 'reports',
          name: 'reports',
          component: Report
        },
        {
          path: 'objectif',
          name: 'objectif',
          component: Objetif
        },
        {
          path: 'rapport',
          name: 'rapport',
          component: Rapport
        },
        // {
        //   path: 'checkin',
        //   name: 'checkin',
        //   component: checking
        // },
        {
          path: 'weekly',
          name: 'weekly',
          component: Weekly
        },
        {
          path: 'hebdomadaire/objectifs',
          name: 'HebdomadaireObjectifs',
          component: HebdomadaireObjectifs
        },
        // {
        //   path: 'createActivity',
        //   name: 'createActivity',
        //   component: CreateActivity
        // },
        {
          path: 'accueil',
          name: 'accueil',
          component: accueil
        },
        {
          path: 'checkin',
          name: 'checkin',
          component: checkin
        },
        {
          path: 'checkOut',
          name: 'checkOut',
          component: checkOutcomponent
        },
        {
          path: 'createActivity',
          name: 'createActivity',
          component: createActivityComponent
        },
        {
          path: 'userReport',
          name: 'userReport',
          component: userReportComponent
        },
        {
          path: 'userRevew',
          name: 'userRevew',
          component: userRevewComponent
        },
        {
          path: 'userStatistic',
          name: 'userStatistic',
          component: userStatisticComponent
        },
        {
          path: 'userView',
          name: 'userView',
          component: UserView
        },
        {
          path: 'classManagement',
          name: 'classManagement',
          component: ClassManagementComponent
        },
          {
            path: 'monitorRegistration',
            name: 'monitorRegistration',
            component: MonitorRegistrationComponent
          },
        {
          path: 'monitorClassView',
          name: 'monitorClassView',
          component: MonitorClassViewComponent
        },
        {
          path: 'monitorReportsAdmin',
          name: 'monitorReportsAdmin',
          component: MonitorReportsAdminComponent
        },
      ]
    },
    {
      path: '/admin/childPicture/:id',
      name: 'ChildPicture',
      component: ChildPicture,
    },
    {
      path: '/forgot',
      name: 'ForgotPassword',
      component: ForgotPassword,
    },
    {
      path: '/resset',
      name: 'RessetPassword',
      component: RessetPassword,
    }
  ],
});

export default router;

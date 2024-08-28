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
      path: '/user/:id',
      name: 'userDashboard',
      component: UserDashboard,
    },
    {
      path: '/admin/:id',
      name: 'adminDashboard',
      component: AdminDashboard,
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
    },
  ],
});

export default router; // Use export default instead of module.exports

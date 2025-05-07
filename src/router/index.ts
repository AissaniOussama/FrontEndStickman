import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/Utils.vue'
import TheWelcome from '../views/TheWelcome.vue'
import HomeView from '../views/HomeView.vue'





const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/TheWelcome',
      name: '',
      component: TheWelcome,
    },
  ],
})

export default router

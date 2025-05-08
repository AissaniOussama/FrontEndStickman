import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../components/Utils.vue'
import TheWelcome from '../views/TheWelcome.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/TheWelcome',
      name: 'welcome',
      component: TheWelcome
    }
  ]
})

export default router

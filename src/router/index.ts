import { createRouter, createWebHistory } from 'vue-router'
import TheWelcome from '../views/TheWelcome.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import StickmanList from '../components/StickmanList.vue'

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
    },
    {
      path: '/stickmen',
      name: 'stickmen',
      component: StickmanList
    }
  ]
})

export default router

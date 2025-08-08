import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Customizer from '../views/Customizer.vue'   // vorher: TheWelcome.vue
import Viewer from '../views/Viewer.vue'           // vorher: StickmanShow.vue
import StickmanList from '../components/StickmanList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },

    // neue, sprechende Pfade
    { path: '/customizer', name: 'customizer', component: Customizer },
    { path: '/viewer',     name: 'viewer',     component: Viewer },

    // (optional) alte Pfade weiterleiten, damit alte Links nicht brechen
    { path: '/TheWelcome', redirect: { name: 'customizer' } },
    { path: '/login',      redirect: { name: 'viewer' } },

    { path: '/stickmen', name: 'stickmen', component: StickmanList },

    // Catch-all optional
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'        // ← plus de .js
import LandingPage from '@/components/LandingPage.vue'
import OnGoingTour from '@/components/OnGoingTour.vue'
import OnGoingPredictionsRanking from '@/components/OnGoingPredictionsRanking.vue'
import Archives from '@/components/Archives.vue'
import Register from '@/components/Register.vue'

const routes = [
  { path: '/', name: 'LandingPage', component: LandingPage },
  { path: '/ongoing-tour', name: 'ongoing-tour', component: OnGoingTour, meta: { requiresAuth: true } },
  { path: '/ongoing-predictions-ranking', name: 'ongoing-predictions-ranking', component: OnGoingPredictionsRanking, meta: { requiresAuth: true } },
  { path: '/archives', name: 'archives', component: Archives, meta: { requiresAuth: true } },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: Register,
    props: (route: RouteLocationNormalized) => ({ resetPassword: !!route.query.token }),  // ← type ajouté
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    props: (route: RouteLocationNormalized) => ({ passwordReset: route.query.passwordReset === 'true' }),  // ← type ajouté
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {   // ← _from
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const authStore = useAuthStore()
    if (!authStore.userLogged) {
      next({ name: 'LandingPage' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
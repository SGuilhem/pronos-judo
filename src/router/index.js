import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: LandingPage
  },
  {
    path: '/ongoing-tour',
    name: 'ongoing-tour',
  },
  {
    path: '/ongoing-result',
    name: 'ongoing-result',
  },
  {
    path: '/archives',
    name: 'archives',
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import Vue from 'vue';
import Router from 'vue-router';
import LandingPage from '../pages/LandingPage.vue'
import Archives from '../pages/OnGoingTour.vue'
import OnGoingTour from '@/pages/OnGoingTour.vue'
import OnGoingPredictionsRanking from '@/components/OnGoingPredictionsRanking.vue';
import { checkAuth } from '@/services/authService';

const routes = [
  {
    path: '/',
    name: 'home',
    component: LandingPage,
  },
  {
    path: '/ongoing-tour',
    name: 'ongoing-tour',
    component: OnGoingTour,
    /* meta: { requiresAuth: true }, */
  },
  {
    path: '/registration-page',
    name: 'registration-page',
  },
  {
    path: '/ongoing-result',
    name: 'ongoing-result',
    component: OnGoingPredictionsRanking,
    /* meta: { requiresAuth: true }, */
  },
  {
    path: '/archives',
    name: 'archives',
    component: Archives,
    /* meta: { requiresAuth: true }, */
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');
    if (!token) {
      next({ name: 'Login' });
    } else {
      checkAuth()
        .then(() => {
          next();
        })
        .catch(() => {
          localStorage.removeItem('token');
          next({ name: 'Login' });
        });
    }
  } else {
    next();
  }
});

export default router;

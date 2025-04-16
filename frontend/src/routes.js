import OnGoingPredictionsRanking from "./components/OnGoingPredictionsRanking.vue";
import OnGoingTour from "./pages/OnGoingTour.vue";

const router = new VueRouter({
    routes: [
      {
        path: '/',
        name: 'home',
        component: LandingPage
      },
      {
        path: '/ongoing-tour',
        name: 'competition-en-cours',
        component: OnGoingTour,
        meta: { requiresAuth: true }
      },
      {
        path: '/ongoing-predictions',
        name: 'competition-en-cours',
        component: OnGoingPredictionsRanking,
        meta: { requiresAuth: true }
      },
      {
        path: '/archives',
        name: 'archives',
        component: Archives,
        meta: { requiresAuth: true }
      }
    ]
  })
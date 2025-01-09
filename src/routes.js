import OnGoingPredictionsRanking from "./components/OnGoingPredictionsRanking.vue";
import OnGoingTour from "./pages/OnGoingTour.vue";

const router = new VueRouter({
    routes: [
      {
        path: '/home' || '/',
        name: 'home',
        component: LandingPage
      },
      {
        path: '/ongoing-tour',
        name: 'competition-en-cours',
        component: OnGoingTour
      },
      {
        path: '/ongoing-predictions',
        name: 'competition-en-cours',
        component: OnGoingPredictionsRanking
      },
      {
        path: '/archives',
        name: 'archives',
        component: Archives
      }
    ]
  })
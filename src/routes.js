import OnGoingTour from "./pages/OnGoingTour.vue";

const router = new VueRouter({
    routes: [
      {
        path: '/home' || '/',
        name: 'home',
        component: LandingPage
      },
      {
        path: '/ongoing-bet',
        name: 'competition-en-cours',
        component: OnGoingTour
      },
      {
        path: '/ongoing-bet',
        name: 'competition-en-cours',
        component: RegistrationPage
      }
    ]
  })
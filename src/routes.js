const router = new VueRouter({
    routes: [
      {
        path: '/home',
        name: 'home',
        component: LandingPage
      },
      {
        path: '/ongoing-bet',
        name: 'competition-en-cours',
        component: ''
      }
    ]
  })
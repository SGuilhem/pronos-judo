import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../components/LandingPage";
import OnGoingTour from "../components/OnGoingTour";
import OnGoingPredictionsRanking from "../components/OnGoingPredictionsRanking";
import Archives from "../components/Archives";
import Register from "../components/Register"
import store from "../store"; 

const routes = [
  {
    path: "/",
    name: "LandingPage",
    component: LandingPage,
  },
  {
    path: "/ongoing-tour",
    name: "ongoing-tour",
    component: OnGoingTour,
    meta: { requiresAuth: true },
  },
  {
    path: "/ongoing-predictions-ranking",
    name: "ongoing-predictions-ranking",
    component: OnGoingPredictionsRanking,
    meta: { requiresAuth: true },
  },
  {
    path: "/archives",
    name: "archives",
    component: Archives,
    meta: { requiresAuth: true },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: Register,
    props: (route) => ({
      resetPassword: !!route.query.token,
    }),
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    props: (route) => ({
      passwordReset: route.query.passwordReset === "true",
    }),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const isLoggedIn = store.state.auth.userLogged;
    if (!isLoggedIn) {
      next({ name: "LandingPage" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;

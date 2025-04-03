import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../components/LandingPage";
import OnGoingTour from "../components/OnGoingTour";
import OnGoingPredictionsRanking from "../components/OnGoingPredictionsRanking";
import Archives from "../components/Archives";
import Register from "../components/Register"

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
  },
  {
    path: "/ongoing-predictions-ranking",
    name: "ongoing-predictions-ranking",
    component: OnGoingPredictionsRanking,
  },
  {
    path: "/archives",
    name: "archives",
    component: Archives,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

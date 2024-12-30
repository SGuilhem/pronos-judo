<template>
  <div class="flex flex-col lg:flex-row">
    <SideMenu :links="links" :linkRoutes="linkRoutes" />
    <LandingPage v-if="isHomePage" />
    <OnGoingTour
      v-if="isOnGoingTour"
      :competitionDays="competitionDays"
      :currentCompetitionDay="currentCompetitionDay"
      :currentFormattedDate="currentFormattedDate"
    />
    <OnGoingPredictionsRanking
      v-if="isOnGoingPredictionsRanking"
      :competitionDays="competitionDays"
      :currentCompetitionDay="currentCompetitionDay"
    />
    <!-- <AppFooter/> -->
  </div>
</template>

<script>
import LandingPage from "./components/LandingPage.vue";
import SideMenu from "./components/SideMenu.vue";
import OnGoingTour from "./components/OnGoingTour.vue";
import OnGoingPredictionsRanking from "./components/OnGoingPredictionsRanking.vue";
/* import AppFooter from "./components/AppFooter.vue"; */

export default {
  name: "App",
  components: {
    LandingPage,
    OnGoingTour,
    OnGoingPredictionsRanking,
    SideMenu,
    /* AppFooter */
  },
  computed: {
    isHomePage() {
      return this.$route.path === "/" || this.$route.path === "/home";
    },
    isOnGoingTour() {
      return this.$route.path === "/ongoing-tour";
    },
    isOnGoingPredictionsRanking() {
      return this.$route.path === "/ongoing-predictions-ranking";
    },
  },
  data() {
    return {
      links: [
        "Accueil",
        "Compétition en cours",
        "Classement en cours",
        "Archives",
      ],
      linkRoutes: {
        Accueil: "/home",
        "Compétition en cours": "/ongoing-tour",
        "Classement en cours": "/ongoing-predictions-ranking",
        Archives: "/archives",
      },
      competitionDays: [
        { day: 1, date: "10/12/2024", events: ["Women -48kg", "Men -60kg"] },
        { day: 2, date: "11/12/2024", events: ["Women -52kg", "Men -66kg"] },
        { day: 3, date: "12/12/2024", events: ["Women -57kg", "Men -73kg"] },
        { day: 4, date: "13/12/2024", events: ["Women -63kg", "Men -81kg"] },
        { day: 5, date: "14/12/2024", events: ["Women -70kg", "Men -90kg"] },
        { day: 6, date: "15/12/2024", events: ["Women -78kg", "Men -100kg"] },
        { day: 7, date: "16/12/2024", events: ["Women +78kg", "Men +100kg"] },
      ],
      currentCompetitionDay: 3,
      currentFormattedDate: null,
    };
  },
  mounted() {
    var currentDate = new Date();
    function formatDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    }

    this.currentFormattedDate = formatDate(currentDate);
  },
  methods: {
    setcurrentCompetitionDay(day) {
      this.currentCompetitionDay = day;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}
</style>

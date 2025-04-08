<template>
  <div class="flex flex-col lg:flex-row">
    <SideMenu :links="links" :linkRoutes="linkRoutes" />
    <router-view
      v-bind="{
        ...(currentRouteName !== 'register' && {
          competitionDays,
          currentCompetitionDay,
          currentFormattedDate,
          competitionId,
          competitionName,
          formattedStartingDay,
        }),
      }"
    />
    <!-- <AppFooter /> -->
  </div>
</template>

<script>
import SideMenu from "./components/SideMenu.vue";

export default {
  name: "App",
  components: {
    SideMenu,
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
        Accueil: "/",
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
      competitionId: 2926,
      currentCompetitionDay: null,
      currentFormattedDate: null,
      competitionName: null,
      startingDay: null,
      formattedStartingDay: null,
    };
  },
  mounted() {
    const today = new Date();
    this.currentFormattedDate = Number(this.formatDate(today));

    this.fetchCompetitionInfos().then(() => {
      if (!this.startingDay) return;

      const startingDate = new Date(this.startingDay);
      const diffInMs = today - startingDate;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays >= 0 && diffInDays < this.competitionDays.length) {
        this.currentCompetitionDay = diffInDays + 1;
      } else {
        this.currentCompetitionDay = null;
      }
    });
  },
  methods: {
    setcurrentCompetitionDay(day) {
      this.currentCompetitionDay = day;
    },
    async fetchCompetitionInfos() {
      try {
        const response = await fetch(
          `https://data.ijf.org/api/get_json?params%5Baction%5D=general.get_one&params%5Bmodule%5D=competition&params%5Bid%5D=${this.competitionId}`
        );
        const data = await response.json();
        this.competitionName = data?.title || "Compétition inconnue";
        this.startingDay = data?.date_from || null;
        this.formattedStartingDay = this.formatDate(data?.date_from);
      } catch (error) {
        console.error("Erreur lors de la récupération de la compétition :", error);
        this.competitionName = "Erreur lors du chargement";
      }
    },
    formatDate(date) {
      const parsedDate = typeof date === "string" ? new Date(date) : date;
      const day = String(parsedDate.getDate()).padStart(2, "0");
      const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
      const year = parsedDate.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
  computed: {
    currentRouteName() {
      return this.$route?.name || "";
    },
  },
};
</script>
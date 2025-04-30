<template>
  <div class="app-layout">
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
          formattedEndingDay,
          endingDay,
          startingDay,
          competitions,
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
        { day: 1, events: ["Women -48kg", "Men -60kg"] },
        { day: 2, events: ["Women -52kg", "Men -66kg"] },
        { day: 3, events: ["Women -57kg", "Men -73kg"] },
        { day: 4, events: ["Women -63kg", "Men -81kg"] },
        { day: 5, events: ["Women -70kg", "Men -90kg"] },
        { day: 6, events: ["Women -78kg", "Men -100kg"] },
        { day: 7, events: ["Women +78kg", "Men +100kg"] },
      ],
      competitionId: 2877,
      currentCompetitionDay: null,
      currentFormattedDate: this.formatDate(new Date()),
      competitions: [],
      competitionName: null,
      startingDay: null,
      endingDay: null,
      formattedStartingDay: null,
      formattedEndingDay: null,
    };
  },
  mounted() {
    const today = new Date();

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
        this.endingDay = data?.date_to || null;
        this.formattedStartingDay = this.formatDate(data?.date_from);
        this.formattedEndingDay = this.formatDate(data?.date_to);
        console.log("this.startingDay", this.startingDay);
        console.log("this.endingDay", this.endingDay);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la compétition :",
          error
        );
        this.competitionName = "Erreur lors du chargement";
      }
    },
    formatDate(date) {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = parsedDate.getFullYear();
  return `${day}/${month}/${year}`;
}
  },
  computed: {
    currentRouteName() {
      return this.$route?.name || "";
    },
  },
};
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
}

* {
  font-family: 'Poppins', sans-serif !important;
}

@media screen and (min-width: 1024px) and (max-height: 1366px){
  .app-layout {
    flex-direction: column;
  }
}

@media screen and (min-width: 1024px) and (max-height: 768px) {
  .app-layout {
    flex-direction: column;
  }
}

@media screen and (min-width: 1025px) and (min-height: 769px) {
  .app-layout {
    flex-direction: row;
  }
}
</style>

<template>
  <div class="lg:w-full flex-col text-center">
    <h1 class="lg:text-5xl text-4xl underline custom-blue font-bold lg:py-16 py-8">
      Interbudo Pronos
    </h1>
    <h4 class="text-2xl text-center lg:w-1/2 lg:px-0 px-6 m-auto lg:pb-6 pb-4">
      Ici seront archivés les précédents pronostiques qui auront eu lieu:
    </h4>

    <div class="text-2xl text-left lg:my-4 lg:mx-20">
      <ul>
        <li
          v-for="(competition, index) in archivedCompetitions"
          :key="competition.competitionId"
          class="event-item"
        >
          <div
            @click="toggleEvent(index)"
            class="custom-bg-blue rounded-lg text-white event-title bold cursor-pointer bg-gray-200 lg:mx-0 mx-5 my-3 py-2 pl-4 flex justify-between items-center"
          >
          <span>
    <span class="font-bold text-2xl underline">{{ competition.title }}</span> du {{ competition.date_from }} au {{ competition.date_to }}
  </span>
  <span :class="activeEventIndex === index ? 'rotate-180' : ''" class="transition-transform duration-300 lg:mr-6 mr-4">
    ▼
  </span>
          </div>
          <div v-if="activeEventIndex === index" :class="`${isMobile ? 'flex justify-center' : ''} event-details transition-all duration-300 overflow-hidden`">
  <div>
    <table
      class="lg:w-full w-auto text-left border-collapse border border-gray-300 my-6"
    >
      <thead>
        <tr>
          <th
            class="border w-1/8 text-base border-gray-300 px-4 py-2 bg-gray-100"
          >
            Position
          </th>
          <th
            class="border w-3/8 text-base border-gray-300 px-4 py-2 bg-gray-100"
          >
            Utilisateur
          </th>
          <th
            class="border w-3/8 text-base border-gray-300 px-4 py-2 bg-gray-100"
          >
            Points cumulés
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(user, index) in competition.leaderboard"
          :key="index"
        >
          <td
            class="border w-1/8 border-gray-300 px-4 py-2 text-center"
          >
            {{ index + 1 }}
          </td>
          <td
            class="border w-3/8 border-gray-300 px-4 py-2 text-center"
          >
            {{ user.username }}
          </td>
          <td
            class="border w-3/8 border-gray-300 px-4 py-2 text-center"
          >
            {{ user.points }} pts
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Archives",
  data() {
    return {
      archivedCompetitions: [],
      activeEventIndex: null,
      isMobile: false,
    };
  },
  mounted() {
    this.isMobile = window.innerWidth <= 768;
    window.addEventListener("resize", this.checkMobile);
    this.fetchArchivedCompetitions();
  },
  methods: {
    async fetchArchivedCompetitions() {
      const API_URL = process.env.VUE_APP_API_URL;
      try {
        const response = await fetch(`${API_URL}/api/archived-competitions"`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des compétitions archivées");
        }
        this.archivedCompetitions = await response.json();
      } catch (error) {
        console.error(error);
      }
    },
    toggleEvent(index) {
      this.activeEventIndex = this.activeEventIndex === index ? null : index;
    },
  },
};
</script>
<style>
.custom-bg-blue {
  background-color: #2d508e
}
.event-title:hover {
  background-color: #b9b5b6;
  color: black;
  transition: background-color 0.3s ease;
}
</style>
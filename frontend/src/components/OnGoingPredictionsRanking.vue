<template>
  <div class="w-full flex-col text-center">
    <h1
      class="lg:text-5xl text-4xl underline custom-blue font-bold lg:py-16 py-8"
    >
      Compétition en cours: Paris Grand Slam 2024
    </h1>
    <div
      class="lg:text-2xl text-3xl underline custom-blue font-bold lg:py-8 py-8"
    >
      En cours - Jour {{ currentCompetitionDay }}:
      {{ this.competitionDays[this.currentCompetitionDay - 1].events[0] }} &
      {{ this.competitionDays[this.currentCompetitionDay - 1].events[1] }}
    </div>
    <div class="text-2xl text-center lg:w-1/2 lg:px-0 px-6 m-auto lg:pb-6 pb-0">
        <div class="day-title mb-1 mt-8"> Classement en cours</div>
        <div :class="`${ isMobile ? '' : 'ml-4'} mt-10 flex align-left`">
          <table class="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr>
                <th class="border w-1/8 text-base border-gray-300 px-4 py-2 bg-gray-100">Position</th>
                <th class="border w-4/8 text-base border-gray-300 px-4 py-2 bg-gray-100">Utilisateur</th>
                <th class="border w-3/8 text-base border-gray-300 px-4 py-2 bg-gray-100">Points cumulés</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, index) in leaderboard" :key="index">
                <td class="border w-1/8 border-gray-300 px-4 py-2">{{ index + 1 }}</td>
                <td class="border w-4/8 border-gray-300 px-4 py-2">{{ user.username }}</td>
                <td class="border w-3/8 border-gray-300 px-4 py-2">{{ user.points }} pts</td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OnGoingPredictionsRanking",
  props: {
    competitionDays: {
      type: Object,
      required: true,
    },
    currentCompetitionDay: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isMobile: null,
      menEvent: null,
      womenEvent: null,
      leaderboard: [
        { username: "Alice", points: 120 },
        { username: "Bob", points: 110 },
        { username: "Alex", points: 105 },
        { username: "Diana", points: 100 },
        { username: "Tom", points: 95 },
        { username: "Clara", points: 90 },
        { username: "George", points: 85 },
      ],
    };
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
  },
  computed: {
  },
};
</script>

<style>
.btn {
  border: 2px solid slategray;
}
.prediction- flex align-center {
  border: 2px solid slategray;
}
.day-title {
  border: 2px solid slategray;
}
.prediction-input {
  border: 2px solid slategrey;
}
input {
  @media screen and (max-width: 768px) {
    max-width: 300px;
  }
}
.custom-blue {
  color: #2d508e
}
</style>

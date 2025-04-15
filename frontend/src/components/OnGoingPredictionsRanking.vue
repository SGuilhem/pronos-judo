<template>
  <div class="w-full flex-col text-center">
    <h1
      class="lg:text-5xl text-4xl underline custom-blue font-bold lg:py-16 pt-8 lg:mx-0 mx-1"
    >
      {{ competitionName }}
    </h1>
    <div
      class="lg:text-3xl text-2xl underline custom-blue font-bold lg:pt-4 py-8"
    >
      du {{ formattedStartingDay }} au {{ formattedEndingDay }}
    </div>
    <div class="text-2xl text-center lg:w-1/2 lg:px-0 px-6 m-auto lg:pb-6 pb-0">
      <div class="day-title mb-1 lg:mt-8 mt-6">Classement en cours</div>
      <div v-if="leaderboard.length === 0" class="text-red-500 mt-4">
        Aucun résultat à afficher pour le moment.
      </div>
      <div v-else :class="`${isMobile ? '' : 'mx-4'} mt-10 flex align-left`">
        <table
          class="w-full border-collapse border border-gray-300 lg:text-lg text-base text-center font-bold"
        >
          <thead>
            <tr>
              <th
                class="border border-gray-300 px-2 lg:px-4 py-4 bg-gray-100 w-1/12 lg:w-1/12"
              >
                Position
              </th>
              <th
                class="border border-gray-300 px-2 lg:px-4 py-4 bg-gray-100 w-6/12 lg:w-7/12"
              >
                Utilisateur
              </th>
              <th
                class="border border-gray-300 px-2 lg:px-4 py-4 bg-gray-100 w-5/12 lg:w-4/12"
              >
                Points cumulés
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in leaderboard" :key="index">
              <td
                class="border border-gray-300 px-2 lg:px-4 py-4 w-1/12 lg:w-1/12"
              >
                {{ index + 1 }}
              </td>
              <td
                class="border border-gray-300 px-2 lg:px-4 py-4 w-6/12 lg:w-7/12"
              >
                {{ user.username }}
              </td>
              <td
                class="border border-gray-300 px-2 lg:px-4 py-4 w-5/12 lg:w-4/12"
              >
                {{ user.points }} pts
              </td>
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
    competitionName: {
      type: String,
      required: true,
    },
    competitionId: {
      type: Number,
      required: true,
    },
    formattedStartingDay: {
      type: String,
      required: true,
    },
    formattedEndingDay: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isMobile: null,
      results: {},
      leaderboard: [
      { username: "Alice", points: 45 },
      { username: "Bob", points: 38 },
      { username: "Charlie", points: 32 },
      { username: "Diana", points: 28 },
      { username: "Eve", points: 20 },
    ],
      users: [],
    };
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
    /* this.fetchUserPredictions().then(() => {
      this.fetchResults().then(() => {
        this.calculateUserScores();
      });
    }); */
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },

    async fetchUserPredictions() {
      const API_URL = process.env.VUE_APP_API_URL;
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token manquant. Veuillez vous connecter.");
        this.users = [];
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/predictions?competitionId=${this.competitionId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Erreur lors de la récupération des prédictions : ${response.statusText}`
          );
        }

        const data = await response.json();

        this.users = data
          .map((prediction) => {
            if (!prediction || !prediction.username) {
              console.error(
                "Prédiction invalide ou utilisateur manquant :",
                prediction
              );
              return null;
            }

            const competitionDay =
              this.competitionDays[prediction.competitionDay - 1];
            if (!competitionDay) {
              console.error(
                `Aucun événement trouvé pour competitionDay ${prediction.competitionDay}`
              );
              return null;
            }

            return {
              username: prediction.username,
              predictions: competitionDay.events.map((event, index) => ({
                event,
                firstPlace:
                  prediction.predictions[
                    index === 0 ? "womenFirstPlace" : "menFirstPlace"
                  ] || "",
                secondPlace:
                  prediction.predictions[
                    index === 0 ? "womenSecondPlace" : "menSecondPlace"
                  ] || "",
                thirdPlace1:
                  prediction.predictions[
                    index === 0 ? "womenThirdPlace1" : "menThirdPlace1"
                  ] || "",
                thirdPlace2:
                  prediction.predictions[
                    index === 0 ? "womenThirdPlace2" : "menThirdPlace2"
                  ] || "",
              })),
            };
          })
          .filter(Boolean);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des prédictions :",
          error
        );
        this.users = [];
      }
    },
    async fetchResults() {
      const results = {};
      const cachedResults =
        JSON.parse(localStorage.getItem("competitionResults")) || {};

      const weightIds = Object.values(this.competitionDays)
        .flatMap((day) => day.events.map((event) => this.getWeightId(event)))
        .filter(Boolean);

      const fetchPromises = weightIds.map(async (weightId) => {
        if (cachedResults[`${this.competitionId}-${weightId}`]) {
          results[weightId] =
            cachedResults[`${this.competitionId}-${weightId}`];
          return;
        }

        try {
          const response = await fetch(
            `https://data.ijf.org/api/get_json?access_token=&params%5Baction%5D=competition.competitors&params%5Bid_competition%5D=${this.competitionId}&params%5Bid_weight%5D=${weightId}`
          );
          const data = await response.json();

          const categoryData =
            data.categories?.[Object.keys(data.categories)[0]]?.[weightId];
          const competitors = Object.values(categoryData?.persons || {});

          const filteredCompetitors = competitors.filter(
            (competitor) => competitor.place !== null
          );

          if (filteredCompetitors.length > 0) {
            results[weightId] = filteredCompetitors;
            cachedResults[`${this.competitionId}-${weightId}`] =
              filteredCompetitors;
          }
        } catch (error) {
          console.error(
            `Erreur lors de la récupération des résultats pour weightId ${weightId}:`,
            error
          );
        }
      });

      await Promise.all(fetchPromises);

      localStorage.setItem("competitionResults", JSON.stringify(cachedResults));

      for (const day of this.competitionDays) {
        for (const event of day.events) {
          const weightId = this.getWeightId(event);
          if (weightId && results[weightId]) {
            this.results[event] = results[weightId];
          }
        }
      }
    },
    getWeightId(event) {
      const weightMapping = {
        "Men -60kg": 1,
        "Men -66kg": 2,
        "Men -73kg": 3,
        "Men -81kg": 4,
        "Men -90kg": 5,
        "Men -100kg": 6,
        "Men +100kg": 7,
        "Women -48kg": 8,
        "Women -52kg": 9,
        "Women -57kg": 10,
        "Women -63kg": 11,
        "Women -70kg": 12,
        "Women -78kg": 13,
        "Women +78kg": 14,
      };

      return weightMapping[event] || null;
    },
    calculateUserScores() {
      if (!Array.isArray(this.users) || this.users.length === 0) {
        console.warn("Aucun utilisateur trouvé pour calculer les scores.");
        this.leaderboard = [];
        return;
      }

      const userScoresMap = new Map();

      for (const user of this.users) {
        if (!user || !user.username || !Array.isArray(user.predictions)) {
          console.error("Utilisateur ou prédictions invalides :", user);
          continue;
        }

        let score = 0;

        for (const prediction of user.predictions) {
          const eventResults = this.results[prediction.event];
          if (!eventResults) continue;

          const actualResults = {
            firstPlace: eventResults.find(
              (competitor) => competitor.place === "1"
            )
              ? `${
                  eventResults.find((competitor) => competitor.place === "1")
                    .family_name
                } ${
                  eventResults.find((competitor) => competitor.place === "1")
                    .given_name
                }`
              : null,
            secondPlace: eventResults.find(
              (competitor) => competitor.place === "2"
            )
              ? `${
                  eventResults.find((competitor) => competitor.place === "2")
                    .family_name
                } ${
                  eventResults.find((competitor) => competitor.place === "2")
                    .given_name
                }`
              : null,
            thirdPlace: eventResults
              .filter((competitor) => competitor.place === "3")
              .map(
                (competitor) =>
                  `${competitor.family_name} ${competitor.given_name}`
              ),
          };

          if (
            !actualResults.firstPlace &&
            !actualResults.secondPlace &&
            actualResults.thirdPlace.length === 0
          ) {
            continue;
          }

          const userPredictions = {
            firstPlace: this.normalizeName(prediction.firstPlace),
            secondPlace: this.normalizeName(prediction.secondPlace),
            thirdPlace: [
              this.normalizeName(prediction.thirdPlace1),
              this.normalizeName(prediction.thirdPlace2),
            ],
          };

          Object.keys(userPredictions).forEach((key) => {
            if (key === "thirdPlace") {
              userPredictions[key].forEach((predictedThirdPlace) => {
                if (actualResults.thirdPlace.includes(predictedThirdPlace)) {
                  score += 3;
                }
              });
            } else {
              if (userPredictions[key] === actualResults[key]) {
                score += 3;
              }
            }
          });
        }

        if (userScoresMap.has(user.username)) {
          userScoresMap.set(
            user.username,
            userScoresMap.get(user.username) + score
          );
        } else {
          userScoresMap.set(user.username, score);
        }
      }

      this.leaderboard = Array.from(userScoresMap.entries())
        .map(([username, points]) => ({ username, points }))
        .sort((a, b) => b.points - a.points);
    },
    normalizeName(name) {
      return name.replace(/\s*\(.*?\)\s*/g, "").trim();
    },
  },
  computed: {},
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
  color: #2d508e;
}
</style>

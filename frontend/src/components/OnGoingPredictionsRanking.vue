<template>
  <div class="w-full flex-col text-center">
    <h1
      class="lg:text-5xl text-3xl underline custom-blue font-bold lg:pt-16 lg:pb-12 py-8"
    >
      {{ competitionName }}
    </h1>
    <h1 v-if="countDown > 0"
      class="lg:text-5xl text-3xl underline custom-blue font-bold lg:pb-8 pb-8"
    >
      J-{{ countDown }}
    </h1>
    <div
       class="lg:text-3xl text-2xl underline custom-blue font-bold lg:pt-4 lg:pb-8 pb-8 pt-2"
    >
    <template
          v-if="
            currentCompetitionDay && competitionDays[currentCompetitionDay - 1]
          "
        >
          En cours - Jour {{ currentCompetitionDay }} :
          {{ competitionDays[currentCompetitionDay - 1].events[0] }} &
          {{ competitionDays[currentCompetitionDay - 1].events[1] }}
        </template>
        <template v-else>
          Début le {{ formattedStartingDay }} et fin le
          {{ formattedEndingDay }}</template
        >
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
    startingDay: {
      type: String,
      required: true,
    },
    endingDay: {
      type: String,
      required: true,
    },
    countDown: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isMobile: null,
      results: {},
      leaderboard: [],
      users: [],
    };
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
    this.fetchUserPredictions().then(() => {
      this.fetchResults().then(() => {
        this.calculateUserScores();
        this.archiveLeaderboard();
      });
    });
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

      const weightIds = Object.values(this.competitionDays)
        .flatMap((day) => day.events.map((event) => this.getWeightId(event)))
        .filter(Boolean);

      const fetchPromises = weightIds.map(async (weightId) => {
        try {
          const response = await fetch(
            `https://data.ijf.org/api/get_json?access_token=&params%5Baction%5D=competition.competitors&params%5Bid_competition%5D=${this.competitionId}&params%5Bid_weight%5D=${weightId}`
          );

          if (!response.ok) {
            console.error(
              `Erreur HTTP pour weightId ${weightId}: ${response.status}`
            );
            return;
          }

          const data = await response.json();

          const categoryData =
            data.categories?.[Object.keys(data.categories)[0]]?.[weightId];
          const competitors = Object.values(categoryData?.persons || {});

          const filteredCompetitors = competitors.filter(
            (competitor) => competitor.place !== null
          );

          if (filteredCompetitors.length > 0) {
            results[weightId] = filteredCompetitors;
          }
        } catch (error) {
          console.error(
            `Erreur lors de la récupération des résultats pour weightId ${weightId}:`,
            error
          );
        }
      });

      try {
        await Promise.all(fetchPromises);
      } catch (error) {
        console.error("Erreur lors de l'exécution des appels API :", error);
      }

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
              ? this.normalizeName(
                  `${
                    eventResults.find((competitor) => competitor.place === "1")
                      .family_name
                  } ${
                    eventResults.find((competitor) => competitor.place === "1")
                      .given_name
                  }`
                )
              : null,
            secondPlace: eventResults.find(
              (competitor) => competitor.place === "2"
            )
              ? this.normalizeName(
                  `${
                    eventResults.find((competitor) => competitor.place === "2")
                      .family_name
                  } ${
                    eventResults.find((competitor) => competitor.place === "2")
                      .given_name
                  }`
                )
              : null,
            thirdPlace: eventResults
              .filter((competitor) => competitor.place === "3")
              .map((competitor) =>
                this.normalizeName(
                  `${competitor.family_name} ${competitor.given_name}`
                )
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
          if (userPredictions.firstPlace === actualResults.firstPlace) {
            score += 3;
          } else if (
            userPredictions.firstPlace === actualResults.secondPlace ||
            actualResults.thirdPlace.includes(userPredictions.firstPlace)
          ) {
            score += 1;
          }

          if (userPredictions.secondPlace === actualResults.secondPlace) {
            score += 3;
          } else if (
            userPredictions.secondPlace === actualResults.firstPlace ||
            actualResults.thirdPlace.includes(userPredictions.secondPlace)
          ) {
            score += 1;
          }

          userPredictions.thirdPlace.forEach((predictedThirdPlace) => {
            if (actualResults.thirdPlace.includes(predictedThirdPlace)) {
              score += 3;
            } else if (
              predictedThirdPlace === actualResults.firstPlace ||
              predictedThirdPlace === actualResults.secondPlace
            ) {
              score += 1;
            }
          });
        }

        userScoresMap.set(
          user.username,
          (userScoresMap.get(user.username) || 0) + score
        );
      }

      this.leaderboard = Array.from(userScoresMap.entries())
        .map(([username, points]) => ({ username, points }))
        .sort((a, b) => b.points - a.points);
    },
    normalizeName(name) {
      if (!name) return "";
      return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s*\(.*?\)\s*/g, "")
        .replace(/\s+/g, " ")
        .trim();
    },
    async archiveLeaderboard() {
      const today = new Date();
      const competitionEndDate = new Date(this.endingDay);
      if (today > competitionEndDate) {
        try {
          const API_URL = process.env.VUE_APP_API_URL;
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("Token manquant. Veuillez vous connecter.");
            return;
          }

          const response = await fetch(`${API_URL}/api/archived-competitions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              competitionId: this.competitionId,
              competitionName: this.competitionName,
              leaderboard: this.leaderboard,
              startingDay: this.formatDateToDDMMYYYY(this.startingDay),
              endingDay: this.formatDateToDDMMYYYY(this.endingDay),
            }),
          });

          if (!response.ok) {
            throw new Error(
              `Erreur lors de l'archivage : ${response.statusText}`
            );
          }
        } catch (error) {
          console.error("Erreur lors de l'archivage du leaderboard :", error);
        }
      }
    },
    formatDateToDDMMYYYY(date) {
    const parsedDate = new Date(date);
    const day = String(parsedDate.getDate()).padStart(2, "0");
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const year = parsedDate.getFullYear();
    return `${day}/${month}/${year}`;
  },
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
  color: #2d508e;
}
</style>

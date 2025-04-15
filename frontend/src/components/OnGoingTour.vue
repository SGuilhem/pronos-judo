<template>
  <div class="w-full flex-col text-center">
    <h1
      class="lg:text-5xl text-3xl underline custom-blue font-bold lg:py-16 py-8"
    >
      {{ competitionName }}
    </h1>
    <div>
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
    </div>

    <div class="text-2xl text-center lg:w-1/2 lg:px-0 px-6 m-auto lg:pb-6 pb-0">
      <div class="button-container mb-4">
        <button
          v-for="day in days"
          :key="day"
          :class="[
            'btn p-2 mr-1 mb-1',
            selectedDay === day ? 'bg-blue-500' : '',
          ]"
          @click="selectDay(day)"
        >
          Jour {{ day }}
        </button>
      </div>
      <div v-if="selectedDay" class="container">
        <div class="day-title mb-1 mt-8">{{ womenEvent }} & {{ menEvent }}</div>

        <div v-if="loading" class="my-4 p-4 text-center">
          <p>Chargement des données en cours...</p>
        </div>

        <div v-else-if="error" class="my-4 p-4 text-center text-red-500">
          <p>{{ error }}</p>
          <button
            class="btn my-2 px-4 py-1"
            @click="loadCompetitorsData(selectedDay)"
          >
            Réessayer
          </button>
        </div>

        <div v-else class="prediction-container my-4">
          <div class="text-sm text-gray-600 mt-2">
            {{ predictions[selectedDay].women[0].options.length }} judokas
            femmes et
            {{ predictions[selectedDay].men[0].options.length }} judokas hommes
            disponibles
          </div>
          <div class="text-xl mt-4 underline lg:mx-0 mx-4">
            🕒 Pronostic ouvert : de la veille jusqu’à 8h (heure de Paris) le
            jour de la catégorie.
          </div>
          <div
            :class="`women-prediction text-2xl mt-5 mb-2 ml-5 flex align-left bold underline ${
              isMobile ? 'justify-center text-2xl' : ''
            }`"
          >
            Pronostics Femmes:
          </div>
          <div class="pb-2 flex flex-col mt-4 ml-4">
            <div
              v-for="(select, index) in predictions[selectedDay].women"
              :key="index"
              :class="isMobile ? 'flex flex-col m-auto' : 'flex flex-row my-2'"
            >
              <label :for="'womenPlace' + index" class="mx-4 text-xl underline">
                {{ select.label }}
              </label>
              <select
                :id="'womenPlace' + index"
                class="prediction-select text-black px-2 lg:w-1/2"
                :class="{
                  'ml-3': !isMobile && index === 0,
                  'my-2': isMobile,
                }"
                v-model="select.value"
                required
                :disabled="
                  !isCategoryActive(categoryMapping[selectedDay].women) ||
                  isCategoryPredicted(categoryMapping[selectedDay].women)
                "
              >
                <option value="" disabled>Choisissez une judoka</option>
                <option
                  v-for="(option, optIndex) in getWomenAvailableOptions(index)"
                  :key="optIndex"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
          <div
            :class="`men-prediction text-2xl mt-5 mb-2 ml-4 flex align-left bold underline ${
              isMobile ? 'justify-center text-2xl' : ''
            }`"
          >
            Pronostics Hommes:
          </div>
          <div class="pb-2 flex flex-col mt-4 ml-4">
            <div
              v-for="(select, index) in predictions[selectedDay].men"
              :key="index"
              :class="isMobile ? 'flex flex-col m-auto' : 'flex flex-row my-2'"
            >
              <label :for="'menPlace' + index" class="mx-4 text-xl underline">
                {{ select.label }}
              </label>
              <select
                :id="'menPlace' + index"
                class="prediction-select text-black px-2 lg:w-1/2"
                :class="{
                  'ml-3': !isMobile && index === 0,
                  'my-2': isMobile,
                }"
                v-model="select.value"
                required
                :disabled="
                  !isCategoryActive(categoryMapping[selectedDay].men) ||
                  isCategoryPredicted(categoryMapping[selectedDay].men)
                "
              >
                <option value="" disabled>Choisissez un judoka</option>
                <option
                  v-for="(option, optIndex) in getMenAvailableOptions(index)"
                  :key="optIndex"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
          <button
            :class="[
              'btn my-4 px-4 py-1',
              isValidForm && hasActiveCategories
                ? 'bg-blue-500'
                : 'bg-gray-400',
            ]"
            :disabled="!isValidForm || !hasActiveCategories"
            @click="validatePrediction"
          >
            Je valide!
          </button>
          <div
            v-if="predictionMessage"
            :class="{
              'text-green-500': predictionSubmitted,
              'text-red-500': !predictionSubmitted && !isValidForm,
              'text-blue-500': !predictionSubmitted && isValidForm,
            }"
            class="my-4 lg:mx-0 mx-4"
          >
            {{ predictionMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OnGoingTour",
  props: {
    competitionDays: {
      type: Object,
      required: true,
    },
    currentCompetitionDay: {
      type: Number,
      required: true,
    },
    competitionId: {
      type: Number,
      required: true,
    },
    currentFormattedDate: {
      type: Number,
      required: true,
    },
    competitionName: {
      type: String,
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
      isMobile: false,
      menEvent: null,
      womenEvent: null,
      days: [1, 2, 3, 4, 5, 6, 7],
      selectedDay: null,
      predictions: {
        1: {
          women: [
            { label: "1ère place:", value: "", options: [] },
            { label: "2ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
          ],
          men: [
            { label: "1ère place:", value: "", options: [] },
            { label: "2ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
          ],
        },
        2: {
          women: [
            { label: "1ère place:", value: "", options: [] },
            { label: "2ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
          ],
          men: [
            { label: "1ère place:", value: "", options: [] },
            { label: "2ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
          ],
        },
        3: {
          women: [
            { label: "1ère place:", value: "", options: [] },
            { label: "2ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
          ],
          men: [
            { label: "1ère place:", value: "", options: [] },
            { label: "2ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
          ],
        },
        4: {
          women: [
            { label: "1ère place:", value: "", options: [] },
            { label: "2ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
          ],
          men: [
            { label: "1ère place:", value: "", options: [] },
            { label: "2ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
          ],
        },
        5: {
          women: [
            { label: "1ère place:", value: "", options: [] },
            { label: "2ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
          ],
          men: [
            { label: "1ère place:", value: "", options: [] },
            { label: "2ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
          ],
        },
        6: {
          women: [
            { label: "1ère place:", value: "", options: [] },
            { label: "2ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
          ],
          men: [
            { label: "1ère place:", value: "", options: [] },
            { label: "2ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
          ],
        },
        7: {
          women: [
            { label: "1ère place:", value: "", options: [] },
            { label: "2ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
          ],
          men: [
            { label: "1ère place:", value: "", options: [] },
            { label: "2ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
            { label: "3ème place:", value: "", options: [] },
          ],
        },
      },
      apiBaseUrl: "https://data.ijf.org/api/get_json",
      loading: false,
      categoryMapping: {
        1: { men: 1, women: 8 },
        2: { men: 2, women: 9 },
        3: { men: 3, women: 10 },
        4: { men: 4, women: 11 },
        5: { men: 5, women: 12 },
        6: { men: 6, women: 13 },
        7: { men: 7, women: 14 },
      },
      predictionSubmitted: false,
    };
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
    const API_URL = process.env.VUE_APP_API_URL;
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkMobile);
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    async selectDay(day) {
      this.selectedDay = day;
      this.womenEvent = this.competitionDays[day - 1].events[0];
      this.menEvent = this.competitionDays[day - 1].events[1];

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token manquant. Veuillez vous connecter.");
        return;
      }

      if (!this.competitionId) {
        console.error(
          "competitionId manquant. Impossible de vérifier les prédictions."
        );
        return;
      }

      try {
        const response = await fetch(
           `${API_URL}/api/predictions/${this.competitionId}/${day}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log(result.message);
          this.predictionObject = result.prediction;
          this.predictionSubmitted = true;
        } else {
          this.predictionObject = null;
          this.predictionSubmitted = false;
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
      }

      this.loadCompetitorsData(day);
    },
    async loadCompetitorsData(day) {
      if (!day || !this.categoryMapping[day]) return;

      this.loading = true;
      this.error = null;

      try {
        const menCategoryId = this.categoryMapping[day].men;
        const womenCategoryId = this.categoryMapping[day].women;

        try {
          const [menData, womenData] = await Promise.all([
            this.fetchCompetitors(menCategoryId),
            this.fetchCompetitors(womenCategoryId),
          ]);

          this.processCompetitorsData(day, "men", menData);
          this.processCompetitorsData(day, "women", womenData);
        } catch (error) {
          console.error(
            `Erreur lors du chargement des données pour le jour ${day}:`,
            error
          );
          this.error = `Impossible de charger les données: ${error.message}`;
        } finally {
          this.loading = false;
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        this.error =
          "Une erreur s'est produite lors du chargement des données.";
      }
      this.loading = false;
    },
    async fetchCompetitors(weightId) {
      const url = `${this.apiBaseUrl}?access_token=&params%5Baction%5D=competition.competitors&params%5Bid_competition%5D=${this.competitionId}&params%5Bid_weight%5D=${weightId}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
      }

      const data = await response.json();
      return data;
    },
    processCompetitorsData(day, gender, data) {
      const weightId = this.categoryMapping[day][gender];
      const genderKey = gender === "men" ? 1 : 2;

      const categoryData = data.categories?.[genderKey]?.[weightId];

      if (!categoryData || !categoryData.persons) {
        console.error(`Données invalides pour ${gender} jour ${day}`);
        return;
      }
      const competitors = Object.values(categoryData.persons)
        .sort(
          (a, b) =>
            (a.ranking_place || Infinity) - (b.ranking_place || Infinity)
        )
        .map((person) => {
          const family = person.family_name || "";
          const given = person.given_name || "";
          const country = person.country_short || "";
          return `${family.toUpperCase()} ${given} (${country})`;
        });
      this.predictions[day][gender].forEach((select) => {
        select.options = competitors;
      });
    },
    getMenAvailableOptions(index) {
      const selectedValues = this.predictions[this.selectedDay].men
        .map((select, i) => (i !== index ? select.value : null))
        .filter((value) => value);

      return this.predictions[this.selectedDay].men[index].options.filter(
        (option) => !selectedValues.includes(option)
      );
    },

    getWomenAvailableOptions(index) {
      const selectedValues = this.predictions[this.selectedDay].women
        .map((select, i) => (i !== index ? select.value : null))
        .filter((value) => value);

      return this.predictions[this.selectedDay].women[index].options.filter(
        (option) => !selectedValues.includes(option)
      );
    },
    async validatePrediction() {
      const womenPredictions = this.predictions[this.selectedDay].women.reduce(
        (acc, select, index) => {
          const keys = [
            "FirstPlace",
            "SecondPlace",
            "ThirdPlace1",
            "ThirdPlace2",
          ];
          acc[`women${keys[index]}`] = select.value || "";
          return acc;
        },
        {}
      );

      const menPredictions = this.predictions[this.selectedDay].men.reduce(
        (acc, select, index) => {
          const keys = [
            "FirstPlace",
            "SecondPlace",
            "ThirdPlace1",
            "ThirdPlace2",
          ];
          acc[`men${keys[index]}`] = select.value || "";
          return acc;
        },
        {}
      );

      this.predictionObject = {
        ...womenPredictions,
        ...menPredictions,
      };

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token manquant. Veuillez vous connecter.");
        return;
      }

      try {
        const method = this.predictionSubmitted ? "PUT" : "POST";
        const response = await fetch(`${API_URL}/api/predictions`, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            predictions: this.predictionObject,
            competitionDay: this.selectedDay,
            competitionId: this.competitionId,
            date: new Date().toISOString().split("T")[0],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn("Erreur côté backend :", errorText);
          return;
        }

        const result = await response.json();

        this.predictionSubmitted = true;
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    },
    isCategoryActive(categoryId) {
      const now = new Date();
      const categorySchedules = {
        "1,2,8,9": "2025-04-23T08:00:00",
        "3,10,11": "2025-04-24T08:00:00",
        "12,4,5": "2025-04-25T08:00:00",
        "13,14,6,7": "2025-04-26T08:00:00",
      };

      for (const [categories, endTime] of Object.entries(categorySchedules)) {
        if (categories.split(",").includes(String(categoryId))) {
          const endDate = new Date(endTime);
          const startDate = new Date(endDate);
          startDate.setDate(endDate.getDate() - 1);
          startDate.setHours(8, 0, 0, 0);

          if (now >= startDate && now < endDate) {
            console.log(`Catégorie ${categoryId} est active.`);
            return true;
          }
        }
      }

      return false;
    },
    isCategoryPredicted(categoryId) {
      if (!this.predictionObject || !this.predictionObject.predictions) {
        return false;
      }

      const predictions = this.predictionObject.predictions;

      if (categoryId === 4) {
        return !!predictions.menFirstPlace;
      }
      if (categoryId === 5) {
        return !!predictions.menSecondPlace;
      }
      if (categoryId === 6) {
        return !!predictions.menThirdPlace1;
      }
      if (categoryId === 7) {
        return !!predictions.menThirdPlace2;
      }

      if (categoryId === 12) {
        return !!predictions.womenFirstPlace;
      }
      if (categoryId === 13) {
        return !!predictions.womenSecondPlace;
      }
      if (categoryId === 14) {
        return !!predictions.womenThirdPlace1;
      }

      return false;
    },
  },
  computed: {
    hasActiveCategories() {
      const womenActive = this.predictions[this.selectedDay]?.women.some(
        (select, index) =>
          this.isCategoryActive(this.categoryMapping[this.selectedDay].women) &&
          !this.isCategoryPredicted(
            this.categoryMapping[this.selectedDay].women
          )
      );

      const menActive = this.predictions[this.selectedDay]?.men.some(
        (select, index) =>
          this.isCategoryActive(this.categoryMapping[this.selectedDay].men) &&
          !this.isCategoryPredicted(this.categoryMapping[this.selectedDay].men)
      );

      return womenActive || menActive;
    },
    isValidForm() {
      const womenValid = this.predictions[this.selectedDay]?.women.every(
        (select, index) =>
          !this.isCategoryActive(
            this.categoryMapping[this.selectedDay].women
          ) ||
          this.isCategoryPredicted(
            this.categoryMapping[this.selectedDay].women
          ) ||
          select.value
      );

      const menValid = this.predictions[this.selectedDay]?.men.every(
        (select, index) =>
          !this.isCategoryActive(this.categoryMapping[this.selectedDay].men) ||
          this.isCategoryPredicted(
            this.categoryMapping[this.selectedDay].men
          ) ||
          select.value
      );

      return womenValid && menValid;
    },
    predictionMessage() {
      if (this.predictionSubmitted) {
        return "Pronostique déjà effectué pour ce jour.";
      } else if (!this.isValidForm) {
        return "Veuillez remplir tous les champs pour valider votre pronostic.";
      } else if (!this.hasActiveCategories) {
        return "Les pronostics ne sont pas encore ouverts pour cette catégorie.";
      } else {
        return "Vous pouvez soumettre votre pronostic.";
      }
    },
  },
};
</script>

<style>
.btn {
  border: 2px solid slategray;
}
.prediction-container {
  border: 2px solid slategray;
}
.day-title {
  border: 2px solid slategray;
}
.prediction-select {
  border: 2px solid slategrey;
}
@media screen and (max-width: 768px) {
  select {
    max-width: 300px;
  }
}
</style>

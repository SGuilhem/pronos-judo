<template>
  <div class="w-full flex-col text-center">
    <h1
      class="lg:text-5xl text-4xl underline text-blue-500 font-bold lg:py-16 py-8"
    >
      Compétition en cours: Paris Grand Slam 2024
    </h1>
    <div
      class="lg:text-2xl text-4xl underline text-blue-500 font-bold lg:py-16 py-8"
    >
      En cours - Jour {{ currentCompetitionDay }}:
      {{ competitionDays[currentCompetitionDay - 1].events[0] }} &
      {{ competitionDays[currentCompetitionDay - 1].events[1] }}
    </div>

    <div class="text-2xl text-center lg:w-1/2 lg:px-0 px-6 m-auto lg:pb-6 pb-0">
      <div class="button-container mb-4">
        <button
          v-for="day in days"
          :key="day"
          :class="[
            'btn p-2 mr-1 mb-1',
            selectedDay === day ? 'bg-blue-500' : '',
            currentCompetitionDay < day ? 'bg-slate-400' : '',
          ]"
          @click="selectDay(day)"
          :disabled="currentCompetitionDay < day"
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
          <button class="btn my-2 px-4 py-1" @click="loadCompetitorsData(selectedDay)">
            Réessayer
          </button>
        </div>
        
        <div v-else class="prediction-container my-4">
          <div class="text-sm text-gray-600 mt-2">
          {{ predictions[selectedDay].women[0].options.length }} judokas femmes et 
          {{ predictions[selectedDay].men[0].options.length }} judokas hommes disponibles
        </div>
          <div
            class="women-prediction mt-5 mb-3 ml-4 flex align-left bold"
            :class="{ 'justify-center text-2xl': isMobile }"
          >
            Pronostiques Femmes:
          </div>
          <div class="pb-2 flex flex-col mt-4 ml-4">
            <div
              v-for="(select, index) in predictions[selectedDay].women"
              :key="index"
              :class="isMobile ? 'flex flex-col m-auto' : 'flex flex-row my-2'"
            >
              <label :for="'womenPlace' + index" class="mx-4 text-xl">
                {{ select.label }}
              </label>
              <select
                :id="'womenPlace' + index"
                class="prediction-select text-black px-2"
                :class="{
                  'ml-3': !isMobile && index === 0,
                  'my-2': isMobile,
                }"
                v-model="select.value"
                required
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
            class="men-prediction mt-5 mb-3 ml-4 flex align-left bold"
            :class="{ 'justify-center text-2xl': isMobile }"
          >
            Pronostiques Hommes:
          </div>
          <div class="pb-2 flex flex-col mt-4 ml-4">
            <div
              v-for="(select, index) in predictions[selectedDay].men"
              :key="index"
              :class="isMobile ? 'flex flex-col m-auto' : 'flex flex-row my-2'"
            >
              <label :for="'menPlace' + index" class="mx-4 text-xl">
                {{ select.label }}
              </label>
              <select
                :id="'menPlace' + index"
                class="prediction-select text-black px-2"
                :class="{
                  'ml-3': !isMobile && index === 0,
                  'my-2': isMobile,
                }"
                v-model="select.value"
                required
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
            v-show="selectedDay === currentCompetitionDay"
            :class="[
              'btn my-4 px-4 py-1',
              isValidForm ? 'bg-blue-500' : 'bg-gray-400',
            ]"
            :disabled="!isValidForm"
            @click="validatePrediction"
          >
            Je valide!
          </button>
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
    currentFormattedDate: {
      type: Number,
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
      competitionId: 2958,
      loading: false,
      categoryMapping: {
        1: { men: 1, women: 8 }, // Jour 1 : Hommes -60kg, Femmes -48kg
        2: { men: 2, women: 9 }, // Jour 2 : Hommes -66kg, Femmes -52kg
        3: { men: 3, women: 10 }, // Jour 3 : Hommes -73kg, Femmes -57kg
        4: { men: 4, women: 11 }, // Jour 4 : Hommes -81kg, Femmes -63kg
        5: { men: 5, women: 12 }, // Jour 5 : Hommes -90kg, Femmes -70kg
        6: { men: 6, women: 13 }, // Jour 6 : Hommes -100kg, Femmes -78kg
        7: { men: 7, women: 14 }, // Jour 7 : Hommes +100kg, Femmes +78kg
      },
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
    selectDay(day) {
      this.selectedDay = day;
      this.womenEvent = this.competitionDays[day - 1].events[0];
      this.menEvent = this.competitionDays[day - 1].events[1];
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
      }catch (error) {
        console.error(`Erreur lors du chargement des données pour le jour ${day}:`, error);
        this.error = `Impossible de charger les données: ${error.message}`;
      } finally {
        this.loading = false;
      }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        this.error = "Une erreur s'est produite lors du chargement des données.";
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
        return;
      }

      const competitors = Object.values(categoryData.persons).map((person) => {
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
    validatePrediction() {
      this.predictionObject = {
        womenFirstPlace: this.predictions[this.selectedDay].women[0].value,
        womenSecondPlace: this.predictions[this.selectedDay].women[1].value,
        womenThirdPlace1: this.predictions[this.selectedDay].women[2].value,
        womenThirdPlace2: this.predictions[this.selectedDay].women[3].value,
        menFirstPlace: this.predictions[this.selectedDay].men[0].value,
        menSecondPlace: this.predictions[this.selectedDay].men[1].value,
        menThirdPlace1: this.predictions[this.selectedDay].men[2].value,
        menThirdPlace2: this.predictions[this.selectedDay].men[3].value,
      };
      console.log("this.predictionObject: ", this.predictionObject);
    },
  },
  computed: {
    isValidForm() {
      return (
        this.predictions[this.selectedDay]?.women.every(
          (select) => select.value
        ) &&
        this.predictions[this.selectedDay]?.men.every((select) => select.value)
      );
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
select {
  @media screen and (max-width: 768px) {
    max-width: 300px;
  }
}
</style>

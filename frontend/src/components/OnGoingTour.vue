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
      {{ this.competitionDays[this.currentCompetitionDay - 1].events[0] }} &
      {{ this.competitionDays[this.currentCompetitionDay - 1].events[1] }}
    </div>

    <div class="text-2xl text-center lg:w-1/2 lg:px-0 px-6 m-auto lg:pb-6 pb-0">
      <div class="button-container mb-4">
        <button
          v-for="day in days"
          :key="day"
          :class="`btn p-2 mr-1 mb-1 ${
            selectedDay === day ? 'bg-blue-500' : ''
          } ${currentCompetitionDay < day ? 'bg-slate-400' : ''}`"
          @click="selectDay(day)"
          :disabled="currentCompetitionDay < day"
        >
          Jour {{ day }}
        </button>
      </div>
      <div v-if="selectedDay" class="container">
        <div class="day-title mb-1 mt-8">{{ womenEvent }} & {{ menEvent }}</div>
        <div class="prediction-container my-4">
          <div :class="`women-prediction mt-5 mb-3 ml-4 flex align-left bold ${isMobile ? 'justify-center text-2xl' : ''}`">
            Pronostiques Femmes:
          </div>
          <div class="pb-2 flex flex-col mt-4 ml-4">
            <div
              v-for="(select, index) in predictions[selectedDay].women"
              :key="index"
              :class="`${
                isMobile ? 'flex flex-col m-auto' : 'flex flex-row my-2'
              }`"
            >
              <label :for="`womenPlace${index}`" class="mx-4 text-xl">
                {{ select.label }}
              </label>
              <select
                :id="`womenPlace${index}`"
                :class="`prediction-select text-black px-2 ${!isMobile && index === 0 ? 'ml-3' : ''} ${isMobile ? 'my-2' : ''}`"
                :disabled="selectedDay < currentCompetitionDay"
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
          <div :class="`men-prediction mt-5 mb-3 ml-4 flex align-left bold ${isMobile ? 'justify-center text-2xl' : ''}`">
            Pronostiques Hommes:
          </div>
          <div class="pb-2 flex flex-col mt-4 ml-4">
            <div
              v-for="(select, index) in predictions[selectedDay].men"
              :key="index"
              :class="`${
                isMobile ? 'flex flex-col m-auto' : 'flex flex-row my-2'
              }`"
            >
              <label :for="`menPlace${index}`" class="mx-4 text-xl">
                {{ select.label }}
              </label>
              <select
                :id="`menPlace${index}`"
                :class="`prediction-select text-black px-2 ${!isMobile && index === 0 ? 'ml-3' : ''} ${isMobile ? 'my-2' : ''}`"
                :disabled="selectedDay < currentCompetitionDay"
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
            :class="`btn my-4 px-4 py-1 ${
              isValidForm ? 'bg-bleu-500' : 'bg-gray-400'
            }`"
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
      daySelected: null,
      predictions: {
        1: {
          womenEvent: "Événement Femmes Jour 1",
          menEvent: "Événement Hommes Jour 1",
          women: [
            { label: "1ère place:", value: "", options: ["Tsunoda", "Bavuudorj", "Boukli", "Babulfath", "Scutto", "Abuzhakynova"] },
            { label: "2ème place:", value: "", options: ["Tsunoda", "Bavuudorj", "Boukli", "Babulfath", "Scutto", "Abuzhakynova"] },
            { label: "3ème place:", value: "", options: ["Tsunoda", "Bavuudorj", "Boukli", "Babulfath", "Scutto", "Abuzhakynova"] },
            { label: "3ème place:", value: "", options: ["Tsunoda", "Bavuudorj", "Boukli", "Babulfath", "Scutto", "Abuzhakynova"] },
          ],
          men: [
            { label: "1ère place:", value: "", options: ["X", "Y", "Z"] },
            { label: "2ème place:", value: "", options: ["U", "V", "W"] },
            { label: "3ème place:", value: "", options: ["Q", "R", "S"] },
            { label: "3ème place:", value: "", options: ["T", "U", "V"] },
          ],
        },
        2: {
          womenEvent: "Événement Femmes Jour 2",
          menEvent: "Événement Hommes Jour 2",
          women: [
            { label: "1ère place:", value: "", options: ["P1", "P2", "P3"] },
            { label: "2ème place:", value: "", options: ["Q1", "Q2", "Q3"] },
            { label: "3ème place:", value: "", options: ["R1", "R2", "R3"] },
            { label: "3ème place:", value: "", options: ["S1", "S2", "S3"] },
          ],
          men: [
            { label: "1ère place:", value: "", options: ["T1", "T2", "T3"] },
            { label: "2ème place:", value: "", options: ["U1", "U2", "U3"] },
            { label: "3ème place:", value: "", options: ["V1", "V2", "V3"] },
            { label: "3ème place:", value: "", options: ["W1", "W2", "W3"] },
          ],
        },
        3: {
          womenEvent: "Événement Femmes Jour 3",
          menEvent: "Événement Hommes Jour 3",
          women: [
            { label: "1ère place:", value: "", options: ["DEGUCHI Christa", "KLIMKAIT Jessica", "HUH Mimi", "CYSIQUE Sarah Leonie"] },
            { label: "2ème place:", value: "", options: ["DEGUCHI Christa", "KLIMKAIT Jessica", "HUH Mimi", "CYSIQUE Sarah Leonie"] },
            { label: "3ème place:", value: "", options: ["DEGUCHI Christa", "KLIMKAIT Jessica", "HUH Mimi", "CYSIQUE Sarah Leonie"] },
            { label: "3ème place:", value: "", options: ["DEGUCHI Christa", "KLIMKAIT Jessica", "HUH Mimi", "CYSIQUE Sarah Leonie"] },
          ],
          men: [
            { label: "1ère place:", value: "", options: ["HEYDAROV Hidayat", "LOMBARDO Manuel", "OSMANOV Adil", "HASHIMOTO Soichi"] },
            { label: "2ème place:", value: "", options: ["HEYDAROV Hidayat", "LOMBARDO Manuel", "OSMANOV Adil", "HASHIMOTO Soichi"] },
            { label: "3ème place:", value: "", options: ["HEYDAROV Hidayat", "LOMBARDO Manuel", "OSMANOV Adil", "HASHIMOTO Soichi"] },
            { label: "3ème place:", value: "", options: ["HEYDAROV Hidayat", "LOMBARDO Manuel", "OSMANOV Adil", "HASHIMOTO Soichi"] },
          ],
        },
        4: {
          womenEvent: "Événement Femmes Jour 4",
          menEvent: "Événement Hommes Jour 4",
          women: [
            { label: "1ère place:", value: "", options: ["P1", "P2", "P3"] },
            { label: "2ème place:", value: "", options: ["Q1", "Q2", "Q3"] },
            { label: "3ème place:", value: "", options: ["R1", "R2", "R3"] },
            { label: "3ème place:", value: "", options: ["S1", "S2", "S3"] },
          ],
          men: [
            { label: "1ère place:", value: "", options: ["T1", "T2", "T3"] },
            { label: "2ème place:", value: "", options: ["U1", "U2", "U3"] },
            { label: "3ème place:", value: "", options: ["V1", "V2", "V3"] },
            { label: "3ème place:", value: "", options: ["W1", "W2", "W3"] },
          ],
        },
        5: {
          womenEvent: "Événement Femmes Jour 5",
          menEvent: "Événement Hommes Jour 5",
          women: [
            { label: "1ère place:", value: "", options: ["P1", "P2", "P3"] },
            { label: "2ème place:", value: "", options: ["Q1", "Q2", "Q3"] },
            { label: "3ème place:", value: "", options: ["R1", "R2", "R3"] },
            { label: "3ème place:", value: "", options: ["S1", "S2", "S3"] },
          ],
          men: [
            { label: "1ère place:", value: "", options: ["T1", "T2", "T3"] },
            { label: "2ème place:", value: "", options: ["U1", "U2", "U3"] },
            { label: "3ème place:", value: "", options: ["V1", "V2", "V3"] },
            { label: "3ème place:", value: "", options: ["W1", "W2", "W3"] },
          ],
        },
        6: {
          womenEvent: "Événement Femmes Jour 6",
          menEvent: "Événement Hommes Jour 6",
          women: [
            { label: "1ère place:", value: "", options: ["P1", "P2", "P3"] },
            { label: "2ème place:", value: "", options: ["Q1", "Q2", "Q3"] },
            { label: "3ème place:", value: "", options: ["R1", "R2", "R3"] },
            { label: "3ème place:", value: "", options: ["S1", "S2", "S3"] },
          ],
          men: [
            { label: "1ère place:", value: "", options: ["T1", "T2", "T3"] },
            { label: "2ème place:", value: "", options: ["U1", "U2", "U3"] },
            { label: "3ème place:", value: "", options: ["V1", "V2", "V3"] },
            { label: "3ème place:", value: "", options: ["W1", "W2", "W3"] },
          ],
        },
        7: {
          womenEvent: "Événement Femmes Jour 7",
          menEvent: "Événement Hommes Jour 7",
          women: [
            { label: "1ère place:", value: "", options: ["P1", "P2", "P3"] },
            { label: "2ème place:", value: "", options: ["Q1", "Q2", "Q3"] },
            { label: "3ème place:", value: "", options: ["R1", "R2", "R3"] },
            { label: "3ème place:", value: "", options: ["S1", "S2", "S3"] },
          ],
          men: [
            { label: "1ère place:", value: "", options: ["T1", "T2", "T3"] },
            { label: "2ème place:", value: "", options: ["U1", "U2", "U3"] },
            { label: "3ème place:", value: "", options: ["V1", "V2", "V3"] },
            { label: "3ème place:", value: "", options: ["W1", "W2", "W3"] },
          ],
        },
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
      this.daySelected = day - 1;
      this.womenEvent = this.competitionDays[this.daySelected].events[0];
      this.menEvent = this.competitionDays[this.daySelected].events[1];
    },
    getWomenAvailableOptions(index) {
      const selectedValues = this.predictions[this.selectedDay].women
        .map((select, i) => (i !== index ? select.value : null))
        .filter((value) => value);


      return this.predictions[this.selectedDay].women[index].options.filter(
        (option) => !selectedValues.includes(option)
      );
    },
    getMenAvailableOptions(index) {
      const selectedValues = this.predictions[this.selectedDay].men
        .map((select, i) => (i !== index ? select.value : null))
        .filter((value) => value);


      return this.predictions[this.selectedDay].men[index].options.filter(
        (option) => !selectedValues.includes(option)
      );
    },
    validatePrediction() {
      this.predictionObject = {
        womenFirstPlace:
          this.predictions[this.currentCompetitionDay].women[0].value,
        womenSecondPlace:
          this.predictions[this.currentCompetitionDay].women[1].value,
        womenThirdPlace1:
          this.predictions[this.currentCompetitionDay].women[2].value,
        womenThirdPlace2:
          this.predictions[this.currentCompetitionDay].women[3].value,
        menFirstPlace:
          this.predictions[this.currentCompetitionDay].men[0].value,
        menSecondPlace:
          this.predictions[this.currentCompetitionDay].men[1].value,
        menThirdPlace1:
          this.predictions[this.currentCompetitionDay].men[2].value,
        menThirdPlace2:
          this.predictions[this.currentCompetitionDay].men[3].value,
      };
      console.log("this.predictionObject: ", this.predictionObject);
    },
  },
  computed: {
    isValidForm() {
      return (
        this.predictions[this.currentCompetitionDay].women[0].value &&
        this.predictions[this.currentCompetitionDay].women[1].value &&
        this.predictions[this.currentCompetitionDay].women[2].value &&
        this.predictions[this.currentCompetitionDay].women[3].value &&
        this.predictions[this.currentCompetitionDay].men[0].value &&
        this.predictions[this.currentCompetitionDay].men[1].value &&
        this.predictions[this.currentCompetitionDay].men[2].value &&
        this.predictions[this.currentCompetitionDay].men[3].value
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

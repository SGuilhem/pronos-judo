<template>
  <div class="w-full flex-col text-center">
    <h1
      class="lg:text-5xl text-4xl underline text-blue-500 font-bold lg:py-16 py-8"
    >
<<<<<<< HEAD
      Compétition en cours:
=======
      Compétition en cours: Paris Grand Slam 2024
>>>>>>> 9659a01 (Update SideMenu CSS && Update of Archives Function && Update of Women/men select logic)
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
          } ${ currentCompetitionDay < day ? 'bg-slate-400' : '' }`"
          @click="selectDay(day)"
          :disabled="currentCompetitionDay < day"
        >
          Jour {{ day }}
        </button>
      </div>
      <!-- currentCompetitionDay: {{ currentCompetitionDay }} //  -->
      <div v-if="selectedDay" class="container">
        <div class="day-title mb-1 mt-8">{{ womenEvent }} & {{ menEvent }}</div>
        <div class="prediction-container my-4">
          <div class="women-prediction my-3 ml-4 flex align-left">
            Pronostiques Femmes:
          </div>
          <div class="pb-2 flex flex-col mt-4 ml-4">
            <div :class="`womenFirstPlace ${isMobile ? 'flex flex-col m-auto' : 'flex flex-row my-2'}`">
              <label for="womenFirstPlace" class="mx-4 text-xl">1ere place: </label>
              <input
                type="womenFirstPlace"
                :class="`prediction-input text-black px-2 ${isMobile ? '' : 'ml-3'}`"
                v-model="womenFirstPlace"
                required
              />
            </div>
            <div :class="`womenSecondPlace ${isMobile ? 'flex flex-col m-auto' : 'flex flex-row my-2'}`">
              <label for="womenSecondPlace" class="mx-4 text-xl">2eme place: </label>
              <input
                type="womenSecondPlace"
                class="prediction-input text-black px-2"
                v-model="womenSecondPlace"
                required
              />
            </div>
            <div :class="`womenThirdPlace1 ${isMobile ? 'flex flex-col m-auto' : 'flex flex-row my-2'}`">
              <label for="womenThirdPlace1" class="mx-4 text-xl">3eme place: </label>
              <input
                type="womenThirdPlace1"
                class="prediction-input text-black px-2"
                v-model="womenThirdPlace1"
                required
              />
            </div>
            <div :class="`womenThirdPlace2 ${isMobile ? 'flex flex-col m-auto' : 'flex flex-row my-2'}`">
              <label for="womenThirdPlace2" class="mx-4 text-xl">3eme place: </label>
              <input
                type="womenThirdPlace2"
                class="prediction-input text-black px-2"
                v-model="womenThirdPlace2"
                required
              />
            </div>
          </div>
          <div class="men-prediction my-3 ml-4 flex align-left">
            Pronostiques Hommes:
          </div>
          <div class="pb-2 flex flex-col mt-4 ml-4">
            <div :class="`menFirstPlace ${isMobile ? 'flex flex-col m-auto' : 'flex flex-row my-2'}`">
              <label for="menFirstPlace" class="mx-4 text-xl">1ere place: </label>
              <input
                type="menFirstPlace"
                :class="`prediction-input text-black px-2 ${isMobile ? '' : 'ml-3'}`"
                v-model="menFirstPlace"
                required
              />
            </div>
            <div :class="`menSecondPlace ${isMobile ? 'flex flex-col m-auto' : 'flex flex-row my-2'}`">
              <label for="menSecondPlace" class="mx-4 text-xl">2eme place: </label>
              <input
                type="menSecondPlace"
                class="prediction-input text-black px-2"
                v-model="menSecondPlace"
                required
              />
            </div>
            <div :class="`menThirdPlace1 ${isMobile ? 'flex flex-col m-auto' : 'flex flex-row my-2'}`">
              <label for="menThirdPlace1" class="mx-4 text-xl">3eme place: </label>
              <input
                type="menThirdPlace1"
                class="prediction-input text-black px-2"
                v-model="menThirdPlace1"
                required
              />
            </div>
            <div :class="`menThirdPlace2 ${isMobile ? 'flex flex-col m-auto' : 'flex flex-row my-2'}`">
              <label for="menThirdPlace2" class="mx-4 text-xl">3eme place: </label>
              <input
                type="menThirdPlace2"
                class="prediction-input text-black px-2"
                v-model="menThirdPlace2"
                required
              />
            </div>
          </div>
          <button :class="`btn my-4 px-4 py-1 ${isValidForm ? 'bg-bleu-500' : 'bg-gray-400'}`" :disabled="!isValidForm" @click="validatePrediction">Je valide!</button>
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
      womenFirstPlace: null,
      womenSecondPlace: null,
      womenThirdPlace1: null,
      womenThirdPlace2: null,
      menFirstPlace: null,
      menSecondPlace: null,
      menThirdPlace1: null,
      menThirdPlace2: null,
      isValidForm: false,
    };
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
    console.log("competitionDays: ", this.competitionDays[this.currentCompetitionDay].date)
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
      console.log("this.daySelected: ", this.daySelected);
    },
    validatePrediction() {
      this.predictionObject = {
        womenFirstPlace: this.womenFirstPlace,
        womenSecondPlace: this.womenSecondPlace,
        womenThirdPlace1: this.womenThirdPlace1,
        womenThirdPlace2: this.womenThirdPlace2,
        menFirstPlace: this.menFirstPlace,
        menSecondPlace: this.menSecondPlace,
        menThirdPlace1: this.menThirdPlace1,
        menThirdPlace2: this.menThirdPlace2,
      }
      console.log("this.predictionObject: ", this.predictionObject)
    }
  },
  computed: {
    isValidForm() {
      return (
      this.womenFirstPlace &&
      this.womenSecondPlace &&
      this.womenThirdPlace1 &&
      this.womenThirdPlace2 &&
      this.menFirstPlace &&
      this.menSecondPlace &&
      this.menThirdPlace1 &&
      this.menThirdPlace2
      );
    }
}
}
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
.prediction-input {
  border: 2px solid slategrey;
}
input {
  @media screen and (max-width: 768px) {
    max-width: 300px;
  }
}
</style>

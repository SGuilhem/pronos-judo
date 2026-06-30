<template>
  <div class="tour-page">
    <!-- Hero -->
    <section class="hero">
      <h1 class="hero-title fade-up" style="--delay: 0ms">
        {{ competitionName }}
      </h1>
      <div class="hero-badges fade-up" style="--delay: 120ms">
        <span v-if="countDown > 0" class="badge badge-countdown"
          >⏳ J-{{ countDown }}</span
        >
        <span
          v-if="currentCompetitionDay && currentDayFormat"
          class="badge badge-live"
        >
          🟢 En cours — Jour {{ currentCompetitionDay }} :
          {{
            currentDayFormat.weightIds
              .map((id) => CATEGORIES[id].label)
              .join(" & ")
          }}
        </span>
        <span v-else class="badge badge-info">
          📅 {{ formattedStartingDay }} → {{ formattedEndingDay }}
        </span>
      </div>
    </section>

    <!-- Sélecteur de jours -->
    <section class="days-section fade-up" style="--delay: 220ms">
      <div class="days-tabs">
        <button
          v-for="d in competitionFormat"
          :key="d.day"
          class="day-tab"
          :class="{ active: selectedDay === d.day }"
          @click="selectDay(d.day)"
        >
          <span>Jour {{ d.day }}</span>
          <span class="day-tab-sub">
            {{
              d.weightIds
                .map((id) => CATEGORIES[id].label.split(" ")[1])
                .join(" / ")
            }}
          </span>
        </button>
      </div>
    </section>

    <!-- Contenu -->
    <section v-if="selectedDay !== null" class="content-section">
      <!-- Skeleton -->
      <div v-if="loading" class="skeleton-wrap">
        <div v-for="i in 2" :key="i" class="skeleton-card">
          <div class="skeleton-line" style="width: 35%"></div>
          <div class="skeleton-line" style="width: 100%"></div>
          <div class="skeleton-line" style="width: 100%"></div>
          <div class="skeleton-line" style="width: 100%"></div>
        </div>
      </div>

      <!-- Erreur -->
      <div v-else-if="error" class="alert alert-error">
        <span>{{ error }}</span>
        <button class="retry-btn" @click="loadCompetitorsData(selectedDay!)">
          Réessayer
        </button>
      </div>

      <!-- Pronostics -->
      <div v-else>
        <div class="info-banner">
          🕒 Pronostics ouverts la veille à partir de 8h et jusqu'au début de la
          journée.
        </div>

        <div
          v-for="category in selectedDayCategories"
          :key="category.weightId"
          class="category-card"
          :class="{ 'card-inactive': !isActive(category.weightId) }"
        >
          <div class="card-header">
            <span class="card-title">
              {{ category.gender === "women" ? "👩" : "👨" }}
              {{ category.label }}
            </span>
            <span
              class="status-badge"
              :class="
                isActive(category.weightId) ? 'status-open' : 'status-closed'
              "
            >
              {{ isActive(category.weightId) ? "Ouvert" : "Fermé" }}
            </span>
          </div>

          <div class="places-grid">
            <div
              v-for="(label, placeIndex) in PLACE_LABELS"
              :key="placeIndex"
              class="place-row"
            >
              <label class="place-label">{{ label }}</label>
              <select
                class="place-select"
                :class="{ 'select-disabled': !isActive(category.weightId) }"
                v-model="predictions[category.weightId].places[placeIndex]"
                :disabled="!isActive(category.weightId)"
              >
                <option value="" disabled>Choisissez un(e) judoka</option>
                <option
                  v-for="option in getAvailableOptions(
                    category.weightId,
                    placeIndex,
                  )"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="validate-section">
          <button
            class="btn-validate"
            :class="{
              'btn-validate-disabled': !isValidForm || !hasActiveCategories,
            }"
            :disabled="!isValidForm || !hasActiveCategories"
            @click="validatePrediction"
          >
            ✓ Je valide mes pronostics
          </button>
          <div
            v-if="predictionMessage"
            class="message-box"
            :class="{
              'message-success': predictionSubmitted,
              'message-error': !predictionSubmitted && !isValidForm,
              'message-info': !predictionSubmitted && isValidForm,
            }"
          >
            {{ predictionMessage }}
          </div>
        </div>
      </div>
    </section>

    <div v-else class="no-day-hint">
      👆 Sélectionnez un jour pour accéder aux pronostics.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { CATEGORIES } from "@/config/categories";
import { COMPETITION_FORMATS } from "@/config/competitionFormats";
import { currentCompetition } from "@/config/currentCompetition";
import type { PredictionResult, Competitor } from "@/types";

const props = defineProps<{
  currentCompetitionDay: number | null;
  competitionName: string;
  formattedStartingDay: string;
  formattedEndingDay: string;
  startingDay: string | null;
  countDown: number;
}>();

interface WeightPrediction {
  places: string[];
  options: string[];
}

const API_URL = import.meta.env.VITE_API_URL;
const PLACE_LABELS = [
  "1ère place:",
  "2ème place:",
  "3ème place:",
  "3ème place:",
];
const CLOSING_OFFSET_MINUTES = 30;

const isMobile = ref(window.innerWidth <= 768);
const selectedDay = ref<number | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const predictionSubmitted = ref(false);
const predictionObject = ref<PredictionResult | null>(null);
const predictions = ref<Record<number, WeightPrediction>>({});

// ── Computed ──────────────────────────────────────────────────────────────
const competitionFormat = computed(
  () => COMPETITION_FORMATS[currentCompetition.type],
);

const currentDayFormat = computed(() =>
  props.currentCompetitionDay
    ? competitionFormat.value.find(
        (d) => d.day === props.currentCompetitionDay,
      ) ?? null
    : null,
);

const selectedDayCategories = computed(() => {
  if (selectedDay.value === null) return [];
  return (
    competitionFormat.value
      .find((d) => d.day === selectedDay.value)
      ?.weightIds.map((id) => CATEGORIES[id]) ?? []
  );
});

const hasActiveCategories = computed(() =>
  selectedDayCategories.value.some(
    (cat) => isActive(cat.weightId) && !isCategoryPredicted(cat.weightId),
  ),
);

const isValidForm = computed(() =>
  selectedDayCategories.value.every((cat) => {
    if (!isActive(cat.weightId) || isCategoryPredicted(cat.weightId))
      return true;
    return predictions.value[cat.weightId]?.places.every((p) => !!p) ?? false;
  }),
);

const predictionMessage = computed(() => {
  if (selectedDay.value === null) return "";
  const hasActive = selectedDayCategories.value.some((cat) =>
    isActive(cat.weightId),
  );
  if (predictionSubmitted.value && hasActive)
    return "Vous pouvez modifier votre pronostic tant que la catégorie est active.";
  if (predictionSubmitted.value) return "Pronostic déjà effectué pour ce jour.";
  if (!isValidForm.value)
    return "Veuillez remplir tous les champs pour valider votre pronostic.";
  if (!hasActiveCategories.value)
    return "Les pronostics ne sont pas encore ouverts pour cette catégorie.";
  return "Vous pouvez soumettre votre pronostic.";
});

// ── Helpers ───────────────────────────────────────────────────────────────
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const initializePredictions = () => {
  competitionFormat.value.forEach((dayFormat) => {
    dayFormat.weightIds.forEach((weightId) => {
      if (!predictions.value[weightId])
        predictions.value[weightId] = { places: ["", "", "", ""], options: [] };
    });
  });
};

const isActive = (weightId: number): boolean => {
  if (!props.startingDay) return false;
  const dayFormat = competitionFormat.value.find((d) =>
    d.weightIds.includes(weightId),
  );
  if (!dayFormat) return false;
  const fightDate = new Date(props.startingDay);
  fightDate.setDate(fightDate.getDate() + dayFormat.day - 1);
  fightDate.setHours(currentCompetition.fightStartHour, 0, 0, 0);
  const closeAt = new Date(
    fightDate.getTime() - CLOSING_OFFSET_MINUTES * 60_000,
  );
  const openAt = new Date(fightDate);
  openAt.setDate(openAt.getDate() - 1);
  openAt.setHours(8, 0, 0, 0);
  return new Date() >= openAt && new Date() < closeAt;
};

const isCategoryPredicted = (weightId: number): boolean => {
  const preds = predictionObject.value?.predictions;
  if (!preds) return false;
  return CATEGORIES[weightId].gender === "women"
    ? !!preds.womenFirstPlace
    : !!preds.menFirstPlace;
};

const getAvailableOptions = (
  weightId: number,
  placeIndex: number,
): string[] => {
  const pred = predictions.value[weightId];
  if (!pred) return [];
  const taken = pred.places.filter(
    (_, i) => i !== placeIndex && pred.places[i],
  );
  return pred.options.filter((o) => !taken.includes(o));
};

const buildPredictionPayload = (): Record<string, string> => {
  const payload: Record<string, string> = {};
  const keys = ["FirstPlace", "SecondPlace", "ThirdPlace1", "ThirdPlace2"];
  selectedDayCategories.value.forEach((cat) => {
    const prefix = cat.gender === "women" ? "women" : "men";
    predictions.value[cat.weightId]?.places.forEach((place, i) => {
      payload[`${prefix}${keys[i]}`] = place;
    });
  });
  return payload;
};

// ── API ───────────────────────────────────────────────────────────────────
const fetchCompetitors = async (weightId: number): Promise<string[]> => {
  const url = `https://data.ijf.org/api/get_json?access_token=&params%5Baction%5D=competition.competitors&params%5Bid_competition%5D=${currentCompetition.id}&params%5Bid_weight%5D=${weightId}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  const genderKey = CATEGORIES[weightId].gender === "men" ? 1 : 2;
  const categoryData = data.categories?.[genderKey]?.[weightId];
  if (!categoryData?.persons) return [];
  return Object.values(categoryData.persons as Record<string, Competitor>)
    .sort(
      (a, b) => (a.ranking_place ?? Infinity) - (b.ranking_place ?? Infinity),
    )
    .map(
      (p) =>
        `${p.family_name.toUpperCase()} ${p.given_name} (${p.country_short})`,
    );
};

const loadCompetitorsData = async (day: number) => {
  const dayFormat = competitionFormat.value.find((d) => d.day === day);
  if (!dayFormat) return;
  loading.value = true;
  error.value = null;
  try {
    await Promise.all(
      dayFormat.weightIds.map(async (weightId) => {
        predictions.value[weightId].options = await fetchCompetitors(weightId);
      }),
    );
  } catch (err) {
    error.value =
      err instanceof Error
        ? `Impossible de charger les données : ${err.message}`
        : "Erreur inconnue";
  } finally {
    loading.value = false;
  }
};

const selectDay = async (day: number) => {
  selectedDay.value = day;
  const token = localStorage.getItem("token");
  if (!token) {
    await loadCompetitorsData(day);
    return;
  }
  try {
    const response = await fetch(`${API_URL}/api/predictions`, {
      method: predictionSubmitted.value ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        predictions: buildPredictionPayload(),
        competitionDay: day,
        competitionId: currentCompetition.id,
        date: new Date().toISOString().split("T")[0],
      }),
    });
    if (response.ok) {
      const result = await response.json();
      predictionObject.value = result.prediction;
      predictionSubmitted.value = true;
    } else {
      predictionObject.value = null;
      predictionSubmitted.value = false;
    }
  } catch (err) {
    console.error("Erreur réseau:", err);
  }
  await loadCompetitorsData(day);
};

const validatePrediction = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    const response = await fetch(`${API_URL}/api/predictions`, {
      method: predictionSubmitted.value ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        predictions: buildPredictionPayload(),
        competitionDay: selectedDay.value,
        competitionId: currentCompetition.id,
        date: new Date().toISOString().split("T")[0],
      }),
    });
    if (response.ok) {
      predictionSubmitted.value = true;
    } else {
      console.warn("Erreur backend:", await response.text());
    }
  } catch (err) {
    console.error("Erreur réseau:", err);
  }
};

// ── Lifecycle ─────────────────────────────────────────────────────────────
onMounted(() => {
  window.addEventListener("resize", checkMobile);
  initializePredictions();
});
onUnmounted(() => window.removeEventListener("resize", checkMobile));
</script>

<style scoped>
.tour-page {
  --blue: #2d508e;
  width: 100%;
}

/* ── Hero ───────────────────────────────────────────────────────────────── */
.hero {
  background: linear-gradient(160deg, #f8faff 0%, #eef3fd 100%);
  text-align: center;
  padding: 3rem 1.5rem 2rem;
}
.hero-title {
  font-size: clamp(1.6rem, 4vw, 3rem);
  font-weight: 800;
  color: var(--blue);
  margin-bottom: 1.25rem;
  line-height: 1.15;
}
.hero-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 600;
}
.badge-countdown {
  background: #fff7ed;
  color: #9a3412;
  border: 1px solid #fed7aa;
}
.badge-live {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #86efac;
}
.badge-info {
  background: rgba(45, 80, 142, 0.07);
  color: var(--blue);
  border: 1px solid rgba(45, 80, 142, 0.18);
}

/* ── Day tabs ───────────────────────────────────────────────────────────── */
.days-section {
  padding: 1.5rem 1.5rem 0;
  max-width: 800px;
  margin: 0 auto;
}
.days-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.day-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.55rem 1rem;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: white;
  color: #2d508e;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1.3;
}
.day-tab-sub {
  font-size: 0.68rem;
  font-weight: 400;
  opacity: 0.65;
  margin-top: 2px;
}
.day-tab:hover {
  border-color: var(--blue);
  color: var(--blue);
  transform: translateY(-2px);
}
.day-tab.active {
  background: var(--blue);
  border-color: var(--blue);
  color: white;
}
.day-tab.active .day-tab-sub {
  opacity: 0.8;
}

/* ── Content ────────────────────────────────────────────────────────────── */
.content-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* ── Skeleton ───────────────────────────────────────────────────────────── */
.skeleton-wrap {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.skeleton-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.skeleton-line {
  height: 13px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ── Alert ──────────────────────────────────────────────────────────────── */
.alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  gap: 1rem;
}
.alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}
.retry-btn {
  padding: 0.35rem 0.9rem;
  background: white;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-size: 0.82rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}
.retry-btn:hover {
  background: #fef2f2;
}

/* ── Info banner ────────────────────────────────────────────────────────── */
.info-banner {
  background: rgba(45, 80, 142, 0.06);
  border: 1px solid rgba(45, 80, 142, 0.14);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.88rem;
  color: var(--blue);
  margin-bottom: 1.25rem;
  text-align: center;
}

/* ── Category card ──────────────────────────────────────────────────────── */
.category-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.4rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s;
}
.category-card:hover {
  box-shadow: 0 4px 20px rgba(45, 80, 142, 0.08);
}
.card-inactive {
  opacity: 0.6;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}
.card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--blue);
}
.status-badge {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
}
.status-open {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #86efac;
}
.status-closed {
  background: #f8fafc;
  color: #94a3b8;
  border: 1px solid #e2e8f0;
}

/* ── Place rows ─────────────────────────────────────────────────────────── */
.places-grid {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.place-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.place-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
  width: 95px;
  flex-shrink: 0;
}
.place-select {
  flex: 1;
  padding: 0.5rem 0.8rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: #f8faff;
  color: #1e293b;
  font-size: 0.88rem;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.place-select:focus {
  border-color: var(--blue);
  background: white;
}
.select-disabled {
  background: #f1f5f9;
  color: #94a3b8;
  cursor: not-allowed;
}

/* ── Validate ───────────────────────────────────────────────────────────── */
.validate-section {
  margin-top: 1.5rem;
  text-align: center;
}
.btn-validate {
  width: 100%;
  padding: 0.85rem;
  background: var(--blue);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}
.btn-validate:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.btn-validate:active {
  transform: scale(0.98);
}
.btn-validate-disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}
.btn-validate-disabled:hover {
  opacity: 1;
  transform: none;
}

.message-box {
  margin-top: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
}
.message-success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #86efac;
}
.message-error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
.message-info {
  background: rgba(45, 80, 142, 0.06);
  color: var(--blue);
  border: 1px solid rgba(45, 80, 142, 0.18);
}

/* ── No day hint ────────────────────────────────────────────────────────── */
.no-day-hint {
  text-align: center;
  padding: 3rem 1.5rem;
  color: #94a3b8;
  font-size: 1rem;
}

/* ── Animations ─────────────────────────────────────────────────────────── */
.fade-up {
  animation: fadeInUp 0.6s ease both;
  animation-delay: var(--delay, 0ms);
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Mobile ─────────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .place-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  .place-label {
    width: auto;
  }
  .place-select {
    width: 100%;
  }
  .days-tabs {
    gap: 0.35rem;
  }
  .day-tab {
    padding: 0.45rem 0.75rem;
    font-size: 0.82rem;
  }
}
</style>

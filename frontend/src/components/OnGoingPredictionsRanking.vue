<template>
  <div class="ranking-page">
    <!-- Hero -->
    <div class="ranking-hero">
      <div class="hero-inner">
        <span class="hero-tag">🏆 Classement en cours</span>
        <h1 class="hero-title">{{ competitionName }}</h1>

        <div v-if="countDown > 0" class="countdown-badge">
          <span class="countdown-label">Début dans:</span>
          <span class="countdown-value">J-{{ countDown }}</span>
        </div>

        <div class="day-info-bar">
          <template v-if="currentCompetitionDay && currentDayFormat">
            <span class="day-badge active">En cours</span>
            <span class="day-text">
              Jour {{ currentCompetitionDay }} —
              {{
                currentDayFormat.weightIds
                  .map((id) => CATEGORIES[id].label)
                  .join(" & ")
              }}
            </span>
          </template>
          <template v-else>
            <span class="day-badge">Dates</span>
            <span class="day-text"
              >{{ formattedStartingDay }} → {{ formattedEndingDay }}</span
            >
          </template>
        </div>
      </div>
    </div>

    <!-- Leaderboard -->
    <section class="ranking-section">
      <div class="section-inner">
        <!-- Loading state -->
        <div v-if="isLoading" class="loading-podium">
          <div class="skeleton-podium">
            <div class="skel-card silver" />
            <div class="skel-card gold" />
            <div class="skel-card bronze" />
          </div>
          <div class="loading-list">
            <div
              v-for="n in 3"
              :key="n"
              class="skeleton-card"
              :style="`--i:${n}`"
            />
          </div>
        </div>
        <!-- Empty state -->
        <div
          v-else-if="!isLoading && leaderboard.length === 0"
          class="empty-card"
        >
          <div class="empty-icon">📊</div>
          <p class="empty-title">Aucun résultat à afficher</p>
          <p class="empty-sub">
            Les scores apparaîtront une fois les premières prédictions validées.
          </p>
        </div>

        <!-- Leaderboard -->
        <template v-else>
          <!-- Podium top 3 -->
          <div class="podium-row">
            <!-- 2ème à gauche -->
            <div
              v-if="leaderboard[1]"
              class="podium-card silver"
              style="--i: 1"
            >
              <div class="medal">🥈</div>
              <div class="podium-rank">2ème</div>
              <div class="podium-username">{{ leaderboard[1].username }}</div>
              <div class="podium-points">{{ leaderboard[1].points }} pts</div>
            </div>
            <!-- 1er au centre (surélevé) -->
            <div v-if="leaderboard[0]" class="podium-card gold" style="--i: 0">
              <div class="medal">🥇</div>
              <div class="podium-rank">1er</div>
              <div class="podium-username">{{ leaderboard[0].username }}</div>
              <div class="podium-points">{{ leaderboard[0].points }} pts</div>
            </div>
            <!-- 3ème à droite -->
            <div
              v-if="leaderboard[2]"
              class="podium-card bronze"
              style="--i: 2"
            >
              <div class="medal">🥉</div>
              <div class="podium-rank">3ème</div>
              <div class="podium-username">{{ leaderboard[2].username }}</div>
              <div class="podium-points">{{ leaderboard[2].points }} pts</div>
            </div>
          </div>

          <!-- Rang 4 et au-delà -->
          <div v-if="leaderboard.length > 3" class="rankings-list">
            <div
              v-for="(user, index) in leaderboard.slice(3)"
              :key="user.username"
              class="ranking-row"
              :style="`--i:${index}`"
            >
              <span class="rank-number">{{ index + 4 }}</span>
              <span class="rank-username">{{ user.username }}</span>
              <span class="rank-points">{{ user.points }} pts</span>
            </div>
          </div>
        </template>
      </div>
    </section>
    <!-- Pronos des participants -->
    <section v-if="closedDays.length > 0" class="predictions-section">
      <div class="section-inner">
        <h2 class="predictions-title">🔍 Pronos des participants</h2>

        <!-- Onglets par jour -->
        <div class="pred-tabs">
          <button
            v-for="day in closedDays"
            :key="day.day"
            class="pred-tab"
            :class="{ active: selectedPredictionDay === day.day }"
            @click="selectedPredictionDay = day.day"
          >
            Jour {{ day.day }}
          </button>
        </div>

        <!-- Tableau des pronos -->
        <div v-if="selectedPredictionDay !== null" class="pred-table-wrap">
          <div
            v-for="category in predictionsByDayAndCategory"
            :key="category.label"
            class="pred-category"
          >
            <div class="pred-category-header">{{ category.label }}</div>
            <div class="pred-table-scroll">
              <table class="pred-table">
                <thead>
                  <tr>
                    <th>Participant</th>
                    <th>1er</th>
                    <th>2ème</th>
                    <th>3ème</th>
                    <th>3ème</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in category.rows" :key="row.username">
                    <td class="pred-username">{{ row.username }}</td>
                    <td
                      :class="{
                        'cell-score-3':
                          getCellScore(
                            row.firstPlace,
                            category.label,
                            'first',
                          ) === 3,
                        'cell-score-1':
                          getCellScore(
                            row.firstPlace,
                            category.label,
                            'first',
                          ) === 1,
                      }"
                    >
                      {{ row.firstPlace }}
                    </td>
                    <td
                      :class="{
                        'cell-score-3':
                          getCellScore(
                            row.secondPlace,
                            category.label,
                            'second',
                          ) === 3,
                        'cell-score-1':
                          getCellScore(
                            row.secondPlace,
                            category.label,
                            'second',
                          ) === 1,
                      }"
                    >
                      {{ row.secondPlace }}
                    </td>
                    <td
                      :class="{
                        'cell-score-3':
                          getCellScore(
                            row.thirdPlace1,
                            category.label,
                            'third',
                          ) === 3,
                        'cell-score-1':
                          getCellScore(
                            row.thirdPlace1,
                            category.label,
                            'third',
                          ) === 1,
                      }"
                    >
                      {{ row.thirdPlace1 }}
                    </td>
                    <td
                      :class="{
                        'cell-score-3':
                          getCellScore(
                            row.thirdPlace2,
                            category.label,
                            'third',
                          ) === 3,
                        'cell-score-1':
                          getCellScore(
                            row.thirdPlace2,
                            category.label,
                            'third',
                          ) === 1,
                      }"
                    >
                      {{ row.thirdPlace2 }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { CATEGORIES } from "@/config/categories";
import { COMPETITION_FORMATS } from "@/config/competitionFormats";
import { currentCompetition } from "@/config/currentCompetition";
import type { Competitor, LeaderboardEntry, User } from "@/types";

// ── Props ─────────────────────────────────────────────────────────────────
const props = defineProps<{
  currentCompetitionDay: number | null;
  competitionName: string;
  formattedStartingDay: string;
  formattedEndingDay: string;
  startingDay: string;
  endingDay: string;
  countDown: number;
}>();

// ── State ─────────────────────────────────────────────────────────────────
const isMobile = ref(window.innerWidth <= 768);
const results = ref<Record<string, Competitor[]>>({});
const leaderboard = ref<LeaderboardEntry[]>([]);
const users = ref<User[]>([]);
const isLoading = ref(true);

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

const selectedPredictionDay = ref<number | null>(null);

const closedDays = computed(() => {
  if (!props.startingDay) return [];
  return competitionFormat.value.filter((dayFormat) => {
    const fightDate = new Date(props.startingDay);
    fightDate.setDate(fightDate.getDate() + dayFormat.day - 1);
    fightDate.setHours(8, 30, 0, 0);
    return new Date() >= fightDate;
  });
});

const predictionsByDayAndCategory = computed(() => {
  if (selectedPredictionDay.value === null) return [];
  const dayFormat = competitionFormat.value.find(
    (d) => d.day === selectedPredictionDay.value,
  );
  if (!dayFormat) return [];

  return dayFormat.weightIds.map((weightId) => {
    const cat = CATEGORIES[weightId];
    const rows = users.value
      .filter((u) => {
        const pred = u.predictions.find((p) => p.event === cat.label);
        return pred !== undefined;
      })
      .map((u) => {
        const pred = u.predictions.find((p) => p.event === cat.label)!;
        return {
          username: u.username,
          firstPlace: pred.firstPlace || "—",
          secondPlace: pred.secondPlace || "—",
          thirdPlace1: pred.thirdPlace1 || "—",
          thirdPlace2: pred.thirdPlace2 || "—",
        };
      });
    return { label: cat.label, rows };
  });
});

// ── Helpers ───────────────────────────────────────────────────────────────
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const normalizeName = (name: string | undefined): string => {
  if (!name) return "";
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s*\(.*?\)\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const formatDateToDDMMYYYY = (date: string): string => {
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}/${d.getFullYear()}`;
};

// ── API ───────────────────────────────────────────────────────────────────
const fetchUserPredictions = async (): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) {
    users.value = [];
    return;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/predictions?competitionId=${
        currentCompetition.id
      }`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!response.ok) throw new Error(response.statusText);

    const data: Array<{
      username: string;
      competitionDay: number;
      predictions: Record<string, string>;
    }> = await response.json();

    users.value = data.flatMap((prediction) => {
      const dayFormat = competitionFormat.value.find(
        (d) => d.day === prediction.competitionDay,
      );
      if (!dayFormat) return [];

      return [
        {
          username: prediction.username,
          predictions: dayFormat.weightIds.map((weightId) => {
            const gender = CATEGORIES[weightId].gender;
            const prefix = gender === "women" ? "women" : "men";
            return {
              event: CATEGORIES[weightId].label,
              firstPlace: prediction.predictions[`${prefix}FirstPlace`] ?? "",
              secondPlace: prediction.predictions[`${prefix}SecondPlace`] ?? "",
              thirdPlace1: prediction.predictions[`${prefix}ThirdPlace1`] ?? "",
              thirdPlace2: prediction.predictions[`${prefix}ThirdPlace2`] ?? "",
            };
          }),
        },
      ];
    });
  } catch (err) {
    console.error("Erreur fetchUserPredictions:", err);
    users.value = [];
  }
};

const fetchResults = async (): Promise<void> => {
  const allWeightIds = competitionFormat.value.flatMap((day) => day.weightIds);

  await Promise.all(
    allWeightIds.map(async (weightId) => {
      try {
        const response = await fetch(
          `https://data.ijf.org/api/get_json?access_token=&params%5Baction%5D=competition.competitors&params%5Bid_competition%5D=${currentCompetition.id}&params%5Bid_weight%5D=${weightId}`,
        );
        if (!response.ok) return;

        const data = await response.json();
        const genderKey = CATEGORIES[weightId].gender === "men" ? 1 : 2;
        const categoryData = data.categories?.[genderKey]?.[weightId];
        const placed = (
          Object.values(categoryData?.persons ?? {}) as Competitor[]
        ).filter((c) => c.place != null);

        if (placed.length > 0) {
          results.value[CATEGORIES[weightId].label] = placed;
        }
      } catch (err) {
        console.error(`Erreur fetchResults weightId ${weightId}:`, err);
      }
    }),
  );
};

// ── Scoring ───────────────────────────────────────────────────────────────
const calculateUserScores = (): void => {
  if (!users.value.length) {
    leaderboard.value = [];
    return;
  }

  const scoreMap = new Map<string, number>();

  for (const user of users.value) {
    let score = 0;

    for (const prediction of user.predictions) {
      const eventResults = results.value[prediction.event];
      if (!eventResults) continue;

      const getName = (c: Competitor) =>
        normalizeName(`${c.family_name} ${c.given_name}`);

      const actual = {
        first:
          getName(
            eventResults.find((c) => c.place === "1") ?? ({} as Competitor),
          ) || null,
        second:
          getName(
            eventResults.find((c) => c.place === "2") ?? ({} as Competitor),
          ) || null,
        thirds: eventResults.filter((c) => c.place === "3").map(getName),
      };

      if (!actual.first && !actual.second && !actual.thirds.length) continue;

      const predicted = {
        first: normalizeName(prediction.firstPlace),
        second: normalizeName(prediction.secondPlace),
        thirds: [
          normalizeName(prediction.thirdPlace1),
          normalizeName(prediction.thirdPlace2),
        ],
      };

      // 1ère place
      if (predicted.first === actual.first) score += 3;
      else if (
        predicted.first === actual.second ||
        actual.thirds.includes(predicted.first)
      )
        score += 1;

      // 2ème place
      if (predicted.second === actual.second) score += 3;
      else if (
        predicted.second === actual.first ||
        actual.thirds.includes(predicted.second)
      )
        score += 1;

      // 3ème places
      predicted.thirds.forEach((p) => {
        if (actual.thirds.includes(p)) score += 3;
        else if (p === actual.first || p === actual.second) score += 1;
      });
    }

    scoreMap.set(user.username, (scoreMap.get(user.username) ?? 0) + score);
  }

  leaderboard.value = Array.from(scoreMap.entries())
    .map(([username, points]) => ({ username, points }))
    .sort((a, b) => b.points - a.points);
};

const archiveLeaderboard = async (): Promise<void> => {
  if (!props.endingDay) return;
  if (!leaderboard.value.length) return;
  if (!leaderboard.value.some((u) => u.points > 0)) return;
  if (new Date() <= new Date(props.endingDay)) return;

  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/archived-competitions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          competitionId: currentCompetition.id,
          competitionName: props.competitionName,
          leaderboard: leaderboard.value,
          startingDay: formatDateToDDMMYYYY(props.startingDay),
          endingDay: formatDateToDDMMYYYY(props.endingDay),
        }),
      },
    );
    if (!response.ok) throw new Error(response.statusText);
  } catch (err) {
    console.error("Erreur archiveLeaderboard:", err);
  }
};

const getCellScore = (
  predictedName: string,
  categoryLabel: string,
  position: "first" | "second" | "third",
): 0 | 1 | 3 => {
  if (!predictedName || predictedName === "—") return 0;
  const eventResults = results.value[categoryLabel];
  if (!eventResults) return 0;

  const normalize = (name: string) =>
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s*\(.*?\)\s*/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const predicted = normalize(predictedName);
  const actual = {
    first: normalize(
      `${eventResults.find((c) => c.place === "1")?.family_name ?? ""} ${
        eventResults.find((c) => c.place === "1")?.given_name ?? ""
      }`,
    ),
    second: normalize(
      `${eventResults.find((c) => c.place === "2")?.family_name ?? ""} ${
        eventResults.find((c) => c.place === "2")?.given_name ?? ""
      }`,
    ),
    thirds: eventResults
      .filter((c) => c.place === "3")
      .map((c) => normalize(`${c.family_name} ${c.given_name}`)),
  };

  if (position === "first") {
    if (predicted === actual.first) return 3;
    if (predicted === actual.second || actual.thirds.includes(predicted))
      return 1;
  }
  if (position === "second") {
    if (predicted === actual.second) return 3;
    if (predicted === actual.first || actual.thirds.includes(predicted))
      return 1;
  }
  if (position === "third") {
    if (actual.thirds.includes(predicted)) return 3;
    if (predicted === actual.first || predicted === actual.second) return 1;
  }
  return 0;
};

// ── Lifecycle ─────────────────────────────────────────────────────────────
onMounted(async () => {
  window.addEventListener("resize", checkMobile);
  isLoading.value = true;
  await fetchUserPredictions();
  await fetchResults();
  calculateUserScores();
  await archiveLeaderboard();
  isLoading.value = false;
  if (closedDays.value.length > 0) {
    selectedPredictionDay.value = closedDays.value[0].day;
  }
});

onUnmounted(() => window.removeEventListener("resize", checkMobile));
</script>

<style scoped>
/* ── PAGE ── */
.ranking-page {
  min-height: 100vh;
  background: linear-gradient(160deg, #f8faff 0%, #eef3fd 100%);
  width: 100%;
}

/* ── HERO ── */
.ranking-hero {
  padding: 4rem 2rem 2.5rem;
  text-align: center;
}
.hero-inner {
  max-width: 700px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease both;
}
.hero-tag {
  display: inline-block;
  background: rgba(45, 80, 142, 0.08);
  color: #2d508e;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  margin-bottom: 1.25rem;
}
.hero-title {
  font-size: clamp(1.6rem, 4vw, 2.8rem);
  font-weight: 700;
  color: #1e3461;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

/* Countdown */
.countdown-badge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: #2d508e;
  color: white;
  border-radius: 14px;
  padding: 0.75rem 2.5rem;
  margin-bottom: 1.5rem;
  @media screen and (min-width: 1024px) {
    flex-direction: row;
  }
}
.countdown-label {
  font-size: 0.7rem;
  opacity: 0.75;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.countdown-value {
  font-size: 1.8rem;
  font-weight: 800;
  @media screen and (min-width: 1024px) {
    font-size: 1rem;
    margin-left: 0.5rem;
  }
}

/* Day info pill */
.day-info-bar {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 0.5rem 1.25rem;
  font-size: 0.9rem;
  @media screen and (min-width: 1024px) {
    margin-left: 1rem;
  }
}
.day-badge {
  background: rgba(45, 80, 142, 0.08);
  color: #2d508e;
  font-weight: 600;
  font-size: 0.72rem;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.day-badge.active {
  background: #dcfce7;
  color: #166534;
}
.day-text {
  color: #4a5568;
  font-weight: 500;
}

/* ── SECTION ── */
.ranking-section {
  padding: 0.5rem 2rem 5rem;
}
.section-inner {
  max-width: 700px;
  margin: 0 auto;
}

/* ── EMPTY STATE ── */
.empty-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 3.5rem 2rem;
  text-align: center;
  animation: fadeInUp 0.5s ease both;
}
.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.empty-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e3461;
  margin-bottom: 0.5rem;
}
.empty-sub {
  color: #718096;
  font-size: 0.9rem;
}

/* ── LOADING ── */
.loading-podium {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.skeleton-podium {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1rem;
}
.skel-card {
  flex: 1;
  max-width: 210px;
  border-radius: 16px;
  background: linear-gradient(90deg, #f0f4ff 25%, #e2e8f0 50%, #f0f4ff 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;
}
.skel-card.gold {
  height: 220px;
}
.skel-card.silver {
  height: 187px;
}
.skel-card.bronze {
  height: 154px;
}
.loading-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.skeleton-card {
  height: 58px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f0f4ff 25%, #e2e8f0 50%, #f0f4ff 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite,
    fadeInUp 0.4s ease calc(var(--i, 0) * 0.06s) both;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ── PODIUM ── */
.podium-row {
  display: flex;
  align-items: flex-end; /* ← les cartes s'alignent par le bas */
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.podium-card {
  flex: 1;
  max-width: 210px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem 1rem 1.25rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: fadeInUp 0.5s ease calc(var(--i, 0) * 0.12s) both;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.podium-card.gold {
  min-height: 220px; /* ← 100% */
  border-color: #fbbf24;
  background: linear-gradient(160deg, #fffdf0 0%, #fffbe8 100%);
}
.podium-card.silver {
  min-height: 187px; /* ← 85% */
  border-color: #cbd5e0;
}
.podium-card.bronze {
  min-height: 154px; /* ← 70% */
  border-color: #d6a679;
}
.podium-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(45, 80, 142, 0.12);
}

/* ── RANKINGS LIST ── */
.rankings-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.ranking-row {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.9rem 1.25rem;
  animation: fadeInUp 0.4s ease calc(var(--i, 0) * 0.05s) both;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.ranking-row:hover {
  transform: translateX(5px);
  box-shadow: 0 2px 12px rgba(45, 80, 142, 0.08);
}
.rank-number {
  width: 2.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #a0aec0;
  flex-shrink: 0;
}
.rank-username {
  flex: 1;
  font-weight: 600;
  color: #1e3461;
  font-size: 0.95rem;
}
.rank-points {
  font-weight: 700;
  color: #2d508e;
  font-size: 0.95rem;
}

/* ── PREDICTIONS SECTION ── */
.predictions-section {
  padding: 0 2rem 5rem;
}
.predictions-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e3461;
  margin-bottom: 1.25rem;
}
.pred-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  justify-content: center;
}
.pred-tab {
  padding: 0.45rem 1rem;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: white;
  color: #2d508e;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.pred-tab.active {
  background: #2d508e;
  border-color: #2d508e;
  color: white;
}
.pred-category {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 1rem;
}
.pred-category-header {
  background: rgba(45, 80, 142, 0.06);
  padding: 0.75rem 1.25rem;
  font-weight: 700;
  color: #2d508e;
  font-size: 0.9rem;
  border-bottom: 1px solid #e2e8f0;
}
.pred-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}
.pred-table th {
  padding: 0.6rem 1rem;
  text-align: left;
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  border-bottom: 1px solid #f1f5f9;
}
.pred-table td {
  padding: 0.7rem 1rem;
  border: 1px solid #f8fafc;
  color: #4a5568;
}
.pred-table tr:last-child td {
  border-bottom: none;
}
.pred-table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 transparent;
}

.pred-table-scroll::-webkit-scrollbar {
  height: 4px;
}

.pred-table-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.pred-table-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 999px;
}
.pred-username {
  font-weight: 600;
  color: #1e3461;
}
@media (max-width: 640px) {
  .pred-table {
    font-size: 0.72rem;
  }
  .pred-table th,
  .pred-table td {
    padding: 0.5rem 0.6rem;
  }
}

.cell-score-3 {
  background: #D4EDDA;
  color: #166534;
  font-weight: 600;
}
.cell-score-1 {
  background: #FCE5CD;
  color: #92400e;
  font-weight: 600;
}

/* ── ANIMATION ── */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

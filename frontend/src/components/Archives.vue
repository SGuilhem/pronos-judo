<template>
  <div class="archives-page">

    <!-- Hero -->
    <div class="archives-hero">
      <div class="hero-inner">
        <span class="hero-tag">📁 Historique</span>
        <h1 class="hero-title">Archives des pronos</h1>
        <p class="hero-sub">Retrouvez les classements de toutes les compétitions passées.</p>
      </div>
    </div>

    <!-- List -->
    <section class="archives-section">
      <div class="section-inner">

        <!-- Empty state -->
        <div v-if="archivedCompetitions.length === 0" class="empty-card">
          <div class="empty-icon">📂</div>
          <p class="empty-title">Aucune archive disponible</p>
          <p class="empty-sub">Les compétitions passées apparaîtront ici.</p>
        </div>

        <!-- Accordion compétitions -->
        <div
          v-for="(competition, index) in archivedCompetitions"
          :key="competition.competitionId"
          class="comp-card"
          :style="`--i:${index}`"
        >
          <!-- Header cliquable -->
          <div class="comp-header" @click="toggleEvent(index)">
            <div class="comp-info">
              <span class="comp-title">{{ competition.title }}</span>
              <span class="comp-dates">{{ competition.date_from }} → {{ competition.date_to }}</span>
            </div>
            <span class="chevron" :class="{ rotated: activeEventIndex === index }">▼</span>
          </div>

          <!-- Leaderboard déroulant -->
          <div v-if="activeEventIndex === index" class="comp-leaderboard">
            <div
              v-for="(user, i) in competition.leaderboard"
              :key="i"
              class="lb-row"
              :style="`--i:${i}`"
            >
              <span class="lb-position">
                <span v-if="i === 0">🥇</span>
                <span v-else-if="i === 1">🥈</span>
                <span v-else-if="i === 2">🥉</span>
                <span v-else class="lb-num">{{ i + 1 }}</span>
              </span>
              <span class="lb-username">{{ user.username }}</span>
              <span class="lb-points">{{ user.points }} pts</span>
            </div>
          </div>

        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface LeaderboardEntry {
  username: string
  points: number
}

interface ArchivedCompetition {
  competitionId: string
  title: string
  date_from: string
  date_to: string
  leaderboard: LeaderboardEntry[]
}

const archivedCompetitions = ref<ArchivedCompetition[]>([])
const activeEventIndex = ref<number | null>(null)
const isMobile = ref(window.innerWidth <= 768)

const checkMobile = () => { isMobile.value = window.innerWidth <= 768 }
const toggleEvent = (index: number) => {
  activeEventIndex.value = activeEventIndex.value === index ? null : index
}

const fetchArchivedCompetitions = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/archived-competitions`, {
      headers: { 'Cache-Control': 'no-cache' },
    })
    if (!response.ok) throw new Error('Erreur lors de la récupération des compétitions archivées')

    const data: ArchivedCompetition[] = await response.json()
    archivedCompetitions.value = data.sort((a, b) => {
      const [d1, m1, y1] = a.date_to.split('/')
      const [d2, m2, y2] = b.date_to.split('/')
      return new Date(`${y2}-${m2}-${d2}`).getTime() - new Date(`${y1}-${m1}-${d1}`).getTime()
    })
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  window.addEventListener('resize', checkMobile)
  fetchArchivedCompetitions()
})
onUnmounted(() => window.removeEventListener('resize', checkMobile))
</script>

<style scoped>
/* ── PAGE ── */
.archives-page {
  min-height: 100vh;
  background: linear-gradient(160deg, #f8faff 0%, #eef3fd 100%);
  width: 100%;
}

/* ── HERO ── */
.archives-hero {
  padding: 4rem 2rem 2.5rem;
  text-align: center;
}
.hero-inner {
  max-width: 560px;
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
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 700;
  color: #1e3461;
  line-height: 1.2;
  margin-bottom: 0.75rem;
}
.hero-sub {
  color: #718096;
  font-size: 1rem;
}

/* ── SECTION ── */
.archives-section {
  padding: 0.5rem 2rem 5rem;
}
.section-inner {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
.empty-icon  { font-size: 2.5rem; margin-bottom: 1rem; }
.empty-title { font-size: 1.1rem; font-weight: 600; color: #1e3461; margin-bottom: 0.5rem; }
.empty-sub   { color: #718096; font-size: 0.9rem; }

/* ── ACCORDION CARD ── */
.comp-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  animation: fadeInUp 0.4s ease calc(var(--i, 0) * 0.08s) both;
  transition: box-shadow 0.2s ease;
}
.comp-card:has(.comp-leaderboard) {
  box-shadow: 0 4px 20px rgba(45, 80, 142, 0.09);
}

.comp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  cursor: pointer;
  gap: 1rem;
  transition: background 0.2s ease;
}
.comp-header:hover {
  background: rgba(45, 80, 142, 0.04);
}

.comp-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.comp-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e3461;
}
.comp-dates {
  font-size: 0.82rem;
  color: #718096;
  font-weight: 500;
}
.chevron {
  color: #2d508e;
  font-size: 0.78rem;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}
.chevron.rotated {
  transform: rotate(180deg);
}

/* ── LEADERBOARD ── */
.comp-leaderboard {
  border-top: 1px solid #e2e8f0;
  padding: 0.75rem 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  animation: fadeInUp 0.3s ease both;
}
.lb-row {
  display: flex;
  align-items: center;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  animation: fadeInUp 0.3s ease calc(var(--i, 0) * 0.04s) both;
  transition: background 0.15s ease;
}
.lb-row:hover {
  background: rgba(45, 80, 142, 0.04);
}
.lb-position {
  width: 2.5rem;
  font-size: 1rem;
  flex-shrink: 0;
}
.lb-num {
  font-size: 0.85rem;
  font-weight: 700;
  color: #a0aec0;
}
.lb-username {
  flex: 1;
  font-weight: 600;
  color: #1e3461;
  font-size: 0.9rem;
}
.lb-points {
  font-weight: 700;
  color: #2d508e;
  font-size: 0.9rem;
}

/* ── ANIMATION ── */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
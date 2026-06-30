<template>
  <div class="app-layout">
    <SideMenu :links="links" :linkRoutes="linkRoutes" />
    <router-view v-bind="currentRouteName !== 'register' ? sharedProps : {}" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { currentCompetition } from '@/config/currentCompetition'
import { COMPETITION_FORMATS } from '@/config/competitionFormats'
import SideMenu from './components/SideMenu.vue'

// ── Navigation ────────────────────────────────────────────────────────────
const links: string[] = ['Accueil', 'Compétition en cours', 'Classement en cours', 'Archives']
const linkRoutes: Record<string, string> = {
  'Accueil':                '/',
  'Compétition en cours':   '/ongoing-tour',
  'Classement en cours':    '/ongoing-predictions-ranking',
  'Archives':               '/archives',
}

// ── State ─────────────────────────────────────────────────────────────────
const competitionName      = ref('Chargement...')
const startingDay          = ref<string | null>(null)
const endingDay            = ref<string | null>(null)
const formattedStartingDay = ref('')
const formattedEndingDay   = ref('')
const currentCompetitionDay = ref<number | null>(null)
const countDown            = ref(0)

// ── Computed ──────────────────────────────────────────────────────────────
const route = useRoute()
const currentRouteName = computed(() => route.name as string ?? '')

const sharedProps = computed(() => ({
  competitionName:        competitionName.value,
  startingDay:            startingDay.value,
  endingDay:              endingDay.value,
  formattedStartingDay:   formattedStartingDay.value,
  formattedEndingDay:     formattedEndingDay.value,
  currentCompetitionDay:  currentCompetitionDay.value,
  countDown:              countDown.value,
}))

// ── Helpers ───────────────────────────────────────────────────────────────
const formatDate = (date: string | Date | null): string => {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

// ── API ───────────────────────────────────────────────────────────────────
const fetchCompetitionInfos = async (): Promise<void> => {
  try {
    const response = await fetch(
      `https://data.ijf.org/api/get_json?params%5Baction%5D=general.get_one&params%5Bmodule%5D=competition&params%5Bid%5D=${currentCompetition.id}`
    )
    const data = await response.json()
    competitionName.value      = data?.title     ?? 'Compétition inconnue'
    startingDay.value          = data?.date_from  ?? null
    endingDay.value            = data?.date_to    ?? null
    formattedStartingDay.value = formatDate(data?.date_from)
    formattedEndingDay.value   = formatDate(data?.date_to)
  } catch (err) {
    console.error('Erreur fetchCompetitionInfos:', err)
    competitionName.value = 'Erreur lors du chargement'
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────
onMounted(async () => {
  await fetchCompetitionInfos()
  if (!startingDay.value) return

  const today      = new Date()
  const startDate  = new Date(startingDay.value)
  const totalDays  = COMPETITION_FORMATS[currentCompetition.type].length

  // Countdown avant le début
  const diffMs = startDate.getTime() - today.getTime()
  countDown.value = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  // Jour de compétition en cours
  const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  currentCompetitionDay.value = (daysSinceStart >= 0 && daysSinceStart < totalDays)
    ? daysSinceStart + 1
    : null
})
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
}
@media screen and (min-width: 1024px) {
  .app-layout {
    flex-direction: row;
    min-height: 100vh;
  }
}
* {
  font-family: 'Poppins', sans-serif !important;
}
</style>
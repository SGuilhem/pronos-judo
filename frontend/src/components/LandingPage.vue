<template>
  <div class="landing w-full">

    <!-- Hero -->
    <section class="hero">
      <div class="fade-up" style="--delay: 0ms">
        <span class="hero-tag">🥋 Pronostics Judo</span>
      </div>
      <h1 class="hero-title fade-up" style="--delay: 100ms">
        Interbudo Pronos
      </h1>
      <p class="hero-subtitle fade-up" style="--delay: 200ms">
        Pronostiquez les podiums des Championnats du Monde de Judo<br class="hidden lg:block" />
        et mesurez-vous à vos partenaires de club.
      </p>
      <div class="hero-divider fade-up" style="--delay: 300ms" />
    </section>

    <!-- Histoire -->
    <section class="content-section reveal" ref="storyRef">
      <p>
        Depuis quelques années, au club, un petit jeu s'est installé pendant les
        <strong>Championnats du Monde de Judo</strong>. Avec un groupe d'adultes du cours,
        on s'est pris au jeu des <strong>pronostics quotidiens</strong>, tout au long
        de la semaine de compétition.
      </p>
      <p>
        Chaque jour, chacun envoyait son <strong>prono du podium</strong> pour les
        catégories en lice le lendemain. Des points étaient attribués selon la justesse
        des choix. À la fin de la semaine, on faisait les comptes… et on désignait
        notre grand gagnant 🏆 !
      </p>
      <p>
        Au départ, Google Docs et Google Forms. Simple, mais pas optimal pour suivre
        les scores ou voir le classement en direct. C'est pour ça que ce site a vu
        le jour : <strong>automatiser tout ça et rendre l'expérience fluide pour tout le monde.</strong>
      </p>
    </section>

    <!-- Comment ça marche -->
    <section class="content-section reveal" ref="howRef">
      <h2 class="section-title">🎯 Comment ça marche ?</h2>
      <div class="steps-grid">
        <div v-for="step in steps" :key="step.number" class="step-card">
          <div class="step-number">{{ step.number }}</div>
          <div class="step-text">{{ step.text }}</div>
        </div>
      </div>
    </section>

    <!-- Barème -->
    <section class="content-section reveal" ref="scoringRef">
      <h2 class="section-title">🧮 Barème des points</h2>
      <div class="scoring-grid">
        <div v-for="s in scoring" :key="s.points" class="score-card" :class="s.class">
          <div class="score-icon">{{ s.icon }}</div>
          <div class="score-points">{{ s.points }} pts</div>
          <div class="score-desc">{{ s.desc }}</div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Step    { number: string; text: string }
interface Scoring { points: number; icon: string; desc: string; class: string }

const steps: Step[] = [
  { number: '01', text: 'La veille de chaque journée de compétition, vos pronostics s\'ouvrent.' },
  { number: '02', text: 'Choisissez vos judokas pour le podium de chaque catégorie.' },
  { number: '03', text: 'Les pronostics se ferment au début de la journée de compétition.' },
  { number: '04', text: 'Les scores sont calculés automatiquement selon les résultats officiels IJF.' },
]

const scoring: Scoring[] = [
  { points: 3, icon: '✅', desc: 'Judoka à la bonne place',           class: 'score-green'  },
  { points: 1, icon: '🔄', desc: 'Sur le podium, mais mal placé',     class: 'score-orange' },
  { points: 0, icon: '❌', desc: 'Judoka hors podium',                class: 'score-red'    },
]

// ── Scroll reveal ─────────────────────────────────────────────────────────
const storyRef   = ref<HTMLElement | null>(null)
const howRef     = ref<HTMLElement | null>(null)
const scoringRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed')
        observer.unobserve(e.target)
      }
    }),
    { threshold: 0.12 }
  )
  ;[storyRef.value, howRef.value, scoringRef.value]
    .forEach(el => el && observer.observe(el))
})
</script>

<style scoped>
/* ── Variables ──────────────────────────────────────────────────────────── */
.landing { --blue: #2d508e; --blue-light: rgba(45,80,142,0.08); }

/* ── Hero ───────────────────────────────────────────────────────────────── */
.hero {
  background: linear-gradient(160deg, #f8faff 0%, #eef3fd 100%);
  text-align: center;
  padding: 4rem 1.5rem 3rem;
}
.hero-tag {
  display: inline-block;
  background: var(--blue-light);
  color: var(--blue);
  border-radius: 999px;
  padding: 4px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  margin-bottom: 1.25rem;
}
.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: var(--blue);
  line-height: 1.1;
  margin-bottom: 1rem;
}
.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.15rem);
  color: #4a5568;
  max-width: 520px;
  margin: 0 auto 2rem;
  line-height: 1.75;
}
.hero-divider {
  width: 48px;
  height: 4px;
  background: var(--blue);
  border-radius: 2px;
  margin: 0 auto;
}

/* ── Sections ───────────────────────────────────────────────────────────── */
.content-section {
  max-width: 700px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}
.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--blue);
  margin-bottom: 1.75rem;
}

/* ── Story paragraphs ───────────────────────────────────────────────────── */
.content-section p {
  color: #374151;
  font-size: 1.02rem;
  line-height: 1.85;
  margin-bottom: 1.1rem;
  padding-left: 1rem;
  border-left: 3px solid var(--blue);
}

/* ── Steps ──────────────────────────────────────────────────────────────── */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}
.step-card {
  background: #f8faff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.5rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.step-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 28px rgba(45,80,142,0.12);
}
.step-number {
  font-size: 2rem;
  font-weight: 800;
  color: var(--blue);
  opacity: 0.25;
  line-height: 1;
  margin-bottom: 0.5rem;
}
.step-text { font-size: 0.92rem; color: #374151; line-height: 1.65; }

/* ── Scoring ────────────────────────────────────────────────────────────── */
.scoring-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}
.score-card {
  border-radius: 14px;
  padding: 1.75rem 1.25rem;
  text-align: center;
  transition: transform 0.25s ease;
}
.score-card:hover { transform: translateY(-5px); }
.score-icon   { font-size: 1.75rem; margin-bottom: 0.5rem; }
.score-points { font-size: 2.25rem; font-weight: 800; margin-bottom: 0.25rem; }
.score-desc   { font-size: 0.88rem; line-height: 1.45; opacity: 0.85; }

.score-green  { background: #f0fdf4; border: 1px solid #86efac; color: #166534; }
.score-orange { background: #fff7ed; border: 1px solid #fed7aa; color: #9a3412; }
.score-red    { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; }

/* ── Animations ─────────────────────────────────────────────────────────── */
.fade-up {
  animation: fadeInUp 0.65s ease both;
  animation-delay: var(--delay, 0ms);
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}

.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
</style>
<template>
  <!-- Hamburger (mobile) -->
  <div v-show="isMobile" class="hamburger-bar">
    <button @click="toggleMenu" class="hamburger-btn">
      <img src="/svg/hamburger.svg" alt="Menu" class="w-8 h-8" />
    </button>
  </div>

  <!-- Backdrop mobile -->
  <Transition name="fade">
    <div v-if="isMobile && isMenuOpen" class="backdrop" @click="closeMenu" />
  </Transition>

  <!-- Sidebar -->
  <Transition name="slide-left">
    <aside v-if="!isMobile || isMenuOpen" class="sidebar" :class="{ 'sidebar-mobile': isMobile }">

      <!-- Bouton fermer (mobile) -->
      <button v-if="isMobile" @click="closeMenu" class="close-btn">
        <img src="/svg/cross-close.svg" alt="Fermer" class="w-6 h-6" />
      </button>

      <!-- Logo -->
      <div class="logo-section">
    <RouterLink to="/" aria-label="Accueil" @click="closeMenu">
      <img src="/InterbudoLogo.png" class="logo" alt="Interbudo" />
    </RouterLink>
  </div>

      <!-- Connecté -->
      <template v-if="userLogged">
        <div class="user-section">
          <div class="avatar">{{ initials }}</div>
          <div class="user-info">
            <span class="welcome">Bienvenue</span>
            <span class="username">{{ userName }}</span>
          </div>
        </div>

        <nav class="nav-links">
          <button
            v-for="(link, index) in links"
            :key="link"
            class="nav-link"
            :class="{ active: selectedLink === link }"
            :style="`--i: ${index}`"
            @click="handleClick(link)"
          >
            {{ link }}
          </button>
        </nav>
        <div class="sidebar-spacer" />
        <button class="btn-logout" @click="logout">Déconnexion</button>
      </template>

      <!-- Formulaire connexion -->
      <template v-else>
        <form class="login-form" @submit.prevent="login">
          <div class="field">
            <label>Email</label>
            <input
              type="email"
              v-model="email"
              required
              placeholder="votre@email.com"
            />
          </div>
          <div class="field">
            <label>Mot de passe</label>
            <input
              type="password"
              v-model="password"
              required
              placeholder="••••••••"
            />
          </div>
          <button type="button" class="forgot-link" @click="forgottenPassword">
            Mot de passe oublié ?
          </button>
          <p v-if="error" class="error-msg">{{ error }}</p>
          <button type="submit" class="btn-login">Connexion</button>
        </form>

        <div class="register-section">
          <p>Pas encore de compte ?</p>
          <router-link :to="{ name: 'register' }">
            <button class="btn-register" @click="closeMenu">Créer un compte</button>
          </router-link>
        </div>
      </template>

    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import axios from '@/axios'
import type { AxiosError } from 'axios'

const props = defineProps<{
  links:      string[]
  linkRoutes: Record<string, string>
}>()

const router    = useRouter()
const authStore = useAuthStore()
const { userLogged, userName } = storeToRefs(authStore)

const isMobile    = ref(window.innerWidth <= 1024)
const isMenuOpen  = ref(false)
const selectedLink = ref<string | null>(null)
const email       = ref('')
const password    = ref('')
const error       = ref('')

const initials = computed(() =>
  (userName.value ?? '')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
)

const checkMobile = () => { isMobile.value = window.innerWidth <= 1024 }
const toggleMenu  = () => { isMenuOpen.value = !isMenuOpen.value }
const closeMenu   = () => { isMenuOpen.value = false }

const handleClick = (link: string) => {
  selectedLink.value = link
  closeMenu()
  const path = props.linkRoutes[link]
  path ? router.push({ path }) : console.error(`Aucune route pour: ${link}`)
}

const forgottenPassword = () => {
  router.push({ name: 'register', query: { passwordReset: 'true' } })
  closeMenu()
}

const checkLogin = () => {
  const token = localStorage.getItem('token')
  const name  = localStorage.getItem('userName')
  if (token && name) authStore.login(name)
}

const login = async () => {
  error.value = ''
  try {
    const { data } = await axios.post('/api/auth/login', {
      email: email.value,
      password: password.value,
    })
    if (data.token) {
      const decoded = JSON.parse(atob(data.token.split('.')[1]))
      localStorage.setItem('token', data.token)
      localStorage.setItem('userName', decoded.username)
      authStore.login(decoded.username)
      router.push('/')
    } else {
      error.value = 'Informations invalides'
    }
  } catch (err) {
    console.error(err as AxiosError)
    error.value = 'Erreur lors de la tentative, réessayer plus tard.'
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  authStore.logout()
  selectedLink.value = null
  router.push('/')
}

onMounted(() => { checkLogin(); window.addEventListener('resize', checkMobile) })
onUnmounted(() => window.removeEventListener('resize', checkMobile))
</script>

<style scoped>
/* ── Hamburger ─────────────────────────────────────────────────────── */
.hamburger-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: linear-gradient(135deg, #1e3461 0%, #2d508e 100%);
  padding: 0.75rem 1rem;
}
.hamburger-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 8px;
  padding: 0.4rem;
  cursor: pointer;
  transition: background 0.2s;
}
.hamburger-btn:hover { background: rgba(255,255,255,0.2); }

/* ── Sidebar ───────────────────────────────────────────────────────── */
.sidebar {
  background: linear-gradient(180deg, #1e3461 0%, #2d508e 100%);
  height: 100vh;
  position: sticky;
  top: 0;
  width: 15%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.25rem;
  overflow: hidden;
}

.sidebar-spacer {
  flex: 1;
}
@media (min-width: 1200px) and (max-width: 1680px) { .sidebar { width: 240px; } }
@media (min-width: 1024px) and (max-width: 1200px) { .sidebar { width: 260px; } }

.sidebar-mobile {
  position: fixed;
  top: 0; left: 0;
  width: 85%;
  max-width: 320px;
  height: 100vh;
  z-index: 100;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  min-height: unset;
}

/* ── Close btn ─────────────────────────────────────────────────────── */
.close-btn {
  position: absolute;
  top: 1rem; right: 1rem;
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 8px;
  padding: 0.4rem;
  cursor: pointer;
  transition: background 0.2s;
}
.close-btn:hover { background: rgba(255,255,255,0.2); }

/* ── Backdrop ──────────────────────────────────────────────────────── */
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(2px);
  z-index: 99;
}

/* ── Logo ──────────────────────────────────────────────────────────── */
.logo-section {
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.12);
  width: 100%;
  text-align: center;
}
.logo {
  width: 140px;
  height: 140px;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
  transition: transform 0.3s ease;
  justify-self: center;
}
.logo:hover { transform: scale(1.05); }

/* ── Utilisateur ───────────────────────────────────────────────────── */
.user-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  margin-bottom: 1.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255,255,255,0.08);
  border-radius: 12px;
}
.avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: white;
  flex-shrink: 0;
}
.user-info   { display: flex; flex-direction: column; text-align: left; }
.welcome     { font-size: 0.72rem; opacity: 0.6; color: white; }
.username    { font-size: 0.95rem; font-weight: 700; color: white; }

/* ── Navigation ────────────────────────────────────────────────────── */
.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
  margin-bottom: 1.5rem;
}
.nav-link {
  width: 100%;
  text-align: left;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  color: rgba(255,255,255,0.75);
  font-size: 0.92rem;
  font-weight: 500;
  background: transparent;
  border: 1px solid white;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, transform 0.2s;
  animation: fadeInLeft 0.4s ease both;
  animation-delay: calc(var(--i, 0) * 60ms);
}
.nav-link:hover {
  background: rgba(255,255,255,0.1);
  color: white;
  transform: translateX(4px);
}
.nav-link.active {
  background: rgba(255,255,255,0.16);
  color: white;
  font-weight: 700;
  border-left: 8px solid rgba(255,255,255,0.8);
}

/* ── Login form ────────────────────────────────────────────────────── */
.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.field { display: flex; flex-direction: column; gap: 0.3rem; }
.field label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255,255,255,0.65);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.field input {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 0.6rem 0.85rem;
  color: white;
  font-size: 0.95rem;
  outline: none;
  width: 100%;
  transition: border-color 0.2s, background 0.2s;
}
.field input::placeholder { color: rgba(255,255,255,0.3); }
.field input:focus {
  border-color: rgba(255,255,255,0.55);
  background: rgba(255,255,255,0.15);
}
.forgot-link {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.55);
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  transition: color 0.2s;
}
.forgot-link:hover { color: white; }
.error-msg { font-size: 0.85rem; color: #fca5a5; text-align: center; }

/* ── Boutons ───────────────────────────────────────────────────────── */
.btn-login {
  width: 100%;
  padding: 0.7rem;
  background: white;
  color: #2d508e;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: opacity 0.2s, transform 0.2s;
}
.btn-login:hover  { opacity: 0.92; transform: translateY(-1px); }
.btn-login:active { transform: scale(0.98); }

.btn-logout {
  margin-top: auto;
  padding: 0.6rem 1.5rem;
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.75);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.88rem;
  transition: background 0.2s, color 0.2s;
}
.btn-logout:hover { background: rgba(255,255,255,0.15); color: white; }

/* ── Créer un compte ───────────────────────────────────────────────── */
.register-section {
  margin-top: 1.5rem;
  text-align: center;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255,255,255,0.12);
  width: 100%;
}
.register-section p { font-size: 0.82rem; color: rgba(255,255,255,0.55); margin-bottom: 0.75rem; }
.btn-register {
  padding: 0.55rem 1.4rem;
  background: transparent;
  color: white;
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.88rem;
  transition: background 0.2s, border-color 0.2s;
}
.btn-register:hover { background: rgba(255,255,255,0.1); border-color: white; }

/* ── Transitions ───────────────────────────────────────────────────── */
.slide-left-enter-active,
.slide-left-leave-active { transition: transform 0.3s ease, opacity 0.3s ease; }
.slide-left-enter-from,
.slide-left-leave-to    { transform: translateX(-100%); opacity: 0; }

.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; }

/* ── Animations ────────────────────────────────────────────────────── */
@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
}
</style>
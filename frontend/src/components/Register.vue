<template>
  <div class="register-page">
    <div class="register-card">
      <div class="card-header">
        <span class="hero-tag">{{ headerTag }}</span>
        <h1 class="card-title">{{ headerTitle }}</h1>
        <p class="card-sub">{{ headerSub }}</p>
      </div>

      <!-- Formulaire 1 : demande de réinitialisation -->
      <form v-if="passwordReset" @submit.prevent="requestPasswordReset" class="form">
        <div class="field">
          <label>Votre email</label>
          <input type="email" v-model="email" required placeholder="exemple@email.com" />
        </div>
        <p v-if="error" class="msg-error">{{ error }}</p>
        <div v-if="emailSent" class="msg-success">✓ Un mail de réinitialisation vous a été envoyé.</div>
        <button type="submit" class="btn-submit" :disabled="emailSent">
          Envoyer le mail de réinitialisation
        </button>
      </form>

      <!-- Formulaire 2 : définir un nouveau mot de passe -->
      <form v-else-if="resetPassword" @submit.prevent="resetPasswordSubmit" class="form">
        <div class="field">
          <label>Nouveau mot de passe</label>
          <input type="password" v-model="newPassword" required placeholder="••••••••" />
        </div>
        <div class="password-rules">
          <div
            v-for="rule in passwordRules"
            :key="rule.label"
            :class="['rule', rule.test(newPassword) ? 'valid' : 'invalid']"
          >
            <span class="rule-icon">{{ rule.test(newPassword) ? '✓' : '✗' }}</span>
            {{ rule.label }}
          </div>
        </div>
        <div class="field">
          <label>Confirmer le mot de passe</label>
          <input type="password" v-model="confirmNewPassword" required placeholder="••••••••" />
        </div>
        <p v-if="error" class="msg-error">{{ error }}</p>
        <p v-if="success" class="msg-success">{{ success }}</p>
        <button type="submit" class="btn-submit" :disabled="!isPasswordValid(newPassword)">
          Mettre à jour le mot de passe
        </button>
      </form>

      <!-- Formulaire 3 : inscription -->
      <form v-else @submit.prevent="register" class="form">
        <div class="field">
          <label>Nom</label>
          <input type="text" v-model="username" required placeholder="Votre nom" />
        </div>
        <div class="field">
          <label>Email</label>
          <input type="email" v-model="email" required placeholder="exemple@email.com" />
        </div>
        <div class="field">
          <label>Mot de passe</label>
          <input type="password" v-model="password" required placeholder="••••••••" />
        </div>
        <div class="password-rules">
          <div
            v-for="rule in passwordRules"
            :key="rule.label"
            :class="['rule', rule.test(password) ? 'valid' : 'invalid']"
          >
            <span class="rule-icon">{{ rule.test(password) ? '✓' : '✗' }}</span>
            {{ rule.label }}
          </div>
        </div>
        <div class="field">
          <label>Confirmer le mot de passe</label>
          <input type="password" v-model="confirmPassword" required placeholder="••••••••" />
        </div>
        <p v-if="error" class="msg-error">{{ error }}</p>
        <p v-if="success" class="msg-success">{{ success }}</p>
        <button type="submit" class="btn-submit" :disabled="!isPasswordValid(password)">
          S'inscrire
        </button>
      </form>

      <div class="card-footer">
        <router-link :to="{ name: 'LandingPage' }" class="back-link">
          ← Retour à l'accueil
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import axios from '@/axios'

const props = withDefaults(defineProps<{
  passwordReset?: boolean
  resetPassword?: boolean
}>(), {
  passwordReset: false,
  resetPassword: false,
})

const router    = useRouter()
const route     = useRoute()
const authStore = useAuthStore()

// Form fields
const username           = ref('')
const email              = ref('')
const password           = ref('')
const confirmPassword    = ref('')
const newPassword        = ref('')
const confirmNewPassword = ref('')
const success            = ref('')
const error              = ref('')
const emailSent          = ref(false)

// ── Règles de mot de passe ──
const passwordRules = [
  { test: (p: string) => p.length >= 8,            label: '8 caractères minimum' },
  { test: (p: string) => /[A-Z]/.test(p),          label: 'Une majuscule' },
  { test: (p: string) => /[0-9]/.test(p),          label: 'Un chiffre' },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p),  label: 'Un symbole (!@#...)' },
]

const isPasswordValid = (p: string) => passwordRules.every(r => r.test(p))

// ── Header dynamique ──
const headerTag = computed(() => {
  if (props.passwordReset) return '🔑 Récupération'
  if (props.resetPassword) return '🔒 Sécurité'
  return '👋 Inscription'
})
const headerTitle = computed(() => {
  if (props.passwordReset) return 'Mot de passe oublié ?'
  if (props.resetPassword) return 'Nouveau mot de passe'
  return 'Créer un compte'
})
const headerSub = computed(() => {
  if (props.passwordReset) return 'Entrez votre email pour recevoir un lien de réinitialisation.'
  if (props.resetPassword) return 'Choisissez un nouveau mot de passe sécurisé.'
  return 'Rejoignez Interbudo Pronos et commencez à pronostiquer !'
})

// ── Actions ──
const register = async () => {
  try {
    if (!isPasswordValid(password.value)) {
      error.value = 'Le mot de passe ne respecte pas les règles de sécurité.'
      return
    }
    if (password.value !== confirmPassword.value) {
      error.value = 'Les mots de passe ne correspondent pas.'
      return
    }
    const response = await axios.post('/api/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value,
    })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      authStore.login(username.value)
      router.push('/')
    } else {
      error.value = "Erreur lors de l'inscription."
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? 'Erreur lors de la tentative, veuillez réessayer.'
  }
}

const requestPasswordReset = async () => {
  try {
    await axios.post('/api/auth/request-password-reset', { email: email.value })
    emailSent.value = true
    error.value = ''
  } catch {
    error.value = 'Erreur lors de la tentative, veuillez réessayer.'
  }
}

const resetPasswordSubmit = async () => {
  try {
    if (!isPasswordValid(newPassword.value)) {
      error.value = 'Le mot de passe ne respecte pas les règles de sécurité.'
      return
    }
    if (newPassword.value !== confirmNewPassword.value) {
      error.value = 'Les mots de passe ne correspondent pas.'
      return
    }
    const response = await axios.post('/api/auth/reset-password', {
      token: route.query.token,
      newPassword: newPassword.value,
    })
    success.value = response.data.message
    error.value = ''
    setTimeout(() => router.push('/'), 2000)
  } catch {
    error.value = 'Erreur lors de la réinitialisation du mot de passe.'
  }
}
</script>

<style scoped>
/* ── PAGE ── */
.register-page {
  min-height: 100vh;
  background: linear-gradient(160deg, #f8faff 0%, #eef3fd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
  width: 100%;
}

/* ── CARD ── */
.register-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(45, 80, 142, 0.08);
  animation: fadeInUp 0.5s ease both;
}

/* ── HEADER ── */
.card-header {
  text-align: center;
  margin-bottom: 2rem;
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
  margin-bottom: 1rem;
}
.card-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e3461;
  margin-bottom: 0.5rem;
}
.card-sub {
  font-size: 0.88rem;
  color: #718096;
  line-height: 1.5;
}

/* ── FORM ── */
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.field label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.field input {
  background: rgba(45, 80, 142, 0.04);
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.7rem 1rem;
  font-size: 0.95rem;
  color: #1e3461;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}
.field input:focus {
  border-color: #2d508e;
  box-shadow: 0 0 0 3px rgba(45, 80, 142, 0.1);
}
.field input::placeholder { color: #a0aec0; }

/* ── RÈGLES MOT DE PASSE ── */
.password-rules {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0.75rem 1rem;
  background: rgba(45, 80, 142, 0.03);
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  margin-top: -0.25rem;
}
.rule {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: color 0.2s ease;
}
.rule-icon {
  font-size: 0.75rem;
  font-weight: 700;
  width: 16px;
  text-align: center;
}
.rule.valid  { color: #16a34a; }
.rule.invalid { color: #94a3b8; }

/* ── MESSAGES ── */
.msg-error {
  font-size: 0.85rem;
  font-weight: 600;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  text-align: center;
}
.msg-success {
  font-size: 0.85rem;
  font-weight: 600;
  color: #166534;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  text-align: center;
}

/* ── BUTTON ── */
.btn-submit {
  margin-top: 0.5rem;
  background: #2d508e;
  color: white;
  font-weight: 700;
  font-size: 0.92rem;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
  width: 100%;
}
.btn-submit:hover   { background: #1e3461; transform: translateY(-1px); }
.btn-submit:active  { transform: translateY(0); }
.btn-submit:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  transform: none;
}

/* ── FOOTER ── */
.card-footer {
  margin-top: 1.5rem;
  text-align: center;
}
.back-link {
  font-size: 0.85rem;
  color: #718096;
  text-decoration: none;
  transition: color 0.2s ease;
}
.back-link:hover { color: #2d508e; }

/* ── ANIMATION ── */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
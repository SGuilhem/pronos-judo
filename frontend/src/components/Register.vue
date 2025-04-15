<template>
  <!-- Mobile -->
  <div
    v-if="isMobile"
    class="bg-gray-200 min-h-screen flex items-center justify-center"
  >
    <div
      class="register-container bg-gray-200 w-full min-h-screen md:bg-white md:max-w-[400px] md:rounded-lg md:shadow-lg px-10 py-10"
    >
      <h1 v-if="passwordReset" class="text-2xl lg:mt-0 mt-8 pb-4">
        Réinitialisation du mot de passe
      </h1>
      <h1 v-else-if="resetPassword" class="text-2xl lg:mt-0 mt-8 pb-4">
        Définir un nouveau mot de passe
      </h1>
      <h1 v-else class="text-2xl lg:mt-0 mt-8 pb-4">Créer un compte</h1>
      <form v-if="passwordReset" @submit.prevent="requestPasswordReset">
        <div class="pb-2">
          <label for="email" class="text-xl">Votre Email:</label>
          <input
            type="email"
            class="log-input text-black px-2 self-center mt-2 mb-4 text-center"
            v-model="email"
            required
          />
        </div>
        <p v-if="error" class="error font-bold text-red-600 pb-2">
          {{ error }}
        </p>
        <button
          type="submit"
          class="border-2 custom-bg-blue text-white font-bold border-slate-400 rounded-md transition-transform duration-200 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 px-4 py-2"
        >
          Envoyer le mail de réinitialisation
        </button>
        <div v-if="emailSent" class="pb-4 mt-6 font-bold text-green-500">
          Un mail de réinitialisation de mot de passe vous a été envoyé
        </div>
      </form>

      <form v-else-if="resetPassword" @submit.prevent="resetPasswordSubmit">
        <div class="pb-2">
          <label for="newPassword" class="text-xl">Nouveau mot de passe:</label>
          <input
            type="password"
            id="newPassword"
            v-model="newPassword"
            required
            class="log-input text-black px-2 self-center mt-2 mb-4 text-center"
          />
        </div>
        <div class="pb-2">
          <label for="newPassword" class="text-xl">Confirmer le mot de passe:</label>
          <input
          type="password"
      id="confirmNewPassword"
      v-model="confirmNewPassword"
      required
            class="log-input text-black px-2 self-center mt-2 mb-4 text-center"
          />
        </div>
        <button
          type="submit"
          class="border-2 custom-bg-blue text-white font-bold border-slate-400 rounded-md transition-transform duration-200 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 px-4 py-2"
        >
          Mettre à jour le mot de passe
        </button>
        <p v-if="error" class="error mt-4">{{ error }}</p>
        <p v-if="success" class="success mt-4 font-bold text-green-500">
          {{ success }}
        </p>
      </form>

      <form v-else @submit.prevent="register">
        <label class="text-xl font-bold pb-10">Nom:</label>
        <input
          class="text-center mt-2 mb-4"
          type="text"
          v-model="username"
          required
        />

        <label class="text-xl font-bold pb-10">Email:</label>
        <input
          class="text-center mt-2 mb-4"
          type="email"
          v-model="email"
          required
        />

        <label class="text-xl font-bold pb-10">Mot de passe:</label>
        <input
          class="text-center mt-2 mb-4"
          type="password"
          v-model="password"
          required
        />
        <label class="text-xl font-bold pb-10"
          >Confirmer le mot de passe:</label
        >
        <input
          class="text-center mt-2 mb-4"
          type="password"
          v-model="confirmPassword"
          required
        />

        <p v-if="error" class="error font-bold pb-4">{{ error }}</p>
        <p v-if="success" class="success pb-4 font-bold text-green-500">
          {{ success }}
        </p>
        <button class="border-2 bg-blue-500 text-slate-800 font-bold border-slate-400 rounded-md transition-transform duration-200 hover:bg-white hover:text-blue-500 hover:scale-105 active:scale-95 px-4 py-2" type="submit">
          S'inscrire
        </button>
      </form>
    </div>
  </div>

  <!-- Desktop -->
  <div
    v-if="!isMobile"
    class="w-full min-h-screen flex items-center justify-center text-center"
  >
    <div class="register-container bg-gray-200 w-full px-10 py-10">
      <h1 v-if="passwordReset" class="text-2xl pb-4">
        Réinitialisation du mot de passe
      </h1>
      <h1 v-else-if="resetPassword" class="text-2xl pb-4">
        Définir un nouveau mot de passe
      </h1>
      <h1 v-else class="text-2xl pb-4">Créer un compte</h1>

      <form v-if="passwordReset" @submit.prevent="requestPasswordReset">
        <div class="pb-2 flex flex-col">
          <label for="email" class="mb-2 text-xl">Votre Email:</label>
          <input
            type="email"
            class="log-input text-black px-2 self-center mt-2 mb-4 text-center"
            v-model="email"
            required
          />
        </div>
        <p v-if="error" class="error font-bold text-red-600 pb-2">
          {{ error }}
        </p>
        <button
          type="submit"
          class="border-2 custom-bg-blue text-white font-bold border-slate-400 rounded-md transition-transform duration-200 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 px-4 py-2"
        >
          Envoyer le mail de réinitialisation
        </button>
        <div v-if="emailSent" class="pb-4 mt-6 font-bold text-green-500">
          Un mail de réinitialisation de mot de passe vous a été envoyé
        </div>
      </form>

      <form v-else-if="resetPassword" @submit.prevent="resetPasswordSubmit">
  <div class="pb-2 flex flex-col">
    <label for="newPassword" class="mb-2 font-bold text-xl">Nouveau mot de passe:</label>
    <input
      type="password"
      id="newPassword"
      v-model="newPassword"
      required
      class="log-input text-black px-2 self-center mt-2 mb-4 text-center"
    />
  </div>
  <div class="pb-2 flex flex-col">
    <label for="confirmNewPassword" class="mb-2 font-bold text-xl">Confirmer le mot de passe:</label>
    <input
      type="password"
      id="confirmNewPassword"
      v-model="confirmNewPassword"
      required
      class="log-input text-black px-2 self-center mt-2 mb-4 text-center"
    />
  </div>
  <button
    type="submit"
    class="border-2 custom-bg-blue text-white font-bold border-slate-400 rounded-md transition-transform duration-200 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 px-4 py-2"
  >
    Mettre à jour le mot de passe
  </button>
  <p v-if="error" class="error mt-4">{{ error }}</p>
  <p v-if="success" class="success mt-4 font-bold text-green-500">
    {{ success }}
  </p>
</form>

      <form v-else @submit.prevent="register">
        <label class="text-xl font-bold pb-10">Nom:</label>
        <input
          class="text-center mt-2 mb-4"
          type="text"
          v-model="username"
          required
        />

        <label class="text-xl font-bold pb-10">Email:</label>
        <input
          class="text-center mt-2 mb-4"
          type="email"
          v-model="email"
          required
        />

        <label class="text-xl font-bold pb-10">Mot de passe:</label>
        <input
          class="text-center mt-2 mb-4"
          type="password"
          v-model="password"
          required
        />
        <label class="text-xl font-bold pb-10"
          >Confirmer le mot de passe:</label
        >
        <input
          class="text-center mt-2 mb-4"
          type="password"
          v-model="confirmPassword"
          required
        />

        <p v-if="error" class="error font-bold pb-4">{{ error }}</p>
        <p v-if="success" class="success pb-4 font-bold text-green-500">
          {{ success }}
        </p>
        <button class="border-2 custom-bg-blue text-white font-bold border-slate-400 rounded-md transition-transform duration-200 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 px-4 py-2" type="submit">
          S'inscrire
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  props: {
    passwordReset: {
      type: Boolean,
      default: false,
    },
    resetPassword: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isMobile: null,
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      success: "",
      error: "",
      userLogged: false,
      userName: "",
      emailSent: null,
    };
  },
  mounted() {
    this.isMobile = window.innerWidth <= 768;
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    async register() {
  try {
    if (this.password !== this.confirmPassword) {
      this.error = "Les mots de passe ne correspondent pas.";
      this.success = "";
      return;
    }

    const response = await this.$axios.post("/api/auth/register", {
      username: this.username,
      email: this.email,
      password: this.password,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);

      this.$store.dispatch("login", this.username);

      this.$emit("user-logged-in", this.username);

      this.$router.push("/");
    } else {
      this.error = "Erreur lors de l'inscription.";
      this.success = "";
    }
  } catch (err) {
    console.error("Erreur dans la méthode register :", err);
    if (err.response && err.response.data && err.response.data.message) {
      this.error = err.response.data.message;
    } else {
      this.error = "Erreur lors de la tentative, veuillez réessayer plus tard.";
    }
    this.success = "";
  }
},
    async requestPasswordReset() {
      try {
        const response = await this.$axios.post(
          "/api/auth/request-password-reset",
          {
            email: this.email,
          }
        );
        this.success = "Un email de réinitialisation a été envoyé.";
        this.error = "";
        this.emailSent = true;
      } catch (err) {
        console.error(err);
        this.error = "Erreur lors de la tentative, veuillez réessayer.";
        this.success = "";
      }
    },

    async resetPasswordSubmit() {
  try {
    if (this.newPassword !== this.confirmNewPassword) {
      this.error = "Les mots de passe ne correspondent pas.";
      this.success = "";
      return;
    }

    const token = this.$route.query.token;
    const response = await this.$axios.post("/api/auth/reset-password", {
      token,
      newPassword: this.newPassword,
    });
    this.success = response.data.message;
    this.error = "";
    setTimeout(() => {
      this.$router.push("/");
    }, 2000);
  } catch (err) {
    console.error(err);
    this.error = "Erreur lors de la réinitialisation du mot de passe.";
    this.success = "";
  }
},
  },
};
</script>

<style>
.register-container {
  max-width: 400px;
  margin: auto;
  text-align: center;
}
input {
  display: block;
  width: 100%;
}
button {
  padding: 10px;
}
.error {
  color: red;
}
.custom-bg-blue {
  background-color: #2d508e;
}
</style>

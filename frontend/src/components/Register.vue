<template>
  <!-- Mobile -->
  <div
    v-if="isMobile"
    class="bg-gray-200 min-h-screen flex items-center justify-center"
  >
    <div
      class="register-container bg-gray-200 w-full min-h-screen md:bg-white md:max-w-[400px] md:rounded-lg md:shadow-lg px-10 py-10"
    >
      <h2 class="text-2xl pb-4">Créer un compte</h2>
      <form @submit.prevent="register">
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

        <p v-if="error" class="error font-bold pb-4">{{ error }}</p>
        <p v-if="success" class="success pb-4 font-bold text-green-500">
          {{ success }}
        </p>
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded-md"
          type="submit"
        >
          S'inscrire
        </button>
      </form>
    </div>
  </div>

  <!-- Desktop -->
  <div 
    v-if="!isMobile" class="w-full min-h-screen flex items-center justify-center text-center">
  <div
    class="register-container bg-gray-200 w-full px-10 py-10"
  >
    <h2 class="text-2xl pb-4">Créer un compte</h2>
    <form @submit.prevent="register">
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

      <p v-if="error" class="error font-bold pb-4">{{ error }}</p>
      <p v-if="success" class="success pb-4 font-bold text-green-500">
        {{ success }}
      </p>
      <button class="bg-blue-500" type="submit">S'inscrire</button>
    </form>
  </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      isMobile: null,
      username: "",
      email: "",
      password: "",
      success: "",
      error: "",
    };
  },
  mounted() {
    this.isMobile = window.innerWidth <= 768;
    window.addEventListener("resize", this.handleResize);
  },
  methods: {
    async register() {
      try {
        const response = await this.$axios.post("/api/auth/register", {
          username: this.username,
          email: this.email,
          password: this.password,
        });
        if (response.status === 201) {
          this.success = response.data.message;
          this.error = "";
          setTimeout(() => {
            this.$router.push("/");
          }, 2000);
        } else {
          this.error = response.data.message || "Erreur lors de l’inscription";
          this.success = "";
        }
      } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.message) {
          this.error = err.response.data.message;
        } else {
          this.error = "Erreur lors de la tentative, réessayer plus tard.";
        }

        this.success = "";
      }
    },
    handleResize() {
      const newIsMobile = window.innerWidth <= 768;
      if (newIsMobile !== this.isMobile) {
        this.isMobile = newIsMobile;
      }
    },
  },
};
</script>

<style scoped>
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
</style>

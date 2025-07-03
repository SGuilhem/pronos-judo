<template>
  <!-- Responsive Hamburger Menu -->
  <div class="hamburger custom-bg-blue text-white z-10">
    <button @click="toggleMenu">
      <img
        src="/svg/hamburger.svg"
        alt="Menu"
        class="w-16 h-16 p-3 align-left"
      />
    </button>
  </div>

  <!-- Mobile -->
  <div
    v-show="isMobile && toggleMobileMenu"
    class="custom-bg-blue text-white side-menu-mobile"
  >
    <button
      @click="closeMenu"
      class="absolute p-4 right-4 z-50 text-white text-xl"
    >
      <img
        src="/svg/cross-close.svg"
        alt="Menu"
        class="w-12 h-12 text-right"
      />
    </button>
    <div class="align-center mobile-container">
      <img src="/InterbudoLogo.png" class="m-auto size-48 py-4" />
      <div v-if="userLogged" class="text-2xl pt-4">
        <div>Bienvenue</div>
        <div v-if="userName" class="text-3xl font-bold">{{ userName }}</div>
      </div>
      <div v-else class="login-container m-auto text-center">
        <form @submit.prevent="login">
          <div class="pb-2 flex flex-col">
            <label for="email">Email:</label>
            <input
              type="email"
              class="log-input text-black px-2 self-center"
              v-model="email"
              required
            />
          </div>
          <div class="pb-1 flex flex-col">
            <label for="password">Password:</label>
            <input
              type="password"
              class="log-input text-black px-2 self-center"
              v-model="password"
              required
            />
          </div>
          <div
            class="pb-6 underline cursor-pointer"
            @click="forgottenPassword()"
          >
            Mot de passe oublié?
          </div>
          <p v-if="error" class="error font-bold text-red-600 pb-6">
            {{ error }}
          </p>
          <button
            type="submit"
            class="border-2 bg-white text-slate-800 font-bold border-slate-400 rounded-md transition-transform duration-200 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 px-4 py-2"
          >
            Connexion
          </button>
        </form>
      </div>
      <ul
        v-if="userLogged"
        class="text-center flex flex-col font-semibold pt-8 items-center"
      >
        <li
          class="lg:w-full border-2 border-gray-200 bg-blue-500 text-white p-4 w-3/4 rounded-md text-center mt-2 transition-transform duration-200 hover:bg-blue-700 hover:scale-105 active:scale-95 cursor-pointer"
          v-for="link in links"
          v-bind:key="link"
          :class="{ 'underline-gradient': selectedLink === link }"
          @click="handleClick(link)"
        >
          <span class="underline-text">{{ link }}</span>
        </li>
      </ul>
      <button
        v-if="userLogged"
        type="submit"
        class="my-4 border-2 bg-white text-slate-800 font-bold border-slate-400 rounded-md transition-transform duration-200 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 px-4 py-2"
        @click="logout"
      >
        Déconnexion
      </button>
    </div>
    <div v-if="!userLogged" class="pt-6 text-center  mb-6">
      <p>Vous n'avez pas de compte ?</p>
      <router-link :to="{ name: 'register' }">
        <button
          @click="closeMenu"
          class="mt-2 border-2 bg-white text-slate-800 font-bold border-slate-400 rounded-md transition-transform duration-200 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 px-4 py-2"
        >
          Créer un compte
        </button>
      </router-link>
    </div>
  </div>

  <!-- Desktop -->
  <div
    v-show="!isMobile && !toggleMobileMenu"
    class="custom-bg-blue text-white side-menu-desktop"
  >
    <div class="align-center desktop-container">
      <img src="/InterbudoLogo.png" class="m-auto size-48 py-4" />
      <div v-if="userLogged" class="text-xl pt-4">
        <div>Bienvenue</div>
        <div v-if="userName" class="text-2xl font-bold">{{ userName }}</div>
      </div>
      <div v-if="!userLogged" class="login-container m-auto text-center">
        <form @submit.prevent="login">
          <div class="pb-2 flex flex-col items-center">
            <label for="email">Email:</label>
            <input
              type="email"
              class="log-input text-black px-2"
              v-model="email"
              required
            />
          </div>
          <div class="pb-1 flex flex-col items-center">
            <label for="password">Password:</label>
            <input
              type="password"
              class="log-input text-black px-2"
              v-model="password"
              required
            />
          </div>
          <div
            class="mt-4 pb-6 underline text-md cursor-pointer text-center"
            @click="forgottenPassword()"
          >
            Mot de passe oublié?
          </div>
          <p v-if="error" class="error font-bold text-red-600 pb-6">
            {{ error }}
          </p>
          <button
            type="submit"
            class="border-2 bg-white text-slate-800 font-bold border-slate-400 rounded-md transition-transform duration-200 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 px-4 py-2"
          >
            Connexion
          </button>
        </form>
      </div>
      <ul
        v-if="userLogged"
        class="text-center flex flex-col font-semibold pt-8"
      >
        <li
          class="lg:w-full border-2 border-gray-200 bg-blue-500 text-white p-4 w-3/4 rounded-md text-center mt-2 transition-transform duration-200 hover:bg-blue-700 hover:scale-105 active:scale-95 cursor-pointer"
          v-for="link in links"
          v-bind:key="link"
          :class="{ 'underline-gradient': selectedLink === link }"
          @click="handleClick(link)"
        >
          <span class="underline-text">{{ link }}</span>
        </li>
      </ul>
      <button
        v-if="userLogged"
        type="submit"
        class="mt-4 border-2 bg-white text-slate-800 font-bold border-slate-400 rounded-md transition-transform duration-200 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 px-4 py-2"
        @click="logout"
      >
        Déconnexion
      </button>
    </div>

    <div v-if="!userLogged" class="mt-4 pb-6 text-md text-center">
      <p>Vous n'avez pas de compte ?</p>
      <router-link :to="{ name: 'register' }">
        <button
          class="mt-4 border-2 bg-white text-slate-800 font-bold border-slate-400 rounded-md transition-transform duration-200 hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95 px-4 py-2"
        >
          Créer un compte
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideMenu",
  props: {
    links: {
      type: Array,
      required: true,
    },
    linkRoutes: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.checkLogin();
    this.isMobile = this.checkIfMobile();
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  data() {
    return {
      isMobile: null,
      toggleMobileMenu: false,
      selectedLink: null,
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    handleClick(link) {
      this.selectedLink = link;
      this.redirectTo(link);
    },
    redirectTo(link) {
      this.toggleMobileMenu = false;
      const path = this.linkRoutes[link];
      if (path) {
        if (this.$router) {
          this.$router.push({ path });
        } else {
          window.location.href = path;
        }
      } else {
        console.error(`Aucune route trouvée pour le lien: ${link}`);
      }
    },
    toggleMenu() {
      this.toggleMobileMenu = !this.toggleMobileMenu;
    },
    closeMenu() {
      this.toggleMobileMenu = false;
    },
    async login() {
      try {
        const response = await this.$axios.post("/api/auth/login", {
          email: this.email,
          password: this.password,
        });

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);

          const decoded = JSON.parse(atob(response.data.token.split(".")[1]));
          localStorage.setItem("userName", decoded.username);

          this.$store.dispatch("login", decoded.username);

          this.$router.push("/");
        } else {
          this.error = "Informations invalides";
        }
      } catch (err) {
        console.error(err);
        this.error = "Erreur lors de la tentative, réessayer plus tard.";
      }
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");

      this.$store.dispatch("logout");

      this.selectedLink = null;

      this.$router.push("/");
    },
    checkLogin() {
      const token = localStorage.getItem("token");
      const storedUserName = localStorage.getItem("userName");

      if (token && storedUserName) {
        this.$store.dispatch("login", storedUserName);
      }
    },
    forgottenPassword() {
      this.$router.push({ name: "register", query: { passwordReset: "true" } });
      if (this.isMobile) {
        this.toggleMobileMenu = false;
      }
    },
    handleResize() {
      const newIsMobile = this.checkIfMobile();
      if (newIsMobile !== this.isMobile) {
        this.isMobile = newIsMobile;
      }
    },
    checkIfMobile() {
      return window.innerWidth <= 1024;
    },
  },
  computed: {
    userLogged() {
      return this.$store.state.auth.userLogged;
    },
    userName() {
      return this.$store.state.auth.userName;
    },
  },
};
</script>

<style>
.hamburger {
  text-align: left;
  display: none;
}

@media screen and (max-width: 1024px) {
  .hamburger {
    display: block;
    position: sticky;
    top: 0;
  }
  .side-menu-mobile {
    display: block;
  }

  .side-menu-desktop {
    display: none;
  }
}

.side-menu-desktop {
  display:block;
  position: static;
  min-height: 100vh;
  width: 15%;
  color: white;
  text-align: center;
  padding: 20px;
}

@media screen and (min-width: 1200px) and (max-width: 1680px) {
  .side-menu-desktop {
    width: 20%;
  }
}
@media screen and (min-width: 1024px) and (max-width: 1200px) {
  .side-menu-desktop {
    width: 30%;
  }
}

.side-menu-mobile {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  color: white;
  text-align: center;
  padding: 0;
  z-index: 100;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.desktop-container {
  margin-top: 15%;
}
.mobile-container {
  margin-top: 15%;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

form {
  width: 100%;
  max-width: 320px;
}

.log-input {
  width: 100%;
  max-width: 320px;
  min-width: 240px;
  box-sizing: border-box;
}

.underline-gradient {
  position: relative;
}

.underline-gradient .underline-text {
  display: inline-block;
  position: relative;
}

.underline-gradient .underline-text::after {
  content: "";
  position: absolute;
  left: -7px;
  bottom: -3px;
  width: calc(100% + 14px);
  height: 3px;
  background: white;
  animation: underlineFill 1s ease-in-out forwards;
}

@keyframes underlineFill {
  from {
    width: 0;
  }
  to {
    width: calc(100% + 14px);
  }
}
</style>

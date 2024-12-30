<template>
  <!-- Responsive Hamburger Menu -->
  <div class="hamburger w-100 bg-blue-500 text-white z-10">
    <button @click="toggleMenu">
      <img src="@/static/svg/hamburger.svg" alt="Menu" class="w-16 h-16 p-3 align-left">
    </button>
  </div>

  <!-- Mobile -->
  <div v-if="toggleMobileMenu" class="w-100 bg-blue-500 text-white side-menu-mobile">
    <button @click="closeMenu" class="absolute top-4 right-4 z-50 text-white text-xl">
      <img src="@/static/svg/cross-close.svg" alt="Menu" class="w-12 h-12 text-right">
    </button>
    <div class="align-center container">
      <img src="./../static/InterbudoLogo.png" class="m-auto size-48 py-4">
      <div v-if="userLogged" class="pt-4">
        <div>Bienvenue{{ userName }}</div>
        <div class="font-bold"> TEST {{ userName }}</div>
      </div>
      <div v-if="!userLogged" class="login-container m-auto">
        <form @submit.prevent="login">
          <div class="pb-2 flex flex-col">
            <label for="email">Email</label>
            <input type="email" class="log-input text-black px-2 self-center" v-model="email" required />
          </div>
          <div class="pb-4 flex flex-col">
            <label for="password">Password</label>
            <input type="password" class="log-input text-black px-2 self-center" v-model="password" required />
          </div>
          <p v-if="error" class="error text-red-600 pb-2">{{ error }}</p>
          <button type="submit" class="bg-white text-black border border-gray-300 px-4 py-2 text-sm uppercase shadow hover:bg-gray-100">Connexion</button>
        </form>
      </div>
      <ul v-if="userLogged" class="text-center flex flex-col font-semibold pt-8">
        <li class="inline hover:text-gray-200 cell cursor-pointer py-4" v-for="link in links" v-bind:key="link"
          @click="redirectTo(link)">{{ link }}</li>
      </ul>
      <button v-if="userLogged" type="submit" class="bg-white text-black border border-gray-300 px-4 py-2 text-sm uppercase shadow hover:bg-gray-100 mt-8" @click="logout">Déconnexion</button>
    </div>
    <div v-if="!userLogged" class="pt-6">
      <p>Vous n'avez pas de compte ?</p>
      <router-link to="/register-page">
        <button class="bg-white text-black border border-gray-300 px-4 py-2 text-sm uppercase shadow hover:bg-gray-100 mt-2">Créer un compte</button>
      </router-link>
    </div>
  </div>
  <!-- Desktop -->
  <div v-if="!isMobile" class="w-100 bg-blue-500 text-white side-menu-desktop">
    <div class="align-center container">
      <img src="./../static/InterbudoLogo.png" class="m-auto size-48 py-4">
      <div v-if="userLogged" class="pt-4">
        <div>Bienvenue{{ userName }}</div>
        <div class="font-bold"> TEST {{ userName }}</div>
      </div>
      <div v-if="!userLogged" class="login-container m-auto">
        <form @submit.prevent="login">
          <div class="pb-2 flex flex-col items-center">
            <label for="email">Email</label>
            <input type="email" class="log-input text-black px-2" v-model="email" required />
          </div>
          <div class="pb-4 flex flex-col items-center">
            <label for="password">Password</label>
            <input type="password" class="log-input text-black px-2" v-model="password" required />
          </div>
          <p v-if="error" class="error text-red-600 pb-2">{{ error }}</p>
          <button type="submit" @click="login()" class="bg-white text-black border border-gray-300 px-4 py-2 text-sm uppercase shadow hover:bg-gray-100">Connexion</button>
        </form>
      </div>
      <ul v-if="userLogged" class="text-center flex flex-col font-semibold pt-8">
        <li class="inline hover:text-gray-200 cell cursor-pointer py-4 underline-offset-4" v-for="link in links" v-bind:key="link"
          @click="selectLink(link)"
          :class="{ underline: selectedLink === link }"
          >{{ link }}</li>
      </ul>
      <button v-if="userLogged" type="submit" class="bg-white text-black border border-gray-300 px-4 py-2 text-sm uppercase shadow hover:bg-gray-100 mt-8" @click="logout">Déconnexion</button>
    </div>

    <div v-if="!userLogged" class="pt-6">
      <p>Vous n'avez pas de compte ?</p>
      <router-link to="/register-page">
        <button class="bg-white text-black border border-gray-300 px-4 py-2 text-sm uppercase shadow hover:bg-gray-100 mt-2">Créer un compte</button>
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
    this.isMobile = window.innerWidth <= 768;
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  data() {
    return {
      isMobile: null,
      toggleMobileMenu: false,
      email: '',
      password: '',
      error: '',
      userLogged: true,
      selectedLink: null,
    };
  },
  methods: {
    selectLink(link) {
      this.selectedLink = link;
      this.redirectTo(link);
    },
    redirectTo(link) {
      this.toggleMobileMenu = false;
      const path = this.linkRoutes[link];
      if (path) {
        if (this.$router) {
          this.$router.push({ path });
          console.log("path: ", path)
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
      this.toggleMobileMenu = false
    },
    async login() {
      try {
        const response = await this.$axios.post('/api/login', {
          email: this.email,
          password: this.password,
        });

        if (response.data.token) {
          this.$store.dispatch('login', { token: response.data.token });
          this.$router.push('/'); 
        } else {
          this.error = 'Informations invalides';
        }
      } catch (err) {
        console.error(err);
        this.error = 'Erreur lors de la tentative, réessayer plus tard.';
      }
    },
    login() {
      if (!this.userLogged) {
        this.userLogged = true
      }
    },
    logout() {
      if (this.userLogged) {
        this.userLogged = false
        this.$router.push('/home')
      }
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 768;
    },
  },
};
</script>

<style scoped>
.hamburger {
  display: none;
}

@media screen and (max-width: 768px) {
  .hamburger {
    text-align: left;
    display: inline;
  }
}

.side-menu-desktop {
    position: static;
    height: 100vh;
    width: 350px;
    color: white;
    text-align: center;
    padding: 20px;
}

.side-menu-mobile {
  @media screen and (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    color: white;
    text-align: center;
    padding: 0;
    z-index: 100;
  }
}

.container {
  margin-top: 25%;
  @media screen and (max-width: 768px)  {
    margin-top: 15%;
  }
}

.login-container input {
  @media screen and (max-width: 768px)  {
      min-width: 280px;
  }
}

.cell {
  width: 100%;
  border: rgb(191 219 254) 1px solid;
  background-color: rgb(59 130 246);
}
.log-input {
  width: 80%;
  @media screen and (max-width: 768px) {
    width: 60%
}
}
</style>

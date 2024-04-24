<template>
  <!-- <NavBar @show-menu="ShowMenu" v-bind:links="['Accueil', 'Compétition en cours', 'Classement en cours', 'Archives']" /> -->
  <div class="flex flex-col lg:flex-row">
    <SideMenu v-bind:links="['Accueil', 'Compétition en cours', 'Classement en cours', 'Archives']" />
    <LandingPage />
  </div>
  <AppFooter />
</template>

<script>
import AppFooter from './components/AppFooter.vue'
/* import NavBar from './components/NavBar.vue' */
import LandingPage from './components/LandingPage.vue'
import SideMenu from './components/SideMenu.vue'

export default {
  name: 'App',
  components: {
    AppFooter,
    /* NavBar, */
    LandingPage,
    SideMenu,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}
</style>

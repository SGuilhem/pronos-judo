<template>
    <NavBar v-bind:links="['| Accueil |', '| Compétition en cours |', '| Classement en cours |', '| Archives |']"/>
    <AppFooter/>
  </template>
  
  <script>
  import AppFooter from './../components/AppFooter.vue'
  import NavBar from './../components/NavBar.vue'
  
  export default {
    name: 'LandingPage',
    components: {
      AppFooter,
      NavBar,
    }
  }
  </script>
  
  <style>
/*   #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  } */
  </style>
  
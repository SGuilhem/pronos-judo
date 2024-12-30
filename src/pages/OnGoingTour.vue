<template>
    <NavBar/>
    <AppFooter/>
  </template>
  
  <script>
  import AppFooter from './../components/AppFooter.vue'
  import NavBar from './../components/NavBar.vue'
  
  export default {
    name: 'OnGoingTour',
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
  
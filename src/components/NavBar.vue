<template>
    <ul class="text-center p-4 pr-4 font-semibold bg-gray-100">
        <li class="inline mx-2 text-blue-500 hover:text-blue-400 cursor-pointer" v-for="link in links" v-bind:key="link">{{link}}</li>
    </ul>
  </template>
  
  <script>
  export default {
   name: 'NavBar',
   props: {
      links: [String]
   },
  }
  </script>
  
  <style>
  </style>
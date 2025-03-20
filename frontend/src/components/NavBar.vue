<template>
  <div class="flex hamburger w-100 bg-blue-500 text-white">
    <button @click="toggleMenu">
      <img src="@/static/svg/hamburger.svg" alt="Menu" class="w-16 h-16 p-3 align-left">
    </button>
  </div>
</template>

<script>

export default {
  name: 'NavBar',
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
  methods: {
    toggleMenu() {
      this.$emit('show-menu')
    }
  }
}
</script>

<style>
.hamburger {
  display: none;
  @media screen and (max-width: 768px) {
    text-align: left !important;
    display: inline;
  }
}
</style>
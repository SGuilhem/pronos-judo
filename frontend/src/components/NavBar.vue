<template>
  <div class="flex hamburger w-100 bg-blue-500 text-white">
    <button @click="toggleMenu">
      <img src="@/static/svg/hamburger.svg" alt="Menu" class="w-16 h-16 p-3 align-left" />
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  links: string[]
  linkRoutes: Record<string, string>
}>()

const emit = defineEmits<{ 'show-menu': [] }>()
const toggleMenu = () => emit('show-menu')
</script>

<style scoped>
.hamburger {
  display: none;
  @media screen and (max-width: 768px) {
    text-align: left !important;
    display: inline;
  }
}
</style>
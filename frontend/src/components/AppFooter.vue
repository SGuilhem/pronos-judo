<template>
  <div class="w-full bg-blue-500 text-white footer absolute bottom-0">
    <div class="text-sm">Guilhem S © 2024</div>
  </div>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  color: white;
  text-align: center;
  padding: 10px 0;
}
/* @media screen and (max-width: 768px) {
  .footer {
    position: sticky;
  }
} */
</style>

<template>
  <!-- Responsive Hamburger Menu -->
  <div class="hamburger w-100 bg-blue-500 text-white">
    <button @click="toggleMenu">
      <img src="@/static/svg/hamburger.svg" alt="Menu" class="w-16 h-16 p-3 align-left">
    </button>
  </div>
  <!-- Mobile -->
  <div v-if="toggleMobileMenu" class="w-100 bg-blue-500 text-white side-menu-mobile">
    <div class="align-center container">
      <img src="./../static/InterbudoLogo.png" class="m-auto size-48 py-4">
      <ul class="text-center flex flex-col font-semibold pt-12">
        <li class="inline hover:text-gray-200 cell cursor-pointer py-4" v-for="link in links" v-bind:key="link"
          @click="redirectTo()"> | {{ link }} | </li>
      </ul>
    </div>
  </div>

  <!-- Desktop -->
  <div v-if="!toggleMobileMenu" class="w-100 bg-blue-500 text-white side-menu-desktop">
    <div class="align-center container">
      <img src="./../static/InterbudoLogo.png" class="m-auto size-48 py-4">
      <ul class="text-center flex flex-col font-semibold pt-12">
        <li class="inline hover:text-gray-200 cell cursor-pointer py-4" v-for="link in links" v-bind:key="link"
          @click="redirectTo()"> | {{ link }} | </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideMenu",
  props: {
    links: [String]
  },
  data() {
    return {
      toggleMobileMenu: false,
    };
  },
  methods: {
    redirectTo() {
      this.toggleMobileMenu = false
      console.log("redirect")
    },
    toggleMenu() {
      this.toggleMobileMenu = true
    }
  },
};
</script>

<style>
.hamburger {
  display: none;

  @media screen and (max-width: 768px) {
    text-align: left !important;
    display: inline;
  }
}

.side-menu-desktop {
  @media screen and (min-width: 768px) {
    min-width: 250px;
    min-height: 100%;
    background-color: #d3d3d3;
    color: white;
    text-align: center;

    .container {
      margin-top: 25%;
    }
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
}

.side-menu-mobile {
  @media screen and (max-width: 768px) {
    min-width: 250px;
    min-height: 100%;
    background-color: #d3d3d3;
    color: white;
    text-align: center;
    position: absolute;
    width: 100%;
    padding: 0;

    .container {
      margin-top: 25%;
    }
  }
}

.cell {
  width: 100%;
  border: rgb(191 219 254) 1px solid;
  background-color: rgb(59 130 246);
}
</style>

<template>
  <div class="w-full flex-col text-center px-2">
    <h1
      class="lg:text-5xl text-4xl underline custom-blue font-bold lg:py-16 py-8"
    >
      Interbudo Pronos
    </h1>
    <h4 class="text-2xl text-center lg:w-3/4 lg:px-0 px-6 m-auto lg:pb-4 pb-0 underline">
      Bienvenue sur la page de pronostiques Interbudo!
    </h4>
    <div class="pt-2 pb-8 text-lg lg:w-3/4 lg:px-0 px-8 m-auto">
      <span>
        Depuis quelques années, au club, un petit jeu s’est installé pendant les
        Championnats du Monde de Judo. Avec un groupe d’adultes du cours, on
        s’est pris au jeu des <strong>pronostics quotidiens</strong>, tout au
        long de la semaine de compétition.<br />
        Chaque jour, chacun envoyait son <strong>prono du podium</strong> pour
        les catégories en lice le lendemain. Et selon la justesse des choix, des
        points étaient attribués. À la fin de la semaine, on faisait les
        comptes… Et on désignait notre grand gagnant 🏆 !<br />
      </span>
    </div>
    <div class="text-lg lg:w-3/4 lg:px-0 px-8 m-auto">
      <span>
        Au départ, on utilisait Google Docs et Google Forms. Simple, oui… mais
        pas vraiment optimal pour suivre les scores, voir notre classement en
        direct ou même faire le cumul des points!<br />
        C’est pour ça que ce petit site a vu le jour :
        <strong>
          Automatiser tout ça et rendre l’expérience plus simple pour tout le
          monde!</strong
        >
      </span>
    </div>
    <div class="rules-border lg:w-3/4 w-full m-auto my-8 pb-8 lg:px-0 px-4">
      <h4
        class="text-2xl text-center lg:w-1/2 m-auto lg:pt-8 pt-2 pb-0"
      >
        🎯 Comment ça marche ?
      </h4>
      <div class="pt-2 text-lg m-auto">
        - La veille de chaque journée de compétition, vous serez invités à faire
        vos pronostics pour les catégories du lendemain. <br />
        - Vous pourrez les envoyer jusqu’au début de la journée de competition.
      </div>
      <h4
        class="text-2xl text-center lg:w-1/2 m-auto lg:pt-8 pt-4 pb-0"
      >
        🧮 Barème des points :
      </h4>
      <div class="pt-2 text-lg lg:w-1/2 m-auto">
        <div class="text-lg m-auto">
          - ✅ Un judoka placé à la bonne place : 3 points <br />
          - ✅ Un judoka présent sur le podium, mais mal placé : 1 point <br />
          - ❌ Un judoka hors podium : 0 point <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
};
</script>

<style>
.custom-blue {
  color: #2d508e;
}
.rules-border {
  border: 10px solid #2d508e;
}
</style>

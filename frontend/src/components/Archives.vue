<template>
  <div class="lg:w-full flex-col text-center">
    <h1 class="lg:text-5xl text-4xl underline custom-blue font-bold lg:py-16 py-8">Interbudo Pronos</h1>
    <h4 class="text-2xl text-center lg:w-1/2 lg:px-0 px-6 m-auto lg:pb-6 pb-0">
      Ici seront archivés les précédents pronostiques qui auront eu lieu:
    </h4>
    <div class="text-2xl pt-10 text-left lg:m-20">
      <ul>
      <li v-for="(event, index) in events" :key="event.id" class="event-item">
        <div @click="toggleEvent(index)" class="event-title bold cursor-pointer bg-gray-200 lg:mx-0 mx-5 my-3 py-2 pl-4">
          {{ event.title }}
        </div>
        <div v-if="activeEventIndex === index" class="event-details">
          <div :class="`${isMobile ? '' : 'flex justify-center items-center'}`">
            <table class="lg:w-full w-auto text-left border-collapse border border-gray-300 my-6">
              <thead>
                <tr>
                  <th class="border w-1/8 text-base border-gray-300 px-4 py-2 bg-gray-100">Position</th>
                  <th class="border w-3/8 text-base border-gray-300 px-4 py-2 bg-gray-100">Utilisateur</th>
                  <th class="border w-3/8 text-base border-gray-300 px-4 py-2 bg-gray-100">Points cumulés</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in event.leaderboard" :key="index">
                  <td class="border w-1/8 border-gray-300 px-4 py-2">{{ index + 1 }}</td>
                  <td class="border w-3/8 border-gray-300 px-4 py-2">{{ user.username }}</td>
                  <td class="border w-3/8 border-gray-300 px-4 py-2">{{ user.points }} pts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </li>
    </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Archives",
  data() {
    return {
      events: [
        {
          id: 1,
          title: 'Paris Grand Slam 2024',
          leaderboard: [
            { username: "Alice", points: 120 },
            { username: "Bob", points: 110 },
            { username: "Alex", points: 105 },
            { username: "Diana", points: 100 },
            { username: "Tom", points: 95 },
            { username: "Clara", points: 90 },
            { username: "George", points: 85 },
          ],
        },
        {
          id: 2,
          title: 'Jeux Olympiques 2024',
          leaderboard: [
          { username: "Alice", points: 120 },
          { username: "Bob", points: 110 },
          { username: "Alex", points: 105 },
          { username: "Diana", points: 100 },
          { username: "Tom", points: 95 },
          { username: "Clara", points: 90 },
          { username: "George", points: 85 },
          ],
        },
        {
          id: 3,
          title: 'Championnats du Monde 2024',
          leaderboard: [
          { username: "Alice", points: 120 },
          { username: "Bob", points: 110 },
          { username: "Alex", points: 105 },
          { username: "Diana", points: 100 },
          { username: "Tom", points: 95 },
          { username: "Clara", points: 90 },
          { username: "George", points: 85 },
          ],
        },
        {
          id: 4,
          title: 'Tokyo Grand Slam 2024',
          leaderboard: [
          { username: "Alice", points: 120 },
          { username: "Bob", points: 110 },
          { username: "Alex", points: 105 },
          { username: "Diana", points: 100 },
          { username: "Tom", points: 95 },
          { username: "Clara", points: 90 },
          { username: "George", points: 85 },
          ],
        },
      ],
      activeEventIndex: null,
      isMobile: false,
    };
  },
  methods: {
    toggleEvent(index) {
      this.activeEventIndex = this.activeEventIndex === index ? null : index;
    },
  },
};
</script>

<style>
.event-title {
  border: 1px solid #ccc;
  @media screen and (min-width: 768px) {
    padding: 10px
  }
}
.custom-blue {
  color: #2d508e
}
</style>

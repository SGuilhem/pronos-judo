export default {
    state: {
      userLogged: false,
      userName: "",
    },
    mutations: {
      setUser(state, { userName }) {
        state.userLogged = true;
        state.userName = userName;
      },
      logout(state) {
        state.userLogged = false;
        state.userName = "";
      },
    },
    actions: {
      login({ commit }, userName) {
        commit("setUser", { userName });
      },
      logout({ commit }) {
        commit("logout");
      },
    },
  };
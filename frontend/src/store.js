import { createStore } from "vuex";
import auth from "./store/modules/auth";

export default createStore({
  state: {
    user: null,
  },
  modules: {
    auth,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    logout(state) {
      state.user = null;
    },
  },
  actions: {
    login({ commit }, user) {
      commit("setUser", user);
    },
    logout({ commit }) {
      commit("logout");
    },
  },
});
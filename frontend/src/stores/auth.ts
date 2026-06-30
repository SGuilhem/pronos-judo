import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userLogged: false,
    userName: '',
  }),
  actions: {
    login(userName: string) {
      this.userLogged = true
      this.userName = userName
    },
    logout() {
      this.userLogged = false
      this.userName = ''
    },
  },
})
import { defineStore } from "pinia";
export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: accessToken() || null,
        user: getUser() || null,
    }),
    getters: {
        isLoggedIn: (state) => {
            return !!(state.token) && !!(state.user)
        },
    },
    actions: {
        setToken(token) {
            this.token = token
            setAccessToken(token)
        },
        setUser(user) {
            this.user = user
            if (user?.permissions) {
                delete user.permissions
            }
            setUser(user)
        },
        clearAuth() {
            this.user = null
            this.token = null
            resetAllCookies()
        },
        async login(payload) {
            const {data, pending, error, refresh} = await postData('login', payload)
            if (data) {
                this.setToken(data.value?.token)
                this.setUser(data.value?.user)
            }
            return {data, pending, error, refresh}
        },
        async register(payload) {
            const {data, pending, error, refresh} = await postData('register', payload)
            if (data) {
                this.setToken(data.value?.token)
                this.setUser(data.value?.user)
            }
            return {data, pending, error, refresh}
        },
        async getLoggedUser() {
            const { data, pending, error, refresh } = await getData('user')
            if (data) {
                if (data.value.data?.permissions) {
                    delete data.value.data.permissions
                }
                this.setUser(data.value?.data)
            }
            return { data, pending, error, refresh }
        },
        async logout() {
            const {data, pending, error, refresh} = await postData('logout')
            if (data) {
                this.clearAuth()
            }
            return {data, pending, error, refresh}
        }
    }
})
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn
    if (!isLoggedIn) {
        return navigateTo('/login?next=' + to.path)
    }
})
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const {isLoggedIn} = storeToRefs(authStore)
  if (isLoggedIn.value) {
    // return abortNavigation()
    return navigateTo('/')
  }
});
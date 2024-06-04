export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const {isLoggedIn} = storeToRefs(authStore)
  console.log('isLoggedIn', isLoggedIn.value)
  console.log('layout', to.meta)
  if (!isLoggedIn.value) {
    return navigateTo('/login?next=' + to.path)
  }
});
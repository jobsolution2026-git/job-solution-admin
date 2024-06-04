export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const { isLoggedIn } = storeToRefs(authStore)

  // Check if user is not logged in and not already on the login page
  if (!isLoggedIn.value && to.path !== '/login' && to.meta.layout !== 'blank') {
    // Redirect to login page with the next query parameter
    return navigateTo('/login?next=' + to.path)
  }
});
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const { isLoggedIn } = storeToRefs(authStore)

  // Check if user is logged in and trying to access guest-only pages (e.g., login or signup)
  if (isLoggedIn.value && (to.path === '/login')) {
    // Redirect to the home page
    return navigateTo('/')
  }
});
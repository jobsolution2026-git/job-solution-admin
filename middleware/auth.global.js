export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const { isLoggedIn } = storeToRefs(authStore)

  if (!isLoggedIn.value && to.path !== '/login' && to.meta.layout !== 'blank') {
    return navigateTo('/login?next=' + to.path)
  }
});
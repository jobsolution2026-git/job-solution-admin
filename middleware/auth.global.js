export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/login') {
    return;
  }
  const authStore = useAuthStore()
  const {isLoggedIn} = storeToRefs(authStore)
  console.log('isLoggedIn', isLoggedIn.value)
  console.log('layout', to.meta.layout)
  if (!isLoggedIn.value && to.meta.layout !== 'blank') {
    return navigateTo('/login?next=' + to.path)
  }
});
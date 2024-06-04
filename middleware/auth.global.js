export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  const {isLoggedIn} = storeToRefs(authStore)
  console.log('isLoggedIn', isLoggedIn.value)
  // if (!isLoggedIn.value && to.meta.layout !== 'blank') {
  //   return navigateTo('/login?next=' + to.path)
  // }
});
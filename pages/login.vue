<script setup lang="ts">
import {useForm} from "vee-validate";
import * as yup from "yup";

definePageMeta({
  layout: 'blank',
  middleware: ['guest']
})

const authStore = useAuthStore()
const router = useRouter()

const isLoading = ref<boolean>(false)

const {errors, handleSubmit, defineField, setErrors} = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  }),
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const onSubmit = handleSubmit(async values => {
  isLoading.value = true
  const { data, pending, error, refresh } = await authStore.login(values)
  if (error && error.value) {
    if (error.value.statusCode === 422) {
      showToast('error', 'Invalid email or password')
      setErrors(error.value.data.errors)
    }
  } else {
    await router.push('/')
  }
  isLoading.value = false
});
</script>

<template>
  <section class="bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen flex items-center justify-center">
    <div class="flex flex-col items-center justify-center px-6 py-8 w-full sm:max-w-md">
      <!-- Logo -->
      <a href="#" class="flex items-center mb-6 text-2xl font-bold text-gray-900 dark:text-white group">
        <img class="w-10 h-10 mr-2 rounded-full shadow-lg transition-transform group-hover:scale-110" src="/images/logo.jpg" alt="logo">
        Job Solution
      </a>

      <!-- Card -->
      <div
        class="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-500"
      >
        <div class="p-8 space-y-6">
          <h1 class="text-2xl font-extrabold leading-tight text-gray-900 dark:text-white text-center">
            Sign in to your account
          </h1>

          <!-- Form -->
          <form class="space-y-4" @submit.prevent="onSubmit">
            <!-- Email -->
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Your email
              </label>
              <input
                type="email"
                v-model="email"
                v-bind="emailAttrs"
                id="email"
                :class="[
                  'w-full p-3 rounded-lg sm:text-sm border bg-gray-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
                  errors.email
                    ? 'border-red-600 focus:ring-red-500 focus:border-red-500 dark:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500'
                    : 'border-gray-300 focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-blue-500 dark:focus:border-blue-500'
                ]"
              >
              <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-500">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <input
                type="password"
                v-model="password"
                v-bind="passwordAttrs"
                id="password"
                :class="[
                  'w-full p-3 rounded-lg sm:text-sm border bg-gray-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400',
                  errors.password
                    ? 'border-red-600 focus:ring-red-500 focus:border-red-500 dark:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500'
                    : 'border-gray-300 focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-blue-500 dark:focus:border-blue-500'
                ]"
              >
              <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-500">{{ errors.password }}</p>
            </div>

            <!-- Submit -->
            <button
              :disabled="isLoading"
              type="submit"
              class="w-full flex justify-center items-center gap-2 text-white bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-sm px-5 py-3 transition-all duration-300"
            >
              <svg
                v-if="isLoading"
                aria-hidden="true"
                role="status"
                class="inline w-5 h-5 animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M100 50.591C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.591C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.591ZM9.08144 50.591C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.591C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.591Z" fill="#E5E7EB"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
              </svg>
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>


<style scoped>

</style>
<script setup lang="ts">
import {navMenuItems} from "~/layouts/menu";
import {hasRole} from "~/composables/helper";
import type {Loader} from "~/interfaces/loader";


const authStore = useAuthStore();
const router = useRouter();

// const loader = ref<Loader>({
//   isLoading: false,
//   isSubmitting: false,
// });
const isActive = ref<boolean>(false);

const navItems = navMenuItems
const logout = async () => {
  const {data, pending, error, refresh} = await authStore.logout();
  if (error && error.value) {
    console.log(error.value);
    await router.push('/login');
  } else {
    await router.push('/login');
  }
};


</script>
<template>


<nav
  class="fixed top-0 z-50 w-full bg-gradient-to-r from-primary-600 via-pink-500 to-purple-600 border-b border-transparent shadow-lg dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
>
  <div class="px-3 py-3 lg:px-5 lg:pl-3">
    <div class="flex items-center justify-between">
      <!-- Left Section -->
      <div class="flex items-center justify-start rtl:justify-end">
        <!-- Sidebar Toggle -->
        <button
          data-drawer-target="logo-sidebar"
          data-drawer-toggle="logo-sidebar"
          aria-controls="logo-sidebar"
          type="button"
          class="inline-flex items-center p-2 text-sm text-white rounded-lg sm:hidden hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 dark:text-gray-300"
        >
          <span class="sr-only">Open sidebar</span>
          <svg
            class="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 
              1.5H2.75A.75.75 0 012 4.75zm0 
              10.5a.75.75 0 01.75-.75h7.5a.75.75 
              0 010 1.5h-7.5a.75.75 0 
              01-.75-.75zM2 10a.75.75 0 
              01.75-.75h14.5a.75.75 0 
              010 1.5H2.75A.75.75 0 
              012 10z"
            />
          </svg>
        </button>

        <!-- Logo -->
        <a href="/" class="flex items-center ms-2 md:me-24 group">
          <img src="/images/logo.jpg" class="h-8 me-3 rounded-lg shadow-md" alt="logo" />
          <span
            class="self-center text-xl font-bold sm:text-2xl text-white group-hover:text-yellow-300 transition-colors"
          >
            Job Solution BD
          </span>
        </a>
      </div>

      <!-- Right Section -->
      <div class="flex items-center space-x-4">
        <!-- Notification Icon -->
        <button
          type="button"
          class="relative p-2 text-white hover:bg-white/20 rounded-full transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 
              14.158V11a6.002 6.002 0 00-4-5.659V5a2 
              2 0 10-4 0v.341C7.67 6.165 6 8.388 6 
              11v3.159c0 .538-.214 1.055-.595 
              1.436L4 17h5m6 0v1a3 3 0 
              11-6 0v-1m6 0H9"
            />
          </svg>
          <span
            class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full"
          >
            3
          </span>
        </button>

        <!-- User Menu -->
        <div class="relative">
          <button
            type="button"
            class="flex items-center text-sm bg-white/20 rounded-full focus:ring-4 focus:ring-white/40"
            aria-expanded="false"
            data-dropdown-toggle="dropdown-user"
          >
            <span class="sr-only">Open user menu</span>
            <img
              class="w-9 h-9 rounded-full border-2 border-white shadow"
              src="https://flowbite.com/docs/images/people/profile-picture-3.jpg"
              alt="user photo"
            />
          </button>

          <!-- Dropdown -->
          <div
            class="z-50 hidden absolute right-0 mt-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-xl shadow-lg dark:bg-gray-800 dark:divide-gray-700 transition-all"
            id="dropdown-user"
          >
            <div class="px-4 py-3" role="none">
              <p class="text-sm font-semibold text-gray-900 dark:text-white" role="none">
                {{ authStore?.user?.name }}
              </p>
              <p
                class="text-sm font-medium text-gray-600 truncate dark:text-gray-300"
                role="none"
              >
                {{ authStore?.user?.email }}
              </p>
            </div>
            <ul class="py-1" role="none">
              <li>
                <nuxt-link
                  to="/"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-lg"
                  role="menuitem"
                  >Dashboard</nuxt-link
                >
              </li>
              <li>
                <a
                  @click.prevent.stop="logout"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white rounded-lg cursor-pointer"
                  role="menuitem"
                  >Sign out</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>

<aside
  id="logo-sidebar"
  class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full sm:translate-x-0 bg-gradient-to-b from-white via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg"
  aria-label="Sidebar"
>
  <div class="h-full px-3 pb-4 overflow-y-auto">
    <ul class="space-y-2 font-medium">
      <li v-for="item in navItems" :key="item.title">
        <nuxt-link
          v-if="hasRole(item.role)"
          :to="item.to"
          class="flex items-center p-3 text-gray-900 rounded-xl dark:text-white hover:bg-gradient-to-r hover:from-primary-500 hover:to-purple-600 hover:text-white transition-all duration-300 group"
          :class="{ 'bg-primary-500 text-white dark:bg-purple-600': $route.path === item.to }"
        >
          <svg
            v-html="item.icon"
            class="w-6 h-6 me-3 text-gray-500 group-hover:text-white dark:text-gray-400 dark:group-hover:text-white transition-colors duration-300"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          ></svg>
          <span class="text-sm font-medium">{{ item.title }}</span>
        </nuxt-link>
      </li>
    </ul>
  </div>
</aside>

  
  <div class="p-4 sm:ml-64 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <div class="p-4 mt-14">
      <slot />
    </div>
  </div>
</template>
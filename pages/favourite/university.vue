<script setup lang="ts">
import type {PageInfo} from "~/interfaces/pageinfo";
import type {Loader} from "~/interfaces/loader";
import type {University} from "~/interfaces/interface";
import FavouriteUniversityViewModal from "~/components/common/FavouriteUniversityViewModal.vue";

const pageInfo = ref<PageInfo>({
  title: 'Favourite Universities',
  description: 'Show all favourite universities',
  apiUrl: '/admin/university-user',
});

useHead({title: `Manage ${pageInfo.value.title}`});
const loader = ref<Loader>({
  isLoading: false,
  isSubmitting: false,
});

//attributes
const items = ref<University[] | null>(null);
//table
const itemsPerPageOptions = [10, 25, 50, 100];
const itemsPerPage = ref<number>(25);
const currentPage = ref<number>(1);
const startItem = ref<number | null>(null);
const search = ref<string>('');
const timeout = ref<any>(null);
const totalItems = ref<number>(0);
const totalPages = ref<number>(0);


//watchers
watch([itemsPerPage, currentPage], (values) => {
  init(currentPage.value);
});
watch(search, (value, oldVal) => {
  if ((value && value.length >= 3 && value.length < 12) || oldVal.length === 3) {
    if (timeout.value) {
      clearTimeout(timeout.value);
    }
    timeout.value = setTimeout(() => {
      init();
    }, 500);
  }
});

const init = async (page: number = 1) => {
  loader.value.isLoading = true;
  let url = `${pageInfo.value.apiUrl}?page=${page}&per_page=${itemsPerPage.value}`;
  if (search.value && search.value.length >= 3) url += `&search=${search.value}`;

  const {data, pending, error, refresh} = await getData(url);
  if (error && error.value) {
    showToast('error', 'An error occurred while fetching data');
  } else {
    items.value = data.value.data;
    totalItems.value = data.value.meta.total;
    totalPages.value = data.value.meta.last_page;
    startItem.value = data.value.meta.from;
    currentPage.value = data.value.meta.current_page;
  }
  loader.value.isLoading = false;
}
init()
const paginationLinks = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const maxVisible = 7; // number of visible pages around the current page
  const visiblePages = [];
  if (total <= 10) {
    for (let i = 1; i <= total; i++) {
      visiblePages.push(i);
    }
  } else {
    if (current <= maxVisible - 2) {
      for (let i = 1; i <= maxVisible - 1; i++) {
        visiblePages.push(i);
      }
      visiblePages.push('...');
      visiblePages.push(total);
    } else if (current >= total - (maxVisible - 2)) {
      visiblePages.push(1);
      visiblePages.push('...');
      for (let i = total - (maxVisible - 2); i <= total; i++) {
        visiblePages.push(i);
      }
    } else {
      visiblePages.push(1);
      visiblePages.push('...');
      for (let i = current - 2; i <= current + 2; i++) {
        visiblePages.push(i);
      }
      visiblePages.push('...');
      visiblePages.push(total);
    }
  }
  return visiblePages;
});
</script>

<template>
  <div>
    <section class="py-3 sm:py-5">
      <div class="px-4 mx-auto max-w-screen-2xl lg:px-12">
        <div class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
          <div
              class="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
            <div class="flex items-center flex-1 space-x-4">
              <h5>
                <span class="dark:text-white font-bold">{{ pageInfo.title }}</span>
              </h5>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-4 py-3">Id</th>
                <th scope="col" class="px-4 py-3">University Name</th>
                <th scope="col" class="px-4 py-3">Web Site</th>
                <th scope="col" class="px-4 py-3">User name</th>
                <th scope="col" class="px-4 py-3">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="loader.isLoading">
                <td class="px-4 py-2 text-center" colspan="5">
                  <common-loader/>
                </td>
              </tr>
              <tr v-if="!loader.isLoading &&  items"
                  class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  v-for="item in items" :key="item.id">
                <th scope="row" class="px-4 py-2 font-medium text-black dark:text-white whitespace-nowrap">
                  <p class="font-medium text-black dark:text-white">#{{ item.id }}</p>
                </th>
                <td class="px-4 py-2 mr-2">
                  <p class="font-medium text-black dark:text-white">{{ item?.university?.title }}</p>
                </td>
                <td class="px-4 py-2 mr-2">
                  <a :href="item?.university?.website" target="_blank" class="font-medium text-blue-500 underline">{{
                      item?.university?.website
                    }}</a>
                </td>
                <td class="px-4 py-2 mr-2">
                  <p class="font-medium text-black dark:text-white">{{ item?.user?.name }}</p>
                </td>
                <td class="px-4 py-2 mr-2">
                  <FavouriteUniversityViewModal :item="item"/>
                </td>
              </tr>
              <tr v-else>
                <td class="px-4 py-2 text-center text-gray-900 dark:text-white" colspan="5">No data found</td>
              </tr>
              </tbody>
            </table>
          </div>
          <nav class="flex flex-col items-start justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0"
               aria-label="Table navigation">
            <div class="flex items-center space-x-3">
              <label for="items-per-page" class="text-sm font-medium text-gray-900 dark:text-white">Items per
                page</label>
              <select v-model="itemsPerPage" id="items-per-page"
                      class="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500">
                <option v-for="option in itemsPerPageOptions" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>
            <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
              Showing
              <span class="font-semibold text-gray-900 dark:text-white">{{ startItem || 0 }} - {{ endItem || 0 }}</span>
              of
              <span class="font-semibold text-gray-900 dark:text-white">{{ totalItems }}</span>
            </span>
            <ul class="inline-flex items-stretch -space-x-px">
              <li>
                <button
                    :disabled="currentPage === 1"
                    @click.prevent.stop="currentPage = currentPage - 1"
                    class="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  <span class="sr-only">Previous</span>
                  <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20"
                       xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clip-rule="evenodd"/>
                  </svg>
                </button>
              </li>
              <li v-for="link in paginationLinks" :key="link">
                <button
                    v-if="link !== '...'"
                    @click.prevent.stop="currentPage = link"
                    :class="{'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300': currentPage === link, 'text-gray-500 bg-white dark:text-gray-400 dark:bg-gray-800': currentPage !== link}"
                    class="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  {{ link }}
                </button>
                <span v-else
                      class="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white dark:text-gray-400 dark:bg-gray-800">...</span>
              </li>
              <li>
                <button
                    :disabled="currentPage === totalPages"
                    @click.prevent.stop="currentPage = currentPage + 1"
                    class="flex items-center justify-center h-full py-1.5 px-3 -ml-px text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  <span class="sr-only">Next</span>
                  <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20"
                       xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clip-rule="evenodd"/>
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

</style>
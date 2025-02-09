<script setup lang="ts">
import type {PageInfo} from "~/interfaces/pageinfo";
import type {Loader} from "~/interfaces/loader";
import {useForm} from "vee-validate";
import * as yup from "yup";
import InputSelect from "~/components/form/InputSelect.vue";
import OrderViewModal from "~/components/common/OrderViewModal.vue";

const pageInfo = ref<PageInfo>({
  title: 'Payments',
  description: 'Manage all your Payments',
  apiUrl: '/admin/payments',
});

useHead({title: `Manage ${pageInfo.value.title}`});
const loader = ref<Loader>({
  isLoading: false,
  isSubmitting: false,
});

const batchStore = useBatchStore();

if (batchStore.batches && batchStore.batches.length < 1) {
  batchStore.fetchBatches();
}
//attributes
const dialog = ref<boolean>(false);
const items = ref<[{
  id?: number,
  amount?: number,
  transaction_id?: string,
  status?: string
  order?: {
    discount?: number,
    user?: {
      name?: string,
      phone?: string
    }
  }
}] | null>(null);
const statuses = [
  {label: 'Pending', value: 'pending'},
  {label: 'Processing', value: 'processing'},
  {label: 'Completed', value: 'completed'},
  {label: 'Cancelled', value: 'cancelled'},
];
//table
const itemsPerPageOptions = [10, 25, 50, 100, 1000];
const itemsPerPage = ref<number>(1000);
const currentPage = ref<number>(1);
const startItem = ref<number | null>(null);
const endItem = ref<number | null>(null);
const search = ref<string>('');
const timeout = ref<any>(null);
const totalItems = ref<number>(0);
const totalPages = ref<number>(0);

const status = ref<string>('');
const start_date = ref<string>('');
const end_date = ref<string>('');
const isFiltered = ref<boolean>(false);


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
  if (status.value) url += `&status=${status.value}`;
  if (start_date.value) url += `&start_date=${start_date.value}`;
  if (end_date.value) url += `&end_date=${end_date.value}`;

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
const closeModal = () => {
  dialog.value = false;
};
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

const onSubmit = async () => {
  await init();
  isFiltered.value = true;
  dialog.value = false;
}

const resetFilter = async () => {
  isFiltered.value = false;
  search.value = '';
  status.value = '';
  start_date.value = '';
  end_date.value = '';
  await init();
}

const calculateTotalSell = computed(() => {
  let total = 0;
  items?.value.forEach((item) => {
      total += item.amount;
  });
  return total;
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
                <span class="dark:text-white">All {{ pageInfo.title }}</span>
              </h5>
              <div class="inline-block  w-0.5 self-stretch bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div
                class="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
                <p class="font-bold" v-if="!loader.isLoading &&  items">Total Sell: {{ calculateTotalSell }} Taka</p>
              <button :disabled="!isFiltered" type="button"
                      :class="isFiltered ? 'bg-green-500 p-1 rounded-full text-white' : 'bg-gray-200 p-1 rounded-full text-gray-500'"
                      @click="resetFilter">
                <svg class="w-5" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                     viewBox="0 0 512 512">
                  <path
                      d="M400 148l-21.12-24.57A191.43 191.43 0 0 0 240 64C134 64 48 150 48 256s86 192 192 192a192.09 192.09 0 0 0 181.07-128"
                      fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10"
                      stroke-width="32"></path>
                  <path d="M464 68.45V220a4 4 0 0 1-4 4H308.45a4 4 0 0 1-2.83-6.83L457.17 65.62a4 4 0 0 1 6.83 2.83z"
                        fill="currentColor"></path>
                </svg>
              </button>
              <button type="button"
                      @click="dialog = true"
                      class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                <svg class="w-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                     viewBox="0 0 24 24">
                  <path d="M5.5 5h13a1 1 0 0 1 .5 1.5L14 12v7l-4-3v-4L5 6.5A1 1 0 0 1 5.5 5" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                Filter
              </button>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-4 py-3 whitespace-nowrap">Id</th>
                <th scope="col" class="px-4 py-3 whitespace-nowrap">Name</th>
                <th scope="col" class="px-4 py-3 whitespace-nowrap">Phone</th>
                <th scope="col" class="px-4 py-3 whitespace-nowrap">Amount</th>
                <th scope="col" class="px-4 py-3 whitespace-nowrap">Discount</th>
                <th scope="col" class="px-4 py-3 whitespace-nowrap">Transaction Id</th>
                <th scope="col" class="px-4 py-3 whitespace-nowrap">Used Coupon</th>
                <th scope="col" class="px-4 py-3 whitespace-nowrap">Created At</th>
                <th scope="col" class="px-4 py-3 whitespace-nowrap">Subscription Name</th>
                <th scope="col" class="px-4 py-3">status</th>
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
                <th scope="row" class="px-4 py-2 font-medium text-black dark:text-white ">
                  <p class="font-medium text-black dark:text-white">#{{ item?.id }}</p>
                </th>
                <td class="px-4 py-2 mr-2">
                  <p class="font-medium text-black dark:text-white">{{ item?.order?.user?.name }}</p>
                </td>
                <td class="px-4 py-2 mr-2">
                  <p class="font-medium text-black dark:text-white">{{ item?.order?.user?.phone }}</p>
                </td>
                <td class="px-4 py-2 mr-2">
                  <p class="font-medium text-black dark:text-white">{{ item?.amount }} Taka</p>
                </td>
                <td class="px-4 py-2 mr-2">
                  <p class="font-medium text-black dark:text-white">{{ item?.order?.discount }} Taka</p>
                </td>
                <td class="px-4 py-2 mr-2">
                  <p class="font-medium text-black dark:text-white">{{ item?.transaction_id }}</p>
                </td>
                <td class="px-4 py-2 mr-2">
                  <p v-if="item?.order?.coupon" class="font-medium text-red-700 dark:text-white">{{ item?.order?.coupon}}</p>
                </td>
                <td class="px-4 py-2 mr-2">
                  <p class="font-medium text-black dark:text-white whitespace-nowrap">{{ formatDateTime(item?.created_at) }}</p>
                </td>
                <td class="px-4 py-2 mr-2">
                  <p class="font-medium text-black dark:text-white">{{ item?.order?.subscription?.title }}</p>
                </td>
                <td class="px-4 py-2 mr-2">
                  <p class="font-medium text-black dark:text-white">{{ item?.status }}</p>
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

    <!-- modal-->
    <div v-if="dialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="relative p-4 w-full max-w-2xl overflow-y-auto">
        <!-- Modal content -->
        <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <!-- Modal header -->
          <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Filter order</h3>
            <button @click="closeModal" type="button"
                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-target="modalEl" data-modal-toggle="modalEl">
              <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20"
                   xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"/>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <form @submit.prevent="onSubmit">
            <div class="grid gap-4 mb-4 sm:grid-cols-2">
              <div class="col-span-2">
                <form-input-label label="Status"/>
                <input-select :options="statuses" v-model="status"/>
              </div>
              <div class="col-span-2 sm:col-span-1">
                <form-input-label label="Start time"/>
                <form-date-time-picker type="datetime-local" v-model="start_date"/>
              </div>
              <div class="col-span-2 sm:col-span-1">
                <form-input-label label="End time"/>
                <form-date-time-picker type="datetime-local" v-model="end_date"/>
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <button type="submit"
                      class="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                <svg v-if="loader.isSubmitting" aria-hidden="true" role="status"
                     class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"/>
                  <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"/>
                </svg>
                Filter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
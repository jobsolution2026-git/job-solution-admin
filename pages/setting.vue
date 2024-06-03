<script setup lang="ts">
import type {PageInfo} from "~/interfaces/pageinfo";
import type {Loader} from "~/interfaces/loader";
import {capitalize} from "~/composables/helper";
import {useForm} from "vee-validate";
import {storeToRefs} from "pinia";
import {useSettingStore} from "~/stores/setting";
import * as yup from "yup";
import type {Setting} from "~/interfaces/setting";

const pageInfo = ref<PageInfo>({
  title: 'Settings',
  description: 'Manage all your settings here',
  apiUrl: '/admin/settings',
});

useHead({title: `Manage ${pageInfo.value.title}`});
const loader = ref<Loader>({
  isLoading: false,
  isSubmitting: false,
});

const {settings} = <Setting>storeToRefs(useSettingStore());

const init = async() => {
  loader.value.isLoading = true;
  const {data, pending, error, refresh} = await getData(pageInfo.value.apiUrl);
  if (error && error.value) {
    showToast('error', 'An error occurred while fetching data');
  } else {
    settings.value = data.value.data;
  }
  loader.value.isLoading = false;
}

if (!settings.value) {
  init();
}

//attributes
const openModal = ref<HTMLElement | null>(null);
const closeButton = ref<HTMLElement | null>(null);
const editMode = ref<boolean>(false);
const selectedItem = ref<object>({});

//table
const startItem = ref<number | null>(null);
const endItem = ref<number | null>(null);
const search = ref<string>('');
const totalItems = ref<number>(0);
//form
const {errors, handleSubmit, handleReset, defineField, setErrors} = useForm({
  validationSchema: yup.object({
    key: yup.string().max(191).required(),
    value: yup.string().nullable()
  }),
});
//form fields
const [key, keyAttrs] = defineField('key');
const [value, valueAttrs] = defineField('value');

//watchers

const onSubmit = handleSubmit(async values => {
  let url = pageInfo.value.apiUrl;
  let msg = `New ${pageInfo.value.title} created successfully!`;
  if (editMode.value) {
    url = `${pageInfo.value.apiUrl}/${selectedItem.value.slug}`;
    msg = `${pageInfo.value.title} updated successfully!`;
    values._method = "PUT";
  }
  loader.value.isSubmitting = true
  const {data, pending, error, refresh} = await postData(url, values);
  if (error && error.value) {
    if (error.value.statusCode === 422) {
      setErrors(error.value.data.errors)
    }
  } else {
    if (editMode.value) {
      const index = settings.value.findIndex(item => item.id === data.value.data.id);
      if (index > -1) Object.assign(settings.value[index], data.value.data);
    } else {
      settings.value.unshift(data.value.data);
      if (totalItems.value == 0) {
        startItem.value = 1;
      }
      endItem.value += 1;
      totalItems.value += 1;
    }
    submitSuccess(data.value.data, msg);
  }
  loader.value.isSubmitting = false
});

const editItem = (item: object) => {
  selectedItem.value = item;
  editMode.value = true;
  key.value = item.key;
  value.value = item.value
  openModal.value?.click();
};
const deleteItem = async (event: number) => {
  selectedItem.value = settings.value.find(item => item.id === event)
  if (!selectedItem.value) {
    showToast('error', 'Item not found');
    return;
  }
  const url = `${pageInfo.value.apiUrl}/${selectedItem.value.id}`;
  const {data, pending, error, refresh} = await deleteData(url);
  if (error && error.value) {
    showToast('error', 'An error occurred while deleting the item');
  } else {
    const index = settings.value.findIndex(item => item.id === selectedItem.value.id);
    settings.value.splice(index, 1);
    totalItems.value -= 1;
    endItem.value -= 1;
    showToast('success', 'Item deleted successfully');
    selectedItem.value = {};
  }
}
const closeModal = () => {
  handleReset();
  selectedItem.value = {};
  editMode.value = false;
};
const submitSuccess = (item: object, msg: string) => {
  handleReset();
  selectedItem.value = {};
  editMode.value = false;
  showToast('success', msg);
  closeButton.value?.click();
};
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
              <form>
                <label for="search"
                       class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div class="relative">
                  <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                  <input type="search" id="search" v-model="search"
                         class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                         placeholder="Search" required/>
                </div>
              </form>
            </div>
            <div
                class="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">
              <button type="button"
                      ref="openModal"
                      data-modal-target="modalEl"
                      data-modal-toggle="modalEl"
                      class="flex items-center justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                <svg class="h-3.5 w-3.5 mr-2" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
                     aria-hidden="true">
                  <path clip-rule="evenodd" fill-rule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                </svg>
                Add new
              </button>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-4 py-3">Key</th>
                <th scope="col" class="px-4 py-3">Value</th>
                <th scope="col" class="px-4 py-3">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="loader.isLoading">
                <td class="px-4 py-2 text-center" colspan="5">
                  <common-loader/>
                </td>
              </tr>
              <tr v-if="!loader.isLoading &&  settings" class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  v-for="item in settings" :key="item.id">
                <th scope="row"
                    class="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {{ item.key }}
                </th>
                <td class="px-4 py-2 mr-2">
                  <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    {{item.value}}
                  </span>
                </td>
                <td class="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <div class="flex items-center space-x-2">
                    <button @click="editItem(item)"
                            class="px-3 py-2 text-xs font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Edit</button>
                    <common-delete-modal :id="item.id" @update="deleteItem($event)"/>
                  </div>
                </td>
              </tr>
              <tr v-else>
                <td class="px-4 py-2 text-center text-gray-900 dark:text-white" colspan="5">No data found</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- modal-->
    <div id="modalEl" data-modal-backdrop="static" tabindex="-1" aria-hidden="true"
         class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
          <!-- Modal header -->
          <div class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white"> {{ `${editMode ? 'Update' : 'Add'} ${capitalize(pageInfo.title)}` }}</h3>
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
              <div class="">
                <form-input-label label="Kye"/>
                <form-input-text id="name" type="text" v-model="key" v-bind="keyAttrs" :error="errors.key"/>
                <form-input-error :message="errors.key"/>
              </div>
              <div class="sm:col-span-2 mb-20">
                <form-input-label label="Value"/>
                <quill-editor toolbar="essential" v-model:content="value" v-bind="valueAttrs" contentType="html" placeholder="Notice Body"/>
              </div>
            </div>
            <div class="flex justify-end gap-2">
              <button type="submit"
                      class="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                <svg v-if="loader.isSubmitting" aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                {{ editMode ? 'Update' : 'Add' }}
              </button>
              <button @click="closeModal" ref="closeButton" type="button" class="text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      data-modal-target="modalEl" data-modal-toggle="modalEl">
                Close
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
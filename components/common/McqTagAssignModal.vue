<script setup lang="ts">
import {initFlowbite} from "flowbite";

const props = defineProps({
  mcqIds: {
    type: Array,
    required: true
  }
});

const tags = ref<string[]>([])

const emit = defineEmits<{
  (e: 'update:imported', value: boolean): void;
}>()

const isLoading = ref<boolean>(false)
const closeBtn = ref<null | HTMLElement>(null)

const init = async () => {
  const {data, error}  = await getData('admin/mcq-tags/all');
  if (error && error.value) {
    showToast('error', 'Failed to fetch tags. Please try again.')
  } else {
    tags.value = data.value.data
  }
}


const onSubmit = async  () => {
  emit('update:imported', true)
  closeBtn.value?.click()
}

// call function

await init()
</script>

<template>
  <div>
    <button data-modal-target="popup-modal-par" data-modal-toggle="popup-modal-par" class="px-3 py-2 text-xs font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-red-400 dark:hover:bg-green-700 dark:focus:ring-green-800">Assign Tag</button>
    <div id="popup-modal-par" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative p-4 w-full max-w-3xl max-h-full">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal-par">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <form @submit.prevent="onSubmit" class="p-4 md:p-5">
            <div>
              <h3 class="mb-1 text-lg font-normal text-gray-500 dark:text-gray-400">Assign tag</h3>
              <hr>
              <div class="my-2">
                {{mcqIds}}
              </div>
            </div>
            <div class="flex gap-4 justify-end">
              <button type="submit" class="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                Assign
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
<script setup lang="ts">
import {initFlowbite} from "flowbite";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

onMounted(() => {
  initFlowbite();
})
</script>

<template>
  <div>
    <button :data-modal-target="`popup-modal-${props.item.id}`" :data-modal-toggle="`popup-modal-${props.item.id}`"
            class="px-3 py-2 text-xs font-medium text-center text-white bg-green-500 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
      View
    </button>

    <div :id="`popup-modal-${props.item.id}`" tabindex="-1"
         class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      <div class="relative p-4 w-full max-w-xl max-h-full">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button type="button"
                  class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  :data-modal-hide="`popup-modal-${props.item.id}`">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-6 text-[18px] text-black">
            <div class="flex flex-col gap-2">
              <p>Student: {{ item?.user?.name }}</p>
              <p>Phone: {{ item?.user?.phone }}</p>
              <p>Email: {{ item?.user?.email }}</p>
              <p>institution: {{ item?.user?.institution }}</p>
            </div>
            <div class="py-2">
              <hr>
            </div>
            <div class="flex flex-col gap-2">
              <p>University name: {{ item?.university?.title }}</p>
              <client-only>
                <p class="mt-1 font-bold">About University:</p>
                <div class="latex" v-katex="item?.university?.description"></div>
              </client-only>
              <div v-if="item?.university?.groups">
                <div class="py-2">
                  <p class="font-bold">Related Groups:</p>
                  <div class="py-1">
                    <hr>
                  </div>
                </div>
                <div class="flex gap-x-2">
                  <div v-for="(group, i) in item?.university?.groups" :key="i">
                    <p class="bg-yellow-300 rounded pb-1 px-1">{{ group }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
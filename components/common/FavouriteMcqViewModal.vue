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
          <div class="p-6 text-[18px]">
            <client-only>
              <div class="flex items-center font-bold text-black">
                <div>#</div>
                <div class="latex" v-katex="item?.mcq?.question"></div>
              </div>
              <div>
                <div class="flex gap-1">
                  <img v-if="item?.mcq?.question_image" :src="item?.mcq?.question_image"
                       class="w-20 h-20 object-cover rounded-lg"
                       alt="question image"/>
                </div>
                <div class="mt-2 grid grid-cols-2 gap-4 mb-2 text-black">
                  <div v-for="option in ['a', 'b', 'c', 'd', 'e']" :key="option">
                    <span v-if="item?.mcq?.answer === option"
                          class="inline-block px-2 py-1 ml-2 text-xs font-medium text-white bg-green-700 rounded-full dark:bg-green-600">{{
                        option
                      }}</span>
                    <span v-else-if="item?.mcq[option]"  class="inline-block px-2 py-1 ml-2 text-xs font-medium text-white bg-black rounded-full">{{
                        option
                      }}</span>
                    <span style="color: black !important;" v-if="item?.mcq[option]" class="ml-2 text-sm"><span v-katex="item?.mcq[option]" class="latex text-black"></span></span>
                  </div>
                </div>
                <div>
                  <div v-if="item?.mcq?.tags && item?.mcq?.tags.length" class="flex gap-2 flex-wrap mb-2">
                    <span>Tags: </span>
                    <div v-for="(tag,i) in item?.mcq?.tags" :key="i">
                      <div class="bg-yellow-400 rounded px-4">{{ tag }}</div>
                    </div>
                  </div>
                  <div v-if="item?.mcq?.answer_image">
                    <span class="text-sm font-medium text-gray-900 dark:text-white">Answer image:</span>
                    <img :src="item?.mcq?.answer_image" class="w-96 h-auto object-cover rounded-lg"
                         alt="answer image"/>
                  </div>
                  <div v-if="item?.mcq?.explanation"
                       class="text-sm font-medium text-gray-900 dark:text-white max-w-xl text-wrap">Explanation: <span
                      v-katex="item?.mcq?.explanation" class="latex"></span></div>
                </div>
              </div>
            </client-only>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
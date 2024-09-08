<script setup lang="ts">
import {initFlowbite} from "flowbite";

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});
const isCopied = ref(false);

const copyOrderDetails = (item: any) => {
  const text = `User: ${item.user?.name}\nEmail: ${item.user?.email}\nPhone: ${item.user?.phone}\nInstitution: ${item.user?.institution}\nGroup: ${item.user?.group}\nSubscription name: ${item.subscription?.title}\nSubscription Status: ${item.subscription?.status}\nPrice: ${item.subscription?.price}\nSubscription duration: ${item.subscription?.validity_duration}`;
  navigator.clipboard.writeText(text).then(() => {
    isCopied.value = true;
  });
}


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
          <button @click="isCopied = false" type="button"
                  class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  :data-modal-hide="`popup-modal-${props.item.id}`">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-6 text-[18px]">
            <div class="flex items-center justify-between">
              <div class="flex flex-col gap-y-1">
                <h3 class="flex items-center gap-x-1">
                  <svg class="w-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                       viewBox="0 0 496 512">
                    <path
                        d="M248 104c-53 0-96 43-96 96s43 96 96 96s96-43 96-96s-43-96-96-96zm0 144c-26.5 0-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48s-21.5 48-48 48zm0-240C111 8 0 119 0 256s111 248 248 248s248-111 248-248S385 8 248 8zm0 448c-49.7 0-95.1-18.3-130.1-48.4c14.9-23 40.4-38.6 69.6-39.5c20.8 6.4 40.6 9.6 60.5 9.6s39.7-3.1 60.5-9.6c29.2 1 54.7 16.5 69.6 39.5c-35 30.1-80.4 48.4-130.1 48.4zm162.7-84.1c-24.4-31.4-62.1-51.9-105.1-51.9c-10.2 0-26 9.6-57.6 9.6c-31.5 0-47.4-9.6-57.6-9.6c-42.9 0-80.6 20.5-105.1 51.9C61.9 339.2 48 299.2 48 256c0-110.3 89.7-200 200-200s200 89.7 200 200c0 43.2-13.9 83.2-37.3 115.9z"
                        fill="currentColor"></path>
                  </svg>
                  {{ item.user?.name }}
                </h3>
                <h3 class="flex items-center gap-x-1">
                  <svg class="w-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                       viewBox="0 0 24 24">
                    <path
                        d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.4 4.25l-7.07 4.42c-.32.2-.74.2-1.06 0L4.4 8.25a.85.85 0 1 1 .9-1.44L12 11l6.7-4.19a.85.85 0 1 1 .9 1.44z"
                        fill="currentColor"></path>
                  </svg>
                  {{ item.user?.email }}
                </h3>
                <h3 class="flex items-center gap-x-1">
                  <svg class="w-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                       viewBox="0 0 24 24">
                    <path
                        d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02l-2.2 2.2z"
                        fill="currentColor"></path>
                  </svg>
                  {{ item.user?.phone }}
                </h3>
                <h3 class="flex items-center gap-x-1">
                  <svg class="w-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                       viewBox="0 0 512 512">
                    <path
                        d="M496 128v16a8 8 0 0 1-8 8h-24v12c0 6.627-5.373 12-12 12H60c-6.627 0-12-5.373-12-12v-12H24a8 8 0 0 1-8-8v-16a8 8 0 0 1 4.941-7.392l232-88a7.996 7.996 0 0 1 6.118 0l232 88A8 8 0 0 1 496 128zm-24 304H40c-13.255 0-24 10.745-24 24v16a8 8 0 0 0 8 8h464a8 8 0 0 0 8-8v-16c0-13.255-10.745-24-24-24zM96 192v192H60c-6.627 0-12 5.373-12 12v20h416v-20c0-6.627-5.373-12-12-12h-36V192h-64v192h-64V192h-64v192h-64V192H96z"
                        fill="currentColor"></path>
                  </svg>
                  {{ item.user?.institution }}
                </h3>
                <h3 class="flex items-center gap-x-1">
                  <svg class="w-4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                       viewBox="0 0 48 48">
                    <g fill="none">
                      <path
                          d="M18 20a3 3 0 1 1-6 0a3 3 0 0 1 6 0zm4.5 3a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5zm6.5-1.75c0-.69.56-1.25 1.25-1.25h6.5a1.25 1.25 0 1 1 0 2.5h-6.5c-.69 0-1.25-.56-1.25-1.25zm1.25 4.25a1.25 1.25 0 1 0 0 2.5h6.5a1.25 1.25 0 1 0 0-2.5h-6.5zM10 26.5a1.5 1.5 0 0 1 1.5-1.5h7a1.5 1.5 0 0 1 1.5 1.5V28s0 3.5-5 3.5s-5-3.5-5-3.5v-1.5zm11.867 2.51a5.47 5.47 0 0 1-.339.99H23a3 3 0 0 0 3-3v-.5a1.5 1.5 0 0 0-1.5-1.5h-2.837c.216.455.337.963.337 1.5v1.556a3.154 3.154 0 0 1-.02.297c-.018.172-.05.396-.113.657zM4 14.25A6.25 6.25 0 0 1 10.25 8h27.5A6.25 6.25 0 0 1 44 14.25v19.5A6.25 6.25 0 0 1 37.75 40h-27.5A6.25 6.25 0 0 1 4 33.75v-19.5zm6.25-3.75a3.75 3.75 0 0 0-3.75 3.75v19.5a3.75 3.75 0 0 0 3.75 3.75h27.5a3.75 3.75 0 0 0 3.75-3.75v-19.5a3.75 3.75 0 0 0-3.75-3.75h-27.5z"
                          fill="currentColor"></path>
                    </g>
                  </svg>
                  {{ item.user?.group }}
                </h3>
              </div>
              <div>
                <button @click.stop="copyOrderDetails(item)">
                  <svg :class="isCopied ? 'text-red-600' : ''" class="w-6" xmlns="http://www.w3.org/2000/svg"
                       xmlns:xlink="http://www.w3.org/1999/xlink"
                       viewBox="0 0 24 24">
                    <path
                        d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                        fill="currentColor"></path>
                  </svg>
                  <span class="text-[12px] text-red-600" v-if="isCopied">Copied</span>
                </button>
              </div>
            </div>
            <div class="py-2">
              <hr>
            </div>
            <div class="flex flex-col gap-y-1">
              <p>Total: {{ item?.total }}.tk</p>
              <p>Discount: {{ item?.discount }}.tk</p>
              <p>Status: {{ item?.status }}</p>
            </div>
            <div class="py-2">
              <hr>
            </div>
            <div class="flex flex-col gap-y-1">
              <p>Subscription name: {{ item.subscription?.title }}</p>
              <p>Subscription duration: {{ item.subscription?.validity_duration }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
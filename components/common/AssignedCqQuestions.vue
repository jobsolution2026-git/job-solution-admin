<script setup lang="ts">
import {initFlowbite} from "flowbite";


const props = defineProps<{
  exam: object;
}>()

const emit = defineEmits<{
  (e: 'update:deleted', value: object): void;
}>()

const route = useRoute()
const dialog = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const closeBtn = ref<null | HTMLElement>(null)
const errors = ref<string[] | null>([])
const questions = ref([])

onMounted(async () => {
  if (props?.exam?.cqQuestion && Object.keys(props?.exam?.cqQuestion).length > 0) {
    questions.value = props?.exam?.cqQuestion?.body?.sections[0].questions
  }
})

watch(() => props.exam, async (newVal) => {
  if (newVal?.cqQuestion && Object.keys(newVal?.cqQuestion).length > 0) {
    questions.value = newVal?.cqQuestion?.body?.sections[0].questions
  }
})

const selectedCqIds = ref<number[]>([])
const addIntoSelectedCqIds = (id: number) => {
  if (selectedCqIds.value.includes(id)) {
    selectedCqIds.value = selectedCqIds.value.filter(cqId => cqId !== id)
  } else {
    selectedCqIds.value.push(id)
  }
}

const selectAllCqs = () => {
  const allCqs = questions.value.map(obj => obj.id);
  allCqs.forEach(id => {
    if (!selectedCqIds.value.includes(id)) {
      selectedCqIds.value.push(id);
    }
  });
};
const DeleteMcq = async () => {
  if (selectedCqIds.value.length) {
    let cqs = questions.value.filter(cq => !selectedCqIds.value.includes(cq.id))
    const payload = {
      _method: 'PUT',
      cq_exam_id: route.params.id,
      body: {
        max_sections: 1,
        max_required_sections: 1,
        sections: [
          {
            title: 'default',
            required: true,
            questions: cqs.map(cq => cq.id)
          }
        ]
      }
    }
    isLoading.value = true
    let url = `admin/cq-questions/${props.exam?.cqQuestion?.id}`
    const {data, error} = await postData(url, payload)
    if (error && error.value) {
      showToast('error', 'An error occurred while assigning questions')
    } else {
      showToast('success', 'Questions Removed successfully')
      selectedCqIds.value = []
      questions.value = cqs
      emit('update:deleted', data.value.data)
    }
    isLoading.value = false
  } else {
    showToast('error', 'Please select questions to delete')
  }
}
</script>

<template>
  <div>
    <button type="button" @click="dialog = true" class="px-5 py-2.5 text-xs font-medium text-center text-white bg-fuchsia-700 rounded-lg hover:bg-fuchsia-800 focus:ring-4 focus:outline-none focus:ring-fuchsia-300 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-700 dark:focus:ring-fuchsia-800">
      Assigned Questions
      <span class="inline-flex items-center justify-center w-7 h-4 ms-2 text-xs font-semibold text-fuchsia-800 bg-fuchsia-200 rounded-full">
        {{ questions.length }}
      </span>
    </button>

    <div id="popup-modal" v-if="dialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="relative p-4 w-full max-w-4xl max-h-full overflow-y-auto">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <button type="button" @click="dialog=false" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <div class="p-4 md:p-5">
            <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Already Assigned Questions</h3>
            <div v-if="questions && questions.length > 0">
              <div class="grid gap-4 sm:grid-cols-2">
                <div v-for="(cq, i) in questions" :key="cq.id" @click="addIntoSelectedCqIds(cq.id)" :class="{ 'bg-primary-100': selectedCqIds.includes(cq.id) }" class="p-4 border rounded-lg cursor-pointer">
                  <div>
                    <div class="flex gap-1">
                      {{i+1}}. <div v-katex="cq.question" class="latex"></div>
                    </div>
                    <div v-if="cq.question_image">
                      <img :src="cq.question_image" class="w-full h-40 object-cover rounded-lg" alt="question image"/>
                    </div>
                    <div class="mt-2 mb-2 flex gap-1">
                      <strong>Ans: </strong><div v-katex="cq.answer" class="latex"></div>
                    </div>
                    <div v-if="cq.answer_image">
                      <span class="text-sm font-medium text-gray-900 dark:text-white">Answer image:</span>
                      <img :src="cq.answer_image" class="w-96 h-auto object-cover rounded-lg" alt="answer image"/>
                    </div>
                    <div>
                      <div v-if="cq?.tags" class="flex gap-2 flex-wrap mb-2">
                        <span>Tags: </span>
                        <div v-for="(tag,i) in cq.tags" :key="i">
                          <small class="bg-yellow-600 rounded p-1 text-white">{{ tag }}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="text-center text-gray-500 dark:text-gray-400">No questions assigned yet.</div>
            </div>
            <div class="flex justify-end gap-2 mt-3">
              <button type="button" @click="selectAllCqs"
                class="inline-flex items-center px-3 py-2 text-xs font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                Select All
                <svg v-if="isLoading" aria-hidden="true" role="status"
                  class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB" />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor" />
                </svg>
              </button>

              <button type="button"  @click="DeleteMcq" class=" inline-flex items-center px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Delete
                <svg v-if="isLoading" aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                <span class="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                  {{ selectedCqIds.length }}
                </span>
              </button>
              <button type="button" @click="dialog= false;" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
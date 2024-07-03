<script setup lang="ts">
import {initFlowbite} from "flowbite";
import {useForm} from "vee-validate";
import * as yup from "yup";

const props = defineProps({
  mcqIds: {
    type: Array,
    required: true
  }
});

const tags = ref<string[]>([])

const emit = defineEmits(['added'])

const isLoading = ref<boolean>(false)
const closeBtn = ref<null | HTMLElement>(null);
const SelectedChapter = ref<string | null>(null);
const emptyTagMessage = ref<string | null>(null);

const {errors, handleSubmit, handleReset, defineField, setErrors} = useForm({
  validationSchema: yup.object({
    subject: yup.mixed().nullable(),
    chapter: yup.mixed().nullable(),
    topic: yup.mixed().nullable(),
    university: yup.mixed().nullable(),
    unit: yup.mixed().nullable(),
    year: yup.mixed().nullable(),
  }),
});
//form fields
const [subject, subjectAttrs] = defineField('subject');
const [chapter, chapterAttrs] = defineField('chapter');
const [topic, topicAttrs] = defineField('topic');
const [university, universityAttrs] = defineField('university');
const [unit, unitAttrs] = defineField('unit');
const [year, yearAttrs] = defineField('year');

// computed

const subjectOptions = computed(() => {
  const subject = tags.value.filter(tag => tag.type === 'subject');
  return subject.map(tag => ({label: tag?.name, value: tag?.id}))
})

const chapterOptions = computed(() => {
  if(subject.value) {
    const selectedSubject = tags.value.find(tag => tag.id == subject.value)
    if (selectedSubject) {
      SelectedChapter.value = selectedSubject.tags.filter(tag => tag.type === 'chapter');
      return SelectedChapter.value.map(tag => ({label: tag?.name, value: tag?.id})) || []
    }
  }
})

const topicOptions = computed(() => {
  if(chapter.value) {
    return SelectedChapter.value?.find(tag => tag.id == chapter.value)?.tags.filter(tag => tag.type === 'topic').map(tag => ({label: tag?.name, value: tag?.id})) || []
  }
})

const universityOptions = computed(() => {
  return tags.value.filter(tag => tag.type === 'university').map(tag => ({label: tag?.name, value: tag?.id}))
})

const unitOptions = computed(() => {
 if(university.value) {
   return tags.value.find(tag => tag.id == university.value)?.tags.filter(tag => tag.type === 'unit').map(tag => ({label: tag?.name, value: tag?.id})) || []
 }
})

const yearOptions = computed(() => {
  return tags.value.filter(tag => tag.type === 'year').map(tag => ({label: tag?.name, value: tag?.id}))
})


const init = async () => {
  const {data, error}  = await getData('admin/tags/all');
  if (error && error.value) {
    showToast('error', 'Failed to fetch tags. Please try again.')
  } else {
    tags.value = data.value.data
  }
}

const onSubmit = handleSubmit(async values => {
  emptyTagMessage.value = null;
  const filteredValues = Object.fromEntries(Object.entries(values).filter(([_, v]) => v !== undefined));
  const tag_ids = []
  for (const key in filteredValues) {
    tag_ids.push(filteredValues[key])
  }

  const payload = {
    tag_ids,
    mcq_ids: props.mcqIds,
  }
  if (tag_ids.length === 0) {
    emptyTagMessage.value = 'Please select at least one tag.'
    return
  }
  const {data, error} = await postData('admin/mcq/attach-tags', payload)
  if (error && error.value) {
    showToast('error', 'Failed to assign tags. Please try again.')
  } else {
    showToast('success', 'Tags assigned successfully.')
    emit('added', true)
    closeBtn.value?.click()
    handleReset()
  }
});

const closeModal = () => {
  handleReset()
  emptyTagMessage.value = null;
  dialog.value = false;
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
              <div class="my-2 grid grid-cols-3 gap-x-2 mt-4">
                <div>
                  <form-input-label label="Subject"/>
                  <form-input-select v-model="subject" v-bind="subjectAttrs" :error="errors.subject" :options="subjectOptions"/>
                  <form-input-error :message="errors.subject"/>
                </div>
                <div>
                  <form-input-label label="Chapter"/>
                  <form-input-select v-model="chapter" v-bind="chapterAttrs" :error="errors.chapter" :options="chapterOptions || []"/>
                  <form-input-error :message="errors.chapter"/>
                </div>
                <div>
                  <form-input-label label="Topic"/>
                  <form-input-select v-model="topic" v-bind="topicAttrs" :error="errors.topic" :options="topicOptions || []"/>
                  <form-input-error :message="errors.topic"/>
                </div>
              </div>
              <div class="my-3">
                <hr>
              </div>
              <div class="my-2 grid grid-cols-3 gap-x-2 my-4">
                <div>
                  <form-input-label label="University"/>
                  <form-input-select v-model="university" v-bind="universityAttrs" :error="errors.university" :options="universityOptions || []"/>
                  <form-input-error :message="errors.university"/>
                </div>
                <div>
                  <form-input-label label="Unit"/>
                  <form-input-select v-model="unit" v-bind="unitAttrs" :error="errors.unit" :options="unitOptions || []"/>
                  <form-input-error :message="errors.unit"/>
                </div>
                <div>
                  <form-input-label label="Year"/>
                  <form-input-select v-model="year" v-bind="yearAttrs" :error="errors.year" :options="yearOptions || []"/>
                  <form-input-error :message="errors.year"/>
                </div>
              </div>
            </div>
            <div v-if="emptyTagMessage">
              <p class="text-red-500">{{ emptyTagMessage }}</p>
            </div>
            <div class="flex gap-4 justify-end">
              <button @click="closeModal" type="button" ref="closeBtn" data-modal-hide="popup-modal-par" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                Close
              </button>
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
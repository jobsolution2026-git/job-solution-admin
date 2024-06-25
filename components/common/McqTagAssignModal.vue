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

const emit = defineEmits<{
  (e: 'update:imported', value: boolean): void;
}>()

const isLoading = ref<boolean>(false)
const closeBtn = ref<null | HTMLElement>(null);
const universities = ref<string[]>([])
const SelectedChapter = ref<string | null>(null)
const years = [
  {
    label: '1990',
    value: '1990'
  },
  {
    label: '1991',
    value: '1991'
  },
  {
    label: '1992',
    value: '1992'
  },
  {
    label: '1993',
    value: '1993'
  },
  {
    label: '1994',
    value: '1994'
  },
  {
    label: '1995',
    value: '1995'
  },
  {
    label: '1996',
    value: '1996'
  },
  {
    label: '1997',
    value: '1997'
  },
  {
    label: '1998',
    value: '1998'
  },
  {
    label: '1999',
    value: '1999'
  },
  {
    label: '2000',
    value: '2000'
  },
  {
    label: '2001',
    value: '2001'
  },
  {
    label: '2002',
    value: '2002'
  },
  {
    label: '2003',
    value: '2003'
  },
  {
    label: '2004',
    value: '2004'
  },
  {
    label: '2005',
    value: '2005'
  },
  {
    label: '2006',
    value: '2006'
  },
  {
    label: '2007',
    value: '2007'
  },
  {
    label: '2008',
    value: '2008'
  },
  {
    label: '2009',
    value: '2009'
  },
  {
    label: '2010',
    value: '2010'
  },
  {
    label: '2011',
    value: '2011'
  },
  {
    label: '2012',
    value: '2012'
  },
  {
    label: '2013',
    value: '2013'
  },
  {
    label: '2014',
    value: '2014'
  },
  {
    label: '2015',
    value: '2015'
  },
  {
    label: '2016',
    value: '2016'
  },
  {
    label: '2017',
    value: '2017'
  },
  {
    label: '2018',
    value: '2018'
  },
  {
    label: '2019',
    value: '2019',
  },
  {
    label: '2020',
    value: '2020'
  },
  {
    label: '2021',
    value: '2021'
  },
  {
    label: '2022',
    value: '2022'
  },
  {
    label: '2023',
    value: '2023'
  },
  {
    label: '2024',
    value: '2024'
  },
  {
    label: '2025',
    value: '2025'
  },
  {
    label: '2026',
    value: '2026'
  },
  {
    label: '2027',
    value: '2027'
  },
  {
    label: '2028',
    value: '2028'
  },
  {
    label: '2029',
    value: '2029'
  },
  {
    label: '2030',
    value: '2030'
  }
]

const {errors, handleSubmit, handleReset, defineField, setErrors} = useForm({
  validationSchema: yup.object({
    subject: yup.mixed().required(),
    chapter: yup.mixed().nullable(),
    topic: yup.mixed().nullable(),
    university: yup.mixed().required(),
    unit: yup.mixed().nullable(),
    year: yup.mixed().required(),
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
  const selectedSubject = tags.value.find(tag => tag.id == subject.value)
  if (selectedSubject) {
    SelectedChapter.value = selectedSubject.mcqTags.filter(tag => tag.type === 'chapter');
    return SelectedChapter.value.map(tag => ({label: tag?.name, value: tag?.id})) || []
  }
})

const topicOptions = computed(() => {
  return SelectedChapter.value?.find(tag => tag.id == chapter.value)?.mcqTags.filter(tag => tag.type === 'topic').map(tag => ({label: tag?.name, value: tag?.id})) || []
})

const universityOptions = computed(() => {
  return universities.value.map(university => ({label: university?.title, value: university?.id}))
})

const unitOptions = computed(() => {
  const selectedUniversity = universities.value.find(university => university.id == university.value)
  return selectedUniversity?.units.map(unit => ({label: unit?.name, value: unit?.id})) || []
})


const init = async () => {
  const {data, error}  = await getData('admin/mcq-tags/all');
  if (error && error.value) {
    showToast('error', 'Failed to fetch tags. Please try again.')
  } else {
    tags.value = data.value.data
  }
}

const getUniversity = async () => {
  const {data, error}  = await getData('admin/universities/all');
  if (error && error.value) {
    showToast('error', 'Failed to fetch universities. Please try again.')
  } else {
    universities.value = data.value.data
  }
}


const onSubmit = handleSubmit(async values => {
  console.log(values)
  closeBtn.value?.click()
  handleReset()
})

// call function

await init()
await getUniversity()
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
                <div v-if="subject">
                  <form-input-label label="Chapter"/>
                  <form-input-select v-model="chapter" v-bind="chapterAttrs" :error="errors.chapter" :options="chapterOptions"/>
                  <form-input-error :message="errors.chapter"/>
                </div>
                <div v-if="chapter">
                  <form-input-label label="Topic"/>
                  <form-input-select v-model="topic" v-bind="topicAttrs" :error="errors.topic" :options="topicOptions"/>
                  <form-input-error :message="errors.topic"/>
                </div>
              </div>
              <div class="my-3">
                <hr>
              </div>
              <div class="my-2 grid grid-cols-3 gap-x-2 my-4">
                <div>
                  <form-input-label label="University"/>
                  <form-input-select v-model="university" v-bind="universityAttrs" :error="errors.university" :options="universityOptions"/>
                  <form-input-error :message="errors.university"/>
                </div>
                <div v-if="university && unitOptions?.length">
                  <form-input-label label="Unit"/>
                  <form-input-select v-model="unit" v-bind="unitAttrs" :error="errors.unit" :options="unitOptions"/>
                  <form-input-error :message="errors.unit"/>
                </div>
                <div>
                  <form-input-label label="Year"/>
                  <form-input-select v-model="year" v-bind="yearAttrs" :error="errors.year" :options="years"/>
                  <form-input-error :message="errors.year"/>
                </div>
              </div>
            </div>
            <div class="flex gap-4 justify-end">
              <button type="button" ref="closeBtn" data-modal-hide="popup-modal-par" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
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
<script setup lang="ts">
import {useForm} from "vee-validate";
import * as yup from "yup";

const route = useRoute()
const exam = ref<object>({})
const tags = ref<string[]>([])
const mcqs = ref<string[]>([])
const oldMcqs = ref<number[]>([])
const questionId = ref<string | null>(null)
const isMcqLoading = ref<boolean>(false)
const selectedMcqIds = ref<number[]>([])
const isLoading = ref<boolean>(false)
const SelectedChapter = ref<string | null>(null);
const showForm = ref<boolean >(true);
const dialog = ref<boolean>(false)

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
const [difficulty, difficultyAttrs] = defineField('difficulty');
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
const difficultyOptions = computed(() => {
  return tags.value.filter(tag => tag.type === 'difficulty').map(tag => ({label: tag?.name, value: tag?.id}))
})

const init = async () => {
  const {data, error}  = await getData('admin/tags/all');
  if (error && error.value) {
    showToast('error', 'Failed to fetch tags. Please try again.')
  } else {
    tags.value = data.value.data
  }
}
const fetchExam = async () => {
  const {data, error}  = await getData('admin/exams/'+route.query.contentable_slug);
  if (error && error.value) {
    showToast('error', 'Failed to fetch tags. Please try again.')
  } else {
    exam.value = data.value.data
    if (exam.value.question && Object.keys(exam.value.question).length > 0) {
      questionId.value = exam.value.question.id
      // mcqs.value = exam.value.question.body.sections[0].questions
      oldMcqs.value = exam.value.question.body.sections[0].questions.map(mcq => mcq.id)
      console.log(oldMcqs.value)
    }
  }
}

const searchMcq = handleSubmit(async values => {
  if (values && !Object.keys(values).length) {
    showToast('error', 'Please select at least one tag')
  } else {
    // showForm.value = false
    let payload = []
    for (const [key, value] of Object.entries(values)) {
      if (value) {
        payload.push(value)
      }
    }
    isMcqLoading.value = true
    const {data, error} = await postData('admin/mcq/search-by-tag', {tag_ids: payload})
    if (error && error.value) {
      showToast('error', 'An error occurred while searching for questions')
    } else {
      mcqs.value = data.value.data
    }
    isMcqLoading.value = false
  }
});
// call function
await init()
await fetchExam()

const addIntoSelectedMcqIds = (id: number) => {
  if (selectedMcqIds.value.includes(id)) {
    selectedMcqIds.value = selectedMcqIds.value.filter(mcqId => mcqId !== id)
  } else {
    selectedMcqIds.value.push(id)
  }
}

const checkAllMcq = computed(() => {
  return mcqs.value.length === selectedMcqIds.value.length
})

const selectAndUnselectAll = () => {
  if (checkAllMcq.value) {
    selectedMcqIds.value = []
  } else {
    selectedMcqIds.value = mcqs.value.map(mcq => mcq.id)
  }
}

const assignMcq = async () => {
  if (selectedMcqIds.value.length) {
    const payload = {
      exam_id: route.params.id,
      body: {
        max_sections: 1,
        sections: [
          {
            title: 'default',
            required: true,
            questions: oldMcqs.value && oldMcqs.value.length ?  oldMcqs.value.concat(selectedMcqIds.value) : selectedMcqIds.value
          }
        ]
      }
    }
    isLoading.value = true
    let url = 'admin/questions'
    if (questionId.value) {
      url += `/${questionId.value}`
      payload._method = 'PUT'
    }
    const {data, error} = await postData(url, payload)
    if (error && error.value) {
      showToast('error', 'An error occurred while assigning questions')
    } else {
      showToast('success', 'Questions assigned successfully')
      // handleReset()
      selectedMcqIds.value = []
      await fetchExam()
    }
    isLoading.value = false
  } else {
    showToast('error', 'Please select at least one question')
  }
}
const updateMcqDeleteFromExam = (event: object) => {
  questionId.value = event.id
  // mcqs.value = event.body.sections[0].questions
  oldMcqs.value = event.body.sections[0].questions.map(mcq => mcq.id)
}
</script>

<template>
  <section class="py-3 sm:py-5">
    <form v-if="showForm" class="px-4 mx-auto max-w-screen-2xl lg:px-12" @submit.prevent="searchMcq">
      <div class="my-2 grid grid-cols-3 gap-x-2">
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
      <div class="grid grid-cols-3 gap-x-2 my-4">
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
      <div class="my-2 grid grid-cols-3 gap-x-2 align-middle mb-2">
        <div>
          <form-input-label label="Difficulty"/>
          <form-input-select v-model="difficulty" v-bind="difficultyAttrs" :error="errors.difficulty" :options="difficultyOptions || []"/>
          <form-input-error :message="errors.year"/>
        </div>
      </div>
      <div class="mt-2 flex justify-center gap-2">
        <button type="submit" class="text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800 font-medium rounded-lg text-xs inline-flex items-center px-5 py-2.5 text-center">
          <svg v-if="isMcqLoading" aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
          </svg>
          Search Questions
        </button>
        <common-assigned-questions :exam="exam" @update:deleted="updateMcqDeleteFromExam($event)" />
      </div>
    </form>
    <div  class="mt-4">
      <div v-if="mcqs && mcqs.length" class="flex flex-wrap justify-between fixed bottom-2 right-2">
        <div>
          <button @click="selectAndUnselectAll" class="mr-2 text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-xs inline-flex items-center px-3 py-2 text-center">
            {{ checkAllMcq ? 'Unselect All' : 'Select All' }}
          </button>
          <button type="button" @click="assignMcq" class=" inline-flex items-center px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Assign
            <span class="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
              {{ selectedMcqIds.length }}
            </span>
          </button>
        </div>
        <button @click="showForm = !showForm" class="ml-2 text-white bg-yellow-600 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 font-medium rounded-lg text-xs inline-flex items-center px-3 py-2 text-center">
          {{ showForm ? 'Hide Search' : 'Show Search' }}
        </button>
      </div>
      <div class="mt-4">
        <div v-if="mcqs && mcqs.length" class="grid gap-4 sm:grid-cols-2">
          <div v-for="(mcq, i) in mcqs" :key="mcq.id" @click="addIntoSelectedMcqIds(mcq.id)" :class="{ 'bg-primary-100': selectedMcqIds.includes(mcq.id) }" class="p-4 border rounded-lg cursor-pointer">
            <div>
              <div class="flex gap-1">
                {{i+1}}. <div v-katex="mcq.question" class="latex"></div>
              </div>
              <img v-if="mcq.question_image" :src="mcq.question_image" class="w-20 h-20 object-cover rounded-lg" alt="question image"/>
              <div class="mt-2 grid grid-cols-2 gap-4 mb-2">
                <div v-for="option in ['a', 'b', 'c', 'd', 'e']" :key="option">
                  <span v-if="mcq.answer === option" class="inline-block px-2 py-1 ml-2 text-xs font-medium text-white bg-green-700 rounded-full dark:bg-green-600">{{ option }}</span>
                  <span v-else-if="mcq[option]" class="inline-block px-2 py-1 ml-2 text-xs font-medium text-white bg-gray-300 rounded-full dark:bg-gray-600 dark:text-gray-400">{{ option }}</span>
                  <span v-if="mcq[option]" class="ml-2 text-sm text-gray-500 dark:text-gray-400"><span v-katex="mcq[option]" class="latex"></span></span>
                </div>
              </div>
              <div>
                <div v-if="mcq?.tags" class="flex gap-2 flex-wrap mb-2">
                  <span>Tags: </span>
                  <div v-for="(tag,i) in mcq.tags" :key="i">
                    <small class="bg-yellow-600 rounded p-1 text-white">{{ tag.name }}</small>
                  </div>
                </div>
                <div v-if="mcq.answer_image">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">Answer image:</span>
                  <img  :src="mcq.answer_image" class="w-96 h-auto object-cover rounded-lg"
                        alt="answer image"/>
                </div>
                <div v-if="mcq.explanation" class="text-sm font-medium text-gray-900 dark:text-white max-w-xl text-wrap">Explanation: <span v-katex="mcq.explanation" class="latex"></span></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="text-center text-gray-500 dark:text-gray-400">No questions found.</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
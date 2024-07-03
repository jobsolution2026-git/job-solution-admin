<script setup lang="ts">
import {useForm} from "vee-validate";
import * as yup from "yup";

const tags = ref<string[]>([])

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

const searchMcq = handleSubmit(async values => {
  if (values && !Object.keys(values).length) {
    showToast('error', 'Please select at least one tag')
  } else {
    showForm.value = false
    console.log(values)
  }
});
// call function
await init()
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
      <div class="mt-6">
        <button type="submit" class="text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
          Search Questions
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>

</style>
<script setup lang="ts">
import {useForm} from "vee-validate";
import * as yup from "yup";

const loader = ref<boolean>(false)


const {errors, handleSubmit, handleReset, defineField, setErrors} = useForm({
  validationSchema: yup.object({
    text: yup.string().max(191).required(),
    numberInput: yup.number().min(1).required(),
    password: yup.string().min(8).required(),
    dateInput: yup.date().required(),
    timeInput: yup.string().required(),
    datetimeInput: yup.date().required(),
    checkbox: yup.string().required(),
    radio: yup.string().required(),
    select: yup.string().required(),
    file: yup.mixed().required(),
    switch: yup.boolean().required(),
    textarea: yup.string().required(),
  }),
});
//form fields
const [text, textAttrs] = defineField('text');
const [numberInput, numberInputAttrs] = defineField('numberInput');
const [password, passwordAttrs] = defineField('password');
const [dateInput, dateInputAttrs] = defineField('dateInput');
const [timeInput, timeInputAttrs] = defineField('timeInput');
const [datetimeInput, datetimeInputAttrs] = defineField('datetimeInput');
const [checkbox, checkboxAttrs] = defineField('checkbox');
const [radio, radioAttrs] = defineField('radio');
const [select, selectAttrs] = defineField('select');
const [file, fileAttrs] = defineField('file');
const [switchInput, switchAttrs] = defineField('switch');
const [textarea, textareaAttrs] = defineField('textarea');

const onSubmit = handleSubmit(async values => {
loader.value = true
  await new Promise(resolve => setTimeout(resolve, 2000))
  loader.value = false
})


const clear = () => {
  handleReset()
  setErrors({})
}
</script>
<template>
  <form @submit.prevent="onSubmit">
    <div class="grid gap-4 mb-4 sm:grid-cols-2">
      <div>
        <form-input-label label="Text"/>
        <form-input-text type="text" v-model="text" v-bind="textAttrs" :error="errors.text"/>
        <form-input-error :message="errors.text"/>
      </div>
      <div>
        <form-input-label label="Number"/>
        <form-input-text type="number" v-model="numberInput" v-bind="numberInputAttrs" :error="errors.numberInput"/>
        <form-input-error :message="errors.numberInput"/>
      </div>
      <div>
        <form-input-label label="Password"/>
        <form-input-text type="password" v-model="password" v-bind="passwordAttrs" :error="errors.password"/>
        <form-input-error :message="errors.password"/>
      </div>
      <div>
        <form-input-label label="Date"/>
        <form-input-text type="date" v-model="dateInput" v-bind="dateInputAttrs" :error="errors.dateInput"/>
        <form-input-error :message="errors.dateInput"/>
      </div>
      <div>
        <form-input-label label="Time"/>
        <form-input-text type="time" v-model="timeInput" v-bind="timeInputAttrs" :error="errors.timeInput"/>
        <form-input-error :message="errors.timeInput"/>
      </div>
      <div>
        <form-input-label label="Datetime"/>
        <form-input-text type="datetime-local" v-model="datetimeInput" v-bind="datetimeInputAttrs" :error="errors.datetimeInput"/>
        <form-input-error :message="errors.datetimeInput"/>
      </div>
      <div>
        <form-input-label label="Checkbox"/>
        <form-checkbox v-model="checkbox" v-bind="checkboxAttrs" :error="errors.checkbox" :options="[{label: 'Checkbox1', value: 'checkbox1'}, {label: 'Checkbox2', value: 'checkbox2'}]"/>
        <form-input-error :message="errors.checkbox"/>
      </div>
      <div>
        <form-input-label label="Radio"/>
        <form-radio v-model="radio" v-bind="radioAttrs" :error="errors.radio" :options="[{label: 'Radio1', value: 'radio1'}, {label: 'Radio2', value: 'radio2'}]"/>
        <form-input-error :message="errors.radio"/>
      </div>
      <div>
        <form-input-label label="Select"/>
        <form-input-select v-model="select" v-bind="selectAttrs" :error="errors.select" :options="[{label: 'Select1', value: 'select1'}, {label: 'Select2', value: 'select2'}]"/>
        <form-input-error :message="errors.select"/>
      </div>
      <div>
        <form-input-label label="Switch"/>
        <form-input-switch label="switch" v-model="switchInput" v-bind="switchAttrs" :error="errors.switch"/>
        <form-input-error :message="errors.switch"/>
      </div>
      <div>
        <form-input-label label="File"/>
        <form-input-file v-model="file" v-bind="fileAttrs" :error="errors.file"/>
        <form-input-error :message="errors.file"/>
      </div>
      <div class="sm:col-span-2">
        <form-input-label label="Textarea"/>
        <form-input-textarea :rows=4 v-model="textarea" v-bind="textareaAttrs" :error="errors.textarea"/>
        <form-input-error :message="errors.textarea"/>
      </div>
    </div>
    <div class="flex justify-end gap-2">
      <button type="submit"
              class="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        <svg v-if="loader" aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
        Save
      </button>
      <button @click="clear" ref="closeButton" type="button" class="text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
      >
        clear
      </button>
    </div>
  </form>
</template>
<script setup lang="ts">
interface Props {
  error?: undefined | string
  multiple?: boolean
  uploadPath?: string
  accept?: string
  maxFileSize?: number
}
const props = withDefaults(defineProps<Props>(), {
  label: 'Select Photo',
  multiple: false,
  uploadPath: 'uploads',
  accept: 'image/*',
  maxFileSize: 1000000
})

const emit = defineEmits<{
  (e: 'update:photoUploaded', value: string | string[]): void;
}>()

const input = ref<null |string | number >(null)

const isLoading = ref<boolean>(false)
let uploadPercentage = ref<number>(0)
let downloadPercentage = ref<number>(0)
let uploadedPhoto = ref<null | []>([])

watch(uploadedPhoto, async (newVal, oldVal) => {
  if (newVal) emit('update:photoUploaded', uploadedPhoto.value)
})

const submitHandler = async (event) => {
  for (const fileItem of event.target.files) {
    await upload(fileItem)
  }
}

const upload = async (file) => {
  isLoading.value = true
  const formData = new FormData()
  const extension = file.name.split('.').pop()
  const fileName = `${props.uploadPath}/${randomString(32)}.${extension}`
  formData.append('file_name', fileName)
  let signedUrl = ''
  const { data, pending, error, refresh } = await postData('get-signed-url', formData)
  if (error && error.value) {
    console.log(error.value)
  } else {
    signedUrl = data.value.signed_url
    const resp = await uploadFile(signedUrl, file)

    if (props.multiple) {
      uploadedPhoto.value.push(resp ? signedUrl : null)
    } else {
      uploadedPhoto.value = resp ? signedUrl : null
    }
    emit('update:photoUploaded', uploadedPhoto.value)
  }
  isLoading.value = false
}

const uploadFile = async (url, file = file) => {
  const xhr = new XMLHttpRequest()

  return await new Promise((resolve) => {
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        uploadPercentage.value = parseInt(Math.round((event.loaded / event.total) * 100))
      }

    })
    xhr.addEventListener('progress', (event) => {
      if (event.lengthComputable)
        downloadPercentage = parseInt(Math.round((event.loaded / event.total) * 100))
    })
    xhr.addEventListener('loadend', () => {
      resolve(xhr.readyState === 4 && xhr.status === 200)
    })
    xhr.onreadystatechange = function () {
      // if (xhr.readyState === 4 && xhr.status === 200) console.log(xhr.responseXML)
    }
    xhr.onload = function () {
      //
    }
    xhr.open('PUT', url, true)
    xhr.setRequestHeader('Content-Type', 'application/octet-stream')
    xhr.send(file)
  })
}
</script>

<template>
<div>
  <div>
    <input
        id="file"
        ref="input"
        type="file"
        :multiple="multiple"
        :accept="accept"
        @change="submitHandler"
        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        :class="error ? 'border-red-600 focus:ring-red-500 focus:border-red-500 dark:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500' : 'border-gray-300'"
    >
    <div class="mt-1 w-full bg-gray-200 rounded-full dark:bg-gray-700">
      <div v-if="uploadPercentage > 0" class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" :style="{width: `${uploadPercentage}%`}">{{ uploadPercentage }}%</div>
    </div>
  </div>
</div>
</template>

<style scoped>

</style>
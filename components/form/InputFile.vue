<script setup lang="ts">
defineProps<{
  error?: undefined | string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>()

const input = ref<null |string | number >(null)
</script>

<template>
<div>
  <input
      id="multiple_files"
      type="file"
      multiple
      class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
      :class="error ? 'border-red-600 focus:ring-red-500 focus:border-red-500 dark:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500' : 'border-gray-300'"
  >
</div>
</template>

<style scoped>

</style>
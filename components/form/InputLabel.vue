<script setup lang="ts">
const props = defineProps<{
  label?: string
}>()
</script>

<template>
  <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    <span v-if="props.label">{{ props.label }}</span>
    <span v-else><slot /></span>
  </label>
</template>

<style scoped>

</style>
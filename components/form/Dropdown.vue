<script setup lang="ts">
interface Option {
  label: string
  value: string | number
}
defineProps<{
  modelValue: string | number | undefined
  options: Option[] | string[] | number[]
  ItemLabel?: string
  ItemValue?: string
  error?: undefined | string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>()

const input = ref<null |string | number >(null)

onMounted(() => {
  if (input?.value?.hasAttribute('autofocus')) {
    input.value.focus();
  }
});

defineExpose({ focus: () => input?.value?.focus() });
</script>

<template>
  <select
    ref="input"
    :class="[
      'bg-gray-50 border sm:text-sm rounded-lg block w-full p-2.5',
      'focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
      error ? 'border-red-600 focus:ring-red-500 focus:border-red-500 dark:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500' : 'border-gray-300'
    ]"
    :value="modelValue"
    @input="$emit('update:modelValue', $event?.target?.value)"
  >
    <template v-if="itemLabel && itemValue">
      <option v-for="option in options" :value="option[itemValue]">{{ option[itemLabel] }}</option>
    </template>
    <template v-else>
      <option v-for="option in options" :value="option">{{ option }}</option>
    </template>
  </select>
</template>

<style scoped>

</style>
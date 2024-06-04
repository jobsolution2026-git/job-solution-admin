<script setup lang="ts">

interface Option {
  label: string
  value: string
}

const props = defineProps<{
  modelValue: undefined | string[]
  options: Option[],
  error?: undefined | string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[] ): void;
}>()

const selectedItems = ref<string[]>(Array.isArray(props.modelValue) ? props.modelValue : [])

const update = (value: string) => {
  if (selectedItems.value.includes(value)) {
    selectedItems.value = selectedItems.value.filter((item) => item !== value)
  } else {
    selectedItems.value.push(value)
  }
  emit('update:modelValue', selectedItems.value)
}

watch(() => props.modelValue, (newValue) => {
  if (Array.isArray(newValue)) {
    selectedItems.value = newValue
  } else {
    selectedItems.value = []
  }
})

</script>

<template>
  <div>
    <label for="groups" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Groups:</label>
    <div class="flex gap-3">
      <div v-for="option in options" :key="option.value" class="flex items-center">
        <input
            :id="option.value"
            type="checkbox"
            :value="option.value"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            :checked="selectedItems.includes(option.value)"
            @change="update(option.value)"
        />
        <label :for="option.value" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"> {{ option.label }}</label>
      </div>
    </div>
    <p class="mt-2 text-sm text-red-600 dark:text-red-500">{{ error }}</p>
  </div>
</template>
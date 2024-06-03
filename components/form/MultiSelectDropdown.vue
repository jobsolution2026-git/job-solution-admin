<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface Option {
  value: number;
  label: string;
}

const props = defineProps<{
  options: Option[],
  oldValue: string | string[],
  editMode: boolean,
  error?: undefined | string
}>();

const emit = defineEmits<{
  (e: 'update', value: number[]): void;
}>();

const isOpen = ref(false);
const selectedOptions = ref<Option[]>([]);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (option: Option) => {
  if (!selectedOptions.value.includes(option)) {
    selectedOptions.value.push(option);
    emit('update', selectedOptions.value.map(o => o.value));
  }
};

const removeOption = (option: Option) => {
  selectedOptions.value = selectedOptions.value.filter(o => o.value !== option.value);
  emit('update', selectedOptions.value.map(o => o.value));
};

const handleClickOutside = (event: MouseEvent) => {
  if (!(event.target as HTMLElement).closest('.relative')) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);

  // Initialize selectedOptions with oldValue
  // selectedOptions.value = props.options.filter(option => props.oldValue.includes(option.value));
  // emit('update', selectedOptions.value.map(o => o.value));
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

watch(() => props.editMode, (newValue, oldValue) => {
  if (props.editMode) {
    selectedOptions.value = props.options.filter(option => props.oldValue.includes(option.value));
  } else {
    selectedOptions.value = [];
  }
});
</script>

<template>
  <div class="relative">
    <label for="groups" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Batches:</label>
    <div
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        @click="toggleDropdown"
    >
      <div v-if="selectedOptions.length === 0" class="block text-sm font-medium text-gray-900 dark:text-white">Select Batch</div>
      <div v-else>
        <span v-for="option in selectedOptions" :key="option.value" class="inline-block bg-blue-500 text-white rounded-full px-2 py-1 text-xs mr-1">
          {{ option.label }}
          <span @click.stop="removeOption(option)" class="ml-1 cursor-pointer">&times;</span>
        </span>
      </div>
    </div>
    <div v-if="isOpen" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600">
      <div v-for="option in options" :key="option.value"
           class="p-2.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700  dark:text-white"
           @click="selectOption(option)">
        {{ option.label }}
      </div>
    </div>
    <p class="mt-2 text-sm text-red-600 dark:text-red-500">{{ error }}</p>
  </div>
</template>

<style scoped>
/* Add any additional styling here */
</style>

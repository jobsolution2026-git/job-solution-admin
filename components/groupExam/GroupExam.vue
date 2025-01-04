<template>
  <div class="my-5" v-if="hideAll">
    <!-- Max sections input and Go button -->
    <div v-if="!getSubjectNumber" class="max-w-md mx-auto">
      <div class="flex gap-2">
        <div class="w-full">
          <label class="block text-sm font-medium mb-1 whitespace-nowrap">Max Required Sections</label>
          <input
              type="number"
              v-model="maxRequiredSections"
              max="5"
              min="1"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="w-full">
          <label class="block text-sm font-medium mb-1 whitespace-nowrap">Max Sections</label>
          <input
              type="number"
              v-model="maxSections"
              max="5"
              min="1"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div class="flex justify-end mt-1 w-full">
        <button
            class="px-12 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click="makeItOk"
        >
          Go
        </button>
      </div>
    </div>

    <div v-if="done" class="max-w-3xl mx-auto mt-6 p-6 border rounded-lg bg-gray-50">
      <form @submit.prevent="addSubject">
        <div
            v-for="(item, i) in subjects"
            :key="i"
            class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
        >
          <div>
            <label class="block font-bold mb-2">Subject Title {{ i + 1 }}</label>
            <input
                required
                type="text"
                v-model="item.title"
                class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter subject title"
            />
          </div>
          <div class="flex items-center">
            <input
                type="checkbox"
                v-model="item.required"
                class="mr-2 focus:ring-blue-500"
            />
            <span class="font-medium">Required</span>
          </div>
        </div>
        <div class="flex justify-end mt-3">
          <button
              type="submit"
              class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['subjects']);
const maxSections = ref(1);
const done = ref(false);
const subjects = ref([]);
const hideAll = ref(true);
const getSubjectNumber = ref(false);
const maxRequiredSections = ref(1);

const makeItOk = () => {
  getSubjectNumber.value = true
  subjects.value = [];
  done.value = true;
  for (let i = 0; i < maxSections.value; i++) {
    subjects.value.push({
      title: '',
      required: false,
      questions: [],
    });
  }
};

const addSubject = () => {
  hideAll.value = false;
  emit('subjects', {
    sections: subjects.value,
    max_sections: maxSections.value,
    max_required_sections: maxRequiredSections.value,
  });
};
</script>

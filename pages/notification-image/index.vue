<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { PageInfo } from '~/interfaces/pageinfo';
import type { Loader } from '~/interfaces/loader';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useTable } from '~/composables/useTable';
import { postData, deleteData } from '~/composables/useRequest';
import { useNotificationImageStore } from '~/stores/notificationImage';

const pageInfo = ref<PageInfo>({
  title: 'Notification Image',
  description: 'Manage all your Notification Images here',
  apiUrl: '/admin/notification-images',
});

useHead({ title: `Manage ${pageInfo.value.title}` });

const loader = ref<Loader>({
  isLoading: false,
  isSubmitting: false,
});

const store = useNotificationImageStore();
onMounted(() => {
  store.fetchImages();
});

// Modal + Form State
const dialog = ref(false);
const editMode = ref(false);
const selectedItem = ref<any>(null);
const oldImage = ref<any>(null);
const previewUrl = ref<string | null>(null);

// Table
const {
  itemsPerPage,
  itemsPerPageOptions,
  currentPage,
  startItem,
  endItem,
  search,
  totalItems,
  totalPages,
  paginatedItems,
} = useTable(computed(() => store.items));

// Form
const { errors, handleSubmit, handleReset, defineField, setErrors } = useForm({
  validationSchema: yup.object({
    titel: yup.string().required().max(191),
    description: yup.string().required(),
    // image: yup.mixed().required(),
  }),
});

const [titel, titelAttrs] = defineField('titel');
const [description, descriptionAttrs] = defineField('description');
const [image, imageAttrs] = defineField('image');

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    image.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const openModal = (item: any = null) => {
  handleReset();
  oldImage.value = null;
  previewUrl.value = null;

  if (item) {
    selectedItem.value = item;
    editMode.value = true;
    titel.value = item.titel;
    description.value = item.description;
    oldImage.value = { link: item.image.link };
  } else {
    selectedItem.value = null;
    editMode.value = false;
  }
  dialog.value = true;
};

const closeModal = () => {
  handleReset();
  selectedItem.value = null;
  dialog.value = false;
  editMode.value = false;
  previewUrl.value = null;
  oldImage.value = null;
};

const submitSuccess = (item: any, msg: string) => {
  if (editMode.value) {
    store.updateImage(item);
  } else {
    store.addImage(item);
  }
  closeModal();
  showToast('success', msg);
};

const onSubmit = handleSubmit(async (values) => {
  loader.value.isSubmitting = true;

  const formData = new FormData();
  formData.append('titel', values.titel);
  formData.append('description', values.description);
  formData.append('image', values.image);

  let url = pageInfo.value.apiUrl;
  let msg = `New ${pageInfo.value.title} created successfully!`;

  if (editMode.value && selectedItem.value?.id) {
    url = `${pageInfo.value.apiUrl}/${selectedItem.value.id}`;
    formData.append('_method', 'PUT');
    msg = `${pageInfo.value.title} updated successfully!`;
  }

  const { data, error } = await postData(url, formData);
  if (error?.value) {
    if (error.value.statusCode === 422) {
      setErrors(error.value.data.errors);
    } else {
      showToast('error', 'Something went wrong');
    }
  } else {
    submitSuccess(data.value.data, msg);
  }

  loader.value.isSubmitting = false;
});

const deleteItem = async (id: number) => {
  const url = `${pageInfo.value.apiUrl}/${id}`;
  const { error } = await deleteData(url);
  if (error?.value) {
    showToast('error', 'Failed to delete item.');
  } else {
    store.removeImage(id);
    showToast('success', 'Item deleted successfully');
  }
};

const copyImageLink = (link: string) => {
  navigator.clipboard.writeText(link).then(() => {
    showToast('success', 'Image link copied!');
  }).catch(() => {
    showToast('error', 'Failed to copy image link');
  });
};
</script>

<template>
  <div class="p-4">
    <!-- Header -->
    <div class="flex justify-between mb-4 items-center">
      <input v-model="search" type="text" placeholder="Search by titel" class="border px-3 py-2 rounded w-64" />
      <button @click="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded">+ Add</button>
    </div>

    <!-- Notification Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in paginatedItems"
        :key="item.id"
        class="border p-4 rounded shadow flex flex-col justify-between"
      >
        <img :src="item.image" class="h-40 object-cover mb-2 rounded" />

        <h3 class="font-semibold text-lg">{{ item.titel }}</h3>
        <p class="text-gray-600 text-sm">{{ item.description }}</p>
        <div class="flex justify-end gap-3 mt-4">
          <button @click="copyImageLink(item.image)" class="text-indigo-600 text-sm">Copy Link</button>
          <button @click="openModal(item)" class="text-blue-600 text-sm">Edit</button>
          <button @click="deleteItem(item.id)" class="text-red-500 text-sm">Delete</button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex justify-center items-center gap-2">
      <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 border rounded-l">Prev</button>
      <span class="px-4 py-1 border-t border-b">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 border rounded-r">Next</button>
    </div>

    <!-- Modal -->
    <div v-if="dialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow">
        <h2 class="text-xl font-semibold mb-4">
          {{ editMode ? 'Edit Notification' : 'Add Notification' }}
        </h2>
        <form @submit.prevent="onSubmit">
          <div class="mb-4">
            <label class="block mb-1 font-medium">titel</label>
            <input v-model="titel" v-bind="titelAttrs" type="text" class="w-full border px-3 py-2 rounded" />
            <p class="text-sm text-red-500" v-if="errors.titel">{{ errors.titel }}</p>
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Description</label>
            <textarea v-model="description" v-bind="descriptionAttrs" class="w-full border px-3 py-2 rounded" />
            <p class="text-sm text-red-500" v-if="errors.description">{{ errors.description }}</p>
          </div>
          <div class="mb-4">
            <label class="block mb-1 font-medium">Image</label>
            <form-input-file class="grow" v-model="image" v-bind="imageAttrs" :error="errors.image" />
            <common-old-image class="flex-none mt-2" v-if="oldImage" :image="oldImage" @update:delete="oldImage = null" />
            <img v-if="previewUrl" :src="previewUrl" class="mt-3 h-32 rounded object-cover" />
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="closeModal" class="px-4 py-2 border rounded">Cancel</button>
            <button :disabled="loader.isSubmitting" type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
              {{ loader.isSubmitting ? 'Saving...' : editMode ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {PageInfo} from "~/interfaces/pageinfo";
import type {Loader} from "~/interfaces/loader";
import {useForm} from "vee-validate";
import * as yup from "yup";
import {useBatchStore} from "~/stores/batch";

interface User {
  id: number
  name: string
}

const users = ref<User>();

const query = ref<string>('');
const filteredUsers = ref([])
const selectedUser = ref<User>()

const pageInfo = ref<PageInfo>({
  title: 'Users',
  description: 'Manage all your Users here',
  apiUrl: '/admin/batch-users',
});

useHead({title: `Manage ${pageInfo.value.title}`});
const loader = ref<Loader>({
  isLoading: false,
  isSubmitting: false,
});

const batchStore = useBatchStore();

if (batchStore.batches && batchStore.batches.length < 1) {
  batchStore.fetchBatches();
}


//form
const {errors, handleSubmit, handleReset, defineField, setErrors} = useForm({
  validationSchema: yup.object({
    batch_id: yup.number().required(),
    validity: yup.string().min(0).required(),
    amount: yup.number().min(0).nullable(),
  }),
  initialValues: {
    batch_id: 1,
    validity: '',
    amount: null,
  },
});
//form fields
const [batch_id, batchAttrs] = defineField('batch_id');
const [validity, validityAttrs] = defineField('validity');
const [amount, amountAttrs] = defineField('amount');


const onSubmit = handleSubmit(async values => {
  let url = pageInfo.value.apiUrl;
  values['user_id'] = selectedUser?.value?.id
  const {data, error} = await postData(url, values);
  if (error && error.value) {
    showToast('error', 'An error occurred while deleting the item');
  } else {
    handleReset();
    showToast('success', 'User added successfully');
  }
});

const handleSearch = async() => {
  if (query.value.length > 2) {
    const {data, error} = await getData('/admin/users?search=' + query.value);
    if (error && error.value) {
      showToast('error', 'An error occurred while searching for users');
    } else {
      filteredUsers.value = data?.value as User[]
    }
  }
}

const handleSelectUser = (user) => {
  selectedUser.value = user
  query.value = user.name
  filteredUsers.value = []
}

</script>

<template>
  <section class="py-3 sm:py-5">
    <div class="px-4 mx-auto max-w-xl lg:px-12 ng-white dark:bg-gray-800 py-12 rounded">
      <form @submit.prevent="onSubmit">
        <div class="grid gap-4 mb-4 sm:grid-cols-2">
          <div class="col-span-2">
            <form-input-label label="Search for a user"/>
            <div class="relative w-full">
              <input
                  required
                  type="text"
                  v-model="query"
                  @input="handleSearch"
                  class="w-full rounded focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search for a user..."
              />
              <ul v-if="filteredUsers.length > 0" class="absolute left-0 w-full mt-2 bg-gray-200 border sm:text-sm rounded-lg block w-full p-2.5">
                <li
                    v-for="user in filteredUsers"
                    :key="user.id"
                    @click="handleSelectUser(user)"
                    class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {{ user.name }}
                </li>
              </ul>
            </div>
          </div>
          <div class="col-span-2">
            <form-input-label label="Select batch"/>
            <form-input-select v-model="batch_id" v-bind="batchAttrs" :error="errors.batch_id"
                               :options="batchStore.filterForSelect"/>
            <form-input-error :message="errors.batch_id"/>
          </div>
          <div class="col-span-2">
            <form-input-label label="Validity"/>
            <form-date-time-picker type="date" v-model="validity" v-bind="validityAttrs"
                                   :error="errors.validity"/>
            <form-input-error :message="errors.validity"/>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button type="submit"
                  class="px-8 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
            Add
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>

</style>
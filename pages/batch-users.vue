<script setup lang="ts">
import type {PageInfo} from "~/interfaces/pageinfo";
import type {Loader} from "~/interfaces/loader";
import {useForm} from "vee-validate";
import * as yup from "yup";
import {useUserStore} from "~/stores/user";

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
const userStore = useUserStore();

if (batchStore.batches && batchStore.batches.length < 1) {
  batchStore.fetchBatches();
}

if (userStore.users && userStore.users.length < 1) {
  userStore.fetchUsers();
}


//form
const {errors, handleSubmit, handleReset, defineField, setErrors} = useForm({
  validationSchema: yup.object({
    user_id: yup.number().required(),
    batch_id: yup.number().min(1).required(),
    validity: yup.string().min(0).required(),
    amount: yup.number().min(0).nullable(),
  }),
});
//form fields
const [user_id, user_idAttrs] = defineField('user_id');
const [batch_id, batchAttrs] = defineField('batch_ids');
const [validity, validityAttrs] = defineField('validity');
const [amount, amountAttrs] = defineField('amount');


const onSubmit = handleSubmit(async values => {
  let url = pageInfo.value.apiUrl;
  const {data, error} = await postData(url, values);
  if (error && error.value) {
    showToast('error', 'An error occurred while deleting the item');
  } else {
    handleReset();
    showToast('error', 'User added successfully');
  }
});
</script>

<template>
  <section class="py-3 sm:py-5">
    <div class="px-4 mx-auto max-w-xl lg:px-12 ng-white dark:bg-gray-800 py-12 rounded">
      <form @submit.prevent="onSubmit">
        <div class="grid gap-4 mb-4 sm:grid-cols-2">
          <div class="col-span-2">
            <form-input-label label="Select bathes"/>
            <form-input-select v-model="batch_id" v-bind="batchAttrs" :error="errors.batch_id"
                               :options="batchStore.filterForSelect"/>
            <form-input-error :message="errors.batch_id"/>
          </div>
          <div class="col-span-2">
            <form-input-label label="Select users"/>
            <form-input-select v-model="user_id" v-bind="user_idAttrs" :error="errors.user_id"
                               :options="userStore.filterForSelect"/>
            <form-input-error :message="errors.user_id"/>
          </div>
          <div class="col-span-2">
            <form-input-label label="Validity"/>
            <form-date-time-picker type="datetime-local" v-model="validity" v-bind="validityAttrs"
                                   :error="errors.validity"/>
            <form-input-error :message="errors.validity"/>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button type="submit"
                  class="px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
            Add
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>

</style>
<script setup lang="ts">
import { ref } from 'vue';
import type { PageInfo } from '~/interfaces/pageinfo';

const iframeUrl = ref("https://billing.nextivesolution.com/project/cm45663xl0001nf615ydjerip");
const isLoading = ref(true);

// Page info setup
const pageInfo = ref<PageInfo>({
  title: 'Billings',
  description: 'Billings',
  apiUrl: '/admin/billings',
});

// Update the page title dynamically
useHead({ title: `Manage ${pageInfo.value.title}` });

// Event to mark iframe as loaded
const onIframeLoad = () => {
  isLoading.value = false;
};
</script>

<template>
  <div class="billing-page">
    <!-- Loader -->
    <div v-if="isLoading" class="loader-container">
        <common-loader/>
      <p>Loading... Please wait.</p>
    </div>

    <!-- Embed the external page -->
    <iframe
      :src="iframeUrl"
      class="iframe-container"
      frameborder="0"
      allowfullscreen
      @load="onIframeLoad"
      v-show="!isLoading"
    ></iframe>
  </div>
</template>

<style scoped>
.billing-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh; 
  position: relative; 
  background-color: #f8f9fa; 
}

/* Loader container for styling */
.loader-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 16px;
  color: #555;
}

/* Iframe styles */
.iframe-container {
  width: 100%;
  height: 100%;
  border: none; 
}
</style>

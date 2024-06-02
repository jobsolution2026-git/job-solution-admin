<template>
  <NuxtLayout>
      <NuxtPage/>
  </NuxtLayout>
</template>
<script setup>
import { initFlowbite } from 'flowbite'

const route = useRoute()
// initialize components based on data attribute selectors


watch(() => route.path, () => {
  initFlowbite();
})
</script>

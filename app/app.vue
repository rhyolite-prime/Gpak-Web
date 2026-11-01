<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <NuxtPage />
  <ScrollToTop v-if="!route.path.startsWith('/self-service/quotation/')" />
</template>

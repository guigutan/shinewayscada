<!-- src/components/tp-title.vue -->
<template>
  <div v-if="loading" class="loading">加载中...</div>
  <div v-else class="title">{{ title }}</div>
</template>

<script setup lang="ts">
const { title = '标题', loading = false } = defineProps<{
  title?: string
  loading?: boolean
}>()
</script>

<style scoped>
.title {
  font-size: 24px;
  font-weight: bold;
  margin: 20px 0;
}
.loading {
  color: #666;
  font-size: 18px;
}
</style>
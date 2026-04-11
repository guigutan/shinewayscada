<!-- src/components/tp-title.vue -->
<template>
  <div v-if="loading" class="loading">加载中...</div>
  <div v-else ></div>
</template>




<script setup lang="ts">
import { computed } from 'vue'   
    import {loadDataTotal, type TotalSumResult } from '../api/GetTotal.ts' 
    interface Props {sourceList?: TotalSumResult[],loading?:boolean } 
    const myProps = defineProps<Props>()
    const myData = computed(() => {return myProps.sourceList}) 
</script>

<style scoped>

</style>
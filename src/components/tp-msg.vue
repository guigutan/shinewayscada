<template>

    <div v-if="loading" >加载中...</div>
     <div v-else class="floorMsg">{{ thisMsg }}</div>

</template>

<script setup lang="ts">

    import { computed } from 'vue' 
    interface Props {msg?: string,loading?:boolean} 
    const myProps = defineProps<Props>() 
    const thisMsg = computed(() => {return myProps.msg})     
        
</script>

<style scoped></style>
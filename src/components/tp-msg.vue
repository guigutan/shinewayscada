<!-- src\components\tp-msg.vue -->

<template>

    <div v-if="loading" >加载中...</div>
     <div v-else class="floorMsg" :class="{'floorMsg--warning':myProps.warning}" :title="thisMsg">{{ thisMsg }}</div>

</template>

<script setup lang="ts">

    import { computed } from 'vue' 
    interface Props {msg?: string,loading?:boolean,warning?:boolean} 
    const myProps = defineProps<Props>() 
    const thisMsg = computed(() => {return myProps.msg})     
        
</script>

<style scoped>

.floorMsg{
    width: 100%;
    min-width: 0;
    background-color: rgb(56, 117, 141);
    height: 40px;
    line-height: 40px;
    padding: 0 5px;   
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 5px;

}
.floorMsg--warning{background:#68481d;color:#fff2d7;font-weight:700}

</style>

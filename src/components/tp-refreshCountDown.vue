<template>

     <div v-if="loading" >加载中...</div>
     <div v-else class="sc-refreshCountDown"><span>{{ Mydata }}</span> 秒后刷新</div>

</template>

<script setup lang="ts">

    import { computed } from 'vue' 
    interface Props {refreshCountDown?: number,loading?:boolean} 
    const myProps = defineProps<Props>() 
    const Mydata = computed(() => {return myProps.refreshCountDown})    
        
</script>

<style scoped>
.sc-refreshCountDown{
    color: rgb(157, 194, 206);
    font-size: larger;
   
    margin-top: 20px;
}
.sc-refreshCountDown span{
    font-size: 24px;
    color:#fff;
     font-weight: bold;
}


</style>
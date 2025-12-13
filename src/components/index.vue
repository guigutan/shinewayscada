<script setup lang="ts">    
    import left from './left.vue';
    import right from './right.vue';
</script>

<template>
    <div class="sc-top"> <left/><right/></div>    
    <div class="sc-content"> <router-view /></div>
</template>

<style scoped>
    .sc-top{
         display: flex;
         display: -webkit-flex;   
         padding: 1rem;
         justify-content: space-between;         
    }
    .sc-content{
        width: 100%;
        margin: 0;        
        padding: 0;
    }
</style>

<script setup lang="ts">
 import {ref} from "vue";
    const items = ref([{ message: 'Foo' }, { message: 'Bar' }])

    console.log(items);


</script>

<template>    
    <div class="floorMsg">floorMsg</div>
    <div class="boxMachine">
     <!-- <div class="boxitem"> <img src="../assets/CNC80.png" class="MachineImg" alt=""> <div class="MachineName">C1</div></div> -->       

   <div class="boxitem" v-for="n in 100"> <img src="../assets/CNC80.png" class="MachineImg" alt=""> <div class="MachineName">C{{n }}</div></div>
       
           
        



    </div>
</template>

<style scoped>
    
</style>

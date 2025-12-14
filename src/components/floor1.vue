<script setup lang="ts">
    import {ref} from "vue";
    const mydata=[{MachineName:'C1' ,LedStatus: '1' }, {MachineName:'C2' ,LedStatus: '2' }, {MachineName:'C3' ,LedStatus: '3' }];
    const items = ref(mydata)
    console.log(items);


</script>

<template>    
    <div class="floorMsg">floorMsg</div>
    <div class="boxMachine">
     <!-- <div class="boxitem"> <img src="../assets/CNC80.png" class="MachineImg" alt=""> <div class="MachineName">C1</div></div> -->
   <div class="boxitem" v-for="info in items"> 
        <img src="../assets/CNC80.png" class="MachineImg" alt=""> 
        <div class="MachineName">{{info.MachineName }}</div>
    </div>
       
           
        



    </div>
</template>

<style scoped>
    
</style>

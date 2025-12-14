<script setup lang="ts">
    import {ref} from "vue";
    const mydata=[{MachineName:'C1' ,LedStatus: '1' }, {MachineName:'C2' ,LedStatus: '2' }, {MachineName:'C3' ,LedStatus: '3' }];
    const items = ref(mydata)
   

    
    import { LedStatus, type LedStatusRow } from '@/api/LedStatus';
    const barcode = ref('');
    const data = ref<LedStatusRow[]>([]);
    const loading = ref(false);

    const query = async () => {
    loading.value = true;
    try {
        const res = await LedStatus(barcode.value);
        if (res.data.success) {
        data.value = res.data.data;
        console.log(data);
        } else {
        alert('查询失败');
        }
    } catch (e) {
        alert('网络错误');
        console.error(e);
    } finally {
        loading.value = false;
    }
    };


</script>

<template>    
    <div class="floorMsg"><button @click="query" class="sc-button">查询</button>
    <input v-model="barcode" placeholder="输入条码（支持模糊查询）" @keyup.enter="query" />
</div>
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

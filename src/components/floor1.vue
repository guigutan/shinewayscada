<!--//src/components/floor1.vue-->
<script setup lang="ts">


  import { ref, onMounted } from "vue"; // 引入 onMounted 钩子
  import { LedStatus, type LedStatusRow } from '@/api/LedStatus';

  const scadano = ref('202512141442'); 
  const data = ref<LedStatusRow[]>([]);
  const loading = ref(false);

  import { useLedStatusStore } from '@/store/LedStatus'; // 引入
  const LedStatusStore = useLedStatusStore();

  const query = async () => {
    loading.value = true;
    try {

        const res = await LedStatus(scadano.value); 
        if (res.data.success) {

          data.value = res.data.data;    
          console.log("接口返回数据:", data.value);       
          LedStatusStore.setData(data.value); // 存储到 Store          

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

  // 2. 组件挂载时自动调用查询函数
  onMounted(() => {
    query();
  });


</script>

<template>    
    <div class="floorMsg">floorMsg</div>
    <div class="boxMachine">
       <!-- <div class="boxitem"> <img src="../assets/CNC80.png" class="MachineImg" alt=""> <div class="MachineName">C1</div></div> -->
      <div class="boxitem" v-for="info in data"> 
            <img src="../assets/CNC80.png" class="MachineImg" alt=""> 
            <div class="MachineName" :class="`LedStatus${info.LedStatus}` ">{{info.MachineNO}}</div>
        </div>
    </div>
</template>

<style scoped>    
  .LedStatus0{background-color: darkgray;}
  .LedStatus1{background-color: green;}
  .LedStatus2{background-color: yellow;color: black;}
  .LedStatus3{background-color: red;}
</style>

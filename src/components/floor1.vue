<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs';


import tpTitle from '../components/tp-title.vue'
import tpLed from '../components/tp-led.vue'
import tpClock from '../components/tp-clock.vue'
import tpMenu from '../components/tp-menu.vue'
import tpMsg from '../components/tp-msg.vue'
import tpBoxMachine from '../components/tp-boxMachine.vue'

import { loadDataMachineLedStatus, type TScadaData } from '../api/GetMachineLedStatus.ts'

const dataListMachineLedStatus = ref<TScadaData[]>([])
const loading = ref(true)
const area = ref("一楼")
const title = ref("一楼CNC机台设备")
const currentPath = ref("/floor1") 
const Msg = ref("这里是机台动态信息") 


onMounted(async () => {
  loading.value = true

  try {
    dataListMachineLedStatus.value = await loadDataMachineLedStatus()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

</script>



<template>
   <tpTitle :title="title"  :loading="loading"  />
   <tpLed :sourceList="dataListMachineLedStatus"  :loading="loading"  />
   <tpClock/>
  <tpMenu :currentPath="currentPath" />
  <tpMsg :msg="Msg" :loading="loading"/>
  <tpBoxMachine :sourceList="dataListMachineLedStatus" :loading="loading" />



</template>


<style scoped> 

</style>
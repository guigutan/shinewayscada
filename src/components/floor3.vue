<template>
  <div class="floorRow1">
    <div>
      <tpTitle :title="title" :loading="loading" />
      <tpClock />
      <tpMenu :currentPath="currentPath" :loading="loading" />
    </div>
    <div>
      <tpLed :sourceList="dataListMachineLedStatus" :loading="loading" />
    </div>
    <div class="tpTotal">
      <tpTotal :sourceList="dataListTotalSumToday" :totalTitle="totalTitleToday" :timePoint="timePointToday" :loading="loading" />
      <tpTotal :sourceList="dataListTotalSumLast" :totalTitle="totalTitleLast" :timePoint="timePointLast" :loading="loading" />
      <tpTotal :sourceList="dataListTotalSumThis" :totalTitle="totalTitleThis" :timePoint="timePointThis" :loading="loading" />
      <tpRefreshCountDown :refreshCountDown="refreshCountDown" :loading="loading" />
    </div>
  </div>

  <div class="floorRow2"> <tpMsg :msg="Msg" :loading="loading"/> </div>
  <div class="floorRow3"><tpBoxMachine :sourceList="dataListMachineLedStatus" :loading="loading" /></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs';
import { getShiftInfo } from './myfunc/getShiftInfo.ts'
import tpTitle from '../components/tp-title.vue'
import tpLed from '../components/tp-led.vue'
import tpClock from '../components/tp-clock.vue'
import tpMenu from '../components/tp-menu.vue'
import tpMsg from '../components/tp-msg.vue'
import tpBoxMachine from '../components/tp-boxMachine.vue'
import tpTotal from '../components/tp-total.vue'
import tpRefreshCountDown from '../components/tp-refreshCountDown.vue'

import { loadDataMachineLedStatus, type TScadaData } from '../api/GetMachineLedStatus.ts'
import { loadDataTotal, type TotalSumResult } from '../api/GetTotal.ts'



const dataListMachineLedStatus = ref<TScadaData[]>([])
const loading = ref(true)
const area = ref("三楼")
const title = ref("三楼机台设备")
const currentPath = ref("/floor3")
const Msg = ref("这里将显示机台的动态告警信息")

const dataListTotalSumToday = ref<TotalSumResult[]>()
const totalTitleToday = ref("")
const timePointToday = ref("")
const dataListTotalSumLast = ref<TotalSumResult[]>()
const totalTitleLast = ref("")
const timePointLast = ref("")
const dataListTotalSumThis = ref<TotalSumResult[]>()
const totalTitleThis = ref("")
const timePointThis = ref("")

// ==============================
// 封装加载数据方法（核心）
// ==============================
const loadAllData = async () => {
  loading.value = true
  try {
    const now = Date.now()
    const tomorrow = now + 86400000
    const shiftInfo = getShiftInfo(dayjs(now).format('YYYY-MM-DD HH:mm:ss'))

    dataListMachineLedStatus.value = await loadDataMachineLedStatus(Number(dayjs(now).format('YYYYMMDDHHmm')), area.value)

    dataListTotalSumToday.value = await loadDataTotal(Number(dayjs(now).format('YYYYMMDD') + "0000"), Number(dayjs(tomorrow).format('YYYYMMDD') + "0000"), area.value)
    totalTitleToday.value = "今日产量";
    timePointToday.value = dayjs(now).format('DD') + "号00点-" + dayjs(now).format('DD') + "号24点"

    dataListTotalSumLast.value = await loadDataTotal(Number(shiftInfo.LastT1), Number(shiftInfo.LastT2), area.value)
    totalTitleLast.value = "上一班(" + shiftInfo.LastShift + ")";
    timePointLast.value = shiftInfo.LastT1.slice(6, 8) + "号" + shiftInfo.LastT1.slice(8, 10) + "点-" + shiftInfo.LastT2.slice(6, 8) + "号" + shiftInfo.LastT2.slice(8, 10) + "点"

    dataListTotalSumThis.value = await loadDataTotal(Number(shiftInfo.ThisT1), Number(shiftInfo.ThisT2), area.value)
    totalTitleThis.value = "当前班(" + shiftInfo.ThisShift + ")";
    timePointThis.value = shiftInfo.ThisT1.slice(6, 8) + "号" + shiftInfo.ThisT1.slice(8, 10) + "点-" + shiftInfo.ThisT2.slice(6, 8) + "号" + shiftInfo.ThisT2.slice(8, 10) + "点"

  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
    // 刷新完重置倒计时
    refreshCountDown.value = 60
  }
}

// ==============================
// 倒计时 + 自动刷新
// ==============================
let timer: number | null = null
const refreshCountDown = ref(60) // 👈 倒计时变量

onMounted(() => {
  loadAllData()

  // 每秒执行一次
  timer = window.setInterval(() => {
    refreshCountDown.value--
    
    // 倒计时到 0，刷新数据
    if (refreshCountDown.value <= 0) {
      loadAllData()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
</style>
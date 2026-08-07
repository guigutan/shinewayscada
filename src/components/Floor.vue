<!-- src/components/Floor.vue -->
<template>
  <div class="floorRow1">
    <div>
      <tpTitle :title="title" :loading="loading" />
      <tpClock :time="time" :date="date" :week="week" />
      <tpMenu :currentPath="currentPath" :loading="loading" />
    </div>
    <div>
      <tpLed :sourceList="dataListMachineLedStatus" :loading="loading" />
    </div>
    <div class="tpTotal">
      <tpTotal 
        :sourceList="dataListTotalSumToday" 
        :totalTitle="totalTitleToday" 
        :timePoint="timePointToday" 
        :loading="loading" 
      />
      <tpTotal 
        :sourceList="dataListTotalSumLast" 
        :totalTitle="totalTitleLast" 
        :timePoint="timePointLast" 
        :loading="loading" 
      />
      <tpTotal 
        :sourceList="dataListTotalSumThis" 
        :totalTitle="totalTitleThis" 
        :timePoint="timePointThis" 
        :loading="loading" 
      />
      <tpRefreshCountDown :refreshCountDown="refreshCountDown" :loading="loading" />
    </div>
  </div>

  <div class="floorRow2"> 
    <tpMsg :msg="Msg" :loading="loading"/> 
  </div>
  
  <div class="floorRow3">
    <tpBoxMachine :sourceList="dataListMachineLedStatus" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'

import { getShiftInfo } from './myfunc/getShiftInfo'

import tpTitle from '../components/tp-title.vue'
import tpLed from '../components/tp-led.vue'
import tpClock from '../components/tp-clock.vue'
import tpMenu from '../components/tp-menu.vue'
import tpMsg from '../components/tp-msg.vue'
import tpBoxMachine from '../components/tp-boxMachine.vue'
import tpTotal from '../components/tp-total.vue'
import tpRefreshCountDown from '../components/tp-refreshCountDown.vue'

import {
  loadDashboardSnapshot,
  type TScadaData,
  type TotalSumResult,
} from '../api/scada'

// ==================== 路由参数处理（适配 /floor1 /floor2 /floor3） ====================
const route = useRoute()

const floorNum = computed(() => {
  const param = String(route.params.floor || '1')
  // 提取数字（兼容 floor1、floor2、floor3）
  const match = param.match(/(\d+)/)
  return match ? match[1] : '1'
})

// ==================== 数字转中文楼层映射（解决数据库查询问题） ====================
const areaMap: Record<string, string> = {
  '1': '一楼',
  '2': '二楼',
  '3': '三楼'
}

//const area = computed(() => areaMap[floorNum.value] || `${floorNum.value}楼`)
// 修复后代码
const area = computed(() => areaMap[floorNum.value ?? 0] || `${floorNum.value}楼`)

const title = computed(() => `${area.value}机台设备`)
const currentPath = computed(() => `/floor${floorNum.value}`)   // 重要：传给菜单用

const Msg = ref("这里将显示机台的动态告警信息")

// ==================== 响应式数据 ====================
const time = ref('')
const date = ref('')
const week = ref('')

const dataListMachineLedStatus = ref<TScadaData[]>([])
const loading = ref(true)
const refreshing = ref(false)

const dataListTotalSumToday = ref<TotalSumResult[]>([])
const totalTitleToday = ref("")
const timePointToday = ref("")

const dataListTotalSumLast = ref<TotalSumResult[]>([])
const totalTitleLast = ref("")
const timePointLast = ref("")

const dataListTotalSumThis = ref<TotalSumResult[]>([])
const totalTitleThis = ref("")
const timePointThis = ref("")

const refreshCountDown = ref(60)

// ==================== 更新时间 ====================
const updateTime = () => {
  const now = new Date()
  time.value = now.toTimeString().slice(0, 8)
  date.value = now.toISOString().slice(0, 10)

  const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  week.value = weeks[now.getDay()] ?? '星期未知'
}

// ==================== 核心数据加载 ====================
const loadAllData = async () => {
  if (refreshing.value) return
  refreshing.value = true
  const initialLoad = dataListMachineLedStatus.value.length === 0
  if (initialLoad) loading.value = true
  try {
    const now = Date.now()
    const tomorrow = now + 86400000
    const shiftInfo = getShiftInfo(dayjs(now).format('YYYY-MM-DD HH:mm:ss'))

    console.log(`正在加载 ${area.value} 数据...`)   // 调试用，看控制台

    const snapshot = await loadDashboardSnapshot({
      scadaNo: Number(dayjs(now).subtract(1, 'minute').format('YYYYMMDDHHmm')),
      area: area.value,
      todayStart: Number(dayjs(now).format('YYYYMMDD') + "0000"),
      todayEnd: Number(dayjs(tomorrow).format('YYYYMMDD') + "0000"),
      lastStart: Number(shiftInfo.LastT1),
      lastEnd: Number(shiftInfo.LastT2),
      currentStart: Number(shiftInfo.ThisT1),
      currentEnd: Number(shiftInfo.ThisT2),
    })
    dataListMachineLedStatus.value = snapshot.machines
    dataListTotalSumToday.value = [{ sum: { WkcntrSum: snapshot.totals.today } }]
    dataListTotalSumLast.value = [{ sum: { WkcntrSum: snapshot.totals.last } }]
    dataListTotalSumThis.value = [{ sum: { WkcntrSum: snapshot.totals.current } }]

    totalTitleToday.value = "今日产量"
    timePointToday.value = dayjs(now).format('DD') + "号00点-" + dayjs(now).format('DD') + "号24点"

    totalTitleLast.value = `上一班(${shiftInfo.LastShift})`
    timePointLast.value = 
      shiftInfo.LastT1.slice(6, 8) + "号" + shiftInfo.LastT1.slice(8, 10) + "点-" +
      shiftInfo.LastT2.slice(6, 8) + "号" + shiftInfo.LastT2.slice(8, 10) + "点"

    totalTitleThis.value = `当前班(${shiftInfo.ThisShift})`
    timePointThis.value = 
      shiftInfo.ThisT1.slice(6, 8) + "号" + shiftInfo.ThisT1.slice(8, 10) + "点-" +
      shiftInfo.ThisT2.slice(6, 8) + "号" + shiftInfo.ThisT2.slice(8, 10) + "点"

  } catch (err) {
    console.error('加载数据失败:', err)
  } finally {
    loading.value = false
    refreshing.value = false
    refreshCountDown.value = 60
  }
}

// ==================== 监听 area 变化，切换楼层时自动刷新数据 ====================
watch(area, (newArea) => {
  if (newArea) {
    console.log(`检测到楼层切换 → ${newArea}，开始重新加载数据...`)
    loadAllData()
  }
}, { immediate: true })

// ==================== 定时器（时钟 + 倒计时） ====================
const isSec=30;// 到每分的30秒时刷新数据

let timer: number | null = null
let sec = new Date().getSeconds()

const startTimer = () => {
  // 清除旧定时器（防止切换楼层后多个定时器并存）
  if (timer) {
    clearInterval(timer)
  }

  timer = window.setInterval(() => {

    
    updateTime()
    sec = new Date().getSeconds()       
    if (sec==isSec) { loadAllData() } // 到每分的30秒时刷新数据
    
   

    
    refreshCountDown.value = sec <= isSec ? isSec - sec : 60 - sec + isSec 
      
      

   


  }, 1000)
}

// ==================== 生命周期 ====================
onMounted(() => {
  console.log(`当前页面: /floor${floorNum.value} → area = ${area.value}`)

  updateTime()        // 立即更新一次时间
  startTimer()        // 启动定时器
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<style scoped>
/* 你的样式粘贴在这里 */
</style>

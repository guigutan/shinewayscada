<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'
import { getShiftInfo } from './myfunc/getShiftInfo'
import { analyticsParams } from './myfunc/analyticsParams'
import tpClock from './tp-clock.vue';import tpMenu from './tp-menu.vue';import tpLed from './tp-led.vue';import tpMsg from './tp-msg.vue';import tpBoxMachine from './tp-boxMachine.vue';import tpTotal from './tp-total.vue';import tpRefreshCountDown from './tp-refreshCountDown.vue';import ProductionReport from './ProductionReport.vue'
import { loadDashboardSnapshot,loadProductionReport,type ProductionMetric,type TScadaData } from '../api/scada'

const route=useRoute(),areaMap:Record<string,string>={'1':'一楼','2':'二楼','3':'三楼'},emptyMetric=():ProductionMetric=>({standard:0,actual:0,rate:null})
const floorNum=computed(()=>String(route.params.floor||'1').match(/\d+/)?.[0]||'1'),area=computed(()=>areaMap[floorNum.value]||`${floorNum.value}楼`),view=computed(()=>String(route.params.view||'status'))
const time=ref(''),date=ref(''),week=ref(''),machines=ref<TScadaData[]>([]),unplanned=ref<string[]>([]),refreshing=ref(false),error=ref(''),countdown=ref(60)
const today=ref<ProductionMetric>(emptyMetric()),last=ref<ProductionMetric>(emptyMetric()),current=ref<ProductionMetric>(emptyMetric()),todayPoint=ref(''),lastPoint=ref(''),currentPoint=ref(''),lastTitle=ref(''),currentTitle=ref('')
const message=computed(()=>unplanned.value.length?`最近1小时有 ${unplanned.value.length} 台机台有实际产出，但未排产。请及时排产以保证数据准确。机台为：${unplanned.value.join('，')}`:'设备实时状态与产量每分钟自动更新')
const updateClock=()=>{const now=new Date();time.value=now.toTimeString().slice(0,8);date.value=dayjs(now).format('YYYY-MM-DD');week.value=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'][now.getDay()]??''}
const shiftPoint=(value:string)=>`${value.slice(6,8)}号 ${value.slice(8,10)}点`
const load=async()=>{if(refreshing.value||view.value!=='status')return;refreshing.value=true;error.value='';try{const now=dayjs(),shift=getShiftInfo(now.format('YYYY-MM-DD HH:mm:ss')),params=analyticsParams(area.value);const [snapshot,report]=await Promise.all([loadDashboardSnapshot({scadaNo:Number(now.subtract(1,'minute').format('YYYYMMDDHHmm')),area:area.value,todayStart:params.todayStart,todayEnd:params.todayEnd,lastStart:params.lastStart,lastEnd:params.lastEnd,currentStart:params.currentStart,currentEnd:params.currentEnd}),loadProductionReport('machine',params)]);machines.value=snapshot.machines;unplanned.value=snapshot.unplannedMachines;today.value=report.totals.today;last.value=report.totals.last;current.value=report.totals.current;todayPoint.value=`${now.format('DD')}号 00点~当前`;lastTitle.value=`上一班（${shift.LastShift}）`;currentTitle.value=`当前班（${shift.ThisShift}）`;lastPoint.value=`${shiftPoint(shift.LastT1)}~${shiftPoint(shift.LastT2)}`;currentPoint.value=`${shiftPoint(shift.ThisT1)}~${shiftPoint(shift.ThisT2)}`}catch(e){error.value=e instanceof Error?e.message:'看板数据加载失败'}finally{refreshing.value=false;countdown.value=60}}
watch([area,view],()=>void load(),{immediate:true})
let timer:number|undefined
onMounted(()=>{updateClock();timer=window.setInterval(()=>{updateClock();const second=new Date().getSeconds();countdown.value=second<=30?30-second:90-second;if(second===30)void load()},1000)})
onUnmounted(()=>{if(timer)clearInterval(timer)})
</script>
<template><div class="scada-shell"><header class="scada-header"><div class="scada-brand"><span>SHINEWAY</span><strong>{{area}}智能制造看板</strong><tpRefreshCountDown :refreshCountDown="countdown"/><tpClock :time="time" :date="date" :week="week"/></div><div class="scada-controls"><tpMenu/></div></header>
  <template v-if="view==='status'"><section class="status-summary"><div class="led-wrap"><tpLed :sourceList="machines"/></div><tpTotal title="今日产量" :timePoint="todayPoint" :metric="today"/><tpTotal :title="lastTitle" :timePoint="lastPoint" :metric="last"/><tpTotal :title="currentTitle" :timePoint="currentPoint" :metric="current"/></section><div v-if="error" class="report-error">{{error}}</div><section class="status-message" :class="{'status-message--warning':unplanned.length}"><tpMsg :msg="message" :warning="Boolean(unplanned.length)"/></section><section class="machine-stage"><tpBoxMachine :sourceList="machines"/></section></template>
  <ProductionReport v-else :area="area" :dimension="view==='products'?'product':'machine'"/>
</div></template>

<script setup lang="ts">
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsType } from 'echarts/core'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { loadProductionReport, type ProductionReport, type ProductionReportRow } from '../api/scada'
import { analyticsParams } from './myfunc/analyticsParams'

const props=defineProps<{area:string;dimension:'product'|'machine'}>()
echarts.use([BarChart,LineChart,GridComponent,LegendComponent,TooltipComponent,CanvasRenderer])
const periods=[{key:'today',name:'当天'},{key:'last',name:'上一班'},{key:'current',name:'当前班'}] as const
const report=ref<ProductionReport|null>(null),selectedId=ref('totals'),loading=ref(false),error=ref(''),chartEl=ref<HTMLDivElement|null>(null)
let chart:EChartsType|null=null,timer:number|undefined
const label=computed(()=>props.dimension==='product'?'产品':'机台')
const selected=computed(()=>selectedId.value==='totals'?report.value?.totals:report.value?.rows.find(x=>x.id===selectedId.value))
const rate=(value:number|null)=>value===null?'—':`${value.toFixed(1)}%`
const number=(value:number)=>value.toLocaleString('zh-CN',{maximumFractionDigits:2})
const draw=()=>{if(!chartEl.value||!selected.value)return;chart??=echarts.init(chartEl.value);const hourly=selected.value.hourly;chart.setOption({animationDuration:350,grid:{left:48,right:48,top:52,bottom:42},tooltip:{trigger:'axis'},legend:{top:10,textStyle:{color:'#adc0cc'}},xAxis:{type:'category',data:hourly.map(x=>x.hour.slice(5,13)),axisLabel:{color:'#89a0ad',interval:2},axisLine:{lineStyle:{color:'#33505e'}}},yAxis:[{type:'value',name:'产量 pcs',nameTextStyle:{color:'#78909c'},axisLabel:{color:'#89a0ad'},splitLine:{lineStyle:{color:'#223d49'}}},{type:'value',name:'达成率',axisLabel:{color:'#89a0ad',formatter:'{value}%'},splitLine:{show:false}}],series:[{name:'标准产量',type:'bar',data:hourly.map(x=>x.standard),itemStyle:{color:'#d89b3c'},barMaxWidth:18},{name:'实际产量',type:'bar',data:hourly.map(x=>x.actual),itemStyle:{color:'#31b8a6'},barMaxWidth:18},{name:'达成率',type:'line',yAxisIndex:1,data:hourly.map(x=>x.rate),connectNulls:true,smooth:true,symbolSize:5,lineStyle:{color:'#e7edf0'},itemStyle:{color:'#e7edf0'}}]})}
const load=async()=>{loading.value=true;error.value='';try{report.value=await loadProductionReport(props.dimension,analyticsParams(props.area));if(selectedId.value!=='totals'&&!report.value.rows.some(x=>x.id===selectedId.value))selectedId.value='totals';await nextTick();draw()}catch(e){error.value=e instanceof Error?e.message:'产能报表加载失败'}finally{loading.value=false}}
const choose=(row:ProductionReportRow)=>{selectedId.value=row.id;nextTick(draw)}
const resize=()=>chart?.resize()
watch(()=>[props.area,props.dimension],()=>{selectedId.value='totals';void load()})
watch(selectedId,()=>nextTick(draw))
onMounted(()=>{void load();timer=window.setInterval(load,60_000);window.addEventListener('resize',resize)})
onUnmounted(()=>{if(timer)clearInterval(timer);window.removeEventListener('resize',resize);chart?.dispose()})
</script>

<template><main class="report-view"><header class="report-heading"><div><span>PRODUCTION ANALYTICS</span><h1>基于{{label}}报表</h1><p>{{area}} · 数据截至当前分钟 · 自动刷新</p></div><label>图表对象<select v-model="selectedId"><option value="totals">全部{{label}}汇总</option><option v-for="row in report?.rows" :key="row.id" :value="row.id">{{row.code}} · {{row.name}}</option></select></label></header>
  <div v-if="error" class="report-error">{{error}}</div><section class="metric-grid"><article v-for="item in periods" :key="item.key"><span>{{item.name}}</span><div><small>标准</small><strong>{{number(report?.totals[item.key]?.standard??0)}}</strong></div><div><small>实际</small><strong>{{number(report?.totals[item.key]?.actual??0)}}</strong></div><b :class="{'rate-good':(report?.totals[item.key]?.rate??0)>=90}">{{rate(report?.totals[item.key]?.rate??null)}}</b></article></section>
  <section class="chart-section"><header><div><h2>最近 24 小时</h2><span>{{selectedId==='totals'?`全部${label}汇总`:report?.rows.find(x=>x.id===selectedId)?.name}}</span></div><i v-if="loading">更新中</i></header><div ref="chartEl" class="production-chart"></div></section>
  <section class="report-table"><header><h2>{{label}}达成明细</h2><span>点击行切换上方趋势图</span></header><div class="report-table-wrap"><table><thead><tr><th rowspan="2">{{label}}</th><th v-for="period in periods" :key="period.key" colspan="3" :class="`period-group period-group--${period.key}`">{{period.name}}</th></tr><tr><template v-for="period in periods" :key="period.key"><th :class="`period-subhead period-subhead--${period.key} period-subhead--start`">标准</th><th :class="`period-subhead period-subhead--${period.key}`">实际</th><th :class="`period-subhead period-subhead--${period.key}`">达成率</th></template></tr></thead><tbody><tr v-if="loading&&!report"><td colspan="10">正在加载产能数据…</td></tr><tr v-else-if="!report?.rows.length"><td colspan="10">暂无{{label}}数据</td></tr><tr v-for="row in report?.rows" :key="row.id" :class="{selected:selectedId===row.id}" @click="choose(row)"><td><strong>{{row.code}}</strong><small>{{row.name}}</small></td><template v-for="period in periods" :key="period.key"><td :class="`period-cell period-cell--${period.key} period-cell--start`">{{number(row[period.key].standard)}}</td><td :class="`period-cell period-cell--${period.key}`">{{number(row[period.key].actual)}}</td><td :class="[`period-cell period-cell--${period.key}`,{'rate-good':(row[period.key].rate??0)>=90}]">{{rate(row[period.key].rate)}}</td></template></tr></tbody></table></div></section>
</main></template>

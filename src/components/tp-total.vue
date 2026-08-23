<script setup lang="ts">
import type { ProductionMetric } from '../api/scada'
defineProps<{title:string;timePoint:string;metric:ProductionMetric}>()
const number=(value:number)=>value.toLocaleString('zh-CN',{maximumFractionDigits:2})
const rate=(value:number|null)=>value===null?'—':`${value.toFixed(1)}%`
</script>
<template><section class="sc-table"><header><strong>{{title}}</strong><small>{{timePoint}}</small></header><div class="total-values"><span><small>标准</small><b>{{number(metric.standard)}}</b></span><span><small>实际</small><b>{{number(metric.actual)}}</b></span><span><small>达成率</small><b :class="{'rate-good':(metric.rate??0)>=90}">{{rate(metric.rate)}}</b></span></div></section></template>
<style scoped>.sc-table{min-width:0;padding:12px 14px;border:1px solid var(--line);border-radius:6px;background:var(--panel)}header{display:flex;align-items:flex-start;gap:3px;flex-direction:column;margin-bottom:10px}header strong{font-size:18px}header small{color:#ffb23e;font-size:11px}.total-values{display:grid;grid-template-columns:1fr;gap:5px}.total-values span{min-width:0;display:grid;grid-template-columns:70px minmax(0,1fr);align-items:center}.total-values small{color:var(--muted);font-size:14px}.total-values small,.total-values b{display:block}.total-values b{margin:0;overflow:hidden;font-size:19px;text-align:right;text-overflow:ellipsis;white-space:nowrap}.total-values span:nth-child(2) b{color:var(--teal)}.total-values span:nth-child(3) b{color:var(--amber)}</style>

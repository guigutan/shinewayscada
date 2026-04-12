<!-- src\components\tp-boxMachine.vue -->


<template>
  <div v-if="loading">加载中...</div>

  <div v-else class="boxMachine">
    <table class="sc-boxtable">
      <tbody>
        <tr v-for="m in myData.trCount" :key="m">
          <td v-for="n in myData.tdCount" :key="n">
            
            <!-- 机台图片 -->
            <template 
              v-for="item in myData.sourceList.filter((item) => item.MachineID?.colIndex === (m - 1) * myData.tdCount + n)"
              :key="item.MachineID?.MachineID"
            >
              <img 
                src="../assets/CNC60.png" 
                class="sc-MachineImg" 
                @click="openDialog(item)" 
              />
            </template>

            <div class="MachineName">
              <div class="divName " :class="`LedStatus${myData.sourceList.filter( (item) => item.MachineID?.colIndex === (m - 1) * myData.tdCount + n )[0]?.LedStatus}`">
                  {{myData.sourceList.filter((item) => item.MachineID?.colIndex === (m - 1) * myData.tdCount + n)[0]?.MachineID?.MachineNO}}
              </div>
            </div>

          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ====================== 原生弹窗（完美居中、浮动） ====================== -->
  <div v-if="dialogVisible" class="modal-mask" @click="closeDialog">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>设备详情：{{ currentData?.MachineID?.MachineNO }}</h3>
        <button class="close-btn" @click="closeDialog">×</button>
      </div>

      <div class="modal-body">
        <p>设备名称：{{ currentData?.MachineID?.FullName }}</p>
        <p>设备品牌：{{ currentData?.MachineID?.Brand }}</p>
        <p>设备型号：{{ currentData?.MachineID?.Model }}</p>
        <p>出厂日期：{{ dayjs(currentData?.MachineID?.OutDate).format('YYYY年MM月') ?? '' }}</p>
        <p>设备地址：<span style="font-weight: bold;">{{ currentData?.MachineID?.IpAddr }}</span></p>
        <p>当前采集时间点：{{ dayjs(currentData?.CreateTime).format('YYYY-MM-DD HH:mm:ss') ?? '' }}</p>
        <p>第[{{ currentData?.ScadaNO }}]分钟：</p>
        <p style="padding-left: 110px;">
          设备状态：
          <span class="sc-ledradius " :class="`LedStatus${currentData?.LedStatus}`">
            {{ 
            currentData?.LedStatus == -1 ? '通讯异常' :
            currentData?.LedStatus == 0 ? '绿灯' :
            currentData?.LedStatus == 1 ? '绿灯' :
            currentData?.LedStatus == 2 ? '黄灯' :
            currentData?.LedStatus == 3 ? '红灯' : '其他'
            }}
          </span>
        </p>
        <p style="padding-left: 110px;">工件计数：{{ currentData?.WkcntrNum }}</p>
        <p style="padding-left: 110px;">分钟产量：{{ currentData?.WkcntrCount }}</p>
        <p style="padding-left: 110px;">一产多件：{{ currentData?.OneToMany }}</p>
        <p style="padding-left: 110px;">产量换算：{{ currentData?.WkcntrCount }}x{{ currentData?.OneToMany }}={{ currentData?.WkcntrSum }}</p>

        <table class="sc-OneMachineDetail">
          <tbody>
            <tr class="sc-lastTime">
               <td v-for="item in HoursSum1">{{item.HourScadaNO.toString().slice(-2) }}点</td>             
            </tr>
            <tr>
              <td v-for="item in HoursSum1">{{ item.sum.WkcntrSum }}</td>       
            </tr>
            <tr class="sc-thisTime">
             <td v-for="item in HoursSum2">{{item.HourScadaNO.toString().slice(-2) }}点</td>
            </tr>
            <tr>
             <td v-for="item in HoursSum2">{{  item.sum.WkcntrSum == 0 ? '' : item.sum.WkcntrSum  }}</td>  
            </tr>          
          </tbody>         
        </table>




      </div>

      <div class="modal-footer">
        <button class="btn cancel" @click="closeDialog">关闭</button>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { type TScadaData } from '../api/GetMachineLedStatus.ts'
import dayjs from 'dayjs'
import { getShiftInfo } from './myfunc/getShiftInfo.ts'
import { loadDataHourWkcntrSum, type HourScadaSumItem } from '../api/GetHourWkcntrSum.ts'
import { generateHourList } from './myfunc/generateHourList.ts'

interface Props {
  sourceList?: TScadaData[]  
  loading?: boolean
}
const myProps = defineProps<Props>()

interface InfoData {
  sourceList: TScadaData[] 
  trCount: number
  tdCount: number
}

const myData = computed(() => {
  const info: InfoData = {
    sourceList: myProps.sourceList || [],   
    trCount: myProps.sourceList?.[0]?.MachineID?.trCount ?? 0,
    tdCount: myProps.sourceList?.[0]?.MachineID?.tdCount ?? 0
  }
  return info
})

//-----------------------------------------------------------------------
//------ 原生弹窗逻辑 ------------------
//-----------------------------------------------------------------------
  const dialogVisible = ref(false)
  const currentData = ref<TScadaData | null>(null)
  const HoursSum1 = ref<HourScadaSumItem[]>([])
  const HoursSum2 = ref<HourScadaSumItem[]>([])


  const openDialog = async (row: TScadaData) => {
          currentData.value = row
          dialogVisible.value = true

          const now = ref(Date.now())
          const testTime = computed(() => dayjs(now.value).format('YYYY-MM-DD HH:mm:ss'))
          const shiftInfo = getShiftInfo(testTime.value)
          const HourScadaNOList1 = generateHourList(shiftInfo.LastT1, shiftInfo.LastT2)
          const HourScadaNOList2 = generateHourList(shiftInfo.ThisT1, shiftInfo.ThisT2)

          // 提取当前页面所有机台的 ID
          const machineIds = myData.value.sourceList.map(item => item.MachineID?.MachineID) .filter(id => id != null) as number[]
          try {
                  const res1 = await loadDataHourWkcntrSum(shiftInfo.LastT1, shiftInfo.LastT2, machineIds)                 
                  const hourMap1 = new Map();res1.forEach(item => { hourMap1.set(item.HourScadaNO, item.sum.WkcntrSum);})                 

                  const res2 = await loadDataHourWkcntrSum(shiftInfo.ThisT1, shiftInfo.ThisT2, machineIds)
                  const hourMap2 = new Map();res2.forEach(item => { hourMap2.set(item.HourScadaNO, item.sum.WkcntrSum);}) 
                
                  HoursSum1.value = HourScadaNOList1.map(hour => {
                        const hourNum = Number(hour)
                        const wkcntrSum = hourMap1.get(hourNum) || '0'
                        return {HourScadaNO: hourNum, sum: { WkcntrSum: wkcntrSum}}
                  })
                  HoursSum2.value = HourScadaNOList2.map(hour => {
                        const hourNum = Number(hour)
                        const wkcntrSum = hourMap2.get(hourNum) || '0'
                        return {HourScadaNO: hourNum, sum: { WkcntrSum: wkcntrSum}}
                  })

          } catch (err) {
                  console.error('加载小时产量失败', err)
                  HoursSum1.value = []
                  HoursSum2.value = []
          }
  }
  const closeDialog = () => {
          dialogVisible.value = false
  }












</script>

<style scoped>
/* ====================== 弹窗样式（强制居中、浮在最上层） ====================== */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999 !important;
}

.modal-content {
  background: #fff;
  width: 680px;
  border-radius: 8px;
  position: relative;
  padding: 0;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-footer {
  padding: 15px;
  text-align: right;
  border-top: 1px solid #eee;
}

.btn {
  padding: 6px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel {
  background: #ccc;
}


/*---表格-- */


.sc-OneMachineDetail{
  border-collapse: collapse;  
 
}
.sc-OneMachineDetail td{
    margin: 0;
    padding: 3px;
    word-wrap: break-word;
    word-break: break-all;
    text-align: center;     
    border: 1px solid #767c80;
}

.sc-lastTime td{background-color:rgb(218, 215, 215);}
.sc-thisTime td{background-color: rgb(218, 215, 215);}














/* ====================== 本页样式 ====================== */
.sc-MachineImg {
  width: 65px;
  height: 65px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.sc-MachineImg:hover {
  transform: scale(1.1);
}

.MachineName {
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content:center;
  width: 100%;  
  background-color: transparent;
  color: white;
}
.MachineName .divName{
 min-width: 60px;
 padding: 3px; 
 border-radius: 5px;
 font-size:larger;
 text-align: center;
}

.LedStatus0 { background-color: rgb(18, 233, 29); }
.LedStatus1 { background-color: rgb(18, 233, 29); }
.LedStatus2 { background-color: yellow; color: #000; }
.LedStatus3 { background-color: red; }
.LedStatus-1 { background-color: rgb(160, 144, 144); }

.sc-boxtable {
  border-collapse: collapse;
  width: 100%;
}
.sc-boxtable tr{
    height: 60px;
}
.sc-boxtable td {
  padding: 0.3rem 1.5rem;
  min-width: 28px;
 
  text-align: center;
}
</style>
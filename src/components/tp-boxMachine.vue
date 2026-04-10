<template>
  <div v-if="loading">加载中...</div>

  <div v-else class="boxMachine">
    <table class="sc-boxtable">
      <tbody>
        <tr v-for="m in infoData.trCount" :key="m">
          <td v-for="n in infoData.tdCount" :key="n">
            <div
              v-if="
                infoData.sourceList.filter(
                  (item) => item.MachineID?.colIndex === (m - 1) * infoData.tdCount + n
                ).length > 0
              "
            >
              <img
                src="../assets/CNC60.png"
                class="sc-MachineImg"
                @click="
                  openDialog(
                    infoData.sourceList.filter(
                      (item) => item.MachineID?.colIndex === (m - 1) * infoData.tdCount + n
                    )[0]!
                  )
                "
              />
            </div>
            <div v-else></div>


            <div class="MachineName">
              <div class="divName "  :class="`LedStatus${infoData.sourceList.filter( (item) => item.MachineID?.colIndex === (m - 1) * infoData.tdCount + n )[0]?.LedStatus}`">
                  {{infoData.sourceList.filter((item) => item.MachineID?.colIndex === (m - 1) * infoData.tdCount + n)[0]?.MachineID?.MachineNO}}
              </div>
            </div>
            


          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 弹窗 -->
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
        <p>出厂日期：{{dayjs( currentData?.MachineID?.OutDate).format('YYYY年MM月')??"" }}</p>
        <p>设备地址：<span  style="font-weight: bold;" >{{ currentData?.MachineID?.IpAddr }}</span></p>
        <p>当前采集时间点：{{dayjs( currentData?.CreateTime).format('YYYY-MM-DD HH:MM:ss')??"" }}</p>
        <p>第[{{ currentData?.ScadaNO }}]分钟：</p>
        <p style="padding-left: 110px;">
          设备状态：
          <span class="sc-ledradius "  :class="`LedStatus${currentData?.LedStatus}`">
                {{ 
                 currentData?.LedStatus == -1 ? '通讯异常' :
                 currentData?.LedStatus== 0 ? '绿灯' :
                 currentData?.LedStatus== 1 ? '绿灯' :
                 currentData?.LedStatus == 2 ? '黄灯' :
                 currentData?.LedStatus == 3 ? '红灯' : '绿灯'
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
               <td v-for="item in dataMachineHoursSum1">{{item.HourScadaNO. slice(-2) }}点</td>             
            </tr>
            <tr>
              <td v-for="item in dataMachineHoursSum1">{{ item.HourWkcntrSum }}</td>       
            </tr>
            <tr class="sc-thisTime">
             <td v-for="item in dataMachineHoursSum2">{{item.HourScadaNO.slice(-2) }}点</td>
            </tr>
            <tr>
             <td v-for="item in dataMachineHoursSum2">{{ item.HourWkcntrSum }}</td>  
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





interface Props {
  sourceList?: TScadaData[]
  area?:""
  loading?: boolean
}
const myProps = defineProps<Props>()

interface InfoData {
  sourceList: TScadaData[]
  area:string
  trCount: number
  tdCount: number

}

const infoData = computed(() => {
  const info: InfoData = {
    sourceList: myProps.sourceList || [],
    area: myProps.area || "一楼",        // ← 加强默认值
    trCount: myProps.sourceList?.[0]?.MachineID?.trCount ?? 0,
    tdCount: myProps.sourceList?.[0]?.MachineID?.tdCount ?? 0
  }
  return info
})

//----------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------
//------------- 弹窗--------------------------------
import dayjs from 'dayjs';
import { getShiftInfo } from './myfunc/getShiftInfo';
import { loadDataHourWkcntrSum ,type HourWkcntrSumData} from '../api/GetHourWkcntrSum.ts'
const dialogVisible = ref(false)
const dataMachineHoursSum1= ref<HourWkcntrSumData[] | null>(null)
const dataMachineHoursSum2= ref<HourWkcntrSumData[] | null>(null)
const currentData = ref<TScadaData | null>(null)
const openDialog = async (row: TScadaData) => {
          currentData.value = row
          dialogVisible.value = true

        const now = ref(Date.now())
        const testTime = computed(() => dayjs(now.value).format('YYYY-MM-DD HH:mm:ss'))
        const shiftInfo = getShiftInfo(testTime.value)       

          // 关键修复：确保 area 不为空
          const currentArea = infoData.value.area || "一楼"   // 给默认值

          // dataMachineHoursSum1.value = await loadDataHourWkcntrSum("一楼", shiftInfo.ThisT1, shiftInfo.ThisT2)
          // console.log(dataMachineHoursSum1);


          try {
            dataMachineHoursSum1.value = await loadDataHourWkcntrSum(
              currentArea, 
              shiftInfo.LastT1, 
              shiftInfo.LastT2              
            )

            dataMachineHoursSum2.value = await loadDataHourWkcntrSum(
              currentArea, 
              shiftInfo.ThisT1, 
              shiftInfo.ThisT2
            )
          } catch (err) {
            console.error('加载小时产量失败', err)
            dataMachineHoursSum1.value = []
            dataMachineHoursSum2.value = []
          }
}
const closeDialog = () => {
      dialogVisible.value = false
}


</script>

<style scoped>
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



.LedStatus0 {
  background-color: rgb(18, 233, 29);
}
.LedStatus1 {
  background-color: rgb(18, 233, 29);
}
.LedStatus2 {
  background-color: yellow;
  color: #000;
}
.LedStatus3 {
  background-color: red;
}
.LedStatus-1 {
  background-color: rgb(160, 144, 144);
}

.sc-boxtable {
  border-collapse: collapse;
  width: 100%;
}
.sc-boxtable td {
  padding: 0.3rem 1.5rem;
  min-width: 28px;
  min-height: 28px;
  text-align: center;
}

/* 弹窗必须样式 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.modal-content {
  background: #fff;
  width: 450px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
.modal-header {
  padding: 0 18px;
  background: #f6f6f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-btn {
  background: #409eff;
  color: #fff;
  border-radius: 10px;
  border: none;
  width: 40px;
  height: 40px;
  font-size: 30px;
  cursor: pointer;
}
.modal-body {
  padding: 25px;
  line-height: 2;
  font-size:smaller;
  color: #292626ce;
}
.modal-body p{
  line-height: 10px;
}

.modal-body .sc-ledradius{ 
  border-radius: 5px;
  padding: 0 10px;
  color: white;
}

.modal-footer {
  padding: 12px 18px;
  background: #f9f9f9;
  text-align: right;
}
.btn {
  padding: 6px 14px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
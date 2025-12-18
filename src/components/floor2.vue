<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { LedStatus, type LedStatusRow } from '@/api/GetLed2F';
import { Sum1F, type Sum1FRow } from '@/api/GetSum2F';
// import left from './left.vue';
import { calcPercentage } from './myfunc/calcPercentage';
import { getShiftInfo } from './myfunc/getShiftInfo';
import dayjs from 'dayjs';


const now = ref(Date.now())

const time = computed(() => dayjs(now.value).format('HH:mm:ss'))
const date = computed(() => dayjs(now.value).format('YYYY/MM/DD'))
const week = computed(() => {
  const weekList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekList[new Date(now.value).getDay()] // getDay()返回0-6，对应数组索引
})


const testTime = computed(() => dayjs(now.value).format('YYYY-MM-DD HH:mm:ss'))
const today = computed(() => dayjs(now.value).format('DD'))
const tomorrow = computed(() => dayjs(now.value).add(1,'day').format('DD'))
const shiftInfo = getShiftInfo(testTime.value);

const scadano = ref(dayjs(now.value).format('YYYYMMDDHHmm'));  

const data = ref<LedStatusRow[]>([]);
const loading = ref(false);
const Count0=ref(0);
const Count1=ref(0);
const Count2=ref(0);
const Count3=ref(0);
const Count4=ref(0);
const CountAll=ref(0);

// 新增：倒计时变量（初始60秒）
const countdown = ref(60)
// 标记是否已在30秒执行过（避免重复执行）
const hasExecutedAt59s = ref(false)
// 定时器变量（用于卸载时清除）
let timeTimer: number | null = null

const query = async () => {
  loading.value = true;
  try {
    const res = await LedStatus(scadano.value); 
    if (res.data.success) {
      data.value = res.data.data;          
      console.log(res.data.data);     
      Count0.value = res.data.data.filter(item => item.LedStatus == '-1').length;
      Count1.value = res.data.data.filter(item => item.LedStatus == '1').length;
      Count2.value = res.data.data.filter(item => item.LedStatus == '2').length;
      Count3.value = res.data.data.filter(item => item.LedStatus == '3').length;
      Count4.value = res.data.data.filter(item => item.LedStatus == '4').length;

      Count1.value=Count1.value+Count4.value;//其他/待机=绿灯
      CountAll.value = res.data.data.length;         
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

const DayT1 = ref(dayjs(now.value).format('YYYYMMDD')+'0000');
const DayT2 = ref(dayjs(now.value).add(1,'day').format('YYYYMMDD')+'0000');
const LastT1 = ref(shiftInfo.LastT1);
const LastT2 = ref(shiftInfo.LastT2);
const ThisT1 = ref(shiftInfo.ThisT1);
const ThisT2 = ref(shiftInfo.ThisT2);

const querySum = async () => {
  loading.value = true;
  try {
    const res = await Sum1F(DayT1.value,DayT2.value,LastT1.value,LastT2.value,ThisT1.value,ThisT2.value); 
    if (res.data.success) {
      dataSum.value = res.data.data;           
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

const dataSum = ref<Sum1FRow[]>([]);  

// 封装执行逻辑（复用）
const executeQuery = () => {
  // 重新计算时间相关变量（保证最新）
  now.value = Date.now()
  scadano.value = dayjs(now.value).format('YYYYMMDDHHmm')
  const newShiftInfo = getShiftInfo(dayjs(now.value).format('YYYY-MM-DD HH:mm:ss'))
  DayT1.value = dayjs(now.value).format('YYYYMMDD')+'0000'
  DayT2.value = dayjs(now.value).add(1,'day').format('YYYYMMDD')+'0000'
  LastT1.value = newShiftInfo.LastT1
  LastT2.value = newShiftInfo.LastT2
  ThisT1.value = newShiftInfo.ThisT1
  ThisT2.value = newShiftInfo.ThisT2
  
  query()
  querySum()
}

// 检测秒数+更新倒计时
const checkSecond = () => {
  const currentSecond = dayjs().second() // 获取当前秒数
  now.value = Date.now() // 更新时间
  
  // 核心：倒计时计算逻辑
  if (currentSecond === 50) {
    countdown.value = 0 // 50秒时倒计时为0
    // 未执行过则触发查询
    if (!hasExecutedAt59s.value) {
      hasExecutedAt59s.value = true
      executeQuery()
    }
  } else if (currentSecond > 50) {   
    countdown.value = 60 - (currentSecond - 50)
  } else {    
    countdown.value = 50 - currentSecond
  }
 
  if (currentSecond !== 50 && hasExecutedAt59s.value) {
    hasExecutedAt59s.value = false
  }
}

onMounted(() => {
  // 初始执行一次
  executeQuery()
  // 启动定时器（100ms检测一次，兼顾性能和准确性，也可改为1000ms）
  timeTimer = window.setInterval(checkSecond, 1000)
});  

// 组件卸载时清除定时器（防止内存泄漏）
onUnmounted(() => {
  if (timeTimer) {
    clearInterval(timeTimer)
    timeTimer = null
  }
});
</script>

<template> 
  <div class="sc-top"> 



    <div class="sc-left">
        <div class="sc-time">
          <div class="sc-tiemtitle">二楼走刀机数字看板</div>
          <div class="sc-timenow">
            <div class="sc-datetime">{{ time }}</div>
            <div class="sc-dayandweek">{{ date }}  {{ week }}</div>
          </div>
          <div class="sc-timendjs">  </div>
        </div>    
        <ul id="sc-menu">
          <li><router-link to="/floor1">一楼</router-link></li> 
          <li><router-link to="/floor2">二楼</router-link></li> 
          <li><router-link to="/floor3">三楼</router-link></li>         
        </ul>
  </div>  




    <div class="sc-right">
      <div class="sc-LedStatus">
        <table class="sc-table1">
          <tbody>
            <tr>
              <td><div class="sc-LedIco"><img src="../assets/greenLED.png"/></div></td>
              <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
              <td><div class="sc-LedStr">绿  灯</div></td>
              <td><div class="sc-LedSum">{{Count1}}台</div></td>
              <td><div class="sc-LedPercentage"><span class="sc-Percentage">{{ calcPercentage(Count1, CountAll) }}</span></div></td>
            </tr>
            <tr>
              <td><div class="sc-LedIco"><img src="../assets/yellowLED.png"/></div></td> 
              <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
              <td><div class="sc-LedStr">黄  灯</div></td>
              <td><div class="sc-LedSum">{{Count2}}台</div></td>
              <td><div class="sc-LedPercentage"><span class="sc-Percentage">{{ calcPercentage(Count2, CountAll) }}%</span></div></td>
            </tr>
            <tr>
              <td><div class="sc-LedIco"><img src="../assets/redLED.png"/></div></td>
              <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
              <td><div class="sc-LedStr">红  灯</div></td>
              <td><div class="sc-LedSum">{{Count3}}台</div></td>
              <td><div class="sc-LedPercentage"><span class="sc-Percentage">{{ calcPercentage(Count3, CountAll) }}%</span></div></td>
            </tr>
            <tr>
              <td><div class="sc-LedIco"><img src="../assets/errorLED.png"/></div></td>
              <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
              <td><div class="sc-LedStr">通信异常</div></td>
              <td><div class="sc-LedSum">{{Count0}}台</div></td>
              <td><div class="sc-LedPercentage"><span class="sc-Percentage">{{ calcPercentage(Count0, CountAll) }}</span></div></td>
            </tr>       
            <tr>
              <td colspan="5"><div class="sc-jdl"><div>机台总数：{{CountAll}} </div><div> 稼动率：{{ calcPercentage(Count1+Count2, CountAll) }}</div></div></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="sc-CountSum">
        <table class="sc-table2">
          <tbody>
            <tr>
              <td><div class="sc-counttile">今日产量</div></td>
              <td rowspan="2"><div class="sc-SumDay">{{ dataSum[0]?.DaySum??0 }}</div></td>
            </tr>
            <tr>
              <td><div  class="sc-countTimes">({{today}}号00点-{{tomorrow}}号00点)</div></td>           
            </tr>
            <tr><td colspan="2" class="sc-topH"></td></tr>
            <tr>
              <td><div class="sc-counttile">上一班({{shiftInfo.LastShift}})</div></td>
              <td rowspan="2"><div class="sc-SumShift1">{{ dataSum[0]?.LastSum??0 }}</div></td>
            </tr>
            <tr>
              <td><div class="sc-countTimes">({{shiftInfo.LastT1.slice(6, 8)}}号{{shiftInfo.LastT1.slice(8, 10)}}点-{{shiftInfo.LastT2.slice(6, 8)}}号{{shiftInfo.LastT2.slice(8, 10)}}点)</div></td>           
            </tr>
            <tr><td colspan="2"  class="sc-topH"></td></tr>
            <tr>
              <td><div class="sc-counttile">当前班({{shiftInfo.ThisShift}})</div></td>
              <td rowspan="2"><div class="sc-SumShift2">{{ dataSum[0]?.ThisSum??0 }}</div></td>
            </tr>
            <tr>
              <td><div class="sc-countTimes">({{shiftInfo.ThisT1.slice(6, 8)}}号{{shiftInfo.ThisT1.slice(8, 10)}}点-{{shiftInfo.ThisT2.slice(6, 8)}}号{{shiftInfo.ThisT2.slice(8, 10)}}点)</div></td>           
            </tr>
            <tr><td colspan="2"  class="sc-topH"></td></tr>
            <!-- 修改：绑定倒计时变量 -->
            <tr><td colspan="2"><div class="sc-jjss">即将刷新（<span>{{countdown}}</span>）</div></td></tr>
          </tbody>
        </table>
      </div>
    </div> 
  </div>   
  <div class="sc-content"> 
    <div class="floorMsg">floorMsg</div>
    <div class="boxMachine">
      <div class="boxitem" v-for="info in data"> 
        <img src="../assets/CNC80.png" class="MachineImg" alt=""> 
        <div class="MachineName" :class="`LedStatus${info.LedStatus}` ">{{info.MachineNO}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped> 


.sc-tiemtitle{
  font-size:x-large;
  color: white;
 margin-bottom: 20px;
 text-align: center;
}
.sc-timenow{
  padding: 10px 0;
  background-color: black;
  color: white;
   text-align: center;
   border-radius: 20px;
}
.sc-datetime{font-size: xx-large;}
.sc-timendjs{
 margin-top: 3rem;
 text-align: right;
 color: wheat;
}
  #sc-menu{
    display: flex;
    display: -webkit-flex; 
    margin: 0;
    padding: 0;
  }
  #sc-menu li{ 
    list-style:none; 
    margin: 0 0.5rem;
    padding: 0;

    width: 4rem;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    background-color: aquamarine;   
    color: black;
    border-radius: 0.3rem;
  }
   #sc-menu li a{color: black;}
   #sc-menu li a:hover{color: blueviolet;}
   #sc-menu li a:active{color: black;}







  .sc-top{
    display: flex;
    display: -webkit-flex;   
    padding: 1rem;
    justify-content: space-between;         
  }
  .sc-content{
    width: 100%;
    margin: 0;        
    padding: 0;
  }
  .sc-right{
    display: flex;
    display: -webkit-flex;
  }
  .sc-LedStatus{
    padding-right:  5rem;
  }
  .sc-CountSum{
    padding-right:  5rem;
  }

  table.sc-table1 {border-collapse:  collapse;color:bisque;	}
  table.sc-table1 td{
    margin: 0;
    padding: 0;
    word-wrap: break-word;
    word-break: break-all;
    text-align: center;  
    padding-top: 10px;
  }
  .sc-LedIco,.sc-MachineIco,.sc-LedStr,.sc-LedSum,.sc-LedPercentage{      
    height:55px;	
    line-height: 55px;	
    border-bottom:1px solid #715121;  
    padding: 0 5px;   
  }
  .sc-LedIco,.sc-MachineIco{
    display: flex;
    display: -webkit-flex;      
    align-items:flex-end;   
  }
  .sc-LedStr{  
    border-top:1px solid #715121;
    border-left:1px solid #715121;
    border-right:1px solid #715121;
    border-radius:15px 15px 0 0;   
    height:40px;	
    line-height:40px;	
    margin-top: 15px;
  }
  .sc-LedSum{min-width: 55px;}
  .sc-Percentage{
    background-color:#00CCFF;
    padding: 0 25px;
    border-radius: 0.5rem;  
    color:black;
  }
  .sc-jdl{
    display: flex;
    display: -webkit-flex;      
    justify-content:  space-between;
    width: 100%;
    color: white;    
  }
  .sc-jdl div{
    padding:0 0.3rem;
  }

  table.sc-table2 {border-collapse:  collapse;color:bisque;height: 100%;	}
  table.sc-table2 td {padding: 0; margin: 0;	}
  .sc-topH{height: 20px;}
  .sc-counttile{
    font-size:18px;
    padding: 5px;text-align: center;
    border-top:1px solid #67cde7;
    border-left:1px solid #67cde7;
    border-right:1px solid #67cde7;
  }
  .sc-countTimes{ 
    padding: 5px;text-align: center;
    font-size:10px;
    border:1px solid #67cde7;
  }
  .sc-SumDay{ height: 100%; padding: 5px;text-align: center; font-size: x-large;border:1px solid #67cde7;}
  .sc-SumShift1{  height: 100%; padding: 5px;text-align: center; font-size: x-large;border:1px solid #67cde7;}
  .sc-SumShift2{  height: 100%;padding: 5px;text-align: center;font-size: x-large;border:1px solid #67cde7;}

  .LedStatus0{background-color: darkgray;}
  .LedStatus1{background-color: green;}
  .LedStatus2{background-color: yellow;color: black;}
  .LedStatus3{background-color: red;}


  .sc-jjss{font-size: 18px;color:beige;}
  .sc-jjss span{font-weight: bold;color: chartreuse;}
</style>
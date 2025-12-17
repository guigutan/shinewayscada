<script setup lang="ts">

  // import { ref, onMounted } from "vue"; // 引入 onMounted 钩子
  import { ref, onMounted, onUnmounted, computed } from 'vue'
  import { LedStatus, type LedStatusRow } from '@/api/LedStatus';
  import { Sum1F, type Sum1FRow } from '@/api/BortherSum';
  import left from './left.vue';
  import { calcPercentage } from './myfunc/calcPercentage';
  import { getShiftInfo } from './myfunc/getShiftInfo';

  import dayjs from 'dayjs';

  const now = ref(Date.now())
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
  const CountAll=ref(0);
  
  


  const query = async () => {
    loading.value = true;
    try {

        const res = await LedStatus(scadano.value); 
        if (res.data.success) {
          data.value = res.data.data;               
          Count0.value = res.data.data.filter(item => item.LedStatus == '-1').length;
          Count1.value = res.data.data.filter(item => item.LedStatus == '1').length;
          Count2.value = res.data.data.filter(item => item.LedStatus == '2').length;
          Count3.value = res.data.data.filter(item => item.LedStatus == '3').length;
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

// {
//   "DayT1": "202512140000",
//   "DayT2": "202512150000",
//   "LastT1": "202512140800",
//   "LastT2": "202512142000",
//   "ThisT1": "202512142000",
//   "ThisT2": "202512150800"
// }

   const dataSum = ref<Sum1FRow[]>([]);  

  const DayT1 = ref(dayjs(now.value).format('YYYYMMDD')+'0000');
  const DayT2 = ref(dayjs(now.value).add(1,'day').format('YYYYMMDD')+'0000');
  const LastT1 = ref(shiftInfo.LastT1);
  const LastT2 = ref(shiftInfo.LastT2);
  const ThisT1 = ref(shiftInfo.ThisT1);
  const ThisT2 = ref(shiftInfo.ThisT2);

  // const DayT1 = ref('202512140000');
  // const DayT2 = ref('202512150000');
  // const LastT1 = ref('202512140800');
  // const LastT2 = ref('202512142000');
  // const ThisT1 = ref('202512142000');
  // const ThisT2 = ref('202512150800');


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

  onMounted(() => {query();querySum();}); 
  
</script>

<template> 

    <div class="sc-top"> 
      <left/>
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

          <tr><td colspan="2"><div class="sc-jdl"><div>机台总数：{{CountAll}} </div><div> 稼动率：{{ calcPercentage(Count1+Count2, CountAll) }}</div></div></td></tr>

        </tbody>
      </table>



    </div>
 </div> 
    
    
    </div>   
     


    <div class="sc-content"> 
        <div class="floorMsg">floorMsg</div>
        <div class="boxMachine">
          <!-- <div class="boxitem"> <img src="../assets/CNC80.png" class="MachineImg" alt=""> <div class="MachineName">C1</div></div> -->
          <div class="boxitem" v-for="info in data"> 
                <img src="../assets/CNC80.png" class="MachineImg" alt=""> 
                <div class="MachineName" :class="`LedStatus${info.LedStatus}` ">{{info.MachineNO}}</div>
            </div>
        </div>
    </div>


</template>



<style scoped> 
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
    /* background-color: aquamarine; */
  }
  .sc-CountSum{
    /* background-color: bisque; */
     padding-right:  5rem;
  }


table.sc-table1 {border-collapse:  collapse;color:bisque;	}

table.sc-table1 td{
  margin: 0;
  padding: 0;
  word-wrap: break-word; /* 当单词过长时，允许在单词内换行 */
	word-break: break-all; /* 单词内换行时，强制断开单词 */
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
    color: chartreuse;    
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


</style>

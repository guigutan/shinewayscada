<!--//src/components/right.vue-->
<script setup lang="ts">

  import { computed } from "vue"; // 改用 computed
  import { useLedStatusStore } from '@/store/LedStatus';

  const LedStatusStore = useLedStatusStore();
  console.log("Store中的data:", LedStatusStore.data);

  const Count0 = computed(() => LedStatusStore.data.filter(item => item.LedStatus === '0').length);
  const Count1 = computed(() => LedStatusStore.data.filter(item => item.LedStatus === '1').length);
  const Count2 = computed(() => LedStatusStore.data.filter(item => item.LedStatus === '2').length);
  const Count3 = computed(() => LedStatusStore.data.filter(item => item.LedStatus === '3').length); 
  const totalMachines = computed(() => Count0.value + Count1.value + Count2.value + Count3.value);

</script>

<template>
  <div class="sc-right">
    <div class="sc-LedStatus">
      <table class="sc-table1">
        <tbody>
          <tr>
            <td><div class="sc-LedIco"><img src="../assets/greenLED.png"/></div></td>
            <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
            <td><div class="sc-LedStr">绿  灯</div></td>
            <td><div class="sc-LedSum">{{Count1}}台</div></td>
            <td><div class="sc-LedPercentage"><span class="sc-Percentage">60%</span></div></td>
          </tr>
          <tr>
            <td><div class="sc-LedIco"><img src="../assets/yellowLED.png"/></div></td> 
            <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
            <td><div class="sc-LedStr">黄  灯</div></td>
            <td><div class="sc-LedSum">{{Count2}}台</div></td>
            <td><div class="sc-LedPercentage"><span class="sc-Percentage">33%</span></div></td>
          </tr>
          <tr>
            <td><div class="sc-LedIco"><img src="../assets/redLED.png"/></div></td>
            <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
            <td><div class="sc-LedStr">红  灯</div></td>
            <td><div class="sc-LedSum">{{Count3}}台</div></td>
            <td><div class="sc-LedPercentage"><span class="sc-Percentage">6%</span></div></td>
          </tr>
          <tr>
            <td><div class="sc-LedIco"><img src="../assets/errorLED.png"/></div></td>
            <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
            <td><div class="sc-LedStr">通信异常</div></td>
            <td><div class="sc-LedSum">{{Count0}}台</div></td>
            <td><div class="sc-LedPercentage"><span class="sc-Percentage">2%</span></div></td>
          </tr>
         

         
        </tbody>
      </table>
    </div>
    <div class="sc-CountSum">
      <table class="sc-table2">
        <tbody>
          <tr>
            <td><div class="sc-counttile">今日产量</div></td>
            <td rowspan="2"><div class="sc-SumDay">8652</div></td>
          </tr>
          <tr>
            <td><div  class="sc-countTimes">(13号0点-14号0点)</div></td>           
          </tr>

          <tr><td colspan="2" class="sc-topH"></td></tr>
            
           <tr>
            <td><div class="sc-counttile">上一班(夜班)</div></td>
            <td rowspan="2"><div class="sc-SumShift1">8652</div></td>
          </tr>
          <tr>
            <td><div class="sc-countTimes">(13号0点-14号0点)</div></td>           
          </tr>

          <tr><td colspan="2"  class="sc-topH"></td></tr>

          <tr>
            <td><div class="sc-counttile">当前班(白班)</div></td>
            <td rowspan="2"><div class="sc-SumShift2">99</div></td>
          </tr>
          <tr>
            <td><div class="sc-countTimes">(13号0点-14号0点)</div></td>           
          </tr>

          <tr><td colspan="2"  class="sc-topH"></td></tr>

          <tr><td colspan="2"><div class="sc-jdl"><div>机台总数：{{ totalMachines }}</div> <div>稼动率：55%</div></div></td></tr>

        </tbody>
      </table>



    </div>
 </div> 
</template>

<style scoped>


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

</style>

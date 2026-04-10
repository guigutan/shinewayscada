<!-- src\components\tp-led.vue -->
<template>  

    <div v-if="loading" >加载中...</div>
    <div v-else class="sc-LedStatus">
            <table class="sc-table1">
            <tbody>
                <tr>
                <td><div class="sc-LedIco"><img src="../assets/greenLED.png"/></div></td>
                <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
                <td><div class="sc-LedStr">绿  灯</div></td>
                <td><div class="sc-LedSum">{{statusCount["1"]+statusCount["0"]}}台</div></td>
                <td><div class="sc-LedPercentage"><span class="sc-Percentage">{{ calcPercentage(statusCount["1"]+statusCount["0"], statusCount["All"]) }}</span></div></td>
                </tr>
                <tr>
                <td><div class="sc-LedIco"><img src="../assets/yellowLED.png"/></div></td> 
                <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
                <td><div class="sc-LedStr">黄  灯</div></td>
                <td><div class="sc-LedSum">{{statusCount["2"]}}台</div></td>
                <td><div class="sc-LedPercentage"><span class="sc-Percentage">{{ calcPercentage(statusCount["2"], statusCount["All"]) }}</span></div></td>
                </tr>
                <tr>
                <td><div class="sc-LedIco"><img src="../assets/redLED.png"/></div></td>
                <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
                <td><div class="sc-LedStr">红  灯</div></td>
                <td><div class="sc-LedSum">{{statusCount["3"]}}台</div></td>
                <td><div class="sc-LedPercentage"><span class="sc-Percentage">{{ calcPercentage(statusCount["3"], statusCount["All"]) }}</span></div></td>
                </tr>
                <tr>
                <td><div class="sc-LedIco"><img src="../assets/errorLED.png"/></div></td>
                <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
                <td><div class="sc-LedStr">通信异常</div></td>
                <td><div class="sc-LedSum">{{statusCount["-1"]}}台</div></td>
                <td><div class="sc-LedPercentage"><span class="sc-Percentage">{{ calcPercentage(statusCount["-1"], statusCount["All"]) }}</span></div></td>
                </tr>       
                <tr>
                <td colspan="5"><div class="sc-jdl"><div>机台总数：{{statusCount["All"]}} </div><div> 稼动率：{{ calcPercentage(statusCount["1"]+statusCount["0"]+statusCount["2"], statusCount["All"]) }}</div></div></td>
                </tr>
            </tbody>
            </table>
    </div>
</template>



<script setup lang="ts">
    import { computed } from 'vue'   
    import { type TScadaData } from '../api/GetMachineLedStatus.ts'
    import { calcPercentage } from  './myfunc/calcPercentage';

    interface Props {sourceList?: TScadaData[],loading?:boolean } 
    const myProps = defineProps<Props>()
   
    const statusCount = computed(() => {       
        const count = {'-1': 0,'0': 0, '1': 0,'2': 0,'3': 0, 'All':0}
        if (!myProps.sourceList) return count
        myProps.sourceList.forEach(item => {
            const status = item.LedStatus ?? -1  
            const key = status as unknown as keyof typeof count           
            if (key in count) { count[key]++ }            
        })
        count["All"]=count["-1"]+count["0"]+count["1"]+count["2"]+count["3"]
        return count
    })
</script>




<style scoped>
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
</style>



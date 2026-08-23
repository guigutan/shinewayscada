<!-- src\components\tp-led.vue -->
<template>  

    <div v-if="loading" >加载中...</div>
    <div v-else class="sc-LedStatus">
            <table class="sc-table1">
            <tbody>
                <tr>
                <td><div class="sc-LedIco"><img src="../assets/greenLED.png"/></div></td>
                <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
                <td><div class="sc-LedStr sc-LedStr--running">绿  灯</div></td>
                <td><div class="sc-LedSum">{{statusCount["1"]+statusCount["0"]}}台</div></td>
                <td><div class="sc-LedPercentage"><div class="sc-Percentage sc-Percentage--running">{{ calcPercentage(statusCount["1"]+statusCount["0"], statusCount["All"]) }}</div></div></td>
                </tr>
                <tr>
                <td><div class="sc-LedIco"><img src="../assets/yellowLED.png"/></div></td> 
                <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
                <td><div class="sc-LedStr sc-LedStr--standby">黄  灯</div></td>
                <td><div class="sc-LedSum">{{statusCount["2"]}}台</div></td>
                <td><div class="sc-LedPercentage"><div class="sc-Percentage sc-Percentage--standby">{{ calcPercentage(statusCount["2"], statusCount["All"]) }}</div></div></td>
                </tr>
                <tr>
                <td><div class="sc-LedIco"><img src="../assets/redLED.png"/></div></td>
                <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
                <td><div class="sc-LedStr sc-LedStr--alarm">红  灯</div></td>
                <td><div class="sc-LedSum">{{statusCount["3"]}}台</div></td>
                <td><div class="sc-LedPercentage"><div class="sc-Percentage sc-Percentage--alarm">{{ calcPercentage(statusCount["3"], statusCount["All"]) }}</div></div></td>
                </tr>
                <tr>
                <td><div class="sc-LedIco"><img src="../assets/errorLED.png"/></div></td>
                <td><div class="sc-MachineIco"><img src="../assets/CNC40.png"/></div></td>
                <td><div class="sc-LedStr sc-LedStr--offline">异常</div></td>
                <td><div class="sc-LedSum">{{statusCount["-1"]}}台</div></td>
                <td><div class="sc-LedPercentage"><div class="sc-Percentage sc-Percentage--offline">{{ calcPercentage(statusCount["-1"], statusCount["All"]) }}</div></div></td>
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
    import { type TScadaData } from '../api/scada'
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
            padding-right:  1rem;
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
            min-width:50px;
            padding:0 5px;
            border-top:1px solid #715121;
            border-left:1px solid #715121;
            border-right:1px solid #715121;
            border-radius:15px 15px 0 0;   
            height:40px;	
            line-height:40px;	
            margin-top: 15px;
        }
        .sc-LedSum{min-width: 55px;}
        .sc-LedPercentage{
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 105px;
            background: transparent;
        }
        .sc-Percentage{
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 105px;
            min-height: 0;
            padding: 2px 25px;
            border-radius: 8px;
            color: #fff;
            line-height: 1.4;
            text-align: center;
            white-space: nowrap;
        }
        .sc-LedStr--running{color:#00FF00;background:transparent;}
        .sc-LedStr--standby{color:#FFFF00;background:transparent;}
        .sc-LedStr--alarm{color:#FF0000;background:transparent;}
        .sc-LedStr--offline{color:#CCCCCC;background:transparent;}
        .sc-Percentage--running{color:#000;background:#00FF00;}
        .sc-Percentage--standby{color:#000;background:#FFFF00;}
        .sc-Percentage--alarm{color:#fff;background:#FF0000;}
        .sc-Percentage--offline{color:#000;background:#CCCCCC;}
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



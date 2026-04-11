<!-- src/components/tp-title.vue -->
<template>
  <div v-if="loading" class="loading">加载中...</div>
  <div v-else >
    <table class="sc-table">
      <tbody>
        <tr>
          <td>{{myData.totalTitle}}</td>
          <td rowspan="2" class="sc-wkcntrSum">{{myData.sourceList[0]?.sum.WkcntrSum}}</td>
        </tr>
        <tr>
          <td>{{myData.timePoint}}</td> 
        </tr>
      </tbody>
    </table>
    </div>
</template>




<script setup lang="ts">

    import { computed } from 'vue' 
    import { type TotalSumResult } from '../api/GetTotal.ts' 
    interface Props {
        sourceList?: TotalSumResult[]
         totalTitle:string
         timePoint:string    
        loading?: boolean
    }
    const myProps = defineProps<Props>()

    interface InfoData {
      sourceList: TotalSumResult[]     
      totalTitle:string
      timePoint:string     
    }


    const myData = computed(() => {
          const info: InfoData = {
                sourceList: myProps.sourceList || []  ,               
                totalTitle:myProps.totalTitle,
                timePoint:myProps.timePoint
          }
          return info
    })



</script>



<style scoped>
.sc-table{
  border-collapse: collapse;
  margin-top: 20px;
}
.sc-table td{
    margin: 0;
    padding: 3px;
    word-wrap: break-word;
    word-break: break-all;
    text-align: center;     
    border: 1px solid #699fc4;
    color: #fff;    
}
.sc-wkcntrSum{
 min-width: 100px;
 font-size: 24px;
}

</style>
<!-- src\components\tp-clock.vue -->

<template>
  <div class="sc-timenow">
    <div class="sc-datetime">{{ Mydata.time }}</div>
    <div>{{ Mydata.date }} {{ Mydata.week }}</div>
  </div>
</template>

<script setup lang="ts">

    import { computed } from 'vue' 
    interface Props {time?: string,date?:string,week?:string,loading?:boolean} 
    const myProps = defineProps<Props>() 
    const Mydata = computed(() => {  return {
      "time":myProps.time,
      "date":myProps.date,
      "week":myProps.week
     
    
    }  })    


        // import { ref, onMounted, onUnmounted } from 'vue'
        // const time = ref('')
        // const date = ref('')
        // const week = ref('') 

        // const updateTime = () => {
        //         const now = new Date()
        //         time.value = now.toTimeString().slice(0, 8)
        //         date.value = now.toISOString().slice(0, 10)

        //         const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        //         const day = now.getDay()         
        //         week.value = weeks[day] ?? '星期未知'
        // }

        // // 定时器（每秒更新
        // let timer: number | null = null 
        // // 挂载时启动
        // onMounted(() => {
        //     updateTime()
        //     timer = setInterval(updateTime, 1000)
        // })
        // // 卸载时清除定时器（重要！防内存泄漏）
        // onUnmounted(() => {
        //     if (timer) clearInterval(timer)
        // })
</script>

<style scoped>
.sc-timenow {
  padding: 10px 0;
  background-color: black;
  color: white;
  text-align: center;
  border-radius: 20px;
}
.sc-datetime {
  font-size: xx-large;
}
</style>
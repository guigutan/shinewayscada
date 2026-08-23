<!-- src\components\tp-clock.vue -->

<template>
  <div class="sc-clock-frame">{{ Mydata.date }} {{ Mydata.week }} {{ Mydata.time }}</div>
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
.sc-clock-frame {
  width: 100%;
  min-height: 46px;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 7px;
  color: #fff;
  background: #16343c;
  box-shadow: 7px 7px 10px -4px rgba(0, 0, 0, 0.78);
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  text-shadow: none;
  white-space: nowrap;
}
</style>

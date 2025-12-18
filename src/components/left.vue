<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import dayjs from 'dayjs'

// 1. 时间/日期/星期相关
const now = ref(Date.now())
const time = computed(() => dayjs(now.value).format('HH:mm:ss'))
const date = computed(() => dayjs(now.value).format('YYYY/MM/DD'))
const week = computed(() => {
  const weekList = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weekList[new Date(now.value).getDay()] // getDay()返回0-6，对应数组索引
})

// 2. 60秒倒计时相关
const countdown = ref(60)
const countdownText = computed(() => countdown.value.toString().padStart(2, '0'))

// 定时器管理
let timeTimer: number | null = null
let countdownTimer: number | null = null

// 启动倒计时
const startCountdown = () => {
  if (countdownTimer) clearInterval(countdownTimer)
  countdownTimer = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      // 可选：停止或循环
      // clearInterval(countdownTimer!)
      countdown.value = 60
    }
  }, 1000)
}

// 重置倒计时
const resetCountdown = () => {
  countdown.value = 60
  startCountdown()
}

// 生命周期
onMounted(() => {
  timeTimer = window.setInterval(() => now.value = Date.now(), 1000)
  startCountdown()
})

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer)
  if (countdownTimer) clearInterval(countdownTimer)
})


</script>

<template>  
<div class="sc-left">
        <div class="sc-time">
          <div class="sc-tiemtitle">一楼CNC加工中心</div>
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
.sc-dayandweek{}


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

</style>

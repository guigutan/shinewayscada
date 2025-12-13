<script setup lang="ts">
  
</script>

<template>  
<div class="sc-left">
        <div class="sc-time">
          <div class="sc-tiemtitle">一楼CNC加工中心</div>
          <div class="sc-timenow">
            <div class="sc-datetime">16:53:21</div>
            <div class="sc-dayandweek">2025/12/13 星期六</div>
          </div>
          <div class="sc-timendjs">60秒刷新一次(59)</div>
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
 margin: 1rem 0;
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

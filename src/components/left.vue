<script setup lang="ts">
</script>

<template>  
<div class="sc-time">
        <div class="sc-time">time</div>    
        <ul id="sc-menu">
          <router-link to="/floor1"><li>一楼</li></router-link>
          <router-link to="/floor2"><li>二楼</li></router-link>
          <router-link to="/floor3"><li>三楼</li></router-link>
        </ul>
  </div>   
</template>

<style scoped>
  
.sc-time{
  background-color:aquamarine;
  /* width: 300px; */
  /* height: 300px; */
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
    background-color: rgb(20, 197, 197);   
    color: white;
  }

</style>

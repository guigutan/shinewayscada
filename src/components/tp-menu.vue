<template>
  <ul id="sc-menu">
    <li :class="{ active: myData.currentPath === '/floor1' }">
      <router-link to="/floor1">一楼</router-link>
    </li>
    <li :class="{ active: myData.currentPath === '/floor2' }">
      <router-link to="/floor2">二楼</router-link>
    </li>
    <li :class="{ active: myData.currentPath === '/floor3' }">
      <router-link to="/floor3">三楼</router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">

   import { computed } from 'vue'    
    interface Props {
        currentPath: string        
    }
    const myProps = defineProps<Props>()

    interface InfoData {
      currentPath: string      
    }


    const myData = computed(() => {
          const info: InfoData = {
                currentPath: myProps.currentPath               
          }
          return info
    })


</script>

<style scoped>
#sc-menu {
  display: flex;
  list-style: none;
  padding: 0;
  gap: 10px;

  margin-top: 50px;
}
#sc-menu li {
  padding: 6px 24px;
  border-radius: 6px;
  cursor: pointer;
  background-color: rgb(127, 174, 206);
}
#sc-menu li a {
  text-decoration: none;
  color: inherit;
}
/* 自动高亮样式 */
#sc-menu li.active {
  background-color: rgb(10, 181, 204);
  color: #fff;
}
</style>
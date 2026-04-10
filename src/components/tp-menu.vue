<template>
  <ul id="sc-menu">
    <li :class="{ active: currentPath === '/floor1' }">
      <router-link to="/floor1">一楼</router-link>
    </li>
    <li :class="{ active: currentPath === '/floor2' }">
      <router-link to="/floor2">二楼</router-link>
    </li>
    <li :class="{ active: currentPath === '/floor3' }">
      <router-link to="/floor3">三楼</router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
// 接收父页面传入当前路由
interface Props {
  currentPath: string
}
defineProps<Props>()
</script>

<style scoped>
#sc-menu {
  display: flex;
  list-style: none;
  padding: 0;
  gap: 10px;
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
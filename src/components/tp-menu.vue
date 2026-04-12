<!-- src/components/tp-menu.vue -->
<template>
  <ul id="sc-menu">
    <li :class="{ active: isActive('/floor1') }">
      <router-link to="/floor1">一楼</router-link>
    </li>
    <li :class="{ active: isActive('/floor2') }">
      <router-link to="/floor2">二楼</router-link>
    </li>
    <li :class="{ active: isActive('/floor3') }">
      <router-link to="/floor3">三楼</router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

interface Props {
  currentPath?: string
}

const props = defineProps<Props>()
const route = useRoute()

const isActive = (target: string) => {
  if (props.currentPath) return props.currentPath === target
  return route.path === target
}
</script>

<style scoped>
/* 你的原有样式保持不变 */
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
#sc-menu li.active {
  background-color: rgb(10, 181, 204);
  color: #fff;
  font-weight: bold;
}
</style>
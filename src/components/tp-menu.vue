<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route=useRoute()
const floor=computed(()=>String(route.params.floor||'1'))
const view=computed(()=>String(route.params.view||'status'))
const floors=[{id:'1',label:'一楼'},{id:'2',label:'二楼'},{id:'3',label:'三楼'}]
const views=[{id:'status',label:'机台状态'},{id:'products',label:'基于产品报表'},{id:'machines',label:'基于机台报表'}]
</script>
<template><nav class="scada-nav" aria-label="看板导航"><div class="floor-tabs"><router-link v-for="item in floors" :key="item.id" :to="`/floor${item.id}/${view}`" :class="{active:floor===item.id}">{{item.label}}</router-link></div><div class="view-tabs"><router-link v-for="item in views" :key="item.id" :to="`/floor${floor}/${item.id}`" :class="{active:view===item.id}">{{item.label}}</router-link></div></nav></template>

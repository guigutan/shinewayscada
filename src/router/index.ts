// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/floor1' },

    {
      path: '/floor:floor',        // ← 注意：这里是 /floor:floor （没有斜杠）
      component: () => import('../components/Floor.vue'),
      name: 'floor'
    }
  ]
})

export default router
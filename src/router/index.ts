// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/floor1/status' },
    { path: '/floor:floor', redirect: to => `/floor${String(to.params.floor)}/status` },
    {
      path: '/floor:floor/:view(status|products|machines)',
      component: () => import('../components/Floor.vue'),
      name: 'floor'
    }
  ]
})

export default router

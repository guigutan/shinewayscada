import { createRouter, createWebHistory } from 'vue-router'

import floor1 from '../components/floor1.vue'
import floor2 from '../components/floor2.vue'
import floor3 from '../components/floor3.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',      
       component: floor1,
       children: [
        { path: '', redirect: 'floor1' }, 
        { path: 'floor1', component: floor1, name: 'floor1' },
        { path: 'floor2', component: floor2, name: 'floor2' },
        { path: 'floor3', component: floor3, name: 'floor3' },    
      ]
    }
  ]
})

export default router
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { constantRouter } from './routers'

const router = createRouter({
  // 路由器模式 hash
  history: createWebHashHistory(),
  //  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRouter,
  // 滚动行为
  scrollBehavior() {
    return {
      top: 0,
      left: 0
    }
  }
})

export default router

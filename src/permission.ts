// 路由鉴权：鉴权，项目中路由能不能被访问权限的设置
// 获取路由器对象
import router from './router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from './stores/modules/user'
import pinia from '@/stores/index'
import { REMOVE_TOKEN } from './utils/token'
import type { RouteLocationNormalized } from 'vue-router'
const userStore = useUserStore(pinia)

console.log('全局守卫')

// 设置全局守卫
// 使用 router.beforeEach 注册一个全局前置守卫：
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) => {
  nprogress.start()
  let token = userStore.token
  // console.log('beforeEach=' + token)

  // 1.有token时，直接跳转目标页面
  if (to.path == '/login') {
    if (token) {
      // 跳转到主页
      next({ path: '/home' })
    } else {
      // 2.没有token时，直接放行
      next()
    }
  } else {
    // 不是login页面
    if (token) {
      // 请求用户名
      let username = userStore.username
      if (username) {
        // 有用户信息 直接放行
        next()
      } else {
        // 没用户信息 请求用户信息再放行
        try {
          await userStore.userInfo()
          // 确保路由加载完毕再跳转
          next({ ...to })
        } catch (e) {
          console.log(e?.message)
          // 需要清除token
          REMOVE_TOKEN()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    } else {
      // 2.没有token时，跳转到login页面，并且带上目标路由信息
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

router.afterEach((to: any, from: any) => {
  nprogress.done()
})

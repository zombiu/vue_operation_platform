import { defineStore } from 'pinia'
import { reqLogin, reqLogout, reqUserInfo } from '@/api/user/index'
import type { LoginForm, LoginResponseData } from '@/api/user/type'
import type { UserState } from './type'
import { REMOVE_TOKEN, getToken, setToken } from '@/utils/token'
import { anyRouter, asyncRouter, constantRouter } from '@/router/routers'
// 获取路由器对象
import router from '@/router/index'

// 存放用户数据的仓库

export const useUserStore = defineStore('user', {
  // 仓库里存放的状态数据
  state: (): UserState => {
    return {
      token: getToken(),
      // 路由数据也要存放到pinia中，方便动态生成路由tab
      menuRoutes: constantRouter,
      username: '',
      avatar: ''
    }
  },
  getters: {},
  actions: {
    // 处理逻辑
    async userLogin(data: LoginForm) {
      const result: LoginResponseData = await reqLogin(data)
      console.log(result)
      if (result.code == 200) {
        // 保存token
        this.token = result.data as string
        setToken(result.data as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    async userInfo() {
      const result = await reqUserInfo()
      // console.log(result)
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar

        // 过滤异步路由
        let routeResult = filterAsyncRouter(asyncRouter, result.data.routes)
        console.log('第一步=' + JSON.stringify(routeResult))
        let arr: RouteRecordRaw[] = [...routeResult, ...anyRouter]
        arr.forEach((item) => {
          console.log('addRoute=' + JSON.stringify(item))
          router.addRoute(item)
        })

        this.menuRoutes = [...constantRouter, ...arr]
        console.log(arr)

        return result
      } else {
        return Promise.reject('获取用户信息失败')
      }
    },
    async logout() {
      const result = await reqLogout()
      this.token = ''
      this.username = ''
      this.avatar = ''
      REMOVE_TOKEN()
      return 'ok'
    }
  }
})
function filterAsyncRouter(asyncRouter: any[], router: string[]) {
  return asyncRouter.filter((item) => {
    if (router.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRouter(item.children, router)
      }
      return true
    }
  })
}

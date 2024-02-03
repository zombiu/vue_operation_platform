import type { App, Component } from 'vue'
// 引入项目中的全局组件
import SvgIcon from './SvgIcon/index.vue'
import Category from './Category/index.vue'
// 引入element-plus/icons 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const allGlobalComponents: { [name: string]: Component } = { SvgIcon, Category }
// 对外暴露自定义插件
export default {
  install(app: App) {
    Object.keys(allGlobalComponents).forEach((key) => {
      app.component(key, allGlobalComponents[key])
    })
    // 对icons所有图标 进行全局注册   for循环+解构赋值
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
}

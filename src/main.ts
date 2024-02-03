import { createApp } from 'vue'
import { createPinia } from 'pinia'
import pinia from '@/stores/index'
import App from '@/App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// element-plus 国际化配置
// @ts-ignore   ts忽略类型检测
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//svg插件需要配置代码
import 'virtual:svg-icons-register'
// 引入模板的全局样式
import '@/styles/index.scss'

// 引入自定义插件对象 注册整个项目全局组件
import globalComponents from '@/components'
// 导入element ui黑暗模式css
import 'element-plus/theme-chalk/dark/css-vars.css'

console.log(globalComponents)
// 测试mock接口
import axios from 'axios'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.use(ElementPlus, { locale: zhCn })
// 将SvgIcon注册为全局组件
// import SvgIcon from '@/components/SvgIcon/index.vue';
// app.component('SvgIcon', SvgIcon)

// axios({
//     url: '/api/user/login',
//     method: 'post',
//     data: {
//         username: 'admin', password: '111111'
//     }
// })
app.use(globalComponents)

// 引入路由鉴权文件
import './permission'
app.mount('#app')
// 获取环境变量
console.log(import.meta.env)

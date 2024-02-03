import axios from 'axios';
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user';

const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 50000
})

request.interceptors.request.use((config) => {
    // 尚硅谷的接口有问题 
    config.url='http://114.115.179.162:8022/prod-api' +config.url
    // 在请求拦截器中 可以进行一些公共header的配置等
    // 配置token
    const userStore = useUserStore()
    if(userStore.token) {
        config.headers.token = userStore.token
    }
    return config
})

request.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    let message = ''
    console.log(JSON.stringify(error));
    
    const status = error.response.status
    switch (status) {
        case 401:
            message = 'token错误'
            break
        case 403:
            message = '没有权限'
            break
        case 404:
            message = '请求地址错误'
            break
        default:
            message = '网络错误'
            break
    }

    ElMessage({ type: 'error', message })
    return Promise.reject(error)
})


export default request
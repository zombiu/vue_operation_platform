// 用来存放 界面是否折叠的数据

import { defineStore } from "pinia"

const useLayoutSettingStore = defineStore('LayoutSetting', {
    state:()=> {
        return {
            // 这个折叠状态 是菜单栏的折叠 、 展开状态
            fold:false,
            // 是否刷新main组件
            refresh:false
        }
    }
})


export default useLayoutSettingStore
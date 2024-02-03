// 用来存放 属性界面 分类数据

import { reqC1SelectList, reqC2SelectList, reqC3SelectList } from "@/api/product/attr"
import type { BaseResponse } from "@/api/user/type"
import { defineStore } from "pinia"
import type { CategoryState } from "./type"

const useCategoryStore = defineStore('Category', {
    state:():CategoryState => {
        return {
           c1Arr:[],
            c1Id:'',
              c2Arr:[],
            c2Id:'',
              c3Arr:[],
            c3Id:'',
        }
    },
    actions: {
      async  getC1SelectList() {
            let result:CategoryResponseData = await reqC1SelectList()
            if (result.code == 200) {
                this.c1Arr = result.data
                // console.log(result);
            }
        },
      async  getC2SelectList() {
            let result:CategoryResponseData = await reqC2SelectList(this.c1Id)
            if (result.code == 200) {
                this.c2Arr = result.data
                // console.log(result);
            }
        },
           async   getC3SelectList() {
            let result:CategoryResponseData = await reqC3SelectList(this.c2Id)
            if (result.code == 200) {
                this.c3Arr = result.data
                // console.log(result);
            }
        }
    },
    getters: {

    }
})


export default useCategoryStore
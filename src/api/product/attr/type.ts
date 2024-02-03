import type { BaseResponse } from '@/api/user/type'

export interface CategoryObj {
  id: string | number
  name: string
  category1Id?: number
  category2Id?: number
}

export interface CategoryResponseData extends BaseResponse {
  data: CategoryObj[]
}

export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}

export type AttrValueList = AttrValue[]

export interface Attr {
  id?: number
  attrName: string
  categoryId: number
  categoryLevel: number
  attrValueList: AttrValueList

  // 用来存储spk 选择的属性
  attrIdAndValueName?: string
}

export type AttrList = Attr[]

export interface AttrResponseData extends BaseResponse {
  data: AttrList
}

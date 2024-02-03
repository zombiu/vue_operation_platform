import type { BaseResponse } from '@/api/user/type'

export interface SpuRecord {
  id?: number
  //   spu名称
  spuName: string
  description: string
  // 分类id
  category3Id: string | number
  // 品牌id
  tmId: number
  // 属性列表
  spuSaleAttrList?: SpuSaleAttrData[] | null
  // 图片列表
  spuImageList?: SpuImageList | null
  spuPosterList: null | []
}

export type Records = SpuRecord[]

export interface SpuResponseData extends BaseResponse {
  data: {
    records: Records
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// 所有品牌列表 type
export interface Trademark {
  id: number
  createTime: string
  updateTime: string
  tmName: string
  logoUrl: string
}

export type TrademarkList = Trademark[]

export interface TrademarkListData extends BaseResponse {
  data: TrademarkList
}

// spu 图片列表 type

export interface SpuImage {
  createTime?: string
  id?: number
  imgName?: string
  imgUrl?: string
  spuId?: number
  updateTime?: string
  name?: string
  url?: string
}

export type SpuImageList = SpuImage[]

export interface SpuImageListResult extends BaseResponse {
  data: SpuImageList
}

// spu 销售属性列表 type

export interface SpuSaleAttrValue {
  baseSaleAttrId: number
  createTime?: string
  id?: number
  isChecked?: string
  saleAttrName?: string
  saleAttrValueName: string
  spuId?: number
  updateTime?: string
}

export type SpuSaleAttrValueList = SpuSaleAttrValue[]

export interface SpuSaleAttrData {
  baseSaleAttrId: number
  createTime?: string
  id?: number
  saleAttrName: string
  spuId?: number
  spuSaleAttrValueList: SpuSaleAttrValueList
  updateTime?: string
  //   是否显示 编辑模式
  flag?: boolean
  //   输入中的属性值
  saleAttrValue?: string
  // 用来存储spk 选择的属性
  saleAttrIdAndValueId?: string
}

export interface SpuSaleAttrResult extends BaseResponse {
  data: SpuSaleAttrData[]
}

// 基础销售属性
export interface BaseSaleAttr {
  id: number
  name: string
}

export type BaseSaleAttrList = BaseSaleAttr[]

export interface BaseSaleAttrResult extends BaseResponse {
  data: BaseSaleAttrList
}

export interface SkuEntity {
  category3Id: string
  id?: number
  price: string | number
  spuId: number
  tmId: number
  weight: string
  skuName: string
  skuAttrValueList?: [
    {
      attrId: number
      valueId: number
      attrIdAndValueId?: string
    }
  ]
  skuDefaultImg: string
  skuDesc: string
  skuSaleAttrValueList?: [
    {
      saleAttrId: number
      saleAttrValueId: number
      saleAttrIdAndValueId?: string
    }
  ]
}

export interface SkuEntityResult extends BaseResponse {
  data: SkuEntity
}

// {
//                 "id": 22,

//                 "spuId": 5,
//                 "price": 1314,
//                 "skuName": "vivo S10 5G手机 8GB+256GB 青柠 超轻薄机身  6nm旗舰芯片 拍照手机 黑",
//                 "skuDesc": "机身重量（g）\n173g\n机身宽度（mm）\n73.67mm\n机身厚度（mm）\n7.29mm\n机身长度（mm）\n158.2mm\n机身材质\n玻璃",
//                 "weight": "1.00",
//                 "tmId": 6,
//                 "category3Id": 61,
//                 "skuDefaultImg": "http://39.98.123.211/group2/M00/02/DA/rBHu8mGxO7mAE-3gAACWbB2wj-4610.jpg",
//                 "isSale": 0,
//                 "skuImageList": null,
//                 "skuAttrValueList": null,
//                 "skuSaleAttrValueList": null
//             }
export interface SkuInfo {
  id?: number
  spuId: number
  price: number
  skuName: string
  skuDesc: string
  weight: string
  tmId: 1
  category3Id: number
  skuDefaultImg: string
  skuImageList: null
  skuAttrValueList: null
  skuSaleAttrValueList: null
  isSale?: boolean
}

export interface SkuInfoListResult extends BaseResponse {
  data: SkuInfo[]
}

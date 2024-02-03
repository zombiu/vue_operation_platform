import type { BaseResponse } from '@/api/user/type'

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
  tmId: number
  category3Id: number
  skuDefaultImg: string
  skuImageList: Img[]
  skuAttrValueList: Attr[]
  skuSaleAttrValueList: null | SaleAttr[]
  isSale?: number
}

export interface Attr {
  id?: number
  attrId: number
  valueId: number
  attrIdAndValueId?: string
  skuId: number
  attrName: string
  valueName: string
}

export interface SaleAttr {
  id?: number
  saleAttrId: number
  saleAttrValueId: number
  saleAttrIdAndValueId?: string

  skuId: number
  spuId: number

  saleAttrName: ''
  saleAttrValueName: ''
}

export interface Img {
  id: number
  skuId: number
  imgName: ''
  imgUrl: ''
  spuImgId: number
  isDefault: number
}
// "records": [
//             {
//                 "id": 22,
//                 "createTime": "2021-12-10 01:31:42",
//                 "updateTime": "2024-01-19 13:40:55",
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
//             },
//         ],
//         "total": 32,
//         "size": 10,
//         "current": 2,
//         "orders": [],
//         "optimizeCountSql": true,
//         "hitCount": false,
//         "countId": null,
//         "maxLimit": null,
//         "searchCount": true,
//         "pages": 4

export interface SkuInfoListResult extends BaseResponse {
  data: {
    records: SkuInfo[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: number
    maxLimit: number
    searchCount: boolean
    pages: number
  }
}

export interface SkuInfoResult extends BaseResponse {
  data: SkuInfo
}

// 引入网络请求封装
import request from '@/utils/request'
import type { BaseResponse } from '@/api/user/type'
import type {
  AttrResponseData,
  CategoryResponseData,
  Attr,
  SpuResponseData,
  TrademarkListData,
  SpuImageListResult,
  SpuSaleAttrResult,
  BaseSaleAttrResult,
  SpuSaleAttrData,
  SpuRecord,
  SkuInfoListResult
} from './type'

// 统一管理
enum Api {
  FETCH_SPU_ULR = '/admin/product/',

  GET_TRADEMARK_LIST = '/admin/product/baseTrademark/getTrademarkList',

  GET_SPU_IMAGE_LIST = '/admin/product/spuImageList/',

  SPU_SALE_ATTR_LIST = '/admin/product/spuSaleAttrList/',

  GET_BASE_SALE_ATTR_LIST = '/admin/product/baseSaleAttrList',

  UPDATE_SPU_INFO = '/admin/product/updateSpuInfo',
  SAVE_SPU_INFO = '/admin/product/saveSpuInfo',

  SKU_INFO_URL = '/admin/product/findBySpuId/'
}

export const reqFetchSpu = (pageNo: number, limit: number, category3Id: number | string) => {
  return request.get<any, SpuResponseData>(
    Api.FETCH_SPU_ULR + `${pageNo}/${limit}?category3Id=${category3Id}`
  )
}

// 获取所有品牌的列表
export const reqGetTrademarkList = () => {
  return request.get<any, TrademarkListData>(Api.GET_TRADEMARK_LIST)
}

// 获取spu 图片列表
export const reqGetSpuImageList = (spuId: number) =>
  request.get<any, SpuImageListResult>(Api.GET_SPU_IMAGE_LIST + spuId)

// 获取spu 销售属性列表
export const reqGetSpuSaleAttrList = (spuId: number) =>
  request.get<any, SpuSaleAttrResult>(Api.SPU_SALE_ATTR_LIST + spuId)

// 获取基础销售属性
export const reqGetBaseSaleAttrList = () => {
  return request.get<any, BaseSaleAttrResult>(Api.GET_BASE_SALE_ATTR_LIST)
}

// 保存|更新spu信息
export const reqSaveOrUpdateSpuInfo = (data: SpuRecord) => {
  if (data.id) {
    return request.post<any, any>(Api.UPDATE_SPU_INFO, data)
  } else {
    return request.post<any, any>(Api.SAVE_SPU_INFO, data)
  }
}

// 获取sku info 列表
export const reqGetSkuInfoList = (spuId: number) => {
  return request.get<any, SkuInfoListResult>(Api.SKU_INFO_URL + spuId)
}

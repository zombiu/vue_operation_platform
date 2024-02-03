// 引入网络请求封装
import request from '@/utils/request'
import type { BaseResponse } from '@/api/user/type'
import type { SkuInfoListResult, SkuInfoResult } from './type'

// 统一管理
enum Api {
  FETCH_SKU_LIST_ULR = '/admin/product/list/',
  // 下架
  CANCEL_SALE_URL = '/admin/product/cancelSale/',
  // 上架
  ON_SALE = '/admin/product/onSale/',
  // 删除
  DELETE_SKU_URL = '/admin/product/deleteSku/',
  // sku详情
  GET_SKU_INFO = '/admin/product/getSkuInfo/'
}

// 获取sku列表
export const reqFetchSkuList = (pageNo: number, limit: number) => {
  return request.get<any, SkuInfoListResult>(Api.FETCH_SKU_LIST_ULR + `${pageNo}/${limit}`)
}

// 上架
export const reqOnSale = (skuId: number) => {
  return request.get<any, BaseResponse>(Api.ON_SALE + `${skuId}`)
}

// 下架
export const reqCancelSale = (skuId: number) => {
  return request.get<any, BaseResponse>(Api.CANCEL_SALE_URL + `${skuId}`)
}

// 删除
export const reqDeleteSku = (skuId: number) => {
  return request.delete<any, BaseResponse>(Api.DELETE_SKU_URL + `${skuId}`)
}

// SKU详情
export const getSkuInfo = (skuId: number) => {
  return request.get<any, SkuInfoResult>(Api.GET_SKU_INFO + `${skuId}`)
}

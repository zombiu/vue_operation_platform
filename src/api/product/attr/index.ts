// 引入网络请求封装
import request from '@/utils/request';
import type { BaseResponse } from '@/api/user/type';
import type { AttrResponseData, CategoryResponseData ,Attr} from './type';
import type{ SkuEntity } from '../spu/type';

// 统一管理 
enum Api {
    C1_URL = '/admin/product/getCategory1',
    C2_URL = '/admin/product/getCategory2/',
    C3_URL = '/admin/product/getCategory3/',
    ATTR_INFO_LIST = '/admin/product/attrInfoList/',
    SAVE_ATTR_INFO = '/admin/product/saveAttrInfo',
    DELETE_ATTR_VALUE_URL = '/admin/product/deleteAttr/',
    // 保存sku info
    SAVE_SKU_INFO= '/admin/product/saveSkuInfo',
}

export const reqC1SelectList = () => request.get<any,CategoryResponseData>(Api.C1_URL)

export const reqC2SelectList = (category1Id:string|number) => request.get<any,CategoryResponseData>(Api.C2_URL + category1Id)

export const reqC3SelectList = (category2Id:string|number) => request.get<any,CategoryResponseData>(Api.C3_URL + category2Id)
export const reqAttrInfoList = (category1Id:string|number,category2Id:string|number,category3Id:string|number) => 
request.get<any,AttrResponseData>(Api.ATTR_INFO_LIST + `${category1Id}/${category2Id}/${category3Id}`)

export const saveAttrInfo = (data:Attr) => request.post<any,BaseResponse>(Api.SAVE_ATTR_INFO,data)

export const reqDeleteAttrValue = (attrId:number|string) => request.delete<any,BaseResponse>(Api.DELETE_ATTR_VALUE_URL + attrId)

export const saveSkuInfo = (data:SkuEntity) => request.post<any,BaseResponse>(Api.SAVE_SKU_INFO,data)



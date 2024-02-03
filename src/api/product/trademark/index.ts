// 引入网络请求封装
import request from '@/utils/request';
import type{ Trademark, TrademarkData } from './type';
import type { BaseResponse } from '@/api/user/type';

// 统一管理 
enum Api {
    FETCH_TRADEMARK_LIST = '/admin/product/baseTrademark',
    SAVE_TRADEMARK = '/admin/product/baseTrademark/save',
    UPDATE_TRADEMARK = '/admin/product/baseTrademark/update',
    DELETE_TRADEMARK = '/admin/product/baseTrademark/remove/',
}

export const reqFetchTrademarkList = (pageNo:number, limit:number) => request.get<any,TrademarkData>(Api.FETCH_TRADEMARK_LIST + `/${pageNo}/${limit}`)



export const reqAddOrUpdateTrademark = (trademark:Trademark) =>{
    // 如果有id 就是更新操作，如果没有id就是新增操作
    if(trademark.id) {
          return  request.put<any,BaseResponse>(Api.UPDATE_TRADEMARK,trademark)
    } else {
        return  request.post<any,BaseResponse>(Api.SAVE_TRADEMARK,trademark)
    }
}

export const reqDeleteTrademark = (id:number|string) =>{
        return  request.delete<any,BaseResponse>(Api.DELETE_TRADEMARK + id)
}
import type{BaseResponse} from '@/api/user/type';

export interface Trademark {
     "id"?: string,
                "createTime"?: string,
                "updateTime"?: string,
                "tmName": string,
                "logoUrl": string
}

export type Records = Trademark[] 
export interface TrademarkData extends BaseResponse{
    data:{
        records : Records,
    "total": number,
        "size": number,
        "current": number,
        "orders": any[],
        "optimizeCountSql": boolean,
        "hitCount": boolean,
        "countId": number,
        "maxLimit": number,
        "searchCount": boolean,
        "pages": number
    }
}

export interface UploadResult extends BaseResponse{
    data:string
}
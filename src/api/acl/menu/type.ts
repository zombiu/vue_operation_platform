import type { BaseResponse } from '@/api/user/type'

//  "id": 1,
//       "createTime": "2019-11-15 17:13:06",
//       "updateTime": "2020-09-25 13:47:54",
//       "pid": 0,
//       "name": "全部数据",
//       "code": null,
//       "toCode": null,
//       "type": 1,
//       "status": null,
//       "level": 1,
//       "children": []

// 菜单bean
export interface Permission {
  id?: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code?: string
  toCode?: string
  type: number
  status: null
  level: number
  children?: PermissionList
  select: boolean
}

export type PermissionList = Permission[]
// 角色的菜单列表
export interface PermissionDataResult extends BaseResponse {
  data: PermissionList
}

import type { BaseResponse } from '@/api/user/type'

// {
//         "id": 9986,
//         "createTime": "2024-01-23 20:26:41",
//         "updateTime": "2024-01-23 20:26:41",
//         "roleName": "后端1",
//         "remark": null
//       }
export interface RoleRecord {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: null
}

export type Records = RoleRecord[]

export interface RoleListResult extends BaseResponse {
  data: {
    records: Records
    total: number
    size: number
    current: number
    // 一共多少页
    pages: number
  }
}

//  "id": 1,
//  "createTime": "2021-05-31 18:09:18",
//  "updateTime": "2023-04-28 11:03:38",
//  "roleName": "超级管理员",
//  "remark": null

// export interface Role {
//   id: number
//   createTime: string
//   updateTime: string
//   roleName: string
//   remark: null
// }

// 菜单bean
export interface MenuEntity {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code?: string
  toCode?: string
  type: number
  status: null
  level: number
  children?: MenuList
  select: boolean
}

export type MenuList = MenuEntity[]
// 角色的菜单列表
export interface MenuDataResult extends BaseResponse {
  data: MenuList
}

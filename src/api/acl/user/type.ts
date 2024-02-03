import type { BaseResponse } from '@/api/user/type'

export interface UserRecord {
  id?: number
  createTime?: string
  updateTime?: string
  username: string
  password: string
  name: string
  phone?: string
  roleName?: string
}

export type Records = UserRecord[]

export interface UserListResult extends BaseResponse {
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

export interface Role {
  id: number
  createTime: string
  updateTime: string
  roleName: string
  remark: null
}

export type RoleList = Role[]

export interface AllRoleResult extends BaseResponse {
  data: {
    assignRoles: RoleList
    allRolesList: RoleList
  }
}

export interface AssignRoleParams {
  roleIdList: number[]
  userId: number
}

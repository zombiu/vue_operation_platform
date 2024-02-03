import request from '@/utils/request'
import type { AllRoleResult, AssignRoleParams, UserListResult, UserRecord } from './type'
import type { BaseResponse } from '@/api/user/type'
// ts 4.5之后，导入type类型的内容，需要显示指定为type

// 统一管理 用户管理的接口
enum Api {
  FETCH_USER_LIST_URL = '/admin/acl/user/',
  SAVE_USER_URL = '/admin/acl/user/save/',
  UPDATE_USER_URL = '/admin/acl/user/update',
  // 全部角色
  ALL_ROLE_URL = '/admin/acl/user/toAssign/',
  // 分配角色
  DO_ASSIGN_ROLE = '/admin/acl/user/doAssignRole',
  // 删除用户
  DELETE_USER_URL = '/admin/acl/user/remove/',

  // 批量删除用户
  DELETE_BATCH_USER_URL = '/admin/acl/user/batchRemove'
}

export const fetchUserList = (page: number, limit: number, username?: string) => {
  if (username) {
    return request.get<any, UserListResult>(
      Api.FETCH_USER_LIST_URL + `${page}/${limit}?username=${username}`
    )
  } else {
    return request.get<any, UserListResult>(Api.FETCH_USER_LIST_URL + `${page}/${limit}`)
  }
}

export const reqAddOrUpdateUser = (data: UserRecord) => {
  if (data.id) {
    return request.put<any, BaseResponse>(Api.UPDATE_USER_URL, data)
  } else {
    return request.post<any, BaseResponse>(Api.SAVE_USER_URL, data)
  }
}

export const fetchAllRole = (adminId: number) =>
  request.get<any, AllRoleResult>(Api.ALL_ROLE_URL + `${adminId}`)
// 分配角色
export const reqDoAssignRole = (data: AssignRoleParams) =>
  request.post<any, any>(Api.DO_ASSIGN_ROLE, data)

// 删除用户
export const reqDeleteUser = (userId: number) =>
  request.delete<any, BaseResponse>(Api.DELETE_USER_URL + userId)

// 批量删除用户
export const reqDeleteBatchUser = (idList: number[]) =>
  request.delete<any, BaseResponse>(Api.DELETE_USER_URL + idList)

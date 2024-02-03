import request from '@/utils/request'

import type { BaseResponse } from '@/api/user/type'
import type { MenuDataResult, RoleListResult, RoleRecord } from './type'
// ts 4.5之后，导入type类型的内容，需要显示指定为type

// 统一管理 用户管理的接口
enum Api {
  // 获取角色分页列表
  FETCH_ROLE_LIST_URL = '/admin/acl/role/',
  // 添加角色
  SAVE_ROLE_URL = '/admin/acl/role/save',
  // 更新角色
  UPDATE_ROLE_URL = '/admin/acl/role/update',
  // 根据角色获取菜单
  FETCH_MENU_BY_ROLE_ID = '/admin/acl/permission/toAssign/',
  // 给角色分配权限
  SET_PERMISSION_URL = '/admin/acl/permission/doAssign',
  // 删除角色
  REMOVE_ROLE_ULR = '/admin/acl/role/remove/'
}

export const reqFetchRoleList = (page: number, limit: number, roleName?: string) => {
  if (roleName) {
    return request.get<any, RoleListResult>(
      Api.FETCH_ROLE_LIST_URL + `${page}/${limit}?roleName=${roleName}`
    )
  } else {
    return request.get<any, RoleListResult>(Api.FETCH_ROLE_LIST_URL + `${page}/${limit}`)
  }
}

export const reqAddOrUpdateRole = (role: RoleRecord) => {
  if (role.id) {
    return request.put<any, BaseResponse>(Api.UPDATE_ROLE_URL, role)
  } else {
    return request.post<any, BaseResponse>(Api.SAVE_ROLE_URL, role)
  }
}

export const reqFetchMenuList = (roleId: number) =>
  request.get<any, MenuDataResult>(Api.FETCH_MENU_BY_ROLE_ID + roleId)

// 给角色设置权限
export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, MenuDataResult>(
    Api.SET_PERMISSION_URL + `?roleId=${roleId}&permissionId=${permissionId}`
  )

export const reqRemoveRole = (roleId: number) =>
  request.delete<any, any>(Api.REMOVE_ROLE_ULR + roleId)

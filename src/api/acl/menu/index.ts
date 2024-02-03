import request from '@/utils/request'

import type { BaseResponse } from '@/api/user/type'
import type { Permission, PermissionDataResult } from './type'
// ts 4.5之后，导入type类型的内容，需要显示指定为type

// 统一管理 用户管理的接口
enum Api {
  // 获取菜单
  FETCH_PERMISSION_URL = '/admin/acl/permission/',
  // 新增菜单
  SAVE_PERMISSION_URL = '/admin/acl/permission/save',
  //更新菜单
  UPDATE_PERMISSION_URL = '/admin/acl/permission/update',
  // 删除权限
  REMOVE_PERMISSION_URL = '/admin/acl/permission/remove/'
}

export const reqFetchAllPermission = () =>
  request.get<any, PermissionDataResult>(Api.FETCH_PERMISSION_URL)

export const reqSaveOrUpdatePermission = (obj: Permission) => {
  if (obj.id) {
    return request.put<any, BaseResponse>(Api.UPDATE_PERMISSION_URL, obj)
  } else {
    return request.post<any, BaseResponse>(Api.SAVE_PERMISSION_URL, obj)
  }
}

export const reqRemovePermission = (pid: number) =>
  request.delete<any, BaseResponse>(Api.REMOVE_PERMISSION_URL + pid)

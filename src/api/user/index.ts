import request from '@/utils/request';
// ts 4.5之后，导入type类型的内容，需要显示指定为type
import type { LoginForm, LoginResponseData, UserResponseData } from './type';

// 统一管理 用户相关的接口
enum Api {
    // LOGIN_URL = '/user/login',
    // USER_INFO_URL = '/user/info'
      LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

export const reqLogin = (login: LoginForm) => request.post<any, LoginResponseData>(Api.LOGIN_URL, login)

export const reqUserInfo = () => request.get<any, UserResponseData>(Api.USERINFO_URL)

export const reqLogout = () => request.get<any, any>(Api.LOGOUT_URL)
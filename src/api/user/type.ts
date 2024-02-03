4
export interface LoginForm {
    username: string
    password: string
}

export interface BaseResponse {
     code: number
    message:string
    ok:boolean
}

export interface LoginResponseData extends BaseResponse{
    data: string
}


interface UserInfo {
    userId: number
    avatar: string
    username: string
    password: string
    desc: string
    roles: string[]
    buttons: string[]
    routes: string[]
    token: string
}
interface User {
    name:string
    avatar:string
}

export interface UserResponseData extends BaseResponse {
    data:  {
        name:string
        avatar :string
        routes:string[]
        buttons:string[]
        roles:string[]
    }
}
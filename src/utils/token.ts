
export const getToken = () => {
    return localStorage.getItem('TOKEN') 
}

export const setToken = (token: string) => {
    localStorage.setItem('TOKEN', token)
}

export const REMOVE_TOKEN = () => {
    localStorage.removeItem('TOKEN')
}
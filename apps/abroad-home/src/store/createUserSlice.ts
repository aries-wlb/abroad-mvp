import type { StateCreator } from 'zustand'
import { message } from 'antd'
import { getUserInfo, updateUserInfo } from '@/services/api'
import type {
  LoginRequest,
  RegisterRequest,
  UpdateUserRequset,
  UserInfo,
} from '@/services/model'
import { login, register } from '@/services/api/common'
import { ResponseCode } from '@/constants'
import { LocalStorage } from '@/shared/storage'

export interface UserState {
  userInfo: UserInfo
  registerLoading: boolean
  loginLoading: boolean
  isLogin: boolean
  fetchUserLoading: boolean
  userInfoUpdateLoading: boolean
  fetchUser: () => Promise<boolean>
  login: (data: LoginRequest) => Promise<boolean>
  logout: () => void
  register: (data: RegisterRequest) => Promise<number>
  updateUserInfo: (data: UpdateUserRequset) => Promise<boolean>
}

export const createUserSlice: StateCreator<UserState> = (set, get) => ({
  userInfo: {} as UserInfo,
  isLogin: false,
  loginLoading: false,
  registerLoading: false,
  fetchUserLoading: false,
  userInfoUpdateLoading: false,
  updateUserInfo: async (data: UpdateUserRequset) => {
    const { userInfoUpdateLoading } = get()
    if (userInfoUpdateLoading) return false
    set({ userInfoUpdateLoading: true })
    const res = await updateUserInfo(data)
    set({ userInfoUpdateLoading: false })
    const { code, msg } = res
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Update failed: ${msg}`)
      return false
    }
    message.success('Update Success')
    return true
  },
  fetchUser: async () => {
    set({ fetchUserLoading: true })
    const res = await getUserInfo()
    set({ fetchUserLoading: false })
    const { code } = res
    if (code !== ResponseCode.SUCCESS) {
      set({ isLogin: false })
      LocalStorage.token.remove()
      return false
    }
    const {
      data: { user_info: _userInfo },
    } = res || { data: {} }
    set({
      userInfo: _userInfo,
      isLogin: true,
    })
    return true
  },
  login: async (data: LoginRequest) => {
    set({ loginLoading: true })
    const res = await login(data)
    const { code, msg } = res
    if (code !== ResponseCode.SUCCESS) {
      LocalStorage.token.remove()
      set({
        userInfo: {} as UserInfo,
        isLogin: false,
        loginLoading: false,
      })
      message.error(`Login failed: ${msg}`)
      return false
    }
    const { token, user: _userInfo } = res.data || {}
    LocalStorage.token.set(token)
    set({
      userInfo: _userInfo,
      isLogin: true,
      loginLoading: false,
    })
    return true
  },
  logout: () => {
    LocalStorage.token.remove()
    set({
      userInfo: {} as UserInfo,
      isLogin: false,
    })
  },
  register: async (data: RegisterRequest) => {
    const { registerLoading } = get()
    if (registerLoading) return 0
    set({ registerLoading: true })
    const { code, msg } = await register(data)
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Register failed: ${msg}`)
      set({ registerLoading: false })
      return code
    }
    message.success('Register Success!')
    set({
      registerLoading: false,
    })
    return 0
  },
})

import { httpV1 } from '../http'
import type { UpdateUserRequset, UserResponse } from '../model'

const { get, post } = httpV1

export function getUserInfo() {
  return get<UserResponse>('/user/info')
}

export function updateUserInfo(userInfo: UpdateUserRequset) {
  return post('/user/update', { ...userInfo })
}

import type { StateCreator } from 'zustand'
import { create } from 'zustand'
import { message } from 'antd'
import type { StudentState } from './createStudentSlice'
import { createStudentSlice } from './createStudentSlice'
import type { UpdateUserByAdminRequset } from '@/services/model/admin'
import { updateUserByAdmin } from '@/services/api'
import { ResponseCode } from '@/constants'

type AdminState = StudentState & CommonState

interface CommonState {
  userInfoUpdateLoading: boolean
  updateUserInfo: (data: UpdateUserByAdminRequset) => Promise<boolean>
}

const createCommonSlice: StateCreator<CommonState> = (set, get) => ({
  userInfoUpdateLoading: false,
  updateUserInfo: async (data: UpdateUserByAdminRequset) => {
    const { userInfoUpdateLoading } = get()
    if (userInfoUpdateLoading) return false
    set({ userInfoUpdateLoading: true })
    const res = await updateUserByAdmin(data)
    set({ userInfoUpdateLoading: false })
    const { code, msg } = res
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Update failed: ${msg}`)
      return false
    }
    message.success('Update Success')
    return true
  },
})

export const useAdminStore = create<AdminState>((...a) => ({
  ...createStudentSlice(...a),
  ...createCommonSlice(...a),
}))

import type { StateCreator } from 'zustand'
import { message } from 'antd'
import type { UserInfo, UsersResponse } from '@/services/model'
import type { PaginationType } from '@/constants'
import { ResponseCode } from '@/constants'
import { getStudents } from '@/services/api'

export interface StudentState {
  students: Array<UserInfo>
  sFetchloading: boolean
  fetchStudents: (pagination: PaginationType) => Promise<UsersResponse>
}

export const createStudentSlice: StateCreator<StudentState> = set => ({
  sFetchloading: false,
  students: [],
  fetchStudents: async (pagination: PaginationType) => {
    set({ sFetchloading: true })
    const { code, msg, data } = await getStudents(
      pagination.current,
      pagination.pageSize
    )
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Register failed: ${msg}`)
      set({ sFetchloading: false })
      return {
        list: [] as Array<UserInfo>,
        total: 0,
        current: pagination.current,
        page_size: pagination.pageSize,
      }
    }
    set({
      students: data?.list || [],
      sFetchloading: false,
    })
    return data
  },
})

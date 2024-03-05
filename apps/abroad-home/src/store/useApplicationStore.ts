import { create } from 'zustand'
import { message } from 'antd'
import {
  createApplication,
  createApplicationByUser,
  deleteApplication,
  deleteApplicationByUser,
  getApplication,
  getApplicationByUser,
  updateApplication,
  updateApplicationByUser,
  updateStatusByUser,
} from '@/services/api'
import type {
  Application,
  GetApplicationRequest,
  GetApplicationResponse,
  UpdateAppStatusRequest,
  UpdateApplicationRequest,
} from '@/services/model'
import { ResponseCode } from '@/constants'

interface ApplicationState {
  applications: Array<Application>
  loading: boolean
  updating: boolean
  statusUpdating: boolean
  setApplications: (applications: Array<Application>) => void
  fetchApplicationByUser: () => Promise<boolean>
  fetchApplication: (
    params: GetApplicationRequest
  ) => Promise<GetApplicationResponse>
  createApplicationByUser: (data: UpdateApplicationRequest) => Promise<boolean>
  updateApplicationByUser: (data: UpdateApplicationRequest) => Promise<boolean>
  updateStatusByUser: (data: UpdateAppStatusRequest) => Promise<boolean>
  deleteApplicationByUser: (id: number) => Promise<boolean>
  createApplication: (data: UpdateApplicationRequest) => Promise<boolean>
  updateApplication: (data: UpdateApplicationRequest) => Promise<boolean>
  deleteApplication: (id: number) => Promise<boolean>
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: [],
  loading: false,
  updating: false,
  statusUpdating: false,
  setApplications: (applications: Array<Application>) => {
    set({ applications })
  },
  fetchApplication: async (params: GetApplicationRequest) => {
    set({ loading: true })
    const { code, msg, data } = await getApplication(params)
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Fetch application failed: ${msg}`)
      set({ loading: false })
      return {
        list: [] as Array<Application>,
        total: 0,
        current: params.current,
        page_size: params.page_size,
      }
    }
    const { list } = data
    set({
      applications: list || [],
      loading: false,
    })
    return data
  },
  fetchApplicationByUser: async () => {
    set({ loading: true })
    const res = await getApplicationByUser()
    set({ loading: false })
    const { code, msg } = res
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Fetch Applications failed: ${msg}`)
      return false
    }
    const {
      data: { applications },
    } = res
    set({
      applications,
      loading: false,
    })
    return true
  },
  createApplicationByUser: async (data: UpdateApplicationRequest) => {
    const { updating } = get()
    if (updating) return false

    set({ updating: true })
    const res = await createApplicationByUser(data)
    set({ updating: false })

    const { code, msg } = res
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Create failed: ${msg}`)
      return false
    }
    message.success('Create Success')
    return true
  },
  updateApplicationByUser: async (data: UpdateApplicationRequest) => {
    const { updating } = get()
    if (updating) return false
    set({ updating: true })
    const res = await updateApplicationByUser(data)
    set({ updating: false })
    const { code, msg } = res
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Update failed: ${msg}`)
      return false
    }
    message.success('Update Success')
    return true
  },
  updateStatusByUser: async (data: UpdateAppStatusRequest) => {
    const { statusUpdating } = get()
    if (statusUpdating) return false
    set({ statusUpdating: true })
    const res = await updateStatusByUser(data)
    set({ statusUpdating: false })
    const { code, msg } = res
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Update failed: ${msg}`)
      return false
    }
    message.success('Update Success')
    return true
  },
  deleteApplicationByUser: async (applicationId: number) => {
    const { updating } = get()
    if (updating) return false
    set({ updating: true })
    const res = await deleteApplicationByUser(applicationId)
    set({ updating: false })
    const { code, msg } = res
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Delete failed: ${msg}`)
      return false
    }
    message.success('Delete Success')
    return true
  },
  createApplication: async (data: UpdateApplicationRequest) => {
    const { updating } = get()
    if (updating) return false
    set({ updating: true })
    const res = await createApplication(data)
    set({ updating: false })
    const { code, msg } = res
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Create failed: ${msg}`)
      return false
    }
    message.success('Create Success')
    return true
  },
  updateApplication: async (data: UpdateApplicationRequest) => {
    const { updating } = get()
    if (updating) return false
    set({ updating: true })
    const res = await updateApplication(data)
    set({ updating: false })
    const { code, msg } = res
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Update failed: ${msg}`)
      return false
    }
    message.success('Update Success')
    return true
  },
  deleteApplication: async (applicationId: number) => {
    const { updating } = get()
    if (updating) return false
    set({ updating: true })
    const res = await deleteApplication(applicationId)
    set({ updating: false })
    const { code, msg } = res
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Delete failed: ${msg}`)
      return false
    }
    message.success('Delete Success')
    return true
  },
}))

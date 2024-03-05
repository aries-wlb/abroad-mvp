import { httpV1 } from '../http'
import type {
  ApplicationResponse,
  GetApplicationRequest,
  GetApplicationResponse,
  UpdateAppStatusRequest,
  UpdateApplicationRequest,
} from '../model'

const { get, post } = httpV1

export function getApplicationByUser() {
  return get<ApplicationResponse>('/application/getByUser')
}

export function createApplicationByUser(data: UpdateApplicationRequest) {
  return post('/application/createByUser', { ...data })
}

export function updateApplicationByUser(data: UpdateApplicationRequest) {
  return post('/application/updateByUser', { ...data })
}

export function updateStatusByUser(data: UpdateAppStatusRequest) {
  return post('/application/updateStatusByUser', { ...data })
}

export function deleteApplicationByUser(id: number) {
  return post('/application/deleteByUser', { application_id: id })
}

export function createApplication(data: UpdateApplicationRequest) {
  return post('/application/create', { ...data })
}

export function updateApplication(data: UpdateApplicationRequest) {
  return post('/application/update', { ...data })
}

export function deleteApplication(id: number) {
  return post('/application/delete', { application_id: id })
}

export function getApplication(params: GetApplicationRequest) {
  return get<GetApplicationResponse>('/application/getApplication', {
    ...params,
  })
}

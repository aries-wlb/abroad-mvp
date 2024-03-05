import type { File } from './file'

export enum ApplicationStatus {
  PrepareDocument = 1,
  PrepareDDL = 2,
  PrepareSubmit = 3,
  SubmitFee = 4,
  SubmitRefLetter = 5,
  OfferWaiting = 6,
  AdmissionDocument = 7,
  AdmissionDeposit = 8,
  Done = 9,
}

export interface UpdateApplicationRequest {
  application_id?: number
  school: string
  major: string
  ddl: number
  type?: string
  file_ids: number[]
  user_id?: number
  status?: number
}

export interface UpdateAppStatusRequest {
  application_id: number
  status: number
}

export interface ApplicationResponse {
  applications: Application[]
}

export interface Application {
  application_id: number
  user_id: number
  school: string
  major: string
  ddl: string
  status: number
  type: string
  files: File[]
}

export interface GetApplicationRequest {
  type?: string
  current: number
  page_size: number
}

export interface GetApplicationResponse {
  list: Application[]
  total: number
  current: number
  page_size: number
}

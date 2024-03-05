export interface AntFile {
  uid: string
  name: string
  lastModified: number
  lastModifiedDate: Date
  webkitRelativePath: string
}

export interface AntUploadReq {
  action: string
  data: unknown
  file: File
  filename: string
  headers: { [key: string]: string }
  method: string
  onError: (err: Error, ret: unknown) => void
  onProgress: (event: { percent: number }, file: AntFile) => void
  onSuccess: (ret: unknown) => void
  withCredentials: boolean
}

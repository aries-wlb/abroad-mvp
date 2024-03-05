import { httpV1 } from '../http'
import type { FileResponse } from '../model'

const { post } = httpV1
export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return post<FileResponse>('/file/upload', formData)
}

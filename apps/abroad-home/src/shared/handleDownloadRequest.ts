import { http } from '@/services/http'

const { get } = http

export async function handleDownloadRequest(url: string, filename = 'file') {
  const response: any = await get(url)
  if (response.code) return
  const blob = new Blob([response])
  const a = window.document.createElement('a')
  const downUrl = window.URL.createObjectURL(blob)
  a.href = downUrl
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(downUrl)
  a.remove()
}

import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { message, notification } from 'antd'
import { LocalStorage } from '@/shared/storage'
import { ResponseCode } from '@/constants'

const env = import.meta.env.MODE

interface BaseResponse<T = Record<string, never>> {
  // headers: AxiosHeaders
  // status: number
  // statusText: string
  // data: {
  code: number
  msg: string
  data: {
    error_code?: number
    error_msg?: string
  } & T
  // }
}

export class Http {
  instance: AxiosInstance
  constructor(baseURL: string) {
    this.instance = axios.create({ baseURL })
  }

  get = <T>(
    url: string,
    query?: Record<string, string | number>,
    config?: Omit<AxiosRequestConfig, 'url' | 'params' | 'method'>
  ) => {
    return this.instance.request<T, BaseResponse<T>>({
      ...config,
      url,
      params: query,
      method: 'GET',
    })
  }

  post = <T>(
    url: string,
    data?: unknown,
    config?: Omit<AxiosRequestConfig, 'url' | 'data' | 'method'>
  ) => {
    return this.instance.request<T, BaseResponse<T>>({
      ...config,
      url,
      data,
      method: 'POST',
    })
  }

  // patch
  // delete
}

export const V1Prefix = '/api/v1'

export const httpV1 = new Http(
  env === 'development'
    ? `/dev/api${V1Prefix}`
    : `${window.location.origin}${V1Prefix}`
)

export const http = new Http(
  env === 'development' ? '/dev/api' : window.location.origin
)

function setInterceptors(http: Http) {
  http.instance.interceptors.request.use(config => {
    const c_token = LocalStorage.token.get()
    if (c_token) config.headers.Authorization = `Bearer ${c_token}`

    return config
  })

  http.instance.interceptors.response.use(
    async response => {
      if (response.status !== 200) {
        message.error(`Server Error: ${response.status}`)
        // throw new Error(`Server Error: ${response.status}`)
        return {
          code: ResponseCode.SEVER_ERROR,
          msg: 'Sever Error',
        }
      }
      if (response?.data?.code === ResponseCode.UNAUTHORISED) {
        // throw new Error(`Server Error: ${response.status}`)
        location.href = '/home'
        return {
          code: ResponseCode.UNAUTHORISED,
          msg: 'Request Failed: Unauthorised',
        }
      }
      // if (response.headers['content-type'] !== 'application/json;charset=UTF-8') {
      //   const blob = new Blob([response.data])
      //   const a = window.document.createElement('a')
      //   const downUrl = window.URL.createObjectURL(blob)
      //   let fileNameEntry = ['filename', 'xls']
      //   if (response.headers['content-disposition']) {
      //     fileNameEntry = response.headers['content-disposition']
      //       .split('filename=')[1]
      //       .split('.')
      //   }
      //   a.href = downUrl
      //   a.download = `${decodeURIComponent(fileNameEntry[0])}.${fileNameEntry[1]}`
      //   a.click()
      //   window.URL.revokeObjectURL(downUrl)
      //   a.remove()
      //   notification.success({ message: '导出成功' })
      // }
      return response.data
    },
    (error: AxiosError) => {
      const codeMessage: Record<number, string> = {
        200: '服务器成功返回请求的数据。',
        201: '新建或修改数据成功。',
        202: '一个请求已经进入后台排队（异步任务）。',
        204: '删除数据成功。',
        400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
        401: '用户没有权限（令牌、用户名、密码错误）。',
        403: '用户得到授权，但是访问是被禁止的。',
        404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
        406: '请求的格式不可得。',
        410: '请求的资源被永久删除，且不会再得到的。',
        422: '当创建一个对象时，发生一个验证错误。',
        500: '服务器发生错误，请检查服务器。',
        502: '网关错误。',
        503: '服务不可用，服务器暂时过载或维护。',
        504: '网关超时。',
      }
      if (error.response) {
        const { status, statusText } = error.response
        const { url } = error.response.config
        const errorText = codeMessage[status] || statusText
        notification.error({
          message: `请求错误 ${status}: ${url}`,
          description: errorText,
        })
      }
      return {
        code: ResponseCode.SEVER_ERROR,
        msg: 'Sever Error',
      }
    }
  )
}

setInterceptors(http)
setInterceptors(httpV1)

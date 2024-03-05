import { httpV1 } from '../http'
import type { GetArticlesResponse } from '../model'

const { get } = httpV1

export function getArticles(current: number, pageSize: number) {
  return get<GetArticlesResponse>('/articles', { current, page_size: pageSize })
}

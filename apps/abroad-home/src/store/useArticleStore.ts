import { create } from 'zustand'
import { message } from 'antd'
import { getArticles } from '@/services/api/article'
import type {
  Article,
  GetArticlesResponse,
  UpdateArticleRequset,
} from '@/services/model'
import type { PaginationType } from '@/constants'
import { ResponseCode } from '@/constants'
import { addArticle, deleteArticle, updateArticle } from '@/services/api'

interface ArticleState {
  articles: Array<Article>
  loading: boolean
  updating: boolean
  fetchArticles: (pagination: PaginationType) => Promise<GetArticlesResponse>
  updateArticle: (data: UpdateArticleRequset) => Promise<boolean>
  addArticle: (data: UpdateArticleRequset) => Promise<boolean>
  deleteArticle: (id: number) => Promise<boolean>
}

export const useArticleStore = create<ArticleState>((set, get) => ({
  articles: [],
  loading: false,
  updating: false,
  fetchArticles: async pagination => {
    set({ loading: true })
    const { code, msg, data } = await getArticles(
      pagination.current,
      pagination.pageSize
    )
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Fetch Articles failed: ${msg}`)
      set({ loading: false })
      return {
        list: [] as Array<Article>,
        total: 0,
        current: pagination.current,
        page_size: pagination.pageSize,
      } as GetArticlesResponse
    }
    const { list } = data
    set({
      articles: list || [],
      loading: false,
    })
    return data as GetArticlesResponse
  },
  updateArticle: async (data: UpdateArticleRequset) => {
    const { updating } = get()
    if (updating) return false
    set({ updating: true })
    const res = await updateArticle(data)
    set({ updating: false })
    const { code, msg } = res
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Update failed: ${msg}`)
      return false
    }
    message.success('Update Success')
    return true
  },
  addArticle: async (data: UpdateArticleRequset) => {
    const { updating } = get()
    if (updating) return false
    set({ updating: true })
    const res = await addArticle(data)
    set({ updating: false })
    const { code, msg } = res
    if (code !== ResponseCode.SUCCESS) {
      message.error(`Add failed: ${msg}`)
      return false
    }
    message.success('Add Success')
    return true
  },
  deleteArticle: async (articleId: number) => {
    const { updating } = get()
    if (updating) return false
    set({ updating: true })
    const res = await deleteArticle(articleId)
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

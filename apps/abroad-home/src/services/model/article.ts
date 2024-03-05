export interface GetArticlesResponse {
  list: Article[]
  total: number
  current: number
  page_size: number
}

export interface Article {
  article_id: number
  title: string
  article_url: string
  content: string
  author: string
}

import { useInViewport, useMemoizedFn } from 'ahooks'
import { List } from 'antd'
import React, { useEffect, useState } from 'react'
import { useArticleStore } from '@/store/useArticleStore'
import type { Article } from '@/services/model'
import type { PaginationType } from '@/constants'
import { Pagination } from '@/constants'

const Articles: React.FC = () => {
  const footerRef = React.useRef<HTMLDivElement>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [pagination, setPagination] = useState<PaginationType>({
    ...Pagination,
    current: 0,
  })
  const { fetchArticles, loading } = useArticleStore(state => ({
    fetchArticles: state.fetchArticles,
    loading: state.loading,
  }))
  const [isVisble] = useInViewport(footerRef)

  const _fetchArticles = useMemoizedFn(async () => {
    if (loading || (pagination.total === articles.length && articles.length))
      return
    const data = await fetchArticles({
      ...pagination,
      current: pagination.current + 1,
    })
    setPagination({
      ...pagination,
      total: data.total,
      current: data.current,
      pageSize: data.page_size,
    })
    setArticles([...articles, ...(data.list || [])])
  })

  useEffect(() => {
    if (isVisble) _fetchArticles()
  }, [isVisble])
  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={false}
      dataSource={articles}
      footer={<div ref={footerRef} style={{ height: '40px' }} />}
      renderItem={item => (
        <List.Item
          key={item.title}
          // extra={
          //   <img
          //     width={272}
          //     alt="logo"
          //     src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
          //   />
          // }
        >
          <List.Item.Meta
            // avatar={<Avatar src={item.avatar} />}
            title={item.title}
            description={item.author}
          />
          {item.content}
        </List.Item>
      )}
    />
  )
}

export default Articles

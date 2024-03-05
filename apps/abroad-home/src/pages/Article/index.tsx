import { useEffect, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { formItems, tableColumns } from './schema'
import { Form, Modal, Table } from '@/components'
import { useArticleStore } from '@/store'
import { Pagination } from '@/constants'
import { messageCenter } from '@/shared'
import type { Article as ArticleType } from '@/services/model'
import './style.less'

const Article: React.FC = () => {
  const [modalData, setModalData] = useState<{
    open: boolean
    title: string
    data: ArticleType
    type: 'add' | 'edit'
  }>({ open: false, title: '', data: {} as ArticleType, type: 'add' })

  const [pagination, setPagination] = useState<typeof Pagination>({
    ...Pagination,
  })

  const {
    articles,
    loading,
    updating,
    fetchArticles,
    addArticle,
    updateArticle,
    deleteArticle,
  } = useArticleStore(state => ({
    articles: state.articles,
    loading: state.loading,
    fetchArticles: state.fetchArticles,
    updating: state.updating,
    addArticle: state.addArticle,
    updateArticle: state.updateArticle,
    deleteArticle: state.deleteArticle,
  }))

  const handleCloseModal = useMemoizedFn(() => {
    setModalData({
      ...modalData,
      data: {} as ArticleType,
      open: false,
    })
  })

  const handlePageChange = useMemoizedFn(
    async (pagination: typeof Pagination) => {
      const data = await fetchArticles(pagination)
      setPagination({
        ...pagination,
        total: data.total,
        current: data.current,
        pageSize: data.page_size,
      })
    }
  )

  useEffect(() => {
    fetchArticles({ ...pagination, current: 1 })
  }, [])

  const handleAdd = useMemoizedFn(() => {
    setModalData({
      ...modalData,
      open: true,
      type: 'add',
      title: 'Add Article',
    })
  })

  const onSubmit = useMemoizedFn(async data => {
    switch (modalData.type) {
      case 'add':
        await addArticle(data)
        break
      case 'edit':
        await updateArticle(data)
        break
      default:
        break
    }

    fetchArticles(pagination)
    handleCloseModal()
  })

  const handleClickEdit = useMemoizedFn((record: ArticleType) => {
    setModalData({
      ...modalData,
      data: record,
      type: 'edit',
      title: 'Edit Article',
      open: true,
    })
  })

  const handleClickDelete = useMemoizedFn(async (record: ArticleType) => {
    await deleteArticle(record.article_id)
    fetchArticles(pagination)
  })

  useEffect(() => {
    const clickEdit = messageCenter.addMsgListener('clickEdit', handleClickEdit)
    const clickDelete = messageCenter.addMsgListener(
      'clickDelete',
      handleClickDelete
    )
    return () => {
      messageCenter.removeMsgListener(clickEdit)
      messageCenter.removeMsgListener(clickDelete)
    }
  }, [])

  return (
    <div className="admin-article">
      <Button
        type="dashed"
        onClick={() => handleAdd()}
        icon={<PlusOutlined />}
        style={{ width: 200, marginBottom: 20 }}
      >
        Add Article
      </Button>
      <Table
        rowKey="artical_id"
        schema={tableColumns}
        data={articles}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
      <Modal
        open={modalData.open}
        title={modalData.title}
        destroyOnClose
        onCancel={handleCloseModal}
        height="320px"
      >
        <Form
          data={modalData.data}
          schema={formItems}
          onSubmit={onSubmit}
          customFormButtonProps={{
            submit: { loading: updating },
          }}
        />
      </Modal>
    </div>
  )
}
export default Article

import { useEffect, useState } from 'react'

import { useMemoizedFn } from 'ahooks'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { tableColumns } from './schema'
import Progress from './Progress'
import CreateForm from './CreateForm'
import { Modal, Table } from '@/components'
import { messageCenter } from '@/shared'
import { useApplicationStore } from '@/store'
import type { Application } from '@/services/model'

const MyApplication: React.FC = () => {
  const [modalData, setModalData] = useState<{
    open: boolean
    title: string
    type: 'progress' | 'edit' | 'add'
    data: Application
  }>({ open: false, title: '', type: 'edit', data: {} as Application })

  const {
    applications,
    fetchApplicationByUser,
    loading,
    setApplications,
    deleteApplicationByUser,
  } = useApplicationStore(state => ({
    applications: state.applications,
    fetchApplicationByUser: state.fetchApplicationByUser,
    loading: state.loading,
    setApplications: state.setApplications,
    deleteApplicationByUser: state.deleteApplicationByUser,
  }))

  const handleClickEdit = useMemoizedFn((record: Application) => {
    setModalData({
      ...modalData,
      data: record,
      type: 'edit',
      title: 'Edit Application',
      open: true,
    })
  })

  const handleClickDelete = useMemoizedFn(async (record: Application) => {
    await deleteApplicationByUser(record.application_id)
    fetchApplicationByUser()
  })

  const handleCloseModal = useMemoizedFn(() => {
    setModalData({
      ...modalData,
      open: false,
    })
  })

  const handleAdd = useMemoizedFn(() => {
    setModalData({
      ...modalData,
      data: {} as Application,
      open: true,
      title: 'Create Application',
      type: 'add',
    })
  })

  const handleSubmit = useMemoizedFn(() => {
    fetchApplicationByUser()
    handleCloseModal()
  })

  const handleAppStatusChange = useMemoizedFn((data: Application) => {
    const app = applications.find(
      item => item.application_id === data.application_id
    )
    if (!app) return
    app.status = data.status
    setApplications([...applications])
    setModalData({
      ...modalData,
      data: app,
    })
  })

  useEffect(() => {
    fetchApplicationByUser()
  }, [])

  useEffect(() => {
    const clickEdit = messageCenter.addMsgListener('clickEdit', handleClickEdit)
    const clickDelete = messageCenter.addMsgListener(
      'clickDelete',
      handleClickDelete
    )
    const clickProgress = messageCenter.addMsgListener(
      'clickProgress',
      (record: Application) => {
        setModalData({
          ...modalData,
          data: record,
          type: 'progress',
          title: 'Progress',
          open: true,
        })
      }
    )
    return () => {
      messageCenter.removeMsgListener(clickEdit)
      // messageCenter.removeMsgListener(clickUpload)
      messageCenter.removeMsgListener(clickDelete)
      messageCenter.removeMsgListener(clickProgress)
    }
  }, [])

  return (
    <div className="my-application">
      <Button
        type="dashed"
        onClick={() => handleAdd()}
        icon={<PlusOutlined />}
        style={{ width: 200, marginBottom: 20 }}
      >
        Create
      </Button>
      <Table
        rowKey="application_id"
        schema={tableColumns}
        data={applications}
        loading={loading}
        pagination={false}
      />
      <Modal
        open={modalData.open}
        title={modalData.title}
        destroyOnClose
        onCancel={handleCloseModal}
        height="80vh"
      >
        {modalData.type === 'progress' ? (
          <Progress
            data={modalData.data}
            onDone={handleCloseModal}
            onChange={handleAppStatusChange}
          />
        ) : (
          <CreateForm
            data={modalData.data}
            action={modalData.type}
            onSubmit={handleSubmit}
          />
        )}
      </Modal>
    </div>
  )
}

export default MyApplication

import { useEffect, useState } from 'react'

import { useMemoizedFn } from 'ahooks'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { formItems, tableColumns } from './schema'
import { Form, Modal, Table } from '@/components'
import { messageCenter } from '@/shared'
import { useAdminStore, useApplicationStore } from '@/store'
import type {
  Application,
  File,
  UpdateApplicationRequest,
} from '@/services/model'
import type { PaginationType } from '@/constants'
import { ACTION, Pagination } from '@/constants'

type FormData = Omit<UpdateApplicationRequest, 'ddl' | 'file_ids'> & {
  ddl: Dayjs
  files: File[]
}

const MyApplication: React.FC = () => {
  const [modalData, setModalData] = useState<{
    open: boolean
    title: string
    type: 'progress' | 'edit' | 'add'
    data: FormData
  }>({ open: false, title: '', type: 'edit', data: {} as FormData })

  const [formSchema, setFormSchema] = useState(formItems)
  const [pagination, setPagination] = useState<PaginationType>({
    ...Pagination,
  })

  const {
    applications,
    fetchApplication,
    loading,
    updateApplication,
    createApplication,
    updating,
    deleteApplication,
  } = useApplicationStore(state => ({
    applications: state.applications,
    fetchApplication: state.fetchApplication,
    updateApplication: state.updateApplication,
    createApplication: state.createApplication,
    updating: state.updating,
    loading: state.loading,
    deleteApplication: state.deleteApplication,
  }))

  const { fetchStudents, students } = useAdminStore(state => ({
    students: state.students,
    fetchStudents: state.fetchStudents,
  }))

  const handlePageChange = useMemoizedFn(async (pagination: PaginationType) => {
    const res = await fetchApplication({
      type: 'self',
      current: pagination.current,
      page_size: pagination.pageSize,
    })
    setPagination({
      ...pagination,
      total: res.total,
      current: res.current,
      pageSize: res.page_size,
    })
  })

  const handleClickEdit = useMemoizedFn((record: Application) => {
    setModalData({
      ...modalData,
      data: {
        application_id: record.application_id,
        user_id: record.user_id,
        school: record.school,
        major: record.major,
        ddl: dayjs(new Date(record.ddl).getTime()),
        status: record.status,
        files: record.files.map(file => ({
          ...file,
          name: file.file_name,
          uid: file.file_id,
          url: file.file_url,
          status: 'done',
        })),
      },
      type: 'edit',
      title: 'Edit Application',
      open: true,
    })
  })

  const handleClickDelete = useMemoizedFn(async (record: Application) => {
    await deleteApplication(record.application_id)
    fetchApplication({
      current: pagination.current,
      page_size: pagination.pageSize,
    })
  })

  const handleCloseModal = useMemoizedFn(() => {
    setModalData({
      ...modalData,
      open: false,
      data: {} as FormData,
    })
  })

  const handleAdd = useMemoizedFn(() => {
    setModalData({
      ...modalData,
      data: {} as FormData,
      open: true,
      title: 'Create Application',
      type: 'add',
    })
  })

  const handleSubmit = useMemoizedFn(async (fields: FormData) => {
    const reqParams = {
      application_id: modalData.data?.application_id,
      user_id: fields.user_id,
      school: fields.school,
      major: fields.major,
      ddl: Math.floor(fields.ddl.toDate().getTime() / 1000),
      file_ids: fields.files.map(file => file.file_id),
      type: fields.type,
      status: fields.status,
    }
    switch (modalData.type) {
      case ACTION.Add:
        await createApplication(reqParams)
        break
      case ACTION.Edit:
        await updateApplication(reqParams)
        break
      default:
        break
    }

    fetchApplication({
      current: pagination.current,
      page_size: pagination.pageSize,
    })
    handleCloseModal()
  })

  useEffect(() => {
    fetchApplication({
      current: pagination.current,
      page_size: pagination.pageSize,
    })
    fetchStudents({
      ...pagination,
      pageSize: -1,
    })
  }, [])

  useEffect(() => {
    setFormSchema(
      formItems.map(item => {
        if (item.optionKey === 'student') {
          return {
            ...item,
            options: students.map(student => ({
              label: student.account_name,
              value: student.user_id,
            })),
          }
        }

        return item
      }) as any
    )
  }, [students])

  useEffect(() => {
    const clickEdit = messageCenter.addMsgListener('clickEdit', handleClickEdit)
    const clickDelete = messageCenter.addMsgListener(
      'clickDelete',
      handleClickDelete
    )
    return () => {
      messageCenter.removeMsgListener(clickEdit)
      // messageCenter.removeMsgListener(clickUpload)
      messageCenter.removeMsgListener(clickDelete)
    }
  }, [])

  return (
    <div className="admin-application">
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
        pagination={pagination}
        onPageChange={handlePageChange}
      />
      <Modal
        open={modalData.open}
        title={modalData.title}
        destroyOnClose
        onCancel={handleCloseModal}
        height="80vh"
      >
        <Form
          schema={formSchema}
          data={modalData.data}
          onSubmit={handleSubmit}
          captions={{ submit: 'Apply' }}
          customFormButtonProps={{ submit: { loading: updating } }}
        />
      </Modal>
    </div>
  )
}

export default MyApplication

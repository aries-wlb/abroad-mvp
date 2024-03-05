import { useEffect, useState } from 'react'
import { useMemoizedFn, useRequest } from 'ahooks'
import { PlusOutlined } from '@ant-design/icons'
import { Button, message } from 'antd'
import { formItems, labelMap, tableColumns } from './schema'
import { Descriptions, Form, Modal, Table } from '@/components'
import { useAdminStore } from '@/store'
import type { PaginationType } from '@/constants'
import { Pagination, ResponseCode } from '@/constants'
import { messageCenter } from '@/shared'
import type { OptionKey, OptionResponse, UserInfo } from '@/services/model'
import './style.less'
import { getOptions } from '@/services/api'

const Student: React.FC = () => {
  const [modalData, setModalData] = useState<{
    open: boolean
    title: string
    data: UserInfo
    type: string
  }>({ open: false, title: '', data: {} as UserInfo, type: 'detail' })
  const [messageApi, contextHolder] = message.useMessage()

  const [pagination, setPagination] = useState<PaginationType>({
    ...Pagination,
  })

  const {
    students,
    loading,
    fetchStudents,
    userInfoUpdateLoading,
    updateUserInfo,
  } = useAdminStore(state => ({
    students: state.students,
    loading: state.sFetchloading,
    fetchStudents: state.fetchStudents,
    userInfoUpdateLoading: state.userInfoUpdateLoading,
    updateUserInfo: state.updateUserInfo,
  }))

  const [formSchema, setFormSchema] = useState(formItems)
  const [options, setOptions] = useState<OptionResponse>({} as OptionResponse)
  useRequest(getOptions, {
    onSuccess: result => {
      const { code, msg } = result || {}
      if (code !== ResponseCode.SUCCESS) {
        messageApi.error(`Get options failed: ${msg}`)
        return
      }
      setOptions(result.data)
    },
  })
  useEffect(() => {
    setFormSchema(
      formItems.map(item => {
        if (item.optionKey) {
          return {
            ...item,
            options: options[item.optionKey as OptionKey] || [],
          }
        }

        return item
      }) as any
    )
  }, [options])

  const handleCloseModal = useMemoizedFn(() => {
    setModalData({
      ...modalData,
      open: false,
    })
  })

  const handlePageChange = useMemoizedFn(
    async (pagination: typeof Pagination) => {
      const res = await fetchStudents(pagination)
      setPagination({
        ...pagination,
        total: res.total,
        current: res.current,
        pageSize: res.page_size,
      })
    }
  )

  useEffect(() => {
    fetchStudents(pagination)
  }, [])

  const updateSchemaSchoolTypes = useMemoizedFn((degree: number) => {
    setFormSchema(
      formSchema.map(item => {
        if (item.optionKey === 'school_types') {
          return {
            ...item,
            options: options[item.optionKey as OptionKey]?.filter(
              option => option.degree === degree
            ),
          }
        }
        return item
      }) as any
    )
  })

  const handleAdd = useMemoizedFn(() => {
    setModalData({
      ...modalData,
      open: true,
      title: 'Add Student',
      data: { role_id: 2, degree: 0 } as UserInfo,
      type: 'add',
    })
    updateSchemaSchoolTypes(0)
  })

  const onSubmit = useMemoizedFn(async data => {
    switch (modalData.type) {
      case 'edit':
        await updateUserInfo(data)
        break
      default:
        break
    }
    fetchStudents(pagination)
    handleCloseModal()
  })

  const getSchoolTypeName = useMemoizedFn((schoolType: number) => {
    const schoolTypeOption = options.school_types?.find(
      item => item.value === schoolType
    )
    return schoolTypeOption?.label
  })

  const handleClickEdit = useMemoizedFn((record: any) => {
    setModalData({
      ...modalData,
      data: record,
      title: 'Edit Student',
      type: 'edit',
      open: true,
    })
    updateSchemaSchoolTypes(record.degree)
  })

  const handleClickUser = useMemoizedFn((record: any) => {
    const { key: _key, ...rest } = record
    setModalData({
      ...modalData,
      data: { ...rest, school_type: getSchoolTypeName(record.school_type) },
      title: 'Student Info',
      type: 'detail',
      open: true,
    })
  })

  const handleDegreeChange = useMemoizedFn(({ form }) => {
    form?.setFieldsValue({ school_type: undefined })
    updateSchemaSchoolTypes(form?.getFieldValue('degree') || 0)
  })

  useEffect(() => {
    const clickEdit = messageCenter.addMsgListener('clickEdit', handleClickEdit)
    const clickUser = messageCenter.addMsgListener('clickUser', handleClickUser)
    const onDegreeChange = messageCenter.addMsgListener(
      'onDegreeChange',
      handleDegreeChange
    )
    return () => {
      messageCenter.removeMsgListener(clickEdit)
      messageCenter.removeMsgListener(clickUser)
      messageCenter.removeMsgListener(onDegreeChange)
    }
  }, [])

  return (
    <div className="admin-student">
      {contextHolder}
      <Button
        type="dashed"
        onClick={() => handleAdd()}
        icon={<PlusOutlined />}
        style={{ width: 200, marginBottom: 20 }}
      >
        Add Student
      </Button>
      <Table
        rowKey="user_id"
        schema={tableColumns}
        data={students}
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
        {modalData.type === 'detail' ? (
          <Descriptions
            labelMap={labelMap}
            data={modalData.data as unknown as Record<string, unknown>}
            bordered
            column={1}
          />
        ) : (
          <Form
            data={modalData.data}
            schema={formSchema}
            onSubmit={onSubmit}
            customFormButtonProps={{
              submit: { loading: userInfoUpdateLoading },
            }}
          />
        )}
      </Modal>
    </div>
  )
}
export default Student

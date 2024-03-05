import {
  Avatar,
  Button,
  Descriptions,
  Divider,
  Skeleton,
  Table,
  Typography,
  message,
} from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMemoizedFn, useRequest } from 'ahooks'
import type { BaseInfoItem } from './schema'
import { baseInfo, formItems } from './schema'
import { useGlobalStore } from '@/store'
import type { OptionKey, OptionResponse, UserInfo } from '@/services/model'
import { Modal } from '@/components/Modal'
import { Form } from '@/components'
import { getOptions } from '@/services/api'
import { ResponseCode } from '@/constants'
import { messageCenter } from '@/shared'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Achievement',
    dataIndex: 'achievement',
    key: 'achievement',
  },
]

const { Paragraph } = Typography

const Info: React.FC = () => {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const {
    fetchUser,
    fetchLoading,
    updateUserInfo,
    userInfoUpdateLoading,
    userInfo = {} as UserInfo,
  } = useGlobalStore(state => ({
    fetchLoading: state.fetchUserLoading,
    userInfo: state.userInfo,
    fetchUser: state.fetchUser,
    updateUserInfo: state.updateUserInfo,
    userInfoUpdateLoading: state.userInfoUpdateLoading,
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

  const [modalData, setModalData] = useState<{
    open: boolean
    title: string
    data: any
  }>({ open: false, title: '', data: {} })

  const _fetchUser = useMemoizedFn(async () => {
    const logined = await fetchUser()
    if (logined) return

    navigate('/home', { replace: true })
  })

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

  const onEditClick = useMemoizedFn(() => {
    setModalData({
      ...modalData,
      open: true,
    })
    updateSchemaSchoolTypes(userInfo.degree)
  })

  const getSchoolTypeName = useMemoizedFn((schoolType: number) => {
    const schoolTypeOption = options.school_types?.find(
      item => item.value === schoolType
    )
    return schoolTypeOption?.label
  })

  const getDegreeName = useMemoizedFn((degree: number) => {
    const schoolTypeOption = options.degrees?.find(
      item => item.value === degree
    )
    return schoolTypeOption?.label
  })

  const renderBaseItem = useMemoizedFn((info: BaseInfoItem) => {
    let label = userInfo[info.name]
    if (info.name === 'school_type') label = getSchoolTypeName(label as number)
    if (info.name === 'degree') label = getDegreeName(label as number)

    return (
      <Descriptions.Item label={info.label}>
        {fetchLoading ? (
          <Skeleton.Input active size="small" block />
        ) : (
          (label as string)
        )}
      </Descriptions.Item>
    )
  })

  const handleCloseModal = useMemoizedFn(() => {
    setModalData({
      ...modalData,
      open: false,
    })
  })

  const onSubmit = useMemoizedFn(async data => {
    await updateUserInfo(data)
    _fetchUser()
    handleCloseModal()
  })

  const handleDegreeChange = useMemoizedFn(({ form }) => {
    form?.setFieldsValue({ school_type: undefined })
    updateSchemaSchoolTypes(form?.getFieldValue('degree') || 0)
  })

  useEffect(() => {
    _fetchUser()
  }, [])

  useEffect(() => {
    const onDegreeChange = messageCenter.addMsgListener(
      'onDegreeChange',
      handleDegreeChange
    )
    return () => {
      messageCenter.removeMsgListener(onDegreeChange)
    }
  }, [])

  return (
    <>
      <div className="info-container">
        {contextHolder}
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={onEditClick}
          style={{
            position: 'absolute',
            right: 30,
            top: -18,
            color: 'black',
            fontSize: 18,
            zIndex: 5,
            fontFamily: 'Quicksand-Bold',
          }}
        >
          Edit
        </Button>
        <div className="basic">
          <Avatar
            size={100}
            style={{
              backgroundColor: '#fde3cf',
              color: '#f56a00',
              marginBottom: 8,
            }}
          >
            U
          </Avatar>
          <span className="text-title">{userInfo.account_name}</span>
        </div>
        <div className="content">
          <Divider orientation="left" plain className="text-title">
            Basic
          </Divider>
          <Descriptions>
            {baseInfo.map(info => renderBaseItem(info))}
          </Descriptions>

          <Divider orientation="left" plain className="text-title">
            Other Standardized Achievement
          </Divider>
          <Skeleton loading={fetchLoading} active={true}>
            <Table
              pagination={false}
              rowKey="name"
              bordered
              locale={{ emptyText: 'No data' }}
              columns={columns}
              dataSource={userInfo.academic_experience || []}
            />
          </Skeleton>

          <Divider orientation="left" plain className="text-title">
            Intention
          </Divider>
          <Skeleton loading={fetchLoading} active={true}>
            <Descriptions>
              <Descriptions.Item label="Intended Region">
                {userInfo.intent_region}
              </Descriptions.Item>
              <Descriptions.Item label="Intended Major" span={2}>
                {userInfo.intent_major}
              </Descriptions.Item>
              <Descriptions.Item label="Other" span={3}>
                <Paragraph
                  ellipsis={{
                    rows: 3,
                    expandable: true,
                  }}
                  title={userInfo.other_details}
                >
                  {userInfo.other_details}
                </Paragraph>
              </Descriptions.Item>
            </Descriptions>
          </Skeleton>

          <Divider orientation="left" plain className="text-title">
            Personal Introduction
          </Divider>
          <Skeleton loading={fetchLoading} active={true}>
            <Paragraph
              ellipsis={{
                rows: 3,
                expandable: true,
              }}
              title={userInfo.personal_introduction}
              style={{ minHeight: 100 }}
            >
              {userInfo.personal_introduction}
            </Paragraph>
          </Skeleton>
        </div>
      </div>
      <Modal
        open={modalData.open}
        title="Edit Info"
        destroyOnClose
        onCancel={handleCloseModal}
        height="80vh"
      >
        <Form
          data={userInfo}
          schema={formSchema}
          onSubmit={onSubmit}
          customFormButtonProps={{
            submit: { loading: userInfoUpdateLoading },
          }}
        />
      </Modal>
    </>
  )
}

export default Info

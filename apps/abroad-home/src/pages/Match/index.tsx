import { useEffect, useState } from 'react'
import { Button, Result, message } from 'antd'
import { useMemoizedFn, useRequest } from 'ahooks'

import { formItems } from './schema'
import { Form } from '@/components'
import './style.less'
import type {
  MatchRequest,
  MatchResponse,
  OptionKey,
  OptionResponse,
  UserInfo,
} from '@/services/model'
import { useGlobalStore } from '@/store'
import { getOptions, match } from '@/services/api/common'
import { ResponseCode } from '@/constants'
import { messageCenter } from '@/shared'

const Match: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const { userInfo = {} as UserInfo } = useGlobalStore(state => ({
    userInfo: state.userInfo,
  }))
  const [result, setResult] = useState<MatchResponse | null>(null)

  const { loading, run } = useRequest(match, {
    manual: true,
    onSuccess: result => {
      const { code, msg, data } = result || {}
      if (code !== ResponseCode.SUCCESS) {
        messageApi.error(`Match failed: ${msg}`)
        return
      }
      setResult(data)
      // Modal.success({
      //   title: 'Match Done',
      //   content: <div>{data?.result}</div>,
      // })
    },
  })

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
  const [formSchema, setFormSchema] = useState(formItems)

  const [formData, setFormData] = useState<MatchRequest>({
    degree: 0,
  } as MatchRequest)
  useEffect(() => {
    setFormSchema(
      formItems.map(item => {
        if (item.optionKey === 'school_types') {
          return {
            ...item,
            options: options[item.optionKey as OptionKey]?.filter(
              option => option.degree === formData.degree
            ),
          }
        }

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

  const onSubmit = useMemoizedFn(async (fields: MatchRequest) => {
    if (loading) return
    setFormData({
      ...fields,
    })
    const { academic_experience, language_achi } = fields
    const getScore = (name: string) =>
      academic_experience
        ?.filter(item => item?.name === name)
        ?.map(item => item?.achievement)
        ?.sort((a, b) => b - a)[0] || 0
    const toefl =
      language_achi?.name === 'TOEFL' ? language_achi?.achievement : 0
    const ielts =
      language_achi?.name === 'IELTS' ? language_achi?.achievement : 0
    const gmat = getScore('GMAT')
    const gre = getScore('GRE')
    const sat = getScore('SAT')
    const act = getScore('ACT')
    const ap = getScore('AP')
    const a_level = getScore('ALevel')
    const ib = getScore('IB')
    const params = {
      intent_region: fields.intent_region,
      school_type: fields.school_type,
      gpa: fields.gpa,
      degree: fields.degree,
      toefl,
      ielts,
      gmat,
      gre,
      act,
      sat,
      ap,
      a_level,
      ib,
    }
    run(params)
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

  const onAutoFill = useMemoizedFn(() => {
    setFormData({
      school_name: userInfo.school_name,
      major: userInfo.major,
      gpa: userInfo.gpa,
      degree: userInfo.degree || 0,
      school_type: userInfo.school_type,
      language_achi: userInfo.language_achi,
      academic_experience: userInfo.academic_experience,
      intent_region: userInfo.intent_region,
      intent_major: userInfo.intent_major,
      other_details: userInfo.other_details,
    })
    updateSchemaSchoolTypes(userInfo.degree)
  })

  const handleDegreeChange = useMemoizedFn(({ form }) => {
    form?.setFieldsValue({ school_type: undefined })
    updateSchemaSchoolTypes(form?.getFieldValue('degree') || 0)
  })

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
    <div className="match-container">
      {contextHolder}
      <div className="match-header">School Matching</div>
      {!result ? (
        <Form
          data={formData}
          schema={formSchema}
          onSubmit={onSubmit}
          captions={{ submit: 'Match' }}
          extraBtnRender={() => <Button onClick={onAutoFill}>Auto-Fill</Button>}
        ></Form>
      ) : (
        <Result
          status="success"
          title="Match School Done!"
          subTitle={result?.result_msg}
          extra={[
            <Button type="primary" onClick={() => setResult(null)}>
              Re-Match
            </Button>,
            // <Button key="buy">Buy Again</Button>,
          ]}
        />
      )}
    </div>
  )
}

export default Match

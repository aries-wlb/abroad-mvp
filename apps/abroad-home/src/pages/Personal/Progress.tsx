import type { StepsProps } from 'antd'
import { Button, Layout, Result, Space, Steps } from 'antd'
import {
  CheckCircleOutlined,
  LoadingOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import './style.less'
import { useEffect, useMemo, useState } from 'react'
import { useMemoizedFn } from 'ahooks'
import { useApplicationStore } from '@/store'
import type { Application } from '@/services/model'
import { ApplicationStatus } from '@/services/model'

const { Sider, Content } = Layout

const mainProgress = [
  {
    key: 'prepare',
    title: 'Prepare',
    desc: '',
    children: [
      {
        key: ApplicationStatus.PrepareDocument,
        title: 'Document',
        desc: 'Have you prepared your application documents?',
      },
      {
        key: ApplicationStatus.PrepareDDL,
        title: 'DDL',
        desc: 'Have you confirmed the deadline?',
      },
      {
        key: ApplicationStatus.PrepareSubmit,
        title: 'Submit',
        desc: 'Have you submitted your application?',
      },
    ],
  },
  {
    key: 'submitted',
    title: 'Submitted',
    desc: '',
    children: [
      {
        key: ApplicationStatus.SubmitFee,
        title: 'Application Fee',
        desc: 'Have you paid the application fee?',
      },
      {
        key: ApplicationStatus.SubmitRefLetter,
        title: 'Reference Letter',
        desc: 'Have you confirmed your reference letter?',
      },
    ],
  },
  {
    key: 'offering',
    title: 'Offering',
    children: [
      {
        key: ApplicationStatus.OfferWaiting,
        title: 'Waiting',
        desc: 'Wainting for the result....',
      },
    ],
  },
  {
    key: 'admission',
    title: 'Admission',
    children: [
      {
        key: ApplicationStatus.AdmissionDocument,
        title: 'Supplementary',
        desc: 'Is there any supplementary document need to add?',
      },
      {
        key: ApplicationStatus.AdmissionDeposit,
        title: 'Deposit',
        desc: 'Have you paid the deposit?',
      },
    ],
  },
  {
    key: ApplicationStatus.Done,
    title: 'Done',
  },
]

const siderStyle: React.CSSProperties = {
  backgroundColor: 'white',
}

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  backgroundColor: 'white',
}

function getCurSteps(curStatus = 1) {
  let mainStep = 0
  let remain = curStatus
  while (true) {
    if (!mainProgress[mainStep]?.children) break
    remain -= mainProgress[mainStep]?.children?.length || 0
    if (remain < 1 || mainStep > 5) {
      remain += mainProgress[mainStep]?.children?.length || 0
      break
    }
    mainStep += 1
  }
  return [mainStep, remain - 1]
}

interface ProgressProps {
  data: Application
  onDone?: () => void
  onChange?: (app: Application) => void
}

const customDot: StepsProps['progressDot'] = dot => dot
const autoText = 'Processing, Please wait'

const Progress: React.FC<ProgressProps> = ({ data, onDone, onChange }) => {
  const { statusUpdating, updateStatusByUser } = useApplicationStore(state => ({
    statusUpdating: state.statusUpdating,
    updateStatusByUser: state.updateStatusByUser,
  }))
  const [[mainCurrent, childCurrent], setCurStep] = useState(
    getCurSteps(data.status)
  )

  useEffect(() => {
    setCurStep(getCurSteps(data.status))
  }, [data.status])

  const { childrenProgress, done, start } = useMemo(() => {
    return {
      childrenProgress: mainProgress[mainCurrent]?.children || [],
      done: data.status === ApplicationStatus.Done,
      start: data.status === ApplicationStatus.PrepareDocument,
    }
  }, [mainCurrent, data.status])

  const Icon = useMemoizedFn(() => {
    if (done) return <CheckCircleOutlined />
    switch (data.type) {
      case 'self':
        return <QuestionCircleOutlined style={{ color: '#c3a91e' }} />
      case 'auto':
        return <LoadingOutlined />
      default:
        return null
    }
  })

  const handleNext = useMemoizedFn(async () => {
    if (data.status === ApplicationStatus.Done) {
      onDone?.()
      return
    }
    const status = data.status + 1
    const result = await updateStatusByUser({
      application_id: data.application_id,
      status,
    })
    if (result) onChange?.({ ...data, status })
  })

  const handlePre = useMemoizedFn(async () => {
    const status = data.status - 1
    if (status < ApplicationStatus.PrepareDocument) return
    const result = await updateStatusByUser({
      application_id: data.application_id,
      status,
    })
    if (result) onChange?.({ ...data, status })
  })

  const renderExtra = useMemoizedFn(() => {
    switch (data.type) {
      case 'self':
        return (
          <Space>
            {!start && (
              <Button
                type="primary"
                onClick={handlePre}
                loading={statusUpdating}
              >
                Previous
              </Button>
            )}
            <Button type="primary" onClick={handleNext}>
              {done ? 'Done' : 'Next'}
            </Button>
          </Space>
        )
      default:
        return null
    }
  })

  const progressText = useMemo(() => {
    const text = mainProgress[mainCurrent]?.children?.[childCurrent]?.desc
    if (done) return 'Congratulations! You have been admitted!'
    return data.type === 'auto' ? autoText : text
  }, [mainCurrent, childCurrent, done])

  return (
    <div className="progress-container">
      <Steps
        progressDot={customDot}
        current={mainCurrent === -1 ? 0 : mainCurrent}
        items={mainProgress}
      />
      <Layout className="progress-content">
        {childrenProgress.length ? (
          <Sider style={siderStyle}>
            <Steps
              current={childCurrent}
              direction="vertical"
              items={childrenProgress}
            />
          </Sider>
        ) : null}
        <Content style={contentStyle}>
          <Result
            status={done ? 'success' : 'info'}
            icon={<Icon />}
            title={progressText}
            extra={renderExtra()}
          />
        </Content>
      </Layout>
    </div>
  )
}

export default Progress

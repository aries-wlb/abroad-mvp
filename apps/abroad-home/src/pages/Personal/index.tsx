import { useMemoizedFn } from 'ahooks'
import { Layout } from 'antd'
import './style.less'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MyApplication from './MyApplication'
import Info from './Info'
import SiderSelect from '@/components/SiderSelect'

const { Sider, Content } = Layout

const siderStyle: React.CSSProperties = {
  backgroundColor: 'white',
}

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  backgroundColor: 'white',
}

const options = [
  // { label: 'Create', value: 'create' },
  { label: 'Info Detail', value: 'info' },
  { label: 'My Application', value: 'my' },
]

const Apply: React.FC = () => {
  const { tab } = useParams()
  const navigate = useNavigate()

  const [selected, setSelected] = useState('')

  const onSiderSelect = useMemoizedFn((item: string) => {
    navigate(`/personal/${item}`, { replace: true })
  })

  useEffect(() => {
    if (tab) setSelected(tab)
  }, [tab])

  const renderContent = useMemoizedFn(() => {
    switch (selected) {
      case 'info':
        return <Info />
      case 'my':
        return <MyApplication />
      default:
        return null
    }
  })

  return (
    <div className="apply-container">
      {/* <div className="apply-header">Personal Info</div> */}
      <div className="apply-body">
        <Layout hasSider>
          <Sider style={siderStyle}>
            <SiderSelect
              options={options}
              defaultSelected={tab}
              onSelect={item => onSiderSelect(item.value as string)}
            />
          </Sider>
          <Content style={contentStyle}>{renderContent()}</Content>
        </Layout>
      </div>
      {/* <Form
        schema={formItems}
        onSubmit={onSubmit}
        captions={{ submit: 'Match' }}
      ></Form> */}
    </div>
  )
}

export default Apply

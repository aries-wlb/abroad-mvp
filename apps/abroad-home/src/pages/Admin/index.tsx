import { Outlet, useLocation, useMatches, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ConfigProvider, Layout, Menu } from 'antd'
import { useMemoizedFn } from 'ahooks'
import Breadcrumb from '../Breadcrumb'
import './style.less'

const { Content, Sider } = Layout

const menu = [
  {
    key: 'student',
    label: 'Student',
  },
  {
    key: 'article',
    label: 'Article',
  },
  {
    key: 'application',
    label: 'Application',
  },
]

const Admin: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const matches = useMatches()
  const [selectedMenus, setSelectedMenus] = useState<string[]>([])

  const handleMenuClick = useMemoizedFn(({ key }) => {
    navigate(key)
  })

  useEffect(() => {
    if (location.pathname === '/admin') navigate('student')
  }, [location, navigate])

  useEffect(() => {
    setSelectedMenus([matches[matches.length - 1].id])
  }, [matches])

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Quicksand-Regular',
          colorPrimary: '#5888ce',
        },
      }}
    >
      <Layout>
        <Sider width={200} style={{ background: 'white' }}>
          <Menu
            mode="inline"
            selectedKeys={selectedMenus}
            style={{ height: '100%', borderRight: 0 }}
            onClick={handleMenuClick}
            items={menu}
          />
        </Sider>
        <Layout>
          <div className="admin-bread-container">
            <Breadcrumb />
          </div>
          <Content
            style={{
              padding: 24,
              margin: 24,
              minHeight: 280,
              background: 'white',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
export default Admin

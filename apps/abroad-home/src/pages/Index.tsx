import {
  Link,
  Outlet,
  useLocation,
  useMatch,
  useNavigate,
} from 'react-router-dom'
import { Suspense, useEffect, useRef, useState } from 'react'
import type { MenuProps } from 'antd'
import { Avatar, ConfigProvider, Dropdown, Layout, Spin } from 'antd'
import { useClickAway, useMemoizedFn } from 'ahooks'

import Breadcrumb from './Breadcrumb'
import Menu from './Menu'
import './style.less'
import LoginModal from './Login/LoginModal'
import { useGlobalStore } from '@/store'
import { LocalStorage } from '@/shared/storage'

const { Header, Content, Footer } = Layout

const dropdownItems: MenuProps['items'] = [
  {
    label: <Link to="/personal/info">Personal</Link>,
    key: 'personal',
  },
  ...([
    {
      type: 'divider',
    },
    {
      label: <div>logout</div>,
      key: 'logout',
    },
  ] as Array<any>),
]

const Index: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const match = useMatch('/admin/*')
  const dropdownRef = useRef(null)
  const globalStore = useGlobalStore(state => ({
    isLogin: state.isLogin,
    setOpen: state.setOpen,
    fetchUser: state.fetchUser,
    logout: state.logout,
  }))

  useEffect(() => {
    const token = LocalStorage.token.get()
    if (globalStore.isLogin || token) globalStore.fetchUser()
  }, [])

  useEffect(() => {
    if (location.pathname === '/') navigate('/home')
  }, [location, navigate])

  const onDropdownClick = useMemoizedFn(() => {
    if (!open && !globalStore.isLogin) {
      globalStore.setOpen(true)
      return
    }
    setOpen(!open)
  })

  const handleMenuClick = useMemoizedFn(({ key }) => {
    if (key === 'logout') globalStore.logout()
  })

  useClickAway(() => {
    setOpen(false)
  }, dropdownRef)

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Quicksand-Regular',
          colorPrimary: '#5888ce',
        },
      }}
    >
      <Layout className="patrick-layout">
        <Header className="layout-header">
          <div className="logo" />
          <Menu />
          <div onClick={() => onDropdownClick()} ref={dropdownRef}>
            <Dropdown
              menu={{ items: dropdownItems, onClick: handleMenuClick }}
              open={open}
              arrow
            >
              <Avatar
                style={{
                  backgroundColor: '#fde3cf',
                  color: '#f56a00',
                  marginLeft: 30,
                  cursor: 'pointer',
                }}
              >
                U
              </Avatar>
            </Dropdown>
          </div>
        </Header>
        <Content className="layout-content">
          <div
            className="root-breadcrmb-container"
            style={{ display: match ? 'none' : undefined }}
          >
            <Breadcrumb />
          </div>
          <Suspense
            fallback={<Spin className="layout-content-spin" size="large" />}
          >
            <Outlet />
          </Suspense>
        </Content>
        <Footer className="layout-footer">
          Copyright © Patrick All Rights Reserved.
        </Footer>
      </Layout>
      <LoginModal />
    </ConfigProvider>
  )
}
export default Index

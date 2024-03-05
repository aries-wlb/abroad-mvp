import React, { useEffect, useMemo, useState } from 'react'
import {
  AppstoreOutlined,
  HomeOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import './style.less'
import { useMatches, useNavigate } from 'react-router-dom'
import { useGlobalStore } from '@/store'
import { Role } from '@/services/model/admin'

const items: MenuProps['items'] = [
  {
    label: 'Home',
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: 'Match',
    key: 'match',
    icon: <SearchOutlined />,
  },
]

const _Menu: React.FC = () => {
  const [current, setCurrent] = useState('')
  const match = useMatches()
  const { userInfo, isLogin, setOpen } = useGlobalStore(state => ({
    userInfo: state.userInfo,
    isLogin: state.isLogin,
    setOpen: state.setOpen,
  }))

  const _items = useMemo(() => {
    if (userInfo.role_id === Role.Admin) {
      return [
        ...items,
        {
          label: 'Admin',
          key: 'admin',
          icon: <AppstoreOutlined />,
        },
      ]
    }
    return items
  }, [userInfo])
  const navigate = useNavigate()

  useEffect(() => {
    setCurrent(match?.[1]?.id)
  }, [match])

  const onClick: MenuProps['onClick'] = e => {
    if (!isLogin && e.key !== 'home') {
      setOpen(true, e.key)
      return
    }
    navigate(e.key)
  }

  return (
    <div className="menu-container">
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={_items}
        style={{ height: 48 }}
      />
    </div>
  )
}

export default _Menu

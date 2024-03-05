import { Breadcrumb } from 'antd'
import type {
  BreadcrumbItemType,
  ItemType,
} from 'antd/es/breadcrumb/Breadcrumb'
import type { Params } from 'react-router-dom'
import { Link, useMatches } from 'react-router-dom'
import { useEffect, useState } from 'react'

const TITLE_MAP: Record<string, string> = {
  home: 'Home',
  search: 'Search',
  apply: 'Apply',
  student: 'Student',
  admin: 'Admin',
  article: 'Article',
  application: 'Application',
}

interface MatchData {
  id: string
  pathname: string
  params: Params<string>
  data: { noEntity?: boolean }
  handle: unknown
}

type ItemRender = (
  route: ItemType & MatchData,
  params: unknown,
  routes: ItemType[],
  paths: string[]
) => React.ReactNode

const itemRender: ItemRender = (item, _, items) => {
  const contentOnly =
    items.indexOf(item) === items.length - 1 || item.data?.noEntity
  return contentOnly ? (
    <div>{item.title}</div>
  ) : (
    <Link to={item.id!}>{item.title}</Link>
  )
}

const _Breadcrumb: React.FC = () => {
  const match = useMatches()
  const [breadItems, setItems] = useState<BreadcrumbItemType[]>([])
  const [display, setDisplay] = useState<string | undefined>()

  useEffect(() => {
    const items = match
      .filter(item => item.id !== 'root')
      .map(route => ({
        ...route,
        path: route.pathname,
        title: TITLE_MAP[route.id],
      }))
    setDisplay(items.length <= 1 ? 'none' : undefined)
    setItems(items)
  }, [match])
  return (
    <Breadcrumb
      items={breadItems}
      itemRender={itemRender as any}
      style={{ display }}
    />
  )
}
export default _Breadcrumb

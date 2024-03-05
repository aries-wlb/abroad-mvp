import type { TableProps } from 'antd'
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Popconfirm,
  Select,
  Space,
  Switch,
  Tooltip,
  Typography,
  Table as _Table,
  message,
} from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  RedoOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { isEmpty } from 'lodash'

import JSONViewer from '../JSONViewer'
import { isJsonString, messageCenter, timestampToDate } from '@/shared'

export interface PaginationProps {
  current: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  position?: any
  pageSizeOptions: string[]
}

// table attributes definition
type TableProp = {
  schema: TableItem[]
  data: Record<string, any>[]
  // pagination information
  pagination?: PaginationProps | any
  // on table's page changed
  onPageChange?: (data: any, filters?: any) => void
  loading?: boolean
  footer?: any
  handleInputOnchange?: (e?: any, data?: any) => void
} & TableProps<any>

type DisabledFunc = (record: any) => boolean

export interface TableItem {
  label: string
  name?: string
  // Text,Link,Badge,Switch,Download,Copy,Action
  type?: string
  render?: (text: string, record: any, index?: any) => any
  linkRender?: (text: string, record: any, index?: any) => any
  // Action type
  config?: ConfigItem[]
  handle?: string
  format?: string
  disabled?: DisabledFunc | boolean
  // for adapt ant design table
  title?: string
  dataIndex?: string
  filteredValue?: any
  filters?: any[]
  onFilter?: (value: any, record: any) => any
  indicatorSwitch?: string[]
  // tooltip type
  tooltipKey?: string
}
interface ConfigItem {
  label?: string
  // default,primary,danger
  type: string
  handle?: string
  // view|delete|check|close';
  icon?: string
  dependent?: {
    name: string
    // Different values are seperated by "|", value1|value2|value3
    value: string | number | boolean
  }
  disabled?: any
  withConfirm?: boolean
  confirmTitle?: string
  confirmContent?: string
}

// table component implementation
export function Table({
  schema,
  data = [],
  pagination,
  onPageChange,
  loading,
  footer,
  handleInputOnchange,
  ...rest
}: TableProp) {
  const { Text, Link } = Typography
  const { Option } = Select

  // add key in each row
  data?.forEach((item, index: number) => {
    let row = null
    if (!item.key) {
      row = item
      row.key = index
    }
  })

  const renderBtnIcon = (icon: string | undefined) => {
    switch (icon) {
      case 'view': {
        return <EyeOutlined />
      }
      case 'delete': {
        return <DeleteOutlined />
      }
      case 'check': {
        return <CheckOutlined />
      }
      case 'close': {
        return <CloseOutlined />
      }
      case 'stop': {
        return <StopOutlined />
      }
      case 'copy': {
        return <CopyOutlined />
      }
      case 'flush': {
        return <RedoOutlined />
      }
      case 'download': {
        return <DownloadOutlined />
      }
      case 'none': {
        return undefined
      }
      default: {
        return <EditOutlined />
      }
    }
  }

  // Render Action Button
  const renderActionItem = (config: ConfigItem, index: number, record: any) => {
    let shouldRender = false
    // Determine if display contain dependency
    if (config.dependent) {
      // change to string
      const values = String(config.dependent.value).split('|')
      const target = String(record[config.dependent.name])
      for (const value of values) {
        if (value === target) {
          shouldRender = true
          break
        }
      }
    } else {
      shouldRender = true
    }

    if (shouldRender && config.type === 'switch') {
      return (
        <Switch
          checked={record[`${config.label}`]}
          onChange={value => {
            config.handle &&
              messageCenter.sendMsg(config.handle, { value, record })
          }}
        />
      )
    }

    if (shouldRender && config.type === 'divider')
      return <Divider type="vertical" key={index} />

    const onClick = () => {
      if (!config.handle) return
      // Send registration event through message center
      messageCenter.sendMsg(config.handle, record)
    }
    const disabled = !!record.btnDisabled

    const ActionBtn = ({ onClick, disabled }: any) => (
      <Button
        key={index}
        size="small"
        type={
          config.type as
            | 'link'
            | 'text'
            | 'ghost'
            | 'default'
            | 'primary'
            | 'dashed'
            | undefined
        }
        icon={renderBtnIcon(config.icon)}
        disabled={disabled}
        onClick={onClick}
      >
        {config.label}
      </Button>
    )

    const actionComp = config.withConfirm ? (
      <Popconfirm
        title={config.confirmTitle}
        description={config.confirmContent}
        okText="Yes"
        onConfirm={onClick}
        disabled={disabled}
        cancelText="No"
        key={index}
      >
        <ActionBtn disabled={disabled} />
      </Popconfirm>
    ) : (
      <ActionBtn onClick={onClick} disabled={disabled} />
    )

    return shouldRender ? actionComp : null
  }

  // Render related item logic
  const renderTableItem = (columnlist: TableItem[]) => {
    let row: TableItem | undefined

    // check if there is an action field in config
    columnlist.forEach((item: TableItem) => {
      row = item
      !row.title && (row.title = row.label)
      !row.dataIndex && (row.dataIndex = row.name)
      if (row.render) return
      if (!item.type) {
        row.render = (text: any) => {
          return isEmpty(String(text)) || !text ? '-' : text
        }
      }
      if (item.type === 'Link') {
        row.render = (text: any, record: any) => {
          if (!text && text !== 0) return '-'
          return (
            <Link
              disabled={(item.disabled as DisabledFunc)?.(record)}
              onClick={() => {
                item.handle && messageCenter.sendMsg(item.handle, record)
              }}
            >
              {item.linkRender ? item.linkRender(text, record) : text}
            </Link>
          )
        }
      }
      if (item.type === 'Tooltip') {
        row.render = (text: any, record: Record<string, unknown>) => {
          if (!text || text === '-') return '-'
          return (
            <Tooltip
              title={item.tooltipKey ? record[item.tooltipKey] : text}
              trigger="click"
            >
              <Link>{text}</Link>
            </Tooltip>
          )
        }
      }
      if (item.type === 'Links') {
        row.render = (text: string | number, record: any) => {
          if (!text || text === '-') return '-'
          const obj = isJsonString(text as string) && JSON.parse(text as string)
          return (
            <Link
              type={obj.status || ''}
              onClick={() => {
                item.handle && messageCenter.sendMsg(item.handle, record)
              }}
            >
              {obj.content || text}
            </Link>
          )
        }
      }
      if (item.type === 'Download') {
        row.render = (text: any) => {
          return (
            <Button
              size="small"
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => {
                item.handle && messageCenter.sendMsg(item.handle, text)
              }}
            >
              Download
            </Button>
          )
        }
      }
      if (item.type === 'Json') {
        row.render = (text: string) => {
          if (!text) return '-'
          return <JSONViewer data={text} />
        }
      }
      if (item.type === 'Copy') {
        row.render = (text: string) => {
          return (
            <Space>
              <Text style={{ width: 150 }} ellipsis>
                {JSON.stringify(text)}
              </Text>
              <Button
                size="small"
                icon={<CopyOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(text))
                  message.success('Copy Success')
                }}
              >
                Copy
              </Button>
            </Space>
          )
        }
      }
      if (item.type === 'Expand') {
        row.render = (text: string) => {
          return <JSONViewer withToggle data={text} />
        }
      }
      if (item.type === 'Datetime') {
        row.render = (text: string | number) => {
          if (text === 0) return '-'
          return (
            <div style={{ whiteSpace: 'nowrap' }}>
              {timestampToDate(text, item.format)}
            </div>
          )
        }
      }
      if (item.type === 'Action') {
        row.render = (_: string, record: any) => {
          return (
            <Space size="middle">
              {row?.config?.map((config: ConfigItem, index: number) => {
                return renderActionItem(config, index, record)
              })}
            </Space>
          )
        }
      }

      if (item.type === 'wrapText') {
        row.render = (text: string) => {
          return (
            <div
              style={{
                wordWrap: 'break-word',
                wordBreak: 'break-all',
                whiteSpace: 'pre',
              }}
            >
              {text}
            </div>
          )
        }
      }
      if (item.type === 'Input') {
        row.render = (text: any, rows: any) => {
          if (!text) return null

          if (item?.indicatorSwitch?.includes(rows?.value?.name)) {
            return (
              <Switch
                defaultChecked={text.value}
                disabled={item.disabled as boolean}
                onChange={e =>
                  handleInputOnchange &&
                  handleInputOnchange(e, { ...text, key: item.name })
                }
              />
            )
          }
          return (
            <Input
              disabled={item.disabled as boolean}
              name={item.name}
              defaultValue={text.value}
              onChange={e =>
                handleInputOnchange &&
                handleInputOnchange(e, { ...text, key: item.name })
              }
            />
          )
        }
      }
      if (item.type === 'Select') {
        row.render = (text: any) => {
          return (
            <Select
              style={{ width: 120 }}
              disabled={text?.disabled}
              onChange={text?.onChange}
            >
              {text?.options.map((option: any) => {
                return <Option value={option}>{option}</Option>
              })}
            </Select>
          )
        }
      }
      if (item.type === 'Checkbox') {
        row.render = (text: any, rows: any) => {
          return (
            <div>
              {!rows?.disabled ? (
                <Checkbox
                  onChange={e => {
                    item.handle &&
                      messageCenter.sendMsg(item.handle, {
                        key: item.name,
                        checked: e.target.checked,
                      })
                  }}
                  defaultChecked={text}
                  disabled={rows?.disabled}
                >
                  {}
                </Checkbox>
              ) : (
                <Checkbox checked={text} disabled={rows?.disabled}>
                  {}
                </Checkbox>
              )}
            </div>
          )
        }
      }
      if (item.type === 'InputDisabledWithData') {
        row.render = (text: any, rows: any) => {
          return (
            <div>
              {!rows?.disabled ? (
                <Input
                  name={item.name}
                  placeholder={text}
                  onChange={e => {
                    item.handle &&
                      messageCenter.sendMsg(item.handle, {
                        key: item.name,
                        value: e.target.value,
                      })
                  }}
                />
              ) : (
                <Input value={text} disabled={rows?.disabled} />
              )}
            </div>
          )
        }
      }
    })
  }

  // Render related item logic
  renderTableItem(schema)

  return (
    <div style={{ overflow: 'auto' }}>
      <_Table
        bordered
        locale={{ emptyText: 'No data' }}
        columns={schema}
        dataSource={data}
        pagination={pagination && { showSizeChanger: true, ...pagination }}
        onChange={onPageChange}
        loading={loading}
        footer={() =>
          footer ??
          `Show ${data?.length ?? 0} of ${
            pagination?.total ?? data?.length
          } records`
        }
        {...rest}
      />
    </div>
  )
}

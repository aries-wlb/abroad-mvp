import { useState } from 'react'
import { Button, Space, Typography } from 'antd'
import { MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons'
import { isArrayLikeObject, isPlainObject } from 'lodash'
import { isParsable } from '@/shared'

interface JSONViewerProps {
  data: any
  width?: any
  inline?: boolean
  depth?: number
  style?: any
}

interface JSONViewerWrapperProps {
  data?: any
  withToggle?: boolean
}

const indentSpace = 12

function JSONViewer({
  data = {},
  inline,
  width = 'default',
  depth = 1,
  style,
}: JSONViewerProps) {
  const initialState: any = {}
  const canBeParsed = isPlainObject(data) || isArrayLikeObject(data)

  if (canBeParsed) {
    Object.keys(data)?.forEach((item: string) => {
      initialState[item] = false
    })
  }

  const [show, setShow] = useState(initialState)

  if (inline) {
    return (
      <div>
        <Typography.Paragraph
          style={{ width, whiteSpace: 'pre-wrap' }}
          ellipsis={{
            rows: 1,
            expandable: true,
            symbol: <PlusSquareOutlined />,
          }}
        >
          {JSON.stringify(data)}
        </Typography.Paragraph>
      </div>
    )
  }

  const renderValue = (value: any, key: string) => {
    if (typeof value === 'object') {
      return (
        <Typography.Paragraph
          style={{ display: 'inline' }}
          ellipsis={{
            rows: 1,
            expandable: true,
            symbol: <PlusSquareOutlined />,
            onExpand: () => setShow((prev: any) => ({ ...prev, [key]: true })),
          }}
        >
          <JSONViewer data={value} depth={depth + 1} />
        </Typography.Paragraph>
      )
    }

    return JSON.stringify(value)
  }

  if (!canBeParsed) {
    return (
      <div className="jsonview" style={{ display: 'inline', ...style }}>
        {JSON.stringify(data)}
      </div>
    )
  }

  return (
    <div className="jsonview" style={{ display: 'inline', ...style }}>
      {Array.isArray(data) ? '[' : '{'}
      {Object.keys(data).map((key: string, index: number) => {
        return (
          <div style={{ marginLeft: depth * indentSpace }} key={index}>
            "{key}":
            {show?.[key] ? (
              <>
                <JSONViewer data={data[key]} depth={depth + 1} />
                <Typography.Link>
                  {' '}
                  <MinusSquareOutlined
                    onClick={() =>
                      setShow((prev: any) => ({ ...prev, [key]: false }))
                    }
                  />
                </Typography.Link>
              </>
            ) : (
              renderValue(data[key], key)
            )}
          </div>
        )
      })}
      {Array.isArray(data) ? ']' : '}'}
    </div>
  )
}

function renderJSONData(data: any) {
  if (typeof data === 'string' && isParsable(data)) return JSON.parse(data)

  return data
}

function JSONViewerWrapper({
  data = {},
  withToggle = false,
  ...args
}: JSONViewerWrapperProps) {
  const [show, setShow] = useState(false)
  const JSONData = renderJSONData(data)

  const handleToggle = () => setShow(prev => !prev)

  if (withToggle) {
    return (
      <Space direction={show ? 'vertical' : 'horizontal'}>
        {show ? (
          <JSONViewer data={JSONData} {...args} />
        ) : (
          <Typography.Text style={{ width: 200 }} ellipsis>
            {JSON.stringify(data)}
          </Typography.Text>
        )}
        <Button size="small" type="link" onClick={handleToggle}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </Space>
    )
  }

  return <JSONViewer data={JSONData} {...args} />
}

export default JSONViewerWrapper

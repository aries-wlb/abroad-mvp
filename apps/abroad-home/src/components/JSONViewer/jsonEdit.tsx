import { useEffect, useRef, useState } from 'react'
import JSONEditor from 'jsoneditor'
import 'jsoneditor/dist/jsoneditor.min.css'
import { Button } from 'antd'
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons'

const sizeType = {
  smail: {
    type: 'smail',
    width: '800px',
    heigth: '200px',
  },
  middle: {
    type: 'middle',
    width: '800px',
    heigth: '400px',
  },
  large: {
    type: 'large',
    width: '800px',
    heigth: '800px',
  },
}

function ShowJSONEditor(props: Iprops) {
  const {
    initJSON,
    isDetailPage,
    domId,
    mode,
    canChangeSize,
    getJsonInfo,
    onError,
  } = props
  const JsonRef = useRef<any>(null)
  // 缩放时确保数据一致
  const [curJSON, setCurJSON] = useState(initJSON)
  const [size, setSize] = useState({
    default: 'smail',
    current: sizeType.smail,
  })
  const [showChangeSize, setShowChangeSize] = useState(true)
  const [sizeButton, setSizeButton] = useState(true)
  let editor: JSONEditor

  const handleOnChange = () => {
    try {
      const value = editor?.get()
      getJsonInfo(value)
      setCurJSON(value)
    } catch (error) {
      const text = editor?.getText()
      getJsonInfo(text)
    }
  }
  const handleError = (errArr: ErrorArrType[]) => {
    setShowChangeSize(!(errArr.length > 0))
    onError(errArr)
  }

  const options: any = {
    mode: mode || 'code',
    history: true,
    onChange: handleOnChange,
    onValidationError: handleError,
    mainMenuBar: false,
    language: 'en',
    theme: 'ace/theme/textmate',
    onEditable: isDetailPage
      ? (node: any) => {
          if (!node.path) return false

          return node
        }
      : null,
  }

  const changeLabelSize = () => {
    if (size.default === 'large') return

    setSizeButton(prev => !prev)
    if (size.default === 'middle') {
      if (size.current.type === 'middle') {
        setSize(prev => {
          return { ...prev, current: sizeType.large }
        })
      } else {
        setSize(prev => {
          return { ...prev, current: sizeType.middle }
        })
      }
    }
    if (size.default === 'smail') {
      if (size.current.type === 'smail') {
        setSize(prev => {
          return { ...prev, current: sizeType.middle }
        })
      } else {
        setSize(prev => {
          return { ...prev, current: sizeType.smail }
        })
      }
    }
  }

  const initEditor = () => {
    editor = new JSONEditor(JsonRef.current, options)
    editor.set(curJSON || initJSON)
    const dom: any = document
      .getElementById(domId as string)
      ?.getElementsByClassName('ace_content')[0]
    if (isDetailPage && dom && dom.style) dom.style.cursor = 'not-allowed'
  }

  useEffect(() => {
    // 获取大概行数
    const getRowsCount = (initObj: any) => {
      let rows = 0
      const dp = (obj: any) => {
        if (Array.isArray(obj)) {
          obj.forEach(item => {
            dp(item)
          })
        }
        if (obj instanceof Object) {
          Object.keys(obj).forEach(item => {
            dp(obj[item])
          })
        } else {
          rows += 1
        }
      }
      dp(initObj)
      return rows
    }
    const rows = getRowsCount(initJSON)
    if (rows <= 10) setSize({ default: 'smail', current: sizeType.smail })
    else if (rows <= 20)
      setSize({ default: 'middle', current: sizeType.middle })
    else setSize({ default: 'large', current: sizeType.large })
  }, [initJSON])

  useEffect(() => {
    initEditor()
    return () => {
      editor?.destroy()
    }
  }, [size])

  return (
    <div
      id={domId}
      style={{
        position: 'relative',
        height: size.current.heigth,
        width: size.current.width,
      }}
    >
      <div
        ref={JsonRef}
        style={{ height: size.current.heigth, width: size.current.width }}
      />
      {showChangeSize && canChangeSize && (
        <Button
          style={{ position: 'absolute', bottom: 1, right: 1 }}
          icon={
            sizeButton ? <FullscreenOutlined /> : <FullscreenExitOutlined />
          }
          size="small"
          type="text"
          onClick={() => changeLabelSize()}
        />
      )}
    </div>
  )
}

interface ErrorArrType {
  line: number
  message: string
  type: string
}

interface Iprops {
  initJSON: any
  domId?: string
  mode?: string
  canChangeSize?: boolean
  isDetailPage?: boolean
  getJsonInfo: (value: any) => void
  onError: (value: ErrorArrType[]) => void
}
export { ShowJSONEditor }

import { useEffect, useMemo, useState } from 'react'
import type {
  ButtonProps,
  FormListFieldData,
  FormProps,
  UploadProps,
} from 'antd'
import {
  Button,
  Cascader,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  Popover,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  TimePicker,
  Tooltip,
  Typography,
  Upload,
  Form as _Form,
  notification,
} from 'antd'
import {
  CheckOutlined,
  DeleteOutlined,
  DeliveredProcedureOutlined,
  DownCircleTwoTone,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  PaperClipOutlined,
  PlusOutlined,
  RightOutlined,
  RollbackOutlined,
  SaveOutlined,
  UpCircleTwoTone,
} from '@ant-design/icons'
import { debounce } from 'lodash'
import { useMemoizedFn } from 'ahooks'
import JSONViewer from '../JSONViewer'
import { ShowJSONEditor } from '../JSONViewer/jsonEdit'
import {
  getCurrentFullKey,
  jsonAuditValueParser,
  messageCenter,
} from '@/shared'
import './style.less'
import type { AntUploadReq } from '@/shared/types'
import { uploadFile } from '@/services/api'
import { handleDownloadRequest } from '@/shared/handleDownloadRequest'

const { Text, Link } = Typography

const { Option } = Select
const { TextArea } = Input
const { Item: _Item } = _Form

function createItem(props: any): React.FC<any> {
  const Item: React.FC<any> = _props => {
    const { children, ...rest } = _props
    return (
      <_Item {...props} {...rest}>
        {children}
      </_Item>
    )
  }
  return Item
}

// const offsetTimer: any = null;

// caption attributes definition
interface Captions {
  cancel?: string
  reject?: string
  add?: string
  submit?: string
  save?: string
  approval?: string
  export?: string
  edit?: string
}

type CaptionedCustomButtonProps = {
  [k in keyof Captions]: ButtonProps
}

interface SelectProps {
  forward: boolean
  reverse: boolean
}
const titleFontSize = {
  1: 18,
  2: 16,
}

// form attributes definition
export type FormProp = {
  schema: FormItem[]
  data?: Record<string, any>
  disabled?: boolean
  captions?: Captions
  getFormRef?: null | ((data: any) => void)
  onSubmit?: null | ((data: any) => void)
  onSave?: null | ((data: any) => void)
  onSwitch?: null | ((value: boolean, data: any) => void)
  onEdit?: null | (() => void)
  onPastes?: null | (() => void)
  onApproval?: null | ((data: any) => void)
  onReject?: null | ((data: any) => void)
  onExport?: null | ((data: any) => void)
  onCancel?: null | (() => void)
  onAdd?: null | ((data: any) => void)
  onAddTemplate?: null | ((data: any) => void)
  onChange?: null | ((data: any) => void)
  onSaveDraft?: null | ((data: any) => void)
  customFormButtonProps?: CaptionedCustomButtonProps
  extraBtnRender?: null | (() => React.ReactNode)
} & FormProps

export interface FormItem {
  // Input,InputNumber,TextArea,DatePicker,Switch,Checkbox,Radio,Select,MultipleSelect,Cascader,Divider
  type: string
  label?: string
  name: string | [number, string] | [string, string]
  titelLevel?: 1 | 2
  required?: boolean
  hidden?: boolean
  disabled?: boolean
  initialValue?: any
  tips?: string
  placeholder?: string
  rules?: { [key: string]: any }[]
  format?: string
  configs?: object
  dependencies?: string[]
  // Checkbox,Radio,Select,MultipleSelect
  options?: FormOption[]
  suffix?: string
  dependent?: {
    name: string
    // Different values are seperated by "|", value1|value2|value3
    value: string
  }
  // for Button
  handle?: string
  handle1?: string
  handleSortUp?: string
  handleSortDown?: string
  btnType?:
    | 'link'
    | 'text'
    | 'ghost'
    | 'default'
    | 'primary'
    | 'dashed'
    | undefined
  // for Switch
  checkedChildren?: string
  unCheckedChildren?: string
  // for uploadImg
  fileList?: any
  // for Divider
  canToggle?: boolean
  sortArrow?: boolean
  json_config?: string
  // for UploadLogo
  handleChange?: string
  maxCount?: number
  state?: boolean
  handleRemove?: string
  // for InputFileName
  handleCopy?: string
  needJsonParse?: boolean
  // for custom upload
  handlePreview?: string
  accept?: UploadProps['accept']
  showUploadList?: UploadProps['showUploadList']
  // for datepicker
  allowClear?: boolean
  needSelectAll?: SelectProps
  children?: FormItem[]

  // inputNumber
  precision?: number
  max?: number
  min?: number
  addonBefore?: React.ReactNode
  addonAfter?: React.ReactNode
}

interface FormOption {
  label: string
  value: string | number | boolean
  details?: any
}

interface ToggleListProps {
  [key: string]: {
    status: boolean
    list: string[]
  }
}

const defaultCaptions = {
  cancel: 'Back',
  submit: 'Submit',
  reject: 'Reject',
  add: 'Add field',
  save: 'Save to draft',
  approval: 'Approval',
  paste: 'Paste',
  export: 'Export',
}

function normFile(e: any) {
  if (Array.isArray(e)) return e

  return e?.fileList
}

// form component implementation
export const Form: React.FC<FormProp> = ({
  schema,
  data,
  disabled,
  captions = {},
  getFormRef,
  onSubmit,
  onSaveDraft,
  onSave,
  onPastes,
  onApproval,
  onReject,
  onExport,
  onAdd,
  onAddTemplate,
  onChange,
  onCancel,
  onSwitch,
  onEdit,
  customFormButtonProps,
  extraBtnRender,
  ...rest
}) => {
  const [form] = _Form.useForm()
  const { getFieldValue, getFieldsValue, setFieldsValue, validateFields } = form
  const buttonCaptions = { ...defaultCaptions, ...captions }
  const [toggleList, setToggleList] = useState<ToggleListProps>({})
  const [dependenList, setDependenList] = useState<any>({})
  // auto increment ID for dependent logic
  const [increaseID, setIncreaseID] = useState<number>(0)

  // handle on form value change
  const onFormChange = (
    itemName: string | [number, string] | [string, string]
  ) => {
    onChange && onChange(getFieldsValue())
    const formatName = typeof itemName === 'string' ? itemName : itemName[1]
    if (dependenList[formatName]) setIncreaseID(increaseID + 1)
  }

  // click Divider toggle
  const toggleView = (name: string, status?: boolean) => {
    const toggle = toggleList[name] || { status: false, list: []}
    toggle.status = status || toggle.status

    schema.forEach(item => {
      if (toggle.list.includes(item.name as string))
        item.hidden = !toggle.status
    })
    setToggleList({ ...toggleList })
  }

  // FE Report error location
  const notifyRender = (err: any) => {
    err.errorFields.forEach((item: any) => {
      const target = document.getElementById(`${item.name[0]}`)
      target?.scrollIntoView()
      notification.error({
        message: item.errors[0],
        description: 'Click me to teleport to the wrong location',
        onClick: () => {
          target?.scrollIntoView()
        },
      })
    })
  }

  const FormatTips = (str: string | undefined) => {
    try {
      if (str && typeof str === 'string' && str?.includes('\n')) {
        const formatTips = (
          <>
            {str.split('\n').map(item => (
              <span>
                {item} <br />
              </span>
            ))}
          </>
        )
        return formatTips
      }
    } catch (error) {
      console.warn('FormatError', error, str)
    }
    return str
  }
  const checkFormError = () => {
    Object.keys(toggleList).forEach(item => {
      if(toggleList[item]) {
        toggleList[item].status = true
      }
    })
    setToggleList({ ...toggleList })
  }

  useEffect(() => {
    getFormRef && getFormRef(form)
  }, [getFormRef])

  useEffect(() => {
    // if data is not empty, set form fields
    if (data) setFieldsValue(data)
  }, [data])

  const handleUploadRequest = useMemoizedFn(
    async ({ request }: { request: AntUploadReq }) => {
      const res = await uploadFile(request.file)
      request.onSuccess({
        file_id: res.data.file_id,
        url: res.data.file_url,
        name: res.data.file_name,
        status: 'done',
      })
    }
  )

  useEffect(() => {
    let curToggleName = ''
    const defaultToggleList: ToggleListProps = {}
    const defaultDependenList: any = {}
    schema.forEach((item: FormItem) => {
      if (item.dependent) defaultDependenList[item.dependent.name] = true

      if (item.type === 'Divider' && item.canToggle) {
        curToggleName = item.name as string
        defaultToggleList[curToggleName] = {
          list: [],
          status: true,
        }
      } else {
        defaultToggleList[curToggleName]?.list.push(item.name as string)
      }
    })
    setDependenList(defaultDependenList)
    setToggleList(defaultToggleList)
  }, [schema])

  // Render related item logic
  const renderFormItem = (
    item: FormItem & { style?: any },
    listField: FormListFieldData = {} as FormListFieldData
  ) => {
    let shouldRender = false
    // Determine if display contain dependency
    if (item.dependent) {
      // change to string
      const values = String(item.dependent.value).split('|')
      const target = String(getFieldValue(item.dependent.name))
      for (const value of values) {
        if (value === target) {
          shouldRender = true
          break
        }
      }
    } else {
      shouldRender = true
    }
    // No need to render, directly return
    if (!shouldRender) return null

    const { rules = [] } = item

    const Item = createItem(item)
    // Determine return element based on type

    if (item.type === 'Input') {
      return (
        <Item
          {...listField}
          name={item.name}
          hidden={item.hidden}
          label={item.label}
          initialValue={item.initialValue}
          rules={[
            { required: item.required, message: `'${item.label}' is required` },
            ...rules,
          ]}
          tooltip={FormatTips(item.tips)}
          dependencies={item.dependencies}
        >
          <Input
            allowClear
            placeholder={item.placeholder}
            disabled={disabled || item.disabled}
            suffix={item.suffix}
            onBlur={
              e => {
                const fieldKey =
                  typeof item.name === 'string' ? item.name : item.name[0]
                const allFields = getFieldsValue()
                if (typeof item.name === 'string')
                  allFields[fieldKey] = e.target.value?.trim()
                else if (listField?.key !== undefined && allFields[fieldKey])
                  allFields[fieldKey][listField.key] = e.target.value?.trim()

                setFieldsValue({ ...allFields })
              }
              // trim
            }
          />
        </Item>
      )
    }
    if (item.type === 'InputWithCopyButton') {
      return (
        <Item
          name={item.name}
          hidden={item.hidden}
          label={item.label}
          initialValue={item.initialValue}
          rules={[
            { required: item.required, message: `'${item.name}' is required` },
            ...rules,
          ]}
          tooltip={FormatTips(item.tips)}
        >
          <div style={{ display: 'flex' }}>
            <Input
              allowClear
              placeholder={item.placeholder}
              disabled={disabled || item.disabled}
            />
            <Button
              type="primary"
              onClick={() =>
                item.handleCopy &&
                messageCenter.sendMsg(
                  item.handleCopy,
                  getFieldsValue().filename
                )
              }
            >
              Copy
            </Button>
          </div>
        </Item>
      )
    }
    if (item.type === 'InputNumber') {
      return (
        <Item
          name={item.name}
          hidden={item.hidden}
          label={item.label}
          initialValue={item.initialValue}
          rules={[
            { required: item.required, message: `'${item.label}' is required` },
            ...rules,
          ]}
          tooltip={FormatTips(item.tips)}
          dependencies={item.dependencies}
        >
          <InputNumber
            placeholder={item.placeholder}
            maxLength={20}
            precision={item.precision}
            max={item.max}
            min={item.min}
            addonAfter={item.addonAfter}
            addonBefore={item.addonBefore}
            disabled={disabled || item.disabled}
            type="number"
            onWheel={() => {
              ;(document?.activeElement as HTMLElement)?.blur()
            }}
            style={{ width: '100%' }}
          />
        </Item>
      )
    }
    if (item.type === 'InputNumberWithSuffix') {
      return (
        <Item label={item.label} style={{ marginBottom: '-5px' }}>
          <Item
            name={item.name}
            hidden={item.hidden}
            initialValue={item.initialValue}
            rules={[
              {
                required: item.required,
                message: `'${item.label}' is required`,
              },
              ...rules,
            ]}
            tooltip={FormatTips(item.tips)}
          >
            <InputNumber
              placeholder={item.placeholder}
              maxLength={20}
              disabled={disabled || item.disabled}
              type="number"
              onWheel={() => {
                ;(document?.activeElement as HTMLElement)?.blur()
              }}
            />
          </Item>
          <span style={{ position: 'absolute', right: '10px', top: '5px' }}>
            {item.suffix}
          </span>
        </Item>
      )
    }
    if (item.type === 'TextArea') {
      const curValue = getFieldValue(item.name)
      const isDetailPage = window.location.pathname.includes('detail')
      const getJsonInfo = (value: object | string) => {
        const fieldKey =
          typeof item.name === 'string' ? item.name : item.name[0]
        const allFields = getFieldsValue()
        if (typeof item.name === 'string') allFields[fieldKey] = value
        else if (listField?.key !== undefined)
          allFields[fieldKey][listField.key] = value

        setFieldsValue({
          ...allFields,
        })
      }

      if (item?.needJsonParse) {
        return (
          <Item
            name={item.name}
            label={item.label}
            hidden={item.hidden}
            initialValue={item.initialValue}
            rules={[
              {
                required: item.required,
                message: `'${item.label}' is required`,
              },
              ...rules,
            ]}
            tooltip={FormatTips(item.tips)}
          >
            <ShowJSONEditor
              initJSON={jsonAuditValueParser(curValue)}
              onError={() => {}}
              getJsonInfo={getJsonInfo}
              isDetailPage={isDetailPage}
              domId={item.name.toString()}
              mode="code"
              canChangeSize
            />
          </Item>
        )
      }

      return (
        <div style={{ position: 'relative' }}>
          <Item
            {...item}
            name={item.name}
            label={item.label}
            hidden={item.hidden}
            initialValue={item.initialValue}
            rules={[
              {
                required: item.required,
                message: `'${item.label}' is required`,
              },
              ...rules,
            ]}
            tooltip={FormatTips(item.tips)}
          >
            <TextArea
              allowClear
              placeholder={item.placeholder}
              rows={4}
              disabled={disabled || item.disabled}
            />
          </Item>
        </div>
      )
    }
    if (item.type === 'Switch') {
      return (
        <Item
          name={item.name}
          hidden={item.hidden}
          label={item.label}
          initialValue={item.initialValue || false}
          rules={[
            { required: item.required, message: `'${item.label}' is required` },
            ...rules,
          ]}
          tooltip={FormatTips(item.tips)}
          valuePropName="checked"
        >
          <Switch
            defaultChecked={item.initialValue || false}
            checkedChildren={
              item.checkedChildren ? item.checkedChildren : 'Enable'
            }
            unCheckedChildren={
              item.unCheckedChildren ? item.unCheckedChildren : 'Disable'
            }
            onChange={() => {
              onFormChange(item.name)
            }}
            disabled={disabled || item.disabled}
          />
        </Item>
      )
    }
    if (item.type === 'Checkbox') {
      return (
        <Item
          name={item.name}
          hidden={item.hidden}
          label={item.label}
          initialValue={item.initialValue}
          rules={[
            { required: item.required, message: `'${item.label}' is required` },
            ...rules,
          ]}
          tooltip={FormatTips(item.tips)}
          dependencies={item.dependencies}
        >
          <Checkbox.Group
            onChange={value => {
              onFormChange(item.name)
              item.handle && messageCenter.sendMsg(item.handle, value)
            }}
            disabled={disabled || item.disabled}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {item.options?.map((option: FormOption, index: number | string) => {
              return (
                <div key={index}>
                  <Checkbox value={option.value}>{option.label}</Checkbox>
                </div>
              )
            })}
          </Checkbox.Group>
        </Item>
      )
    }
    if (item.type === 'Radio') {
      return (
        <Item
          name={item.name}
          hidden={item.hidden}
          label={item.label}
          initialValue={item.initialValue}
          rules={[
            { required: item.required, message: `'${item.label}' is required` },
            ...rules,
          ]}
          tooltip={FormatTips(item.tips)}
          dependencies={item.dependencies}
        >
          <Radio.Group
            onChange={() => {
              onFormChange(item.name)
              item.handleChange &&
                messageCenter.sendMsg(item.handleChange, { form })
            }}
            disabled={disabled || item.disabled}
          >
            {item.options?.map((option: FormOption, index: number) => {
              return (
                <Radio value={option.value} key={index}>
                  {option.label}
                </Radio>
              )
            })}
          </Radio.Group>
        </Item>
      )
    }
    if (item.type === 'Select') {
      return (
        <Item
          name={item.name}
          hidden={item.hidden}
          label={item.label}
          initialValue={item.initialValue}
          rules={[
            { required: item.required, message: `'${item.label}' is required` },
            ...rules,
          ]}
          tooltip={FormatTips(item.tips)}
        >
          <Select
            allowClear
            showSearch
            onChange={value => {
              onFormChange(item.name)
              item.handleChange &&
                messageCenter.sendMsg(item.handleChange, { info: value, form })
            }}
            disabled={disabled || item.disabled}
            filterOption={(input: string, option: any) =>
              (option?.children.props.children.props.children ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            placeholder={item.placeholder}
          >
            {item.options?.map((option: FormOption, index: number) => {
              return (
                <Option value={option.value as string | number} key={index}>
                  <Tooltip
                    placement="right"
                    overlayStyle={{ minWidth: 280 }}
                    title={option.details}
                  >
                    <div>{option.label}</div>
                  </Tooltip>
                </Option>
              )
            })}
          </Select>
        </Item>
      )
    }
    if (item.type === 'MultipleSelect') {
      const allOptions: any = item.options?.map(option => option.value)
      // multip select all check box
      const dropdownRenderFn = (allSelectValue: any) => (
        <>
          {item.needSelectAll ? (
            <div style={{ padding: '4px 8px 8px 8px', cursor: 'pointer' }}>
              <Checkbox
                checked={getFieldValue(item.name).length === allOptions?.length}
                onChange={e => {
                  // forward:正选 reverse:反选
                  if (
                    e.target.checked === true &&
                    item.needSelectAll?.forward
                  ) {
                    setFieldsValue({
                      ...getFieldsValue(),
                      [`${item.name}`]: allOptions,
                    })
                    onFormChange(item.name)
                    item.handle &&
                      messageCenter.sendMsg(item.handle, allOptions)
                  } else if (
                    e.target.checked === false &&
                    item.needSelectAll?.reverse
                  ) {
                    onFormChange(item.name)
                    item.handle && messageCenter.sendMsg(item.handle, [])
                    setFieldsValue({
                      ...getFieldsValue(),
                      [`${item.name}`]: [],
                    })
                  }
                }}
              >
                Select All
              </Checkbox>
            </div>
          ) : null}
          <Divider style={{ margin: '0' }} />
          {allSelectValue}
        </>
      )
      return (
        <Item
          name={item.name}
          hidden={item.hidden}
          label={item.label}
          initialValue={item.initialValue || []}
          rules={[
            { required: item.required, message: `'${item.label}' is required` },
            ...rules,
          ]}
          tooltip={FormatTips(item.tips)}
        >
          <Select
            mode="multiple"
            onChange={selectValue => {
              onFormChange(item.name)
              item.handle && messageCenter.sendMsg(item.handle, selectValue)
            }}
            disabled={disabled || item.disabled}
            filterOption={(input: string, option: any) =>
              (option?.children ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            dropdownRender={dropdownRenderFn}
          >
            {item.options?.map((option: FormOption, index: number) => {
              return (
                <Option value={option.value as string | number} key={index}>
                  {option.label}
                </Option>
              )
            })}
          </Select>
        </Item>
      )
    }
    if (item.type === 'Cascader') {
      return (
        <Item
          name={item.name}
          hidden={item.hidden}
          label={item.label}
          initialValue={item.initialValue}
          rules={[
            { required: item.required, message: `'${item.label}' is required` },
            ...rules,
          ]}
          tooltip={FormatTips(item.tips)}
        >
          <Cascader
            options={item.options as any}
            onChange={() => {
              onFormChange(item.name)
            }}
            disabled={disabled || item.disabled}
          />
        </Item>
      )
    }
    if (item.type === 'Divider') {
      return (
        <Divider orientation={item.initialValue || 'left'}>
          {item.sortArrow && (
            <>
              <UpCircleTwoTone
                onClick={() => {
                  const index = Number.parseInt(
                    (item.name as string).split('_')[1],
                    10
                  )
                  const formValue = {
                    ...getFieldsValue(),
                    [`fieldInputType_${index}`]: getFieldValue(
                      `fieldInputType_${index}`
                    ),
                    [`fieldInputType_${index - 1}`]: getFieldValue(
                      `fieldInputType_${index - 1}`
                    ),
                  }
                  item.handleSortUp &&
                    messageCenter.sendMsg(item.handleSortUp, {
                      index,
                      formValue,
                    })
                }}
              />
              <DownCircleTwoTone
                style={{ margin: 10 }}
                onClick={() => {
                  const index = Number.parseInt(
                    (item.name as string).split('_')[1],
                    10
                  )
                  // dependent的被隐藏了 getFieldsValue 无法获取
                  const formValue = {
                    ...getFieldsValue(),
                    [`fieldInputType_${index}`]: getFieldValue(
                      `fieldInputType_${index}`
                    ),
                    [`fieldInputType_${index + 1}`]: getFieldValue(
                      `fieldInputType_${index + 1}`
                    ),
                  }
                  item.handleSortDown &&
                    messageCenter.sendMsg(item.handleSortDown, {
                      index,
                      formValue,
                    })
                }}
              />
            </>
          )}
          {item.canToggle &&
            (toggleList[item.name as string]?.status ? (
              <DownOutlined
                onClick={() => toggleView(item.name as string)}
                style={{ marginRight: 20 }}
              />
            ) : (
              <RightOutlined
                onClick={() => toggleView(item.name as string)}
                style={{ marginRight: 20 }}
              />
            ))}
          <span style={{ fontSize: titleFontSize[item.titelLevel || 1] }}>
            {' '}
            {item.label}
          </span>
          {item.json_config && (
            <Popover
              trigger="click"
              content={<JSONViewer data={JSON.parse(item.json_config)} />}
            >
              <Button type="primary" size="small" style={{ marginLeft: 20 }}>
                json config
              </Button>
            </Popover>
          )}
        </Divider>
      )
    }
    if (item.type === 'Button') {
      return (
        <Item
          name={item.name}
          hidden={item.hidden}
          tooltip={FormatTips(item.tips)}
          colon={false}
          label={' '}
        >
          <Button
            block
            type={item.btnType}
            disabled={disabled || item.disabled}
            icon={<ExclamationCircleOutlined />}
            onClick={() => {
              // Send registration event through message center
              item.handle && messageCenter.sendMsg(item.handle, item)
            }}
          >
            {item.label}
          </Button>
        </Item>
      )
    }
    if (item.type === 'Text') {
      return (
        <Item
          name={item.name}
          hidden={item.hidden}
          label={item.label}
          tooltip={FormatTips(item.tips)}
          initialValue={item.initialValue}
        >
          <Text>{item.initialValue}</Text>
        </Item>
      )
    }
    if (item.type === 'Link') {
      return (
        <Item
          name={item.name}
          hidden={item.hidden}
          label={item.label}
          tooltip={FormatTips(item.tips)}
          initialValue={item.initialValue}
        >
          <Link
            onClick={() => {
              item.handle && messageCenter.sendMsg(item.handle, item)
            }}
          >
            {item.initialValue}
          </Link>
        </Item>
      )
    }
    if (item.type === 'DatePicker') {
      return (
        <Item
          name={`${item.name}`}
          hidden={item.hidden}
          label={item.label}
          initialValue={item.initialValue}
          rules={[
            { required: item.required, message: `'${item.label}' is required` },
            ...rules,
          ]}
          tooltip={FormatTips(item.tips)}
        >
          <DatePicker
            allowClear={item.allowClear}
            disabled={disabled || item.disabled}
            format={item.format}
            style={{ width: '100%' }}
          />
        </Item>
      )
    }
    if (item.type === 'TimePicker') {
      return (
        <Item
          name={item.name}
          hidden={item.hidden}
          label={item.label}
          initialValue={item.initialValue}
          rules={[
            { required: item.required, message: `'${item.label}' is required` },
            ...rules,
          ]}
          tooltip={FormatTips(item.tips)}
        >
          <TimePicker
            allowClear
            format="HH:mm"
            disabled={disabled || item.disabled}
          />
        </Item>
      )
    }
    if (item.type === 'DateTimePicker') {
      return (
        <Item
          name={item.name}
          hidden={item.hidden}
          label={item.label}
          initialValue={item.initialValue}
          rules={[
            { required: item.required, message: `'${item.label}' is required` },
            ...rules,
          ]}
          tooltip={FormatTips(item.tips)}
        >
          <DatePicker
            allowClear
            disabled={disabled || item.disabled}
            showTime
            format={item.format}
          />
        </Item>
      )
    }
    if (item.type === 'RangePicker') {
      return (
        <Item
          name={item.name}
          hidden={item.hidden}
          label={item.label}
          initialValue={item.initialValue}
          rules={[
            { required: item.required, message: `'${item.label}' is required` },
            ...rules,
          ]}
          tooltip={item.tips}
        >
          <DatePicker.RangePicker
            allowClear
            disabled={disabled || item.disabled}
            showTime
            {...item.configs}
          />
        </Item>
      )
    }
    if (item.type === 'Upload') {
      return (
        <Item
          name={item.name}
          label={item.label}
          valuePropName="fileList"
          initialValue={item.initialValue}
          rules={[{ required: item.required }, ...rules]}
          getValueFromEvent={normFile}
        >
          <Upload
            customRequest={req => {
              if (item.handle) {
                messageCenter.sendMsg(item.handle, {
                  item,
                  request: { ...req },
                })
              } else {
                handleUploadRequest({
                  request: { ...req } as unknown as AntUploadReq,
                })
              }
            }}
            beforeUpload={() => {
              if (item.maxCount && item.maxCount > 1) {
                try {
                  const file = getFieldValue(item.name) || []
                  if (file.length >= item.maxCount) return false
                } catch (e) {
                  throw new Error('error type')
                }
              }
              return true
            }}
            onChange={param => {
              setFieldsValue({
                ...getFieldsValue(),
                [item.name as string]: param.fileList.map(file => {
                  if (file.response) return { ...file, ...file.response }

                  return file
                }),
              })
            }}
            showUploadList={{ showDownloadIcon: true }}
            onDownload={file => {
              if (item.handle) {
                messageCenter.sendMsg(item.handle, {
                  item,
                  request: { ...file },
                })
              } else if (file.url) {
                handleDownloadRequest(file.url, file.name)
              }
            }}
            itemRender={(_, file, _f, actions) => {
              return (
                <div className="form-ant-file-container">
                  <PaperClipOutlined />
                  <Link
                    onClick={() => actions.download()}
                    className="file-name"
                  >
                    {file.name}
                  </Link>
                  <DeleteOutlined
                    onClick={() => actions.remove()}
                    className="file-delete"
                  />
                </div>
              )
            }}
            maxCount={item.maxCount}
          >
            <Button
              type="dashed"
              block
              icon={<PlusOutlined />}
              disabled={item.disabled}
              style={{ width: '100%' }}
            >
              Upload
            </Button>
          </Upload>
        </Item>
      )
    }
    if (item.type === 'MultiForm') {
      return (
        <Item label={item.label} className="form-inline-item">
          {item.children?.map((child: FormItem) =>
            renderFormItem({
              ...child,
              name: [item.name as string, child.name as string],
              style: { marginBottom: 0, width: '48%' },
            })
          )}
        </Item>
      )
    }
    if (item.type === 'FormList') {
      return (
        <_Form.List name={item.name}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Item
                  key={field.key}
                  label={index === 0 ? item.label : ' '}
                  colon={index === 0}
                  className="form-inline-item"
                  tooltip={index === 0 ? FormatTips(item.tips) : ''}
                >
                  {item.children?.map((child: FormItem) => (
                    <>
                      {renderFormItem(
                        {
                          ...child,
                          name: [field.name, child.name as string],
                          style: { marginBottom: 0, width: '43%' },
                        },
                        { ...field }
                      )}
                    </>
                  ))}
                  <MinusCircleOutlined
                    onClick={() => remove(field.name)}
                    style={{ marginLeft: 8 }}
                  />
                </Item>
              ))}
              <Item
                label={fields.length ? ' ' : item.label}
                colon={!fields.length}
              >
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add
                </Button>
              </Item>
            </>
          )}
        </_Form.List>
      )
    }
    return null
  }

  const renderFormItemMemo = useMemo(() => {
    return (
      <Row>
        {schema.map((item: FormItem, index: number) => {
          return (
            <Col span={24} key={index}>
              {renderFormItem(item)}
            </Col>
          )
        })}
      </Row>
    )
  }, [schema, increaseID, dependenList, toggleList, disabled])

  return (
    <div className="form-container">
      <_Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        {...rest}
      >
        {renderFormItemMemo}
      </_Form>
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Space align="center">
            {extraBtnRender?.()}

            {onSwitch && (
              <Switch
                checkedChildren="Advanced"
                unCheckedChildren="Simple"
                onChange={(value: boolean) => onSwitch(value, getFieldsValue())}
              />
            )}
            {onCancel ? (
              <Button
                type="default"
                icon={<RollbackOutlined />}
                onClick={onCancel}
                {...customFormButtonProps?.cancel}
              >
                {buttonCaptions.cancel}
              </Button>
            ) : (
              ''
            )}
            {onEdit && (
              <Button type="default" icon={<EditOutlined />} onClick={onEdit}>
                {buttonCaptions.edit}
              </Button>
            )}
            {onSave ? (
              <Button
                icon={<SaveOutlined />}
                onClick={() => {
                  validateFields()
                    .then(() => {
                      onSave(getFieldsValue())
                    })
                    .catch(err => {
                      notifyRender(err)
                    })
                }}
                {...customFormButtonProps?.save}
              >
                {buttonCaptions.save}
              </Button>
            ) : (
              ''
            )}
            {onSaveDraft ? (
              <Button
                icon={<SaveOutlined />}
                onClick={debounce(() => {
                  onSaveDraft(getFieldsValue())
                }, 1000)}
              >
                Save Draft
              </Button>
            ) : (
              ''
            )}
            {onPastes && (
              <Button
                icon={<SaveOutlined />}
                onClick={() => {
                  onPastes()
                }}
              >
                {buttonCaptions.paste}
              </Button>
            )}
            {onAdd ? (
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  validateFields()
                    .then(() => {
                      // renderBtnPosition(offset + 1);
                      onAdd(getFieldsValue())
                    })
                    .catch(err => {
                      notifyRender(err)
                    })
                }}
                {...customFormButtonProps?.add}
              >
                {buttonCaptions.add}
              </Button>
            ) : (
              ''
            )}
            {onAddTemplate ? (
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  const channelIdName = getCurrentFullKey(
                    getFieldsValue(),
                    'channel_id'
                  )
                  const optionIdName = getCurrentFullKey(
                    getFieldsValue(),
                    '|option_id'
                  )
                  validateFields([`${channelIdName}`, `${optionIdName}`])
                    .then(() => {
                      // renderBtnPosition(offset + 1);
                      onAddTemplate(getFieldValue([`${channelIdName}`]))
                    })
                    .catch(err => {
                      notifyRender(err)
                    })
                }}
              >
                {buttonCaptions.add}
              </Button>
            ) : (
              ''
            )}
            {onSubmit ? (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => {
                  validateFields()
                    .then(() => {
                      onSubmit(getFieldsValue())
                    })
                    .catch(err => {
                      checkFormError()
                      notifyRender(err)
                    })
                }}
                {...customFormButtonProps?.submit}
              >
                {buttonCaptions.submit}
              </Button>
            ) : (
              ''
            )}
            {onApproval ? (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => {
                  validateFields()
                    .then(() => {
                      onApproval(getFieldsValue())
                    })
                    .catch(err => {
                      notifyRender(err)
                    })
                }}
                {...customFormButtonProps?.approval}
              >
                {buttonCaptions.approval}
              </Button>
            ) : (
              ''
            )}
            {onReject ? (
              <Button
                type="default"
                icon={<RollbackOutlined />}
                onClick={() => {
                  validateFields()
                    .then(() => {
                      onReject(getFieldsValue())
                    })
                    .catch(err => {
                      notifyRender(err)
                    })
                }}
                {...customFormButtonProps?.reject}
              >
                {buttonCaptions.reject}
              </Button>
            ) : (
              ''
            )}

            {onExport ? (
              <Button
                icon={<DeliveredProcedureOutlined />}
                type="primary"
                onClick={() => {
                  onExport(getFieldsValue())
                }}
                {...customFormButtonProps?.export}
              >
                {buttonCaptions.export}
              </Button>
            ) : (
              ''
            )}
          </Space>
        </Col>
      </Row>
    </div>
  )
}

import { useMemoizedFn } from 'ahooks'
import './style.less'
import { useEffect, useState } from 'react'

interface SelectItem {
  label: string
  value: string | number
}

interface SiderSelectProps {
  options: Array<SelectItem>
  onSelect?: (item: SelectItem) => void
  defaultSelected?: string | number
}

const SiderSelect: React.FC<SiderSelectProps> = ({
  options,
  onSelect,
  defaultSelected,
}) => {
  const [selected, setSelected] = useState(defaultSelected)

  const _onSelect = useMemoizedFn((item: SelectItem) => {
    setSelected(item.value)
    onSelect?.(item)
  })

  useEffect(() => {
    if (selected) return
    _onSelect(options[0])
  }, [selected])

  useEffect(() => {
    if (defaultSelected) setSelected(defaultSelected)
    else _onSelect(options[0])
  }, [defaultSelected])

  const renderItem = useMemoizedFn(() => {
    return options.map(item => (
      <div
        className="sider-select-item"
        key={item.value}
        onClick={() => _onSelect(item)}
      >
        <span
          className={`sider-select-item-text ${
            selected === item.value ? 'active' : ''
          }`}
        >
          {item.label}
        </span>
      </div>
    ))
  })

  return <div className="sider-select">{renderItem()}</div>
}

export default SiderSelect

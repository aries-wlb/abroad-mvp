import type { DescriptionsProps } from 'antd'
import { Descriptions as DescriptionsImpl } from 'antd'
import { useMemoizedFn } from 'ahooks'

export interface LabelValue {
  full: string
  short: string
}
export type LabelMap = Record<string, LabelValue>

type _DescriptionsProps = {
  data: Record<string, unknown>
  labelMap?: LabelMap
} & DescriptionsProps

export function Descriptions({ data, labelMap, ...rest }: _DescriptionsProps) {
  const renderItem = useMemoizedFn(() => {
    if (typeof data !== 'object') return []

    return Object.entries(data).reduce((pre, cur) => {
      const [key, value] = cur
      let formatValue = value
      try {
        formatValue =
          typeof formatValue === 'string'
            ? formatValue
            : JSON.stringify(formatValue)
      } catch (error) {
        console.error(error)
      }

      return [
        ...pre,
        <DescriptionsImpl.Item label={labelMap?.[key]?.short || key} key={key}>
          {formatValue as string}
        </DescriptionsImpl.Item>,
      ]
    }, [] as Array<JSX.Element>)
  })
  return <DescriptionsImpl {...rest}>{renderItem()}</DescriptionsImpl>
}

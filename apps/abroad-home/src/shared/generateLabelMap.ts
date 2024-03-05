import type { LabelMap, LabelValue } from '@/components/Descriptions'

export function generateLabelMap(labelMap: unknown) {
  let result = labelMap
  try {
    result = Object.entries(labelMap || {}).reduce((cur, [key, value]) => {
      let tmp = value as unknown
      if (typeof value === 'string') {
        tmp = {
          short: value,
          full: value,
        }
      }
      return {
        ...cur,
        [key]: tmp as LabelValue,
      }
    }, {} as LabelMap)
  } catch (_) {}
  return result as LabelMap
}

export * from './messageCenter'
export * from './jsonAuditValueParser'
export * from './getCurrentFullKey'
export * from './generateLabelMap'
export * from './isParsable'
export * from './timestampToDate'
export * from './isJsonString'

export function createPromise(time = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

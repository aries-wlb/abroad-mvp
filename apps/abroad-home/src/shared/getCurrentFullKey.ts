export function getCurrentFullKey(data: unknown, key: string) {
  let res
  try {
    res = Object.keys(data as any).find((item: string) => {
      return item.includes(key)
    })
  } catch (_) {}
  return res
}

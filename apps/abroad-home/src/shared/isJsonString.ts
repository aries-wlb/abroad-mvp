export function isJsonString(inJson: string) {
  try {
    JSON.parse(inJson as string)
  } catch (e) {
    return false
  }
  const valid = /^(\s)*(\{)[\S\s]*(\}(\s)*)$/.test(inJson)
  return valid
}

export function jsonAuditValueParser(value: any) {
  try {
    const valueToObject = JSON.parse(value)
    return valueToObject
  } catch (_) {
    return value
  }
}

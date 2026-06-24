export function encodeState(state) {
  try {
    const json = JSON.stringify(state)
    const encoded = btoa(encodeURIComponent(json))
    return encoded
  } catch {
    return ''
  }
}

export function decodeState(param) {
  if (!param) return null

  try {
    const decoded = decodeURIComponent(atob(param))
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

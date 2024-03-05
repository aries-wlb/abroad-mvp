function createStorage(key: string, expiry?: number) {
  function get() {
    const itemStr = localStorage.getItem(key)
    // if the item doesn't exist, return null
    if (!itemStr) return null

    if (typeof expiry === 'undefined') return itemStr

    const item = JSON.parse(itemStr)
    const now = new Date()
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key)
      return null
    }
    return item.value
  }

  function set(value: string) {
    const val =
      typeof expiry === 'undefined'
        ? value
        : JSON.stringify({
            value,
            expiry: new Date().getTime() + expiry,
          })

    return localStorage.setItem(key, val)
  }

  function remove() {
    return localStorage.removeItem(key)
  }
  return {
    get,
    set,
    remove,
  }
}

export const LocalStorage = {
  token: createStorage('token', 1000 * 60 * 60 * 24 * 30),
}

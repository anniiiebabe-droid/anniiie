const PREFIX = 'first_bite_'
function get(key, fallback) {
  try { const value = wx.getStorageSync(PREFIX + key); return value === '' || value == null ? fallback : value } catch (e) { return fallback }
}
function set(key, value) { wx.setStorageSync(PREFIX + key, value); return value }
function remove(key) { wx.removeStorageSync(PREFIX + key) }
function clear() {
  const info = wx.getStorageInfoSync()
  info.keys.filter(k => k.indexOf(PREFIX) === 0).forEach(k => wx.removeStorageSync(k))
}
module.exports = { get, set, remove, clear }

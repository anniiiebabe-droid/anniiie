function pad(n) { return String(n).padStart(2, '0') }
function toDate(value) {
  if (!value) return new Date()
  if (value instanceof Date) return value
  return new Date(String(value).replace(/-/g, '/'))
}
function formatDate(value) {
  const d = toDate(value)
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}
function startOfDay(value) { const d = toDate(value); return new Date(d.getFullYear(), d.getMonth(), d.getDate()) }
function daysBetween(from, to) { return Math.round((startOfDay(to) - startOfDay(from)) / 86400000) }
function weekRange(value) {
  const d = startOfDay(value || new Date())
  const day = d.getDay() || 7
  const start = new Date(d); start.setDate(d.getDate() - day + 1)
  const end = new Date(start); end.setDate(start.getDate() + 6); end.setHours(23, 59, 59, 999)
  return { start, end, startText: formatDate(start), endText: formatDate(end) }
}
function friendly(value) {
  const d = toDate(value)
  return (d.getMonth() + 1) + '月' + d.getDate() + '日'
}
module.exports = { formatDate, daysBetween, weekRange, friendly, toDate, startOfDay }

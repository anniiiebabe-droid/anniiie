const { daysBetween } = require('./date')
function decorate(item) {
  const daysLeft = daysBetween(new Date(), item.priorityUseDate)
  let priority = '充足', tone = 'safe', statusText = '状态良好'
  if (daysLeft < 0) { priority = '请检查'; tone = 'check'; statusText = '已过建议日期，请检查状态' }
  else if (daysLeft === 0) { priority = '今天优先'; tone = 'urgent'; statusText = '建议今天优先使用' }
  else if (daysLeft <= 2) { priority = '尽快使用'; tone = 'soon'; statusText = '临近建议使用日期' }
  const categoryClasses = { '蔬菜': 'cat-vegetable', '水果': 'cat-fruit', '肉类': 'cat-meat', '蛋奶': 'cat-dairy', '豆制品': 'cat-bean', '其他': 'cat-other' }
  return Object.assign({}, item, { daysLeft, priority, tone, statusText, shortName: String(item.name || '').charAt(0), categoryClass: categoryClasses[item.category] || 'cat-other' })
}
function active(items) { return items.filter(i => i.status === 'active' && Number(i.remainingQuantity) > 0) }
function sorted(items) { return active(items).map(decorate).sort((a, b) => a.daysLeft - b.daysLeft || a.createdAt - b.createdAt) }
function today(items, limit) { return sorted(items).filter(i => i.daysLeft >= 0).slice(0, limit || 3) }
module.exports = { decorate, active, sorted, today }

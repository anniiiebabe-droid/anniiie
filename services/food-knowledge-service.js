const foods = require('../data/food-knowledge')
const { formatDate, toDate } = require('../utils/date')

function identify(input) {
  const text = String(input || '').trim()
  if (!text) return null
  return foods.find(food => food.aliases.some(alias => text.indexOf(alias) >= 0 || alias.indexOf(text) >= 0)) || null
}
function addDays(date, days) { const d = toDate(date); d.setDate(d.getDate() + Number(days || 0)); return formatDate(d) }
function estimate(name, purchaseDate, location) {
  const food = identify(name), storage = location || '冷藏室'
  const days = food ? (food.days[storage] || food.days['冷藏室']) : ({ '冷藏室': 3, '冷冻室': 30, '常温': 2 }[storage] || 3)
  return { food, category: food ? food.category : '其他', unit: food ? food.unit : '个', shelfLifeDays: days, suggestedEatDate: addDays(purchaseDate || new Date(), days), source: food ? '食材保鲜知识库' : '通用保鲜参考' }
}
function search(text) { const q=String(text||'').trim(); return q ? foods.filter(f=>f.name.indexOf(q)>=0||f.aliases.some(a=>a.indexOf(q)>=0)).slice(0,6) : foods.slice(0,8) }
module.exports = { identify, estimate, search, foods }

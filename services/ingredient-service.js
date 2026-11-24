const dm = require('../storage/data-manager')
const createId = require('../utils/id')
const priority = require('../utils/priority')
const rewardService = require('./reward-service')

function list() { return priority.sorted(dm.getState().ingredients) }
function all() { return dm.getState().ingredients.map(priority.decorate) }
function get(id) { const item = dm.getState().ingredients.find(i => i.id === id); return item ? priority.decorate(item) : null }
function add(input) {
  return dm.update(state => {
    const now = Date.now()
    const item = Object.assign({ id: createId('ingredient'), category: '其他', purchaseDate: '', storageLocation: '冷藏室', note: '', status: 'active', rewardClaimed: false, createdAt: now, updatedAt: now }, input)
    item.quantity = Number(item.quantity); item.remainingQuantity = Number(item.quantity)
    state.ingredients.push(item)
    state.events.push({ id: createId('event'), type: 'ingredient_added', ingredientId: item.id, createdAt: now })
    return item
  })
}
function update(id, input) {
  return dm.update(state => {
    const item = state.ingredients.find(i => i.id === id)
    if (!item) return null
    Object.assign(item, input, { updatedAt: Date.now() })
    item.quantity = Number(item.quantity); item.remainingQuantity = Math.min(Number(item.remainingQuantity), item.quantity)
    return item
  })
}
function remove(id) {
  return dm.update(state => {
    const item = state.ingredients.find(i => i.id === id)
    if (!item) return false
    item.status = 'deleted'; item.updatedAt = Date.now()
    state.events.push({ id: createId('event'), type: 'ingredient_deleted', ingredientId: id, createdAt: Date.now() })
    return true
  })
}
function consume(id, amount) {
  return dm.update(state => {
    const item = state.ingredients.find(i => i.id === id && i.status === 'active')
    const qty = Number(amount)
    if (!item || !qty || qty < 0 || qty > item.remainingQuantity) return { error: '用量无效' }
    item.remainingQuantity = Math.max(0, Number((item.remainingQuantity - qty).toFixed(2)))
    item.updatedAt = Date.now()
    const completed = item.remainingQuantity === 0
    if (completed) item.status = 'consumed'
    const consumption = { id: createId('consume'), ingredientId: id, quantity: qty, consumedAt: Date.now(), completed, eligibleForReward: completed, reversed: false }
    state.consumptions.push(consumption)
    const reward = completed ? rewardService.grantCompletion(state, item, consumption.id) : null
    return { item, consumption, reward }
  })
}
function undoConsumption(consumptionId) {
  return dm.update(state => {
    const record = state.consumptions.find(c => c.id === consumptionId && !c.reversed)
    if (!record) return { error: '记录不存在或已撤销' }
    const hasLater = state.consumptions.some(c => c.ingredientId === record.ingredientId && !c.reversed && c.consumedAt > record.consumedAt)
    if (hasLater) return { error: '请先撤销较新的使用记录' }
    const item = state.ingredients.find(i => i.id === record.ingredientId)
    if (!item) return { error: '食材不存在' }
    item.remainingQuantity = Math.min(item.quantity, Number(item.remainingQuantity) + record.quantity)
    item.status = 'active'; item.updatedAt = Date.now(); record.reversed = true; record.reversedAt = Date.now()
    rewardService.reverseForConsumption(state, record)
    return { item, record }
  })
}
function today(limit) { return priority.today(dm.getState().ingredients, limit) }
module.exports = { list, all, get, add, update, remove, consume, undoConsumption, today }

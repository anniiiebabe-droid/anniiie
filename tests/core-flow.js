const assert = require('assert')

const memory = {}
global.wx = {
  getStorageSync(key) { return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : '' },
  setStorageSync(key, value) { memory[key] = JSON.parse(JSON.stringify(value)) },
  removeStorageSync(key) { delete memory[key] },
  getStorageInfoSync() { return { keys: Object.keys(memory) } }
}

const dm = require('../storage/data-manager')
const ingredients = require('../services/ingredient-service')
const outfits = require('../services/outfit-service')
const report = require('../services/report-service')
const { formatDate } = require('../utils/date')

dm.reset()
const onion = ingredients.add({
  name: '洋葱', quantity: 1, unit: '个', category: '蔬菜',
  priorityUseDate: formatDate(new Date()), purchaseDate: formatDate(new Date()),
  storageLocation: '冷藏室', note: '课堂演示'
})

assert.strictEqual(ingredients.today(3)[0].id, onion.id, '洋葱应进入今日优先')
const completed = ingredients.consume(onion.id, 1)
assert.ok(completed.reward, '完成使用应发放奖励')
assert.strictEqual(dm.getState().lingling.xp, 10)
assert.strictEqual(dm.getState().lingling.points, 5)
assert.strictEqual(dm.getState().lingling.nutrients.purple, 1)
const duplicate = ingredients.consume(onion.id, 1)
assert.ok(duplicate.error, '已完成食材不可重复领取奖励')
assert.strictEqual(dm.getState().lingling.xp, 10)

const tomato = outfits.buy('tomato-hat')
assert.ok(!tomato.error, '5 积分应可兑换番茄帽')
assert.strictEqual(dm.getState().lingling.points, 0)
assert.ok(!outfits.equip('tomato-hat').error)
assert.strictEqual(dm.getState().lingling.equippedOutfits.hat, 'tomato-hat')

const weekly = report.current()
assert.strictEqual(weekly.ingredientsAdded, 1)
assert.strictEqual(weekly.ingredientsConsumed, 1)
assert.strictEqual(weekly.xpEarned, 10)
assert.strictEqual(weekly.pointsEarned, 0, '周报积分变化包含获得与兑换')

const undo = ingredients.undoConsumption(completed.consumption.id)
assert.ok(!undo.error)
assert.strictEqual(ingredients.get(onion.id).remainingQuantity, 1)
assert.strictEqual(dm.getState().lingling.xp, 0)
assert.strictEqual(dm.getState().lingling.nutrients.purple, 0)

console.log('core flow ok')

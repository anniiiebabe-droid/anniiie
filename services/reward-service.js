const createId = require('../utils/id')
const config = require('../data/game-config')
const linglingService = require('./lingling-service')

function grantCompletion(state, ingredient, consumptionId) {
  if (ingredient.rewardClaimed) return null
  const onTime = new Date().setHours(0,0,0,0) <= new Date(String(ingredient.priorityUseDate).replace(/-/g, '/')).setHours(23,59,59,999)
  if (!onTime) return null
  const reward = config.completeReward
  const tx = { id: createId('reward'), sourceId: ingredient.id, consumptionId, type: 'complete_ingredient', xp: reward.xp, points: reward.points, createdAt: Date.now(), reversed: false }
  state.transactions.push(tx)
  state.lingling.xp += reward.xp
  state.lingling.points += reward.points
  ingredient.rewardClaimed = true
  const nutrient = config.nutrientMap[ingredient.name]
  if (nutrient) state.lingling.nutrients[nutrient.id] = (state.lingling.nutrients[nutrient.id] || 0) + 1
  linglingService.syncLevel(state)
  return { transaction: tx, nutrient }
}
function reverseForConsumption(state, consumption) {
  const tx = state.transactions.find(t => t.consumptionId === consumption.id && !t.reversed)
  if (!tx) return null
  tx.reversed = true; tx.reversedAt = Date.now()
  state.lingling.xp = Math.max(0, state.lingling.xp - tx.xp)
  state.lingling.points = Math.max(0, state.lingling.points - tx.points)
  const ingredient = state.ingredients.find(i => i.id === consumption.ingredientId)
  if (ingredient) {
    ingredient.rewardClaimed = false
    const nutrient = config.nutrientMap[ingredient.name]
    if (nutrient && state.lingling.nutrients[nutrient.id]) state.lingling.nutrients[nutrient.id]--
  }
  linglingService.syncLevel(state)
  return tx
}
module.exports = { grantCompletion, reverseForConsumption }

const dm = require('../storage/data-manager')
const { weekRange } = require('../utils/date')
function within(time, range) { return time >= range.start.getTime() && time <= range.end.getTime() }
function current() {
  const state = dm.getState(), range = weekRange()
  const added = state.ingredients.filter(i => within(i.createdAt, range))
  const consumptions = state.consumptions.filter(c => !c.reversed && within(c.consumedAt, range))
  const completedIds = Array.from(new Set(consumptions.filter(c => c.completed).map(c => c.ingredientId)))
  const txs = state.transactions.filter(t => !t.reversed && within(t.createdAt, range))
  const unlocked = state.userOutfits.filter(o => o.owned && o.acquiredAt && within(o.acquiredAt, range) && o.outfitId !== 'onion-hat')
  const priorityTotal = added.filter(i => new Date(String(i.priorityUseDate).replace(/-/g, '/')) <= range.end).length
  const completionRate = priorityTotal ? Math.min(100, Math.round(completedIds.length / priorityTotal * 100)) : 0
  const pointsEarned = txs.reduce((n, t) => n + t.points, 0)
  return {
    weekStart: range.startText, weekEnd: range.endText,
    ingredientsAdded: added.length, ingredientsConsumed: completedIds.length,
    priorityCompleted: completedIds.length, priorityTotal,
    xpEarned: txs.reduce((n, t) => n + t.xp, 0), pointsEarned,
    newOutfits: unlocked.length,
    completionRate,
    addedBar: Math.min(100, added.length * 20), consumedBar: Math.min(100, completedIds.length * 20),
    pointsText: (pointsEarned >= 0 ? '+' : '') + pointsEarned,
    hasData: added.length > 0 || consumptions.length > 0 || txs.length > 0
  }
}
module.exports = { current }

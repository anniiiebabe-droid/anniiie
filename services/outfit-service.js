const dm = require('../storage/data-manager')
const outfits = require('../data/outfits')
const createId = require('../utils/id')
function catalog() {
  const state = dm.getState()
  return outfits.map(item => {
    const user = state.userOutfits.find(u => u.outfitId === item.id) || {}
    return Object.assign({}, item, user, { locked: state.lingling.level < item.unlockLevel })
  })
}
function buy(id) {
  return dm.update(state => {
    const item = outfits.find(o => o.id === id), user = state.userOutfits.find(u => u.outfitId === id)
    if (!item || !user) return { error: '装扮不存在' }
    if (user.owned) return { error: '已经拥有这件装扮' }
    if (state.lingling.level < item.unlockLevel) return { error: '等级还未达到' }
    if (state.lingling.points < item.price) return { error: '星星积分不足' }
    state.lingling.points -= item.price; user.owned = true; user.acquiredAt = Date.now()
    state.transactions.push({ id: createId('reward'), sourceId: item.id, type: 'outfit_purchase', xp: 0, points: -item.price, createdAt: Date.now(), reversed: false })
    return { item, balance: state.lingling.points }
  })
}
function equip(id) {
  return dm.update(state => {
    const item = outfits.find(o => o.id === id), user = state.userOutfits.find(u => u.outfitId === id)
    if (!item || !user || !user.owned) return { error: '尚未拥有这件装扮' }
    state.userOutfits.filter(u => { const own = outfits.find(o => o.id === u.outfitId); return own && own.type === item.type }).forEach(u => { u.equipped = false })
    user.equipped = true; state.lingling.equippedOutfits[item.type] = id
    if (item.type === 'expression') state.lingling.currentExpression = id
    return { item }
  })
}
function unequip(type) {
  return dm.update(state => {
    state.userOutfits.forEach(u => { const item = outfits.find(o => o.id === u.outfitId); if (item && item.type === type) u.equipped = false })
    delete state.lingling.equippedOutfits[type]
    if (type === 'expression') state.lingling.currentExpression = 'default'
  })
}
module.exports = { catalog, buy, equip, unequip }

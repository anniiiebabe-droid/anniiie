const CURRENT_VERSION = 2
function migrate(state) {
  const next = Object.assign({ version: CURRENT_VERSION, ingredients: [], consumptions: [], transactions: [], events: [], userOutfits: [] }, state || {})
  if ((next.version || 1) < 2 && next.lingling) {
    next.lingling.equippedOutfits = {}
    ;(next.userOutfits || []).forEach(item => { item.equipped = false })
  }
  next.profile = Object.assign({ nickname: '惜食新朋友', avatarUrl: '' }, next.profile || {})
  next.version = CURRENT_VERSION
  return next
}
module.exports = { CURRENT_VERSION, migrate }

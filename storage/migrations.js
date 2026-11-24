const CURRENT_VERSION = 1
function migrate(state) {
  const next = Object.assign({ version: CURRENT_VERSION, ingredients: [], consumptions: [], transactions: [], events: [], userOutfits: [] }, state || {})
  next.version = CURRENT_VERSION
  return next
}
module.exports = { CURRENT_VERSION, migrate }

const config = require('../data/game-config')

function levelForXp(xp) {
  return config.levelThresholds.reduce((found, row) => xp >= row.xp ? row : found, config.levelThresholds[0])
}
function summary(lingling) {
  const current = levelForXp(lingling.xp)
  const next = config.levelThresholds.find(row => row.level === current.level + 1)
  const span = next ? next.xp - current.xp : 1
  const progress = next ? Math.min(100, Math.round((lingling.xp - current.xp) / span * 100)) : 100
  return Object.assign({}, lingling, { level: current.level, stageName: current.name, nextXp: next ? next.xp : current.xp, progress, isMax: !next })
}
function syncLevel(state) { state.lingling.level = levelForXp(state.lingling.xp).level; return summary(state.lingling) }
module.exports = { levelForXp, summary, syncLevel }

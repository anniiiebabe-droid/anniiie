const storage = require('./storage')
const { migrate } = require('./migrations')
const outfits = require('../data/outfits')

const KEY = 'state'
function defaults() {
  return {
    version: 1,
    ingredients: [], consumptions: [], transactions: [], events: [],
    lingling: { level: 1, xp: 0, points: 0, currentExpression: 'default', equippedOutfits: { hat: 'onion-hat' }, nutrients: {} },
    userOutfits: outfits.map(o => ({ outfitId: o.id, owned: o.id === 'onion-hat', equipped: o.id === 'onion-hat', acquiredAt: o.id === 'onion-hat' ? Date.now() : null })),
    preferences: { reminders: true }, createdAt: Date.now()
  }
}
function initialize() {
  const old = storage.get(KEY, null)
  if (!old) return storage.set(KEY, defaults())
  return storage.set(KEY, migrate(old))
}
function getState() { return storage.get(KEY, null) || initialize() }
function saveState(state) { return storage.set(KEY, state) }
function update(mutator) { const state = getState(); const result = mutator(state); saveState(state); return result === undefined ? state : result }
function reset() { storage.remove(KEY); return initialize() }
module.exports = { initialize, getState, saveState, update, reset, defaults }

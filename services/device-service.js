const ingredientService = require('./ingredient-service')
function getDisplayData() { return Promise.resolve({ items: ingredientService.today(3), syncedAt: Date.now(), mode: 'local-simulation' }) }
function syncToDevice() { return getDisplayData() }
module.exports = { getDisplayData, syncToDevice }

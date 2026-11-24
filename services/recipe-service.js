const recipes = require('../data/recipes')
function recommend(ingredients, priorityItems) {
  const names = ingredients.filter(i => i.status === 'active' && i.remainingQuantity > 0).map(i => i.name)
  const priorityNames = (priorityItems || []).map(i => i.name)
  return recipes.map(recipe => {
    const available = recipe.ingredients.filter(name => names.some(n => n.indexOf(name) >= 0 || name.indexOf(n) >= 0))
    const missing = recipe.ingredients.filter(name => !available.includes(name))
    const hitsPriority = recipe.ingredients.some(name => priorityNames.includes(name))
    return Object.assign({}, recipe, { available, missing, missingText: missing.join('、'), score: available.length * 2 + (hitsPriority ? 5 : 0), hitsPriority })
  }).sort((a, b) => b.score - a.score)[0]
}
module.exports = { recommend }

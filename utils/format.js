function quantity(value) { return Number(value) % 1 === 0 ? String(Number(value)) : Number(value).toFixed(1) }
module.exports = { quantity }

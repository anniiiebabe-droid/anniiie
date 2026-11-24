module.exports = {
  levelThresholds: [
    { level: 1, xp: 0, name: '初来乍到' },
    { level: 2, xp: 50, name: '熟悉彼此' },
    { level: 3, xp: 120, name: '一起成长' },
    { level: 4, xp: 220, name: '默契伙伴' },
    { level: 5, xp: 350, name: '最佳搭档' }
  ],
  completeReward: { xp: 10, points: 5 },
  demoBonus: { points: 30 },
  nutrientMap: {
    '洋葱': { id: 'purple', name: '紫色养料', color: '#9270aa', emoji: '🟣' },
    '菠菜': { id: 'green', name: '绿色养料', color: '#71926d', emoji: '🟢' },
    '番茄': { id: 'red', name: '红色养料', color: '#d96051', emoji: '🔴' },
    '胡萝卜': { id: 'orange', name: '橙色养料', color: '#e88a4d', emoji: '🟠' }
  }
}

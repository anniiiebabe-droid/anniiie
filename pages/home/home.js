const ingredientService = require('../../services/ingredient-service')
const recipeService = require('../../services/recipe-service')
const dm = require('../../storage/data-manager')
const linglingService = require('../../services/lingling-service')
const { friendly } = require('../../utils/date')

Page({
  data: { date: '', greeting: '', priorityItems: [], recipe: null, lingling: {}, rewardVisible: false, reward: null },
  onShow() { this.load() },
  load() {
    const state = dm.getState(), items = ingredientService.today(3), hour = new Date().getHours()
    const greeting = hour < 11 ? '早上好，今天也从珍惜食物开始吧。' : hour < 18 ? '看看冰箱，今天先吃什么？' : '晚上好，把新鲜留在餐桌上吧。'
    this.setData({ date: friendly(new Date()), greeting, priorityItems: items, recipe: recipeService.recommend(state.ingredients, items), lingling: linglingService.summary(state.lingling) })
  },
  add() { wx.navigateTo({ url: '/pages/add-ingredient/add-ingredient' }) },
  device() { wx.navigateTo({ url: '/pages/device-demo/device-demo' }) },
  detail(e) { wx.navigateTo({ url: '/pages/ingredient-detail/ingredient-detail?id=' + e.detail.id }) },
  consume(e) {
    const item = ingredientService.get(e.detail.id)
    wx.showModal({ title: '确认全部使用', content: '确认已经用完剩余 ' + item.remainingQuantity + item.unit + item.name + '？', success: res => {
      if (!res.confirm) return
      const result = ingredientService.consume(item.id, item.remainingQuantity)
      if (result.reward) { getApp().globalData.lastReward = result.reward; this.setData({ rewardVisible: true, reward: result.reward }) }
      else wx.showToast({ title: '库存已更新', icon: 'success' })
      this.load()
    }})
  },
  closeReward() { this.setData({ rewardVisible: false }) },
  goRecipe() { const r = this.data.recipe; if (!r) return; wx.showModal({ title: r.name + ' · ' + r.minutes + '分钟', content: r.steps.map((s,i) => (i+1)+'. '+s).join('\n'), showCancel: false }) },
  lingling() { wx.switchTab({ url: '/pages/lingling/lingling' }) }
})

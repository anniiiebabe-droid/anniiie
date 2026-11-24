const service = require('../../services/ingredient-service')
const categories = ['全部','蔬菜','水果','肉类','蛋奶','豆制品','其他']
Page({
  data: { categories, selected: '全部', items: [], filtered: [], rewardVisible: false, reward: null },
  onShow(){ this.load() },
  load(){ const items = service.list(); this.setData({ items }, () => this.filter()) },
  choose(e){ this.setData({ selected: e.currentTarget.dataset.value }, () => this.filter()) },
  filter(){ const s=this.data.selected; this.setData({ filtered: s==='全部'?this.data.items:this.data.items.filter(i=>i.category===s) }) },
  add(){ wx.navigateTo({url:'/pages/add-ingredient/add-ingredient'}) },
  detail(e){ wx.navigateTo({url:'/pages/ingredient-detail/ingredient-detail?id='+e.detail.id}) },
  consume(e){ const item=service.get(e.detail.id); wx.showActionSheet({ itemList:['部分使用','全部用完'], success: res=>{
    if(res.tapIndex===1){ const result=service.consume(item.id,item.remainingQuantity); if(result.reward)this.setData({rewardVisible:true,reward:result.reward}); this.load() }
    else wx.navigateTo({url:'/pages/ingredient-detail/ingredient-detail?id='+item.id+'&action=consume'})
  }}) },
  closeReward(){this.setData({rewardVisible:false})}
})

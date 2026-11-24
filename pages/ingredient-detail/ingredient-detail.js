const service=require('../../services/ingredient-service');const dm=require('../../storage/data-manager')
Page({
 data:{id:'',item:null,amount:'',records:[],rewardVisible:false,reward:null},
 onLoad(q){this.setData({id:q.id});this.load();if(q.action==='consume')setTimeout(()=>this.partial(),300)},onShow(){this.load()},
 load(){const item=service.get(this.data.id);const records=dm.getState().consumptions.filter(c=>c.ingredientId===this.data.id).sort((a,b)=>b.consumedAt-a.consumedAt).map(c=>Object.assign({},c,{unit:item?item.unit:'',time:new Date(c.consumedAt).toLocaleDateString()}));this.setData({item,records})},
 edit(){wx.navigateTo({url:'/pages/add-ingredient/add-ingredient?id='+this.data.id})},
 partial(){this.setData({amount:''});wx.showModal({title:'部分食用',editable:true,placeholderText:'输入食用数量（最多 '+this.data.item.remainingQuantity+'）',success:r=>{if(r.confirm){const result=service.consume(this.data.id,Number(r.content));if(result.error)wx.showToast({title:result.error,icon:'none'});else wx.showToast({title:'库存已更新',icon:'success'});this.load()}}})},
 all(){const i=this.data.item;wx.showModal({title:'确认全部食用',content:'用完后将记录奖励；建议食用日期内完成可获得 XP 与星星。',success:r=>{if(r.confirm){const result=service.consume(i.id,i.remainingQuantity);if(result.reward)this.setData({rewardVisible:true,reward:result.reward});this.load()}}})},
 undo(e){wx.showModal({title:'撤销这次食用？',content:'库存和本次获得的奖励将同步回滚。',success:r=>{if(r.confirm){const result=service.undoConsumption(e.currentTarget.dataset.id);wx.showToast({title:result.error||'已撤销',icon:result.error?'none':'success'});this.load()}}})},
 remove(){wx.showModal({title:'删除食材？',content:'删除后将不再出现在冰箱中。',confirmColor:'#b25443',success:r=>{if(r.confirm){service.remove(this.data.id);wx.navigateBack()}}})},closeReward(){this.setData({rewardVisible:false})}
})

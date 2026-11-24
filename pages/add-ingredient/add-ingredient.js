const service = require('../../services/ingredient-service')
const { formatDate } = require('../../utils/date')
Page({
  data:{ id:'', form:{name:'',quantity:'',unit:'个',priorityUseDate:'',purchaseDate:'',category:'蔬菜',storageLocation:'冷藏室',note:''}, units:['个','颗','根','盒','袋','克','千克','毫升'], categories:['蔬菜','水果','肉类','蛋奶','豆制品','其他'], locations:['冷藏室','冷冻室','常温','其他'], today:formatDate(new Date()), isEdit:false },
  onLoad(q){ if(q.id){const item=service.get(q.id); if(item)this.setData({id:q.id,form:item,isEdit:true})} },
  input(e){this.setData({['form.'+e.currentTarget.dataset.key]:e.detail.value})},
  pick(e){const key=e.currentTarget.dataset.key, values=this.data[key==='unit'?'units':key==='category'?'categories':'locations'];this.setData({['form.'+key]:values[e.detail.value]})},
  date(e){this.setData({['form.'+e.currentTarget.dataset.key]:e.detail.value})},
  save(){const f=this.data.form;if(!f.name.trim()||!Number(f.quantity)||!f.unit||!f.priorityUseDate){wx.showToast({title:'请填写所有必填项',icon:'none'});return} if(Number(f.quantity)<=0){wx.showToast({title:'数量需大于 0',icon:'none'});return}
    if(this.data.isEdit)service.update(this.data.id,f);else service.add(f)
    wx.showToast({title:this.data.isEdit?'保存成功':'添加成功',icon:'success'});setTimeout(()=>wx.navigateBack(),500)
  }
})

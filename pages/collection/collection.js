const dm=require('../../storage/data-manager');const config=require('../../data/game-config')
Page({data:{items:[]},onShow(){const n=dm.getState().lingling.nutrients||{};this.setData({items:Object.keys(config.nutrientMap).map(food=>Object.assign({food,count:n[config.nutrientMap[food].id]||0},config.nutrientMap[food]))})}})

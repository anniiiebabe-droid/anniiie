const service=require('../../services/report-service')
Page({data:{report:{}},onShow(){this.setData({report:service.current()})}})

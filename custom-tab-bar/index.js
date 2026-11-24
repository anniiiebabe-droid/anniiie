Component({
  data:{selected:0,list:[
    {pagePath:'/pages/home/home',text:'首页',icon:'⌂'},
    {pagePath:'/pages/fridge/fridge',text:'冰箱',icon:'▣'},
    {pagePath:'/pages/lingling/lingling',text:'令令',icon:'◕'},
    {pagePath:'/pages/profile/profile',text:'我的',icon:'○'}
  ]},
  methods:{switchTab(e){const index=e.currentTarget.dataset.index,item=this.data.list[index];this.setData({selected:index});wx.switchTab({url:item.pagePath})}}
})

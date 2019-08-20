// pages/myself/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible1: false,
    spId: '',
    spdata: {},
    indicatorDots: true,
    autoplay: true,
    indicator: true,
    interval: 5000,
    duration: 1000,
    //规格参数
    ggshowdata: {},
    ggdata: {
      productId: '',
      token: '',
      properties: ''
    },
    msgobj: {},
    numbers: 1,
    //已选规格
    chosedata: {},
    //kudta
    kudata: {},
    adddata:{
      count:1,
      productId: '',
      productSkuId: '',
      token:''
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //数量
  chancenum(e) {
    this.setData({
      numbers: e.detail.value
    })
    this.data.adddata.count = this.data.numbers
  },
  //切换规格
  chanceG(e) {
    let arrnum = e.currentTarget.dataset.indexs
    let arrnums = e.currentTarget.dataset.index
    let arrsin = "ggshowdata[" + arrnum+ "].indexs"
    this.setData({
      [arrsin]:e.currentTarget.dataset.index
    })

    let gname = "chosedata[" + arrnum+ "].name"
    let gids = "chosedata[" + arrnum+ "].bid"
    this.setData({
      [gname] : this.data.ggshowdata[arrnum].values[arrnums].productPropertiesValue,
      [gids] : this.data.ggshowdata[arrnum].values[arrnums].productPropertiesValueId
    })

   this.getDatas()
  },
  Naveurl: function () {
    wx.setStorageSync('comlist', this.data.spdata.comment)
    wx.navigateTo({
      url: '../detail/comment/index'
    })
  },
  //已选规格
  overchance() {
    let arrys = JSON.parse(JSON.stringify(this.data.ggshowdata))
    let arrycho = []
    for (let index = 0; index < arrys.length; index++) {
      const element = arrys[index];
      let arrdata = {}
      arrdata.aid = element.productPropertiesId
      arrdata.name = element.values[0].productPropertiesValue
      arrdata.bid = element.values[0].productPropertiesValueId
      arrycho.push(arrdata)
    }
    this.setData({
      chosedata: arrycho
    })
  },
  showTc() {
    this.setData({
      visible1: true
    })
  },
  hideTc() {
    this.setData({
      visible1: false
    })
  },
  onLoad: function (options) {
    this.data.spId = options.cId
  },
  //获取详情
  getDetail() {
    let url = `/mall/api/v1/product/${this.data.spId}`
    let newobj = []
    app.getajax.get(url, this.data.listobj).then(res => {
      res.data.detailDesc = res.data.detailDesc.replace(/\<img/gi,'<img class="rich-img" ' );
      this.setData({
        spdata: res.data,
        ggshowdata: res.data.properties
      })
      for (let index = 0; index < this.data.ggshowdata.length; index++) {
        const element = this.data.ggshowdata[index];
        element.indexs = 0
        newobj.push(element)
      }
      this.setData({
        ggshowdata: newobj
      })
      console.log(this.data.ggshowdata)
      this.overchance()
      this.getDatas()
    })
  },
  //获取规格参数
  getDatas() {
    let ids = ''
    let idsarr = this.data.chosedata
    for (let index = 0; index < idsarr.length; index++) {
      const element = idsarr[index];
      
      if(index == idsarr.length-1){
        ids += ""+ element.aid +","+element.bid+""
      }else{
        ids += ""+ element.aid +","+element.bid+"&"
      }
    }
    this.data.ggdata.properties = ids
    this.data.ggdata.productId = this.data.spId
    this.data.ggdata.token = this.data.msgobj.token
    app.postajax.post('/mall/api/v1/getSku', this.data.ggdata).then(res => {
      if(res.status===200){
        this.setData({
          kudata: res.data
        })
        this.data.adddata.productId = this.data.kudata.productId
        this.data.adddata.productSkuId = this.data.kudata.productSkuId
      }
    })
  },
  //加入购物车
  Addcar(){
    this.data.adddata.count = this.data.numbers
    if(this.data.visible1){
      app.postajax.post('/cart/api/v1/addCart',this.data.adddata).then(res =>{
        console.log(res)
        if(res.status === 200){
          wx.showToast({
            title: '成功加入购物车',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
          });
          this.setData({
            visible1:false
          })  
        }
      })
    }else{
      this.setData({
        visible1:true
      })
    }
    
  },
  Naveurls: function(e){
    if(this.data.visible1){
      let buyobj = {
        products:[],
        token:''
      }
      buyobj.products.push(this.data.adddata)
      buyobj.products[0].firstImg = this.data.spdata.images[0]
      buyobj.products[0].name = this.data.spdata.name
      buyobj.token = this.data.adddata.token
      app.postajax.post('/order/api/v1/create',buyobj).then(res =>{
        let url = e.currentTarget.dataset.url +"?ccode=" + res.data + ""
        wx.navigateTo({
        url: url
        })
        this.setData({
          visible1: false
        })
      })
    }else{
      this.setData({
        visible1: true
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let usermsg = wx.getStorageSync('userMsg')
    this.data.msgobj = JSON.parse(usermsg)
    this.data.adddata.token = this.data.msgobj.token
    this.getDetail()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
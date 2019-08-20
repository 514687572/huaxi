// pages/shops/index/Searchs/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist:{},
    listobj:{
      token: '',
      index: 1,
      size: 999
    },
    noList:false  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getShoplist(){
    if(this.data.msgobj){
     this.data.listobj.token = this.data.msgobj.token
     //  this.data.listobj.token = 'testToken0001002'
    }
    app.getajax.get('/mall/api/v1/products',this.data.listobj).then(res =>{
      if(res.data.data.length < 1){
        this.setData({
          noList:true
        })
      }else{
        this.setData({
          noList:false
        })
      }
      this.setData({
        datalist: res.data.data
      })
    })
  },
  Serlist(e){
    console.log(e.detail.value)
    this.data.listobj.keywords = e.detail.value
    this.getShoplist()
  },
  navTos: function (e) {
    let url = e.currentTarget.dataset.url
    let cid = e.currentTarget.dataset.cid
    wx.navigateTo({
      url: `${url}?cId=${cid}`
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let usermsg = wx.getStorageSync('userMsg')
    this.data.msgobj = JSON.parse(usermsg)
   // this.getShoplist()
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
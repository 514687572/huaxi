// pages/myself/linedeal/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    acindex:0,
    msgobj:{},
    sendData:{
      orderStatus: 0,
      token:'',
      index: 1,
      size:999
    },
    Alldata:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  Naveurl: function(e){
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
     url: url
    })
  },
  chceList(e){
    this.setData({
      acindex:e.target.dataset.index
    })
    this.data.sendData.orderStatus = e.target.dataset.index
    this.getData()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let usermsg = wx.getStorageSync('userMsg')
    this.data.msgobj = JSON.parse(usermsg)
    this.data.sendData.token = this.data.msgobj.token
    this.getData()
  },
  getData(){
    app.getajax.get('/user/api/v1/orderOffline',this.data.sendData).then(res =>{
      if(res.status === 200){
        this.setData({
          Alldata:res.data
        })
      }
    })
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
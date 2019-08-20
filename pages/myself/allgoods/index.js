// pages/myself/allgoods/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgobj:{},
    sendData:{
      index: 1,
      size: 9999,
      token:''
    },
    Alldata:{},
    acindex:0,
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
    let usermsg = wx.getStorageSync('userMsg')
    this.data.msgobj = JSON.parse(usermsg)
    this.data.sendData.token = this.data.msgobj.token
    this.getData()
  },
  getData(){
    app.getajax.get('/user/api/v1/saleCountDetail',this.data.sendData).then(res =>{
      if(res.status === 200){
        this.setData({
          Alldata:res.data
        })
      }
    })
  },
  chceList(e){
    let r = e.target.dataset.index
    this.setData({
      acindex:r,
    })
    this.data.sendData.type = r
    this.getData()
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
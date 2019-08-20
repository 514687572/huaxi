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
    let usermsg = wx.getStorageSync('userMsg')
    this.data.msgobj = JSON.parse(usermsg)
    this.data.sendData.token = this.data.msgobj.token
    this.getData()
  },
  getData(){
    app.getajax.get('/user/api/v1/childDetail',this.data.sendData).then(res =>{
      if(res.status === 200){
        this.setData({
          Alldata:res.data
        })
      }
    })
  },
  showCh(e){
    let ins = e.currentTarget.dataset.index
    let dataall = this.data.Alldata
    if(dataall.list[ins].showch == undefined || dataall.list[ins].showch == false){
      dataall.list[ins].showch = true
    }else{
      dataall.list[ins].showch = false
    }
    this.setData({
      Alldata:dataall
    })
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
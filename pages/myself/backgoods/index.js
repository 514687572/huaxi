// pages/myself/backgoods/index.js
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
      token:'',
      type:0
    },
    Alldata:{},
    acindex:0
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
  chceList(e){
    this.setData({
      acindex:e.target.dataset.index
    })
    this.data.sendData.type = e.target.dataset.index
    this.getData()
  },
  choosBtn(e){
    let podata = {}
    podata.orderRefundLogId = e.target.dataset.code
    podata.operator = e.target.dataset.types
    podata.token = this.data.msgobj.token
    app.postajax.post('/user/api/v1/refund/operator',podata).then(res =>{
      if(res.status === 200){
        wx.showToast({
          title: '操作成功',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
        setTimeout(() => {
          this.getData()
        }, 1500);  
      }
    })
  },
  getData(){
    this.data.Alldata = {}
    app.getajax.get('/user/api/v1/refund/list',this.data.sendData).then(res =>{
      if(res.status === 200){
        this.setData({
          Alldata:res.data
        })  
      }
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
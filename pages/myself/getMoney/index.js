// pages/myself/getMoney/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgobj:{},
    sendData:{
      token:''
    },
    Alldata:{},
    maxprice:0,
    types:'',
    getpics:'',
    alldatas:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      maxprice :options.price
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  getpice(e){
    this.setData({
      getpics:e.detail.value
    })
  },
  onReady: function () {
    let usermsg = wx.getStorageSync('userMsg')
    this.data.msgobj = JSON.parse(usermsg)
    this.data.sendData.token = this.data.msgobj.token
    this.getAlldata()
  },
  getAlldata(){
    let tokens = {
      token: ''
    }
    tokens.token = this.data.msgobj.token 
    app.getajax.get('/user/api/v1/getUserCount',tokens).then(res =>{
      if(res.status === 200){
        console.log(this.data.msgobj)
        this.setData({
          alldatas: res.data
        })
      }
    })
  },
  allpas(){
    this.setData({
      getpics:this.data.maxprice
    })
  },
  getData(){
    let regprice = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
    if(!regprice.test(this.data.getpics) || this.data.getpics > this.data.maxprice || this.data.getpics < 0){
      wx.showToast({
        title: '请输入小于或等于您总收益的正确金额',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    if(this.data.types ==''){
      wx.showToast({
        title: '请选择提现收款方式',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    this.data.sendData.cash = this.data.getpics
    this.data.sendData.type = this.data.types
    app.postajax.post('/user/api/v1/applyCash',this.data.sendData).then(res =>{
      if(res.status === 200){
        wx.showToast({
          title: '提现申请成功',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        }, 1500); 
      }
    })
  },
  chooset(e){
    this.setData({
      types: e.detail.value
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
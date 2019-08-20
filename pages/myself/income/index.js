// pages/myself/income/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgobj:{},
    sendData:{
      type: 1,
      token:''
    },
    acindex:1,
    textprice:'总收入',
    textarr:['我的佣金金额','我的本金金额','我的提成金额','我的分红金额'],
    Alldata:{},
    alldatas:{}
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
    this.getAlldata()
  },
  getData(){
    app.getajax.get('/user/api/v1/incomeList',this.data.sendData).then(res =>{
      if(res.status === 200){
        this.setData({
          Alldata:res.data
        })
      }
    })
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
  gogPay(){
    if(this.data.Alldata.totalIncome <= 0){
      wx.showToast({
        title: '暂无可提现金额',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return
    }
    if(this.data.alldatas.bindAliPay==false && this.data.alldatas.bindCard==false && this.data.alldatas.bindWx==false){
      wx.showToast({
        title: '请先去个人中心至少绑定一种提现收款账户',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return
    }
    wx.navigateTo({
      url: '../getMoney/index?price='+this.data.Alldata.totalIncome+'',
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  chceList(e){
    let r = e.target.dataset.index
    // let rtxt = this.data.textarr[r-1]
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
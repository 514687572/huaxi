// pages/myself/Apply/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apData:{},
    sendData:{
      phone: '',
      token:''
    },
    msgobj:{},
    second:60,
    issecond:false
  },
  Naveurl: function(e){
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
     url: url
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //提交数据
  submincon: function(e){
    let spdata = e.detail.value
    let regcard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
    spdata.token = this.data.sendData.token
    if(spdata.applyName ==''){
      wx.showToast({
        title: '请输入正确申请人姓名！',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      }); 
      return
    }
    if(spdata.phone ==''){
      wx.showToast({
        title: '请输入正确申请人电话！',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      }); 
      return
    }
    if(spdata.validCode ==''){
      wx.showToast({
        title: '请输入正确验证码！',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      }); 
      return
    }
    if(!regcard.test(spdata.idCard)){
      wx.showToast({
        title: '请输入正确的身份证号码！',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });   
      return
    }
    app.postajax.post('/user/api/v1/applyForAgent',spdata).then(res =>{
      if (res.status === 200) {
        wx.showToast({
          title: '申请代理成功',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500);  
      }
    })
  },
  //获取手机号
  phonec: function(e){
      this.data.sendData.phone = e.detail.value
  },
  countdown () {
    let that = this
    let second = this.data.second
    if (second == 0) {
      that.setData({
        second: 60,
        issecond: false
      })
      return
    }
    that.setData({
      issecond: true
    })
    let time = setTimeout( () => {
      that.setData({
        second: second - 1,
      })
      that.countdown(that)
    }, 1000)
  },
  //验证码
  getCode: function(){
    let that = this
    if(that.data.sendData.phone == ''){
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result) => {
          
        },
        fail: () => {},
        complete: () => {}
      });
        
      return
    }
    app.postajax.post('/user/api/v1/sendCode',that.data.sendData).then(res =>{
      if(res.status === 200){
        wx.showToast({
          title: '获取验证码成功',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: (result) => {
            that.countdown()
          },
          fail: () => {},
          complete: () => {}
        });
          
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let usermsg = wx.getStorageSync('userMsg')
    this.data.msgobj = JSON.parse(usermsg)
    this.data.sendData.token = this.data.msgobj.token
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
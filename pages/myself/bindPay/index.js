// pages/myself/bindPay/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgobj:{},
    Alldata:{},
    types: '',
    bankId: '',
    values:'',
    bankList: [{
      name:'工商银行',
      code:1002
    },{
      name:'农业银行',
      code:1005
    },{
      name:'中国银行',
      code:1026
    },{
      name:'中国建设银行',
      code:1003
    },{
      name:'招商银行',
      code:1001
    },{
      name:'中国邮政储蓄银行',
      code:1066
    },{
      name:'交通银行',
      code:1020
    },{
      name:'浦发银行',
      code:1004
    },{
      name:'民生银行',
      code:1006
    },{
      name:'兴业银行',
      code:1009
    },{
      name:'平安银行',
      code:1010
    },{
      name:'中信银行',
      code:1021
    },{
      name:'华夏银行',
      code:1025
    },{
      name:'广发银行',
      code:1027
    },{
      name:'光大银行',
      code:1022
    },{
      name:'北京银行',
      code:4836
    },{
      name:'宁波银行',
      code:1056
    },{
      name:'上海银行',
      code:1024
    }
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      types:options.type
    })
    if(options.type == 1){
      wx.setNavigationBarTitle({
        title: '绑定微信',
      });  
    }else if(options.type == 2){
      wx.setNavigationBarTitle({
        title: '绑定支付宝',
      });  
    }else if(options.type == 3){
      wx.setNavigationBarTitle({
        title: '绑定银行卡',
      });  
    }
   
  },
  bindChange: function(e) {
    const val = e.detail.value
    this.setData({
      values: this.data.bankList[val].name,
    })
    this.setData({
      bankId: this.data.bankList[val].code,
    })
  },
  findBink(type){
    let that = this
    let spdata = {}
    spdata.token = this.data.msgobj.token
    spdata.type = type
    app.getajax.get('/user/api/v1/findBind',spdata).then(res =>{
      if(res.status === 200){
        that.setData({
          Alldata:res.data
        })
        if(this.data.types == 3){
          let arrnew = that.data.bankList.filter(y => y.code == res.data.openBranch)
          that.setData({
            values:arrnew[0].name,
            bankId:arrnew[0].code
          })
        }  
      }
    })
  },
  //提交数据
  submincon: function(e){
    let spdata = e.detail.value
    spdata.token = this.data.msgobj.token
    spdata.type = this.data.types
    if(spdata.type == 3){
      spdata.openBranch = this.data.bankId
    }
    if(spdata.type == 2 && spdata.account == ''){
      wx.showToast({
        title: '请填写支付宝账号',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    if(spdata.type == 1 && spdata.account == ''){
      wx.showToast({
        title: '请填写微信号',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    if(spdata.type == 3 && spdata.name == ''){
      wx.showToast({
        title: '请填写持卡人实名',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    if(spdata.type == 3 && spdata.account == ''){
      wx.showToast({
        title: '请填写银行卡卡号',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    if(spdata.type == 3 && spdata.openBranch == ''){
      wx.showToast({
        title: '请选择开户银行',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    app.postajax.post('/user/api/v1/bind',spdata).then(res =>{
      if (res.status === 200) {
        wx.showToast({
          title: '绑定成功',
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let usermsg = wx.getStorageSync('userMsg')
    this.data.msgobj = JSON.parse(usermsg)
    this.findBink(this.data.types)
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
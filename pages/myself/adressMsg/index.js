// pages/myself/adressMsg/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['请选择所在地区', '',''],
    customItem: '',
    msgobj:{},
    sendData:{
      token:''
    },
    Alldata:{},
    adddata:{
      address: "",
      area: "",
      city: "",
      orderAddressId: "",
      prod: "",
      receiverName: "",
      receiverPhone: "",
      token:''
    },
    aressdata:{},
    exitadress:false,
    adreId:''
  },
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        exitadress: true,
        adreId: options.id
      })
    }else{
      this.setData({
        exitadress: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let usermsg = wx.getStorageSync('userMsg')
    this.data.msgobj = JSON.parse(usermsg)
    this.data.sendData.token = this.data.msgobj.token
    this.data.adddata.token = this.data.msgobj.token
    // this.getData()
  },
  nameget(e){
    let names = "adddata.receiverName"
    this.setData({
      [names]:e.detail.value
    })
  },
  phoneget(e){
    let names = "adddata.receiverPhone"
    this.setData({
      [names]:e.detail.value
    })
  },
  adressget(e){
    let names = "adddata.address"
    this.setData({
      [names]:e.detail.value
    })
  },
  Deladdadres(){
    let deldata = {}
    deldata.orderAddressId = this.data.adreId
    app.postajax.post('/user/api/v1/removeAddress?orderAddressId='+this.data.adreId+'',deldata).then(res =>{
      if(res.status === 200){
        wx.showToast({
          title: '删除地址成功',
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
  getData(){
    app.getajax.get('/user/api/v1/addresses',this.data.sendData).then(res =>{
      if(res.status === 200){
        this.setData({
          Alldata:res.data
        })
        if(this.data.adreId){
          let arrad = this.data.Alldata.filter(y => y.receiverAddressId == this.data.adreId)
          this.setData({
            aressdata:arrad[0],
          })
          let adarr = []
          adarr[0] = arrad[0].pro
          adarr[1] = arrad[0].city
          adarr[2] = arrad[0].area
          this.setData({
            region:adarr,
          })
          this.data.adddata.orderAddressId = arrad[0].receiverAddressId
          this.data.adddata.receiverName = arrad[0].receiverName
          this.data.adddata.receiverPhone = arrad[0].phone
          this.data.adddata.address = arrad[0].detailAddress
        }  
      }
    })
  },
  addadres(){
    this.data.adddata.prod = this.data.region[0]
    this.data.adddata.city = this.data.region[1]
    this.data.adddata.area = this.data.region[2]
    if(this.data.adddata.receiverName == ''){
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });    
      return
    }
    if(this.data.adddata.receiverPhone == ''){
      wx.showToast({
        title: '请输入收货人手机号',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });    
      return
    }
    if(this.data.adddata.prod == '' || this.data.adddata.city == ''){
      wx.showToast({
        title: '请选择收货地区',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });    
      return
    }
    if(this.data.adddata.address == ''){
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });    
      return
    }
    app.postajax.post('/user/api/v1/editAddress',this.data.adddata).then(res =>{
      if(res.status){
        wx.showToast({
          title: '保存地址成功',
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
  // getData(){
  //   app.getajax.get('/user/api/v1/addresses',this.data.sendData).then(res =>{
  //     if(res.status === 200){
  //       this.setData({
  //         Alldata:res.data
  //       })
  //     }
  //   })
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let usermsg = wx.getStorageSync('userMsg')
    this.data.msgobj = JSON.parse(usermsg)
    this.data.sendData.token = this.data.msgobj.token
    this.getData()
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
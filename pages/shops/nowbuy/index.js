// pages/shops/nowbuy/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgobj: {},
    sendData: {
      index: 1,
      size: 999,
      token: ''
    },
    Alldata: {},
    adressdta: {},
    linsadress:{},
    adresslen: false,
    Codes: '',
    dedata: {},
    paydata: {},
    payover: '',
    visible1: false,
    freight:'',
    allprice: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      Codes: options.ccode
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //获取运费
  getFreight(i,r){
    let addata = {}
    addata.orderId = i
    addata.addressId = r
    app.getajax.get('/order/api/v1/order/calcFreight',addata).then(res =>{
      this.setData({
        freight: res.data
      })
      this.getDeailmsg()
    })
  },
  //获取地址
  getData() {
    app.getajax.get('/user/api/v1/addresses', this.data.sendData).then(res => {
      if (res.status === 200) {
        this.setData({
          Alldata: res.data
        })
        if(this.data.Alldata.length > 0){
          this.setData({
            adresslen: true
          })
          let adress = {}
          if(this.data.dedata.orderAddressId!= undefined && this.data.dedata.orderAddressId!= '' && this.data.dedata.orderAddressId!= 0){
             adress = this.data.Alldata.filter(y => y.receiverAddressId == this.data.dedata.orderAddressId)[0]
          }else{
             adress = this.data.Alldata[0]
          }
          console.log(adress)
          this.setData({
            adressdta: adress
          })
          this.data.paydata.receiverAddressId = adress.receiverAddressId
          this.getFreight(this.data.Codes,adress.receiverAddressId)
        }else{
          this.setData({
            adresslen: false
          })
        }
      }
    })
  },
  showAdress(){
    this.setData({
      visible1: true
    })
  },
  chooseexpss(e){
    let chooarr = this.data.Alldata.filter(y =>y.receiverAddressId == e.detail.value)
    this.setData({
      linsadress:chooarr
    })
  },
  //更换收货地址
  suruser(){
    this.setData({
      visible1: false
    })
    this.setData({
      adressdta:this.data.linsadress[0]
    })
    this.data.paydata.receiverAddressId = this.data.adressdta.receiverAddressId
    this.getFreight(this.data.Codes,this.data.adressdta.receiverAddressId)
  },
  //关闭地址选择弹出
  closeuser(){
    this.setData({
      visible1: false
    })
  },
  //改变库存数量
  chancenum(e){
    let podata = {}
    podata.storeCount = e.detail.value
    if(podata.storeCount === ''){
      debugger
      wx.showToast({
        title: '请输入库存数量',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      // this.getDeailmsg()
      return
    }
    podata.productOrderSnapshotId = e.currentTarget.dataset.cid
    app.postajax.post('/order/api/v1/order/modifyStore',podata).then(res =>{
      if(res.status === 200){
        this.getDeailmsg()
      }
    })
  },
  //获取订单
  getDeailmsg() {
    // 
    let getorder = {}
    getorder.orderId = this.data.Codes
    getorder.token = this.data.msgobj.token
    app.getajax.get('/order/api/v1/orderDetail', getorder).then(res => {
      if (res.status === 200) {
        this.setData({
          dedata: res.data,
          payover: res.data.orderStatus
        })

        let orderids = 'paydata.orderId'
        this.setData({
          [orderids]: res.data.orderId
        })
       
        if(this.data.freight != undefined || this.data.freight != '' || this.data.dedata.totalAmount!= undefined ){
          let picea = (Number(this.data.dedata.totalAmount) - this.data.freight).toFixed(2);
          this.setData({
            allprice: picea
          })
        }else{
          this.setData({
            allprice: this.data.dedata.totalAmount
          })
        }
      }
    })
  },
  getDeailmsga() {
    // 
    let getorder = {}
    getorder.orderId = this.data.Codes
    getorder.token = this.data.msgobj.token
    app.getajax.get('/order/api/v1/orderDetail', getorder).then(res => {
      if (res.status === 200) {
        this.setData({
          dedata: res.data,
          payover: res.data.orderStatus
        })
        let orderids = 'paydata.orderId'
        this.setData({
          [orderids]: res.data.orderId
        })
       
        if(this.data.freight != undefined || this.data.freight != '' || this.data.dedata.totalAmount!= undefined ){
          let picea = (Number(this.data.dedata.totalAmount) - this.data.freight).toFixed(2);
          this.setData({
            allprice: picea
          })
        }else{
          this.setData({
            allprice: this.data.dedata.totalAmount
          })
        }
        this.getData()
      }
    })
  },
  getDeailmsgs() {
    // 
    let getorder = {}
    getorder.orderId = this.data.Codes
    getorder.token = this.data.msgobj.token
    app.getajax.get('/order/api/v1/orderDetail', getorder).then(res => {
      if (res.status === 200) {
        this.setData({
          dedata: res.data,
          payover: res.data.orderStatus
        })
        let orderids = 'paydata.orderId'
        this.setData({
          [orderids]: res.data.orderId
        })
        if (this.data.payover == 2) {
          wx.showToast({
            title: '支付成功，即将返回首页',
            icon: 'none',
            duration: 1500,
            mask: false,
          });
          setTimeout(() => {
            wx.reLaunch({
              url: '../../shops/index/index',
              success: (result) => {

              },
            });
          }, 1500);
        }else{
         
            wx.showToast({
              title: '支付失败，请前往个人中心-订单列表重新支付',
              icon: 'none',
              duration: 1500,
              mask: false,
            });
            setTimeout(() => {
              wx.reLaunch({
                url: '../../myself/index',
                success: (result) => {
                },
              });
            }, 2000);
         
        }
      }
    })
  },
  //zhifu
  payNows() {
    if(!this.data.adresslen){
      wx.showToast({
        title: '请先添加地址',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });     
      return
    }
    app.postajax.post('/order/api/v1/pay', this.data.paydata).then(res => {
      if (res.status === 200) {
        this.setData({
          paydata: res.data
        })
        let paydatas = JSON.parse(JSON.stringify(res.data))
        wx.requestPayment({
          timeStamp: paydatas.timeStamp,
          nonceStr: paydatas.nonceStr,
          package: paydatas.package,
          signType: paydatas.signType,
          paySign: paydatas.sign,
          success: (result) => {
            if (result.status === 200) {
            }
          },
          fail: (error) => {
            console.log(error)
          },
          complete: (msg) => {
            this.getDeailmsgs()
            // for (let index = 0; index <= 10; index++) {
            //   this.getDeailmsgs()
             
            //   if (index == 10) {
            //     wx.showToast({
            //       title: '支付失败，请前往个人中心-订单列表重新支付',
            //       icon: 'none',
            //       duration: 1500,
            //       mask: false,
            //     });
            //     setTimeout(() => {
            //       wx.reLaunch({
            //         url: '../../myself/index',
            //         success: (result) => {
            //         },
            //       });
            //     }, 2000);
            //   }
            // }
          }
        });

      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let usermsg = wx.getStorageSync('userMsg')
    this.data.msgobj = JSON.parse(usermsg)
    this.data.sendData.token = this.data.msgobj.token
    this.data.paydata.token = this.data.msgobj.token
    this.getDeailmsga()
    
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
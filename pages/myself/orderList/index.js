// pages/myself/orderList/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    acindex:0,
    msgobj:{},
    sendData:{
      type: 0,
      token:'',
      index: 1,
      size:99999
    },
    Alldata:{},
    orderIds: '',
    targetTime:0,
    myFormat: ['时', '分', '秒'],
    visible1:false,
    visible2:false,
    visible3:false,
    visiblewl:false,
    wldata:{},
    backcount: 1,
    maxCount:1,
    backType:0,
    canback:0,
    backdata:{},
    backcont:'',
    cachek:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.type !== undefined || options.type !== ''){
      this.setData({
        acindex : options.type
      })
      this.data.sendData.type = options.type
    }
    
    this.setData({
      targetTime: new Date().getTime() + 6430000,
  });
  },
  chancenum(e){
    this.setData({
      backcount: e.detail.value
    })
  },
  backcont(e){
    this.setData({
      backcont:e.detail.value
    })
  },
  handleClose(){
    this.setData({
      visible1 : false,
      visible2 : false,
      visible3 : false,
      visiblewl : false
    })
  },
  handleOpen4(e){
    this.setData({
      orderIds: e.target.dataset.code
    })
    this.getwlMsg()
    this.setData({
      visiblewl : true
    })
    
  },
  getwlMsg(){
    let candata = {}
    candata.orderId = this.data.orderIds
    app.getajax.get('/order/api/v1/getExpressInfo',candata).then(res =>{
      if(res.status === 200){
         this.setData({
          wldata:res.data[0]
         })
      }
    })
  },
  handleOpen1(e){
    this.setData({
      orderIds: e.target.dataset.code
    })
    this.setData({
      visible1 : true
    })
  },
  handleOpen2(e){
    this.setData({
      orderIds: e.target.dataset.code
    })
    this.setData({
      visible2 : true
    })
  },
  handleOpen3(e){
    let indexs = e.target.dataset.indexs
    let indexss = e.target.dataset.indexss
    this.setData({
      orderIds: e.target.dataset.code,
      visible3 : true,
      backcont : '',
      backdata : this.data.Alldata.data[indexs].productOrderSnapshots[indexss]
    })
    this.setData({
      backcount: 0,
      canback:0,
      cachek:false,
      backType:''
    })
  },
  checkboxChange(e){
    let val = e.detail.value
    let canback = 0
    this.setData({
      backType:val
    })
    console.log(this.data.backdata)
    let maxconut = 0
    if(val == 1){
      //收货退货
      if(this.data.backdata.count > this.data.backdata.allCount){
        maxconut = this.data.backdata.allCount
      }else{
        maxconut = this.data.backdata.count - this.data.backdata.storeCount - this.data.backdata.refundCount  
      }
    }else if(val == 2){
      //库存退货
      if(this.data.backdata.storeCount > this.data.backdata.allStoreCount){
        maxconut = this.data.backdata.allStoreCount
      }else{
        maxconut = this.data.backdata.storeCount - this.data.backdata.refundStoreCount 
      }
    }
    this.setData({
      canback: maxconut
    })
    console.log(maxconut)
    if(maxconut <= 0){
      wx.showToast({
        title: '库存不足，无法退货',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
    }
    this.setData({
      maxCount : maxconut
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  chceList(e){
    this.setData({
      acindex:e.target.dataset.index
    })
    this.data.sendData.type = e.target.dataset.index
    this.getData()
  },
  gopay(e){
    this.data.orderIds = e.target.dataset.code
    let url = e.currentTarget.dataset.url +"?ccode=" + this.data.orderIds + ""
    wx.navigateTo({
    url: url
    })
  },
  goCancel(e){
    // this.data.orderIds = e.target.dataset.code
    let candata = {}
    candata.token = this.data.msgobj.token
    candata.orderId = this.data.orderIds
    app.postajax.post('/order/api/v1/cancelOrder',candata).then(res =>{
      this.setData({
        visible1 : false
      })
      if(res.status === 200){
        wx.showToast({
          title: '取消订单成功',
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
  sureGet(e){
   // this.data.orderIds = e.target.dataset.code
    let candata = {}
    candata.token = this.data.msgobj.token
    candata.orderId = this.data.orderIds
    app.postajax.post('/order/api/v1/confirmOrder',candata).then(res =>{
      this.setData({
        visible2 : false
      })
      if(res.status === 200){
        wx.showToast({
          title: '确认收货成功',
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
  reBack(e){
    if(!this.data.backType){
      wx.showToast({
        title: '请选择退货类型',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    if(this.data.maxCount <= 0){
      wx.showToast({
        title: '库存不足，无法退货',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    if(this.data.backcount <= 0){
      wx.showToast({
        title: '请选择大于0的退货数量',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    let candata = {}
    candata.token = this.data.msgobj.token
    candata.orderId = this.data.orderIds
    candata.orderDetailId = this.data.backdata.orderDetailId
    candata.count = this.data.backcount
    candata.refundType = this.data.backType
    candata.refundReason = this.data.backcont
    app.postajax.post('/order/api/v1/refundOrder',candata).then(res =>{
      if(res.status === 200){
        this.setData({
          visible3 : false
        })
        wx.showToast({
          title: '退货申请成功',
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
  gocomment(e){
    this.setData({
      orderIds: e.target.dataset.code
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let usermsg = wx.getStorageSync('userMsg')
    this.data.msgobj = JSON.parse(usermsg)
    this.data.sendData.token = this.data.msgobj.token
    this.getData()
    this.setData({
      visible1 : false,
      visible2 : false,
      visible3 : false
    })
  },
  getData(){
    this.data.Alldata = {}
    app.getajax.get('/order/api/v1/orderList',this.data.sendData).then(res =>{
      if(res.status === 200){
        this.setData({
          Alldata:res.data
        })
        let newtime = new Date().getTime();
        for (let index = 0; index < this.data.Alldata.data.length; index++) {
          let element = this.data.Alldata.data[index];
          let addtime = 0.5 * 60 * 60 * 1000;
          let tim = parseInt(element.orderTimestamp)*1000 
          let tims = tim + addtime    
          let timeas = "Alldata.data["+index+"].orderTimestamp" 
          let timeass = "Alldata.data["+index+"].overTiem" 
          if(tims<=newtime){
            this.setData({
              [timeass]: true
            })
            if(element.orderStatus === 1){
              this.setData({
                orderIds: element.orderId
              })
              this.goCancel()
            }
          }
          this.setData({
            [timeas]: tims
          })
         // debugger
        }
        console.log(this.data.Alldata)
      }
    })
  },
  myLinsterner(e) {
    let paydata = this.data.Alldata
    for (let index = 0; index < paydata.data.length; index++) {
      const element = paydata.data[index];
      if(element.orderId === e.target.dataset.cid){
        element.overTiem = true
      }
    }
    this.setData({
      Alldata:paydata
    })
    // this.setData({
    //     status: '结束'
    // });
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
    this.setData({
      clearTimer: true
    });
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
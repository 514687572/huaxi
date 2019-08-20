const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgobj: {},
    sendData: {
      token: '',
      index: 1,
      size: 999
    },
    Alldata: {},
    visible1: false,
    visible2: false,
    ardeassdata:{},
    expressdata: [{
      id: 7,
      name: '德邦快递',
      code: 'DBL',
      check: false
    },{
      id: 1,
      name: '顺丰速运',
      code: 'SF',
      check: false
    }, {
      id: 2,
      name: '百世快递',
      code: 'HTKY',
      check: false
    }, {
      id: 3,
      name: '中通快递',
      code: 'ZTO',
      check: false
    }, {
      id: 4,
      name: '申通快递',
      code: 'STO',
      check: false
    }, {
      id: 5,
      name: '韵达速递',
      code: 'YD',
      check: false
    }, {
      id: 6,
      name: '天天快递',
      code: 'HHTT',
      check: false
    }, {
      id: 6,
      name: '城市100',
      code: 'CITY100',
      check: false
    }],
    current: '',
    orrids : '',
    inptext:''
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let usermsg = wx.getStorageSync('userMsg')
    this.data.msgobj = JSON.parse(usermsg)
    this.data.sendData.token = this.data.msgobj.token
    this.getData()
  },
  handleOpen1(e) {
    this.setData({
      visible1: true,
      inptext:''
    });
    this.setData({
      orrids:e.target.dataset.code
    })
    if(this.data.Alldata.data && this.data.Alldata.data.length > 0){
      let areceiverAddress = this.data.Alldata.data[e.target.dataset.indexs].receiverAddress
      if(areceiverAddress){
        this.setData({
          ardeassdata: areceiverAddress
        })
      }
    }
  },
  chooseexp(e) {
    this.setData({
      current: e.detail.value
    });
  },
  handleClose1() {
    this.setData({
      visible1: false
    });
  },
  handleClose(){
    this.setData({
      visible2: false
    });
  },
  getData() {
    app.getajax.get('/user/api/v1/findSendLog', this.data.sendData).then(res => {
      if (res.status === 200) {
        this.setData({
          Alldata: res.data,
        })
        console.log(this.data.Alldata)
      }
    })
  },
  backgoods(e) {
    this.setData({
      visible2: true
    });
    this.setData({
      orrids:e.target.dataset.code
    })
   
  },
  otherGive(e){
    this.setData({
      orrids:e.target.dataset.code
    })
    let backdata = {}
    backdata.orderAgentLogId = this.data.orrids
    backdata.token = this.data.msgobj.token
    // backdata.expressCode = this.data.current
    app.postajax.post('/user/api/v1/platformSend', backdata).then(res => {
      if (res.status === 200) {
        this.getData()
      }  
    })
  },
  bindInp(e){
    this.setData({
      inptext:e.detail.value
    })
  },
  givegoods(){
    let backdata = {}
    backdata.orderAgentLogId = this.data.orrids
    backdata.token = this.data.msgobj.token
    backdata.expressCode = this.data.current
    backdata.expressNo = this.data.inptext
    if(!backdata.expressNo){
      wx.showToast({
        title: '请输入快递单号',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    app.postajax.post('/user/api/v1/confirmSend', backdata).then(res => {
      if (res.status === 200) {
        this.getData()
      }  
    })
    this.setData({
      visible1: false
    });
  },
  backgoodss(){
    let backdata = {}
    backdata.orderAgentLogId = this.data.orrids
   backdata.token = this.data.msgobj.token
    app.postajax.post('/user/api/v1/failSend', backdata).then(res => {
      if (res.status === 200) {
        this.getData()
      }
    })
    this.setData({
      visible2: false
    });
  },
  givegoogs(e) {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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
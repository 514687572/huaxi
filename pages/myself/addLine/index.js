// pages/myself/addLine/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tychek: false,
    visible1:false,
    visible2:false,
    visible3:false,
    apData:{},
    sendData:{
      phone: '',
      token:''
    },
    listobj:{
      token: '',
      index: 1,
      size: 999
    },
    msgobj:{},
    date: '',
    leavedata:{},
    userlist:{},
    datalist:{},
    chodata:{
      applyUserId:'',//申请人
      applyLevelId:'',//申请人级别
      parentLevelId:'',//上级id
      sunLevelId: '',//下级id
      productId:'',
      token:''
    },
    namesdata:{
      lename1:'选择申请人级别',
      lename2:'选择申请人上级代理',
      lename3:'选择申请人下级代理',
      lename4:'选择申请产品',
      lename5:'选择申请人'
    },
    chletype:'',
    current: {},
    currents:{},
    currentss:{}
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  handleClose1() {
    this.setData({
      visible1: false
    });
    this.setData({
      tychek: false
    });
  },
  handleClose2() {
    this.setData({
      visible2: false
    });
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
    this.getleave()
    this.getUserlist()
    this.getShoplist()
  },
    //提交数据
  submincon: function(e){
    if(this.data.userlist.length <1){
      wx.showToast({
        title: '您没有下级人员，无法申请线下交易',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
    }
    if(this.data.chodata.applyUserId == ''){
      wx.showToast({
        title: '请选择申请人',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    this.data.chodata.token = this.data.msgobj.token
    let spdata = e.detail.value
    let podata =  Object.assign(spdata,this.data.chodata)
    app.postajax.post('/user/api/v1/applyOrderOffline', podata).then(res => {
      if (res.status === 200) {
        wx.showToast({
          title: '添加成功',
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
    console.log(podata)
  },
  //hupqu
  getleave(){
    let backdata = {}
    app.getajax.get('/user/api/v1/allLevels', backdata).then(res => {
      if (res.status === 200) {
       this.setData({
         leavedata : res.data
       })
       console.log(this.data.leavedata)
      }
    })
  },
  openchLeav(e){
    this.setData({
      chletype : e.currentTarget.dataset.type
    })
    this.setData({
      visible1: true
    });
  },
  chooseexp(e) {
    // this.TabchekSum = this.TabList.filter(y=>y.checked == true).length
    let chooarr = this.data.leavedata.filter(y =>y.userLevelId == e.detail.value)
    
    if (chooarr.length > 0){
      this.setData({
        current:chooarr
      })
    
    }
  },
  chooseexps(e) {
    // this.TabchekSum = this.TabList.filter(y=>y.checked == true).length
    let chooarr = this.data.datalist.filter(y =>y.productId == e.detail.value)
    if (chooarr.length > 0){
      this.setData({
        currents:chooarr
      })
    
    }
  },
  chooseexpss(e) {
    // this.TabchekSum = this.TabList.filter(y=>y.checked == true).length
    let chooarr = this.data.userlist.filter(y =>y.userId == e.detail.value)
    if (chooarr.length > 0){
      this.setData({
        currentss:chooarr
      })
     
    }
  },
  openuser(){
    this.setData({
      visible3: true
    });
  },
  closeuser(){
    this.setData({
      visible3: false
    });
  },
  suruser(){
    let names = 'namesdata.lename5'
    let tids = 'chodata.applyUserId'
     this.setData({
      [names]: this.data.currentss[0].userName
    })
    this.setData({
      [tids]: this.data.currentss[0].userId
    })
    this.setData({
      visible3:false
    })
  },
  sureshop(){
    let names = 'namesdata.lename4'
    let tids = 'chodata.productId'
     this.setData({
      [names]: this.data.currents[0].name
    })
    this.setData({
      [tids]: this.data.currents[0].productId
    })
    this.setData({
      visible2:false
    })
  },
  openshop(){
    this.setData({
      visible2: true
    });
  },
  sureLeave(){
    // let names="";
    // let tids="";
    console.log(this.data.chletype)
    if(this.data.chletype == 1){
  
       let names = 'namesdata.lename1'
      let tids = 'chodata.applyLevelId'
       this.setData({
        [names]: this.data.current[0].levelName
      })
      this.setData({
        [tids]: this.data.current[0].userLevelId
      })
      
    }else if(this.data.chletype == 2){
      let names = 'namesdata.lename2'
      let tids = 'chodata.parentLevelId'
       this.setData({
        [names]: this.data.current[0].levelName
      })
      this.setData({
        [tids]: this.data.current[0].userLevelId
      })   
    }else if(this.data.chletype == 3){
      let names = 'namesdata.lename3'
      let tids = 'chodata.sunLevelId'  
       this.setData({
        [names]: this.data.current[0].levelName
      })
      this.setData({
        [tids]: this.data.current[0].userLevelId
      })
    }
    this.setData({
      visible1:false
    })
    this.setData({
      tychek:false
    })
  },
  //user
  getUserlist(){
    let backdata = {}
    backdata.token = this.data.msgobj.token
    app.getajax.get('/user/api/v1/sunUsers', backdata).then(res => {
      if (res.status === 200) {
       this.setData({
        userlist : res.data
       })
       console.log(this.data.userlist)
      }
    })
  },
  getShoplist(){
    if(this.data.msgobj){
     this.data.listobj.token = this.data.msgobj.token
    }
    app.getajax.get('/mall/api/v1/products',this.data.listobj).then(res =>{
      this.setData({
        datalist: res.data.data
      })
      console.log(this.data.datalist)
    })
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
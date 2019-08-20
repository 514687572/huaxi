// pages/myself/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgobj:{},
    alldata:{},
    imgurl:'',
    Isand:false,
    showTc:false,
    dilcont:'亲，首批拿货50盒或累计拿货满50盒方可申请代理，加油哦！或致电400-6979-028咨询哦！',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  showZc(){
    this.setData({
      showTc: true
    })
    wx.hideTabBar({
      animation: false,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  closeTc(){
    this.setData({
      showTc: false
    })
    wx.showTabBar({
      animation: false,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  Naveurl: function(e){
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
     url: url
    })
  },
  Naveurlas: function(){
    // let urls = 'https://oss.huaxiok.com/imgs/qroA2sQ0aR2KuJYe-zezlDx67vbB7U.jpg'

    let reg = /^(https:)/
    if(this.data.Isand){
      let newurl = this.data.imgurl
      newurl = newurl.replace(reg,'http:')
      this.setData({
        imgurl:newurl
      })
    }
    wx.previewImage({
      current: this.data.imgurl,
      urls: [this.data.imgurl],
      // current: urls,
      // urls: [urls],
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
  },
  //获取各项参数
  getimg(){
    let tokens = {
      token: ''
    }
    tokens.token = this.data.msgobj.token 
    app.getajax.get('/user/api/v1/selfQr',tokens).then(res =>{
      if(res.status === 200){
        this.setData({
          imgurl: res.data
        }) 
      }
    })
  },
  getAlldata(){
    let tokens = {
      token: ''
    }
    tokens.token = this.data.msgobj.token 
   // tokens.token = 'oA2sQ0aR2KuJYe-zezlDx67vbB7U'
    app.getajax.get('/user/api/v1/getUserCount',tokens).then(res =>{
      if(res.status === 200){
       // console.log(this.data.msgobj)
        this.setData({
          alldata: res.data
        })
        console.log(this.data.alldata)
      }
    })
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
    wx.showTabBar({
      animation: false,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    let that = this
    let usermsg = wx.getStorageSync('userMsg')
    that.data.msgobj = JSON.parse(usermsg)
    that.setData({
      msgobj:JSON.parse(usermsg)
    })
    that.getAlldata()
    that.getimg()
    //判断机型
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
       if(res.platform == "android"){
        that.setData({
          Isand:true
         })
       }else{
        that.setData({
          Isand:false
         })
       }
      }
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
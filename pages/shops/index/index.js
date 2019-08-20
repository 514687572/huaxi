//index.js
//获取应用实例

const app = getApp()
Page({
  data: {
    canuser: true,
    imgUrls: [
     
    ],
    indicatorDots: true,
    autoplay: true,
    indicator: true,
    interval: 5000,
    duration: 1000,
    //分类
    Typesdata:{},
    listobj:{
      token: '',
      index: 1,
      size: 999
    },
    iszut:false,
    iszuts:false,
    msgobj:{},
    listdata:{},
    datalist:{},
    getscenes:''
  },
  //获取轮播图片
  getBanimg: function(){
    let that = this
    app.getajax.get('/mall/api/v1/banners').then(res => {
      that.setData ({
        imgUrls : res.data
      })
    })
  },
  //商品分类
  getType: function(){
    let that = this
    app.getajax.get('/mall/api/v1/classes').then(res => {
      that.setData ({
        Typesdata: res.data
      })
      console.log(res)
    })
  },
  getaaain(){
    let that = this
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // wx.redirectTo({
            //   url: 'pages/shops/index/index',
            //   success: (result) => {

            //   },
            //   fail: () => {},
            //   complete: () => {}
            // });
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // that.setData({
                //   isUserse: true
                // })
                // 可以将 res 发送给后台解码出 unionId
                console.log(this.data.msgobj)
                let enobj = {
                  encryptedData: res.encryptedData,
                  ivStr: res.iv,
                  unionId: this.data.msgobj.unionId,
                  headImg: this.data.msgobj.headImg,
                  userName: this.data.msgobj.userName,
                  sessionKey: this.data.msgobj.sessionKey,
                  token: this.data.msgobj.token
                }
                console.log(enobj)
                app.postajax.post("/user/api/v1/encrypt", enobj).then(res => {

                })
              }
            })
          } else {
           
            that.isUserse = false    
            // wx.reLaunch({
            //   url: '',
            //   success: (result) => {

            //   },
            //   fail: () => {},
            //   complete: () => {}
            // });

          }
        },
        fail: function (err) {
        
          that.isUserse = false
          // wx.reLaunch({
          //   url: '',
          //   success: (result) => {

          //   },
          //   fail: () => {},
          //   complete: () => {}
          // });
          // that.setData({
          //   isUserse: false
          // })
          // wx.reLaunch({
          //   url: '../index/index',
          //   success: (result) => {

          //   },
          //   fail: () => {},
          //   complete: () => {}
          // });
          // wx.authorize({
          //   scope: 'scope.userInfo',
          //   success: (result) => {
          //     wx.getUserInfo({
          //       success: res => {
          //         // 可以将 res 发送给后台解码出 unionId
          //         let enobj = {
          //           encryptedData: res.encryptedData,
          //           ivStr: res.iv,
          //           sessionKey: usermsg.sessionKey,
          //           token: usermsg.token
          //         }
          //         this.postajax.post("/user/api/v1/encrypt", enobj).then(res => {

          //         })

          //         // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          //         // 所以此处加入 callback 以防止这种情况
          //         if (this.userInfoReadyCallback) {
          //           this.userInfoReadyCallback(res)
          //         }
          //       }
          //     })
          //   },
          //   fail: () => {},
          //   complete: () => {}
          // });
            
          console.log(err)
        }
      })
  },
  getUserInfo(e){
    let detail = e.detail;
    // 如果授权失败（未获取到数据），保持弹框存在
    if(!detail.encryptedData || !detail.iv || !detail.rawData || !detail.signature){
      return
    }
    this.setData({
      canuser: true
    })
    
    wx.showTabBar({
      animation: false,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    this.loadpage()
  },
  //商品列表
  getShoplist(){
    if(this.data.msgobj){
     this.data.listobj.token = this.data.msgobj.token
     //  this.data.listobj.token = 'testToken0001002'
    }
    app.getajax.get('/mall/api/v1/products',this.data.
    listobj).then(res =>{
      this.setData({
        datalist: res.data.data
      })
      if(res.data.data.length > 0 && this.data.iszut){
        this.setData({
          iszuts: true
        })
      }else{
        this.setData({
          iszuts: false
        })
      }
    })
  },
  chooseType(e){
    this.setData({
      iszut:true
    })
    let tyid = e.currentTarget.dataset.typeid
    this.data.listobj.productClassId = tyid
    this.getShoplist()
  },
  navTos: function (e) {
    let url = e.currentTarget.dataset.url
    let cid = e.currentTarget.dataset.cid
    if(cid){
      wx.navigateTo({
        url: `${url}?cId=${cid}`
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    console.log(options,"")
    app.userInfoReadyCallback = res => {
      this.setData({
        canuser:true
      })
      this.setData({
        canuser:app.isUserse
      })
      this.loadpage()
    }
    this.setData({
      canuser:app.isUserse
    })
    this.loadpage()
    //二维码
     let scenes = decodeURIComponent(options.scene)
     this.setData({
      getscenes:scenes
     })
    
  },
  Choosepre(){
    if(this.data.getscenes != 'undefined' && this.data.getscenes!= ''){
      let poobj = {
        pidToken: this.data.getscenes,
        token:''
      }
      poobj.token = this.data.msgobj.token
      app.postajax.post('/user/api/v1/setPid',poobj).then(res => {
          
      }) 
    } 
  },
  loadpage(){
    if(this.data.canuser){
      wx.showTabBar({
        animation: false,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      let usermsg = wx.getStorageSync('userMsg')
      this.data.msgobj = JSON.parse(usermsg)
      this.getBanimg()
      this.getType()
      this.getaaain()
      this.getShoplist()
      this.Choosepre()
    }
  },
  onShow: function () {
    let dataall = {
        token: '',
        index: 1,
        size: 999
    }
    this.data.listobj = dataall
    if(!this.data.canuser){
      wx.hideTabBar({
        animation: false,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
    
    // let usermsg = wx.getStorageSync('userMsg')
    // this.data.msgobj = JSON.parse(usermsg)
    // this.getBanimg()
    // this.getType()
    // this.getShoplist()
    this.loadpage()
  },
  
})

// Page({
//   data: {
//     motto: 'Hello World',
//     userInfo: {},
//     hasUserInfo: false,
//     canIUse: wx.canIUse('button.open-type.getUserInfo')
//   },
//   //事件处理函数
//   bindViewTap: function() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onLoad: function () {
//     if (app.globalData.userInfo) {
//       this.setData({
//         userInfo: app.globalData.userInfo,
//         hasUserInfo: true
//       })
//     } else if (this.data.canIUse){
//       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//       // 所以此处加入 callback 以防止这种情况
//       app.userInfoReadyCallback = res => {
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     } else {
//       // 在没有 open-type=getUserInfo 版本的兼容处理
//       wx.getUserInfo({
//         success: res => {
//           app.globalData.userInfo = res.userInfo
//           this.setData({
//             userInfo: res.userInfo,
//             hasUserInfo: true
//           })
//         }
//       })
//     }
//   },
//   getUserInfo: function(e) {
//     console.log(e)
//     app.globalData.userInfo = e.detail.userInfo
//     this.setData({
//       userInfo: e.detail.userInfo,
//       hasUserInfo: true
//     })
//   }
// })

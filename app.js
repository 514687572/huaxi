//app.js
import request from "./utils/request.js"
let httpajax = require('./utils/request.js')
App({
  onLaunch: function () {
    let usermsg = {}
    let that = this
    // 登录
    wx.login({
     
      success: res => {
        that.getajax.get("/user/api/v1/code2session", {
          jsCode: res.code
        }).then(res => {
          usermsg = res.data
          that.globalData.userInfo = JSON.parse(JSON.stringify(res.data))
          //debugger
    
          wx.setStorage({
            key: 'userMsg',
            data: JSON.stringify(usermsg)
          })
       
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
                    that.isUserse = true
                    // that.setData({
                    //   isUserse: true
                    // })
                    // 可以将 res 发送给后台解码出 unionId
                    let enobj = {
                      encryptedData: res.encryptedData,
                      ivStr: res.iv,
                      sessionKey: usermsg.sessionKey,
                      token: usermsg.token,
                      unionId: usermsg.unionId,
                      headImg: usermsg.headImg,
                      userName: usermsg.userName
                    }
                    that.postajax.post("/user/api/v1/encrypt", enobj).then(res => {

                    })

                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (that.userInfoReadyCallback) {
                      that.isUserse = true
                      // that.setData({
                      //   isUserse: true
                      // })
                      that.userInfoReadyCallback(res)
                    }
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
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

  },
  isUserse: '',
  globalData: {
    userInfo: null,
  },
  getajax: {
    get: httpajax.get
  },
  postajax: {
    post: httpajax.post
  },
  navTo: function (url) {
    wx.navigateTo({
      url: url
    })
  }

})

// pages/myself/Choosepre/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Userlist:[],
    value: [],
    values: "",
    userId:"",
    msgobj:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  getData(){
    let spdata = {}
    spdata.token = this.data.msgobj.token
    app.getajax.get('/user/api/v1/allUsers',spdata).then(res =>{
      if(res.status === 200){
        this.setData({
          Userlist:res.data
        })
      }
    })
  },
  bindChange: function(e) {
    const val = e.detail.value
    console.log(val)
    this.setData({
      values: this.data.Userlist[val].userName,
    })
    this.setData({
      userId: this.data.Userlist[val].userId,
    })
  },
  surePre(){
    let podata = {}
    podata.token = this.data.msgobj.token
    podata.remark = ''
    podata.pid = this.data.userId
    app.postajax.post('/user/api/v1/applyChangeParent',podata).then(res =>{
      if(res.status === 200){
        wx.showToast({
          title: '更换上级成功',
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let usermsg = wx.getStorageSync('userMsg')
    this.data.msgobj = JSON.parse(usermsg)
    this.getData()
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
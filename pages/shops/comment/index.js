// pages/shops/comment/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgobj:{},
    podata:{},
    imgArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.data.podata.orderId = options.id
    } 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  uoimg(){
    let that = this
    wx.chooseImage({
      success (res) {
        const tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '上传中...',
          mask: true,
        });
          
        wx.uploadFile({
          url: 'https://kqyh.huaxiok.com/hxgk/imageUp', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: {
          },
          success (res){
           
            console.log(res)
            if(res.statusCode === 200){
              wx.showToast({
                title: '上传成功',
                icon: 'none',
                image: '',
                duration: 1500,
                mask: false,
              });
              let imgdata = JSON.parse(JSON.parse(res.data))
              let arrlist = that.data.imgArr
              arrlist.push(imgdata)
              that.setData({
                imgArr:arrlist
              })
            }else{
              wx.showToast({
                title: '图片上传失败请稍后再试',
                icon: 'none',
                image: '',
                duration: 1500,
                mask: false,
              }); 
            }
            //  console.log(that.data.imgArr)
          },
          fail: function(res) {
            wx.showToast({
              title: '图片上传失败请稍后再试',
              icon: 'none',
              image: '',
              duration: 1500,
              mask: false,
            }); 
          },
          complete: () => {
            wx.hideLoading();
          }
        }) 
      }
    })
  },
  chanVal(e){
    this.data.podata.content = e.detail.value
  },
  saveCom(){
    if(!this.data.podata.content){
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    if(this.data.imgArr.length > 0){
      let arrimg = []
      for (let index = 0; index < this.data.imgArr.length; index++) {
        const element = this.data.imgArr[index];
        arrimg.push(element.url)
      }
      this.data.podata.images = arrimg
    }
    app.postajax.post('/order/api/v1/addComment',this.data.podata).then(res =>{
      if(res.status === 200){
        wx.showToast({
          title: '发布成功',
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let usermsg = wx.getStorageSync('userMsg')
    this.data.msgobj = JSON.parse(usermsg)
    this.data.podata.token = this.data.msgobj.token
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
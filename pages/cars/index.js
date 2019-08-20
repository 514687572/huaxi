// pages/cars/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgobj:{},
    sendData:{
      index: 1,
      size: 999,
      token:''
    },
    allcheck:false,
    Alldata:{},
    Codes: '',
    dedata:{},
    allprice:0,
    allcunt:0,
    carExit:false,
    shwotc:false,
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
   //获取购物车
   getData(){
    app.getajax.get('/cart/api/v1/cartList',this.data.sendData).then(res =>{
      if(res.status === 200){
        this.setData({
          Alldata:res.data
        })
        this.choosecar()
      }
    })

  },
  Cheadit(e){
    let insdexs = e.currentTarget.dataset.num
    let rachek = 'Alldata['+insdexs+'].check'
    let isr = !this.data.Alldata[insdexs].check
    this.setData({
      [rachek] : isr
    })
    this.choosecar()
  },
  CheAll(){
    this.setData({
      allcheck:!this.data.allcheck
    })
    let aldata = this.data.Alldata
    if(this.data.allcheck){
      if(aldata.length > 0){
        for (let index = 0; index < aldata.length; index++) {
          const element = aldata[index];
          element.check = true
        }
      }
      this.setData({
        Alldata : aldata
      })
    }else{
      if(aldata.length > 0){
        for (let index = 0; index < aldata.length; index++) {
          const element = aldata[index];
          element.check = false
        }
        this.setData({
          Alldata : aldata
        })
      }
    }
    this.choosecar()
  },
  //统计选中列表
  choosecar(){
    let arrlists = this.data.Alldata.filter(y=>y.check === true)
    if(arrlists.length!==0 && arrlists.length == this.data.Alldata.length){
      this.setData({
        allcheck: true
      })
    }else{
      this.setData({
        allcheck: false
      })
    }
    let counts = 0
    let pirces = 0
    for (const i in arrlists) {
      const element = arrlists[i];
      counts += element.count
      pirces += Math.round(element.count * (element.price*100)) / 100
    }
    this.setData({
      allcunt:counts
    })
    this.setData({
      allprice:pirces
    })
  },
  //修改shuliang
  chancenum(e){
    let noenum = e.detail.value
    let podata = {
      shoppingCarts: [
        {
          count: 0,
          shoppingCartId: 0
        }
      ],
      type: 1,
      token:''
    }
    let insdexs = e.currentTarget.dataset.num
    let innums = 'Alldata['+insdexs+'].count'
    // this.setData({
    //   [innums] : noenum
    // })
    podata.token = this.data.msgobj.token
    podata.shoppingCarts[0].count = noenum
    podata.shoppingCarts[0].shoppingCartId = this.data.Alldata[insdexs].shoppingCartId
    app.postajax.post('/cart/api/v1/modify',podata).then(res =>{
      if(res.status === 200){
        this.getData()
      }
    })
  },
  gopays(e){
    if(this.data.Alldata == '' || this.data.Alldata == null){
      return
    }
    let arrlists = this.data.Alldata.filter(y=>y.check === true)
    if(arrlists.length < 1){
      wx.showToast({
        title: '请至少选中一种商品!',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      return
    }
    let buyobj = {
      products:[],
      token:''
    }
    buyobj.products.push(...arrlists)
    buyobj.token = this.data.msgobj.token
    app.postajax.post('/order/api/v1/create',buyobj).then(res =>{
      let url = e.currentTarget.dataset.url +"?ccode=" + res.data + ""
      wx.navigateTo({
      url: url
      })
    })
  },
  openExc(){
    this.setData({
      carExit: true
    });
  },
  overExc(){
    this.setData({
      carExit: false
    });
  },
  openTc(){
    this.setData({
      shwotc: true
    });
  },
  Closetc(){
    this.setData({
      shwotc: false
    });
  },
  Delcars(){
    if(this.data.Alldata == '' || this.data.Alldata == null){
      return
    }
    let arrlists = this.data.Alldata.filter(y=>y.check === true)
    if(arrlists.length < 1){
      wx.showToast({
        title: '请至少选中一种商品!',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      this.setData({
        shwotc: false
      });
      return
    }else{
      let oblist = []
      for (let index = 0; index < arrlists.length; index++) {
        const element = arrlists[index];
        oblist.push({
          count:element.count,
          shoppingCartId:element.shoppingCartId
        })
      }
      let podata = {
        shoppingCarts: [],
        type: 0,
        token:''
      }
      podata.shoppingCarts.push(...oblist)
      podata.token = this.data.msgobj.token
      app.postajax.post('/cart/api/v1/modify',podata).then(res =>{
        if(res.status === 200){
          this.setData({
            shwotc: false
          });
          wx.showToast({
            title: '删除成功!',
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
    }
  },
  onShow: function () {
    this.setData({
      carExit: false
    });
    this.setData({
      shwotc: false
    });
    this.setData({
      allcheck: false
    });
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
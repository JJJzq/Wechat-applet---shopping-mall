const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jieguo: 1,
    detail: '',
    Products: [],
    cartList:[],
    imgUrls: [{}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    //首页传数据到详情页
    console.log('携带数据', opt)
    // let id = opt.id
    //let that = this
    wx.cloud.database().collection('fProduct').doc(opt.id).get()
      .then(res => {
        console.log('以id获取商品信息', res)
        this.setData({
          detail: res.data
        })
      })
    //设置购物车商品数量
    this.setData({
      cartList: app.globalData.cartList
    })

    //获取全部评论
    wx.cloud.callFunction({
      name: 'getpinglun',
    }).then(res => {
      console.log('成功获取全部评论', res)
      this.setData({
        pinglun: res.result.data
      })
    })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  changeJG1: function () {
    this.setData({
      jieguo: 1
    });
  },
  changeJG2: function () {
    this.setData({
      jieguo: 0
    })
  },
  //添加当前商品到购物车
  addCart: function () {
    console.log('点击了加入购物车')
    //获取用户信息
    let user = wx.getStorageSync('user')
    if (user) {
      let cartList = app.globalData.cartList
      let index = -1
      if (cartList.length == 0) {
        this.data.detail.number = 1
        this.data.detail.choose = true
        app.globalData.cartList.push(this.data.detail)
        //创建缓存信息
        wx.setStorageSync('cartList', app.globalData.cartList)
      } else {
        for (let i in cartList) {
          console.log(i)
          if (cartList[i]._id == this.data.detail._id) {
            index = i
          }
        }
        if (index != -1) {
          cartList[index].number = cartList[index].number + 1
          app.globalData.cartList = cartList
          wx.setStorageSync('cartList', app.globalData.cartList)
        } else {
          this.data.detail.number = 1
          this.data.detail.choose = true
          app.globalData.cartList.push(this.data.detail)
          wx.setStorageSync('cartList', app.globalData.cartList)
        }
      }
      wx.showToast({
        title: '添加成功!',
      })
      this.setData({
        cartList: app.globalData.cartList
      })
    } else {
      wx.showToast({
        title: '请先登录！！!',
        icon: 'error'
      })
      //登录
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: res => {
          console.log('授权成功', res)
          let user = res.userInfo
          wx.setStorageSync('user', user)
          this.setData({
            userInfo: user
          })
          wx.showToast({
            title: '登录成功！！！',
            icon: 'success'
          })
        },
        fail: res => {
          console.log('授权失败', res)
          wx.showToast({
            title: '登录失败！！！',
            icon: 'error'
          })
        }
      })

    }

  },
  //跳转至订单页面
  toOrder: function () {
    console.log('点击立即购买')
    //获取用户信息
    let user = wx.getStorageSync('user')
    if (user) {
      let orderList = app.globalData.orderList
      if (orderList.length != 0) {
        app.globalData.orderList.splice(0, orderList.length)
        wx.setStorageSync('orderList', null)
        this.data.detail.number = 1
        app.globalData.orderList.push(this.data.detail)
        //创建缓存信息
        wx.setStorageSync('orderList', app.globalData.orderList)
      } else {
        this.data.detail.number = 1
        app.globalData.orderList.push(this.data.detail)
        //创建缓存信息
        wx.setStorageSync('orderList', app.globalData.orderList)
      }
      wx.navigateTo({
        url: '/pages/order/order',
      })
    } else {
      wx.showToast({
        title: '请先登录！！!',
        icon: 'error'
      })
      //登录
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success: res => {
          console.log('授权成功', res)
          let user = res.userInfo
          wx.setStorageSync('user', user)
          this.setData({
            userInfo: user
          })
          wx.showToast({
            title: '登录成功！！！',
            icon: 'success'
          })
        },
        fail: res => {
          console.log('授权失败', res)
          wx.showToast({
            title: '登录失败！！！',
            icon: 'error'
          })
        }
      })
    }


  }


})
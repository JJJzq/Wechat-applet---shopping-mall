// app.ts
App<IAppOption>({
  globalData: {
    //购物车列表
    cartList: [],
    //订单列表
    orderList: []
  },
  onLaunch() {
    //初始化云开发
    console.log('初始化小程序')
    wx.cloud.init({
      env: ''
    })

    //订单页面缓存获取
    if (wx.getStorageSync('orderList')) {
      this.globalData.orderList = wx.getStorageSync('orderList')
    }

    //购物车页面缓存获取
    if (wx.getStorageSync('cartList')) {
      this.globalData.cartList = wx.getStorageSync('cartList')
    }

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
  onShow() {
    
  }
})
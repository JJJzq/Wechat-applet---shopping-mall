// pages/mine/mine.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let user = wx.getStorageSync('user')
    console.log('获取用户缓存', user)
    this.setData({
      userInfo: user
    })
  },
  //登录
  login() {
    // console.log('点击事件执行')
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
          title:'登录成功！！！',
          icon:'success'
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
  },
  //退出登录
  loginOut() {
    this.setData({
      userInfo: ''
    })
    wx.setStorageSync('user', null)
  },
  //进入我的订单页面
  goMyOrder() {
    wx.navigateTo({
      url: '/pages/myOrder/myOrder',
    })
  },
  //进入我的评价页面
  goMycomment() {
    wx.navigateTo({
      url: '/pages/myComment/myComment'
    })
  }




})
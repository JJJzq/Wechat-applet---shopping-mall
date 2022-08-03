// pages/home_page/home_page.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [{}],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    jieguo: 1,
    products: [{}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取商品
    // var that = this;
    wx.cloud.database().collection('fProduct').get().
      then(res => {
        console.log('获取成功', res)
        this.setData({
          products: res.data
        })
      })
      .catch(err => {
        console.log('获取失败！！！', err)
      }),
      //获取轮播图
      wx.cloud.database().collection('lunbo1').get().
        then(res => {
          console.log('获取成功', res)
          this.setData({
            imgUrls: res.data
          })
        })
        .catch(err => {
          console.log('获取失败！！！', err)
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

  },
  /**跳转至详情 */
  goDetail: function (e) {
    // console.log('点击了',e)
    console.log('点击了', e.currentTarget.dataset.item)
    let id = e.currentTarget.dataset.item._id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
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
  //搜索点击事件
  goSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }
})
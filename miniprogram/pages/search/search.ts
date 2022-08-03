// pages/search/search.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    products: [{}],
    jieguo: 1
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

  },
  //获取输入关键词
  getSearchKey(event) {
    console.log(event.detail.value)
    let inputValue = event.detail.value
    this.setData({
      inputValue
    })
  },
  //进行模糊查询
  search() {
    wx.cloud.database().collection('fProduct').where({
      fName: wx.cloud.database().RegExp({
        regexp: this.data.inputValue,
        options: 'i'
      })
    }).get()
      .then(res => {
        console.log('搜索成功', res)
        if (res.data.length != 0) {
          this.setData({
            products: res.data,
            jieguo: 0
          })
        } else {
          wx.showToast({
            title: '暂无此商品！！!',
            icon: 'error'
          })
        }
      })
  },
  /**跳转至详情 */
  goDetail: function (e) {
    // console.log('点击了',e)
    console.log('点击了', e.currentTarget.dataset.item)
    let id = e.currentTarget.dataset.item._id
    //  console.log(id)
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  }
})
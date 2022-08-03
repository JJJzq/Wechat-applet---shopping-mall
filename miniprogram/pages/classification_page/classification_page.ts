// pages/classification_page/classification_page.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentType: 0,
    types: [{}],
    productList: [{}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // console.log(wx.cloud.database().collection('productType').get())
    this.getType()
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {


  },
  //获取种类
  getType() {
    wx.cloud.database().collection('fType').get().
      then(res => {
        console.log('获取成功', res)
        this.setData({
          types: res.data
        })
        this.first_getProduct(res.data[0].fType)
      })
      .catch(err => {
        console.log('获取失败！！！', err)
      })
  },
  //点击获取商品列表
  getProductList(event) {
    // console.log(event.currentTarget.dataset.type)
    // console.log(event.currentTarget.dataset.index)
    let index = event.currentTarget.dataset.index
    let type = event.currentTarget.dataset.type
    this.setData({
      currentType: event.currentTarget.dataset.index
    })
    wx.cloud.database().collection('fProduct').where({
      fType: type
    }).get().then(res => {
      console.log(res)
      this.setData({
        productList: res.data
      })
    })
  },
  //进入分类页面获取第一类目下的商品
  first_getProduct(type) {
    wx.cloud.database().collection('fProduct').where({
      fType: type
    }).get().then(res => {
      console.log(res)
      this.setData({
        productList: res.data
      })
    })
  },
  /**跳转至详情 */
  goDetail: function (e) {
    // console.log('点击了',e)
    console.log('点击了', e.currentTarget.dataset.item)
    let id = e.currentTarget.dataset.item._id
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  }

})
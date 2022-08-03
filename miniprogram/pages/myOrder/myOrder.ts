const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tables: ['待发货', '待评价', '已完成', '已取消'],
    current_Tab: 0
    // list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getLists(0);
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  //获取当前导航栏下标
  getCurrentIndex(e) {
    console.log('当前下标志',e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    this.setData({
      current_Tab: index
    })

    if (index == 3) {
      index = -1
    }
    this.getLists(index)


  },
  //获取订单列表
  getLists(sta) {
    wx.cloud.database().collection('order')
      .where({
        status: sta
        //订单状态:(-1,取消订单),(1,待评价),(2,已完成)
      })
      .get()
      .then(res => {
        console.log('成功获取订单!!!', res)
        this.setData({
          list: res.data
        })
      })
      .catch(res => {
        console.log('获取订单失败!!!', res)
      })
  },
  //取消订单
  cancle(evevt) {
    console.log(evevt.currentTarget.dataset.id)
    let id = evevt.currentTarget.dataset.id
    wx.cloud.database().collection('order').doc(id)
      .update({
        data: {
          status: -1
          //订单状态:(-1,取消订单),(0,代发货),(1,待评价),(2,已完成)
        }
      }).then(res => {
        console.log('成功取消！！', res)
        this.getLists(0);
      }).catch(res => {
        console.log('取消失败！！', res)
      })
  },
  //去评价
  gopj(e) {
    let id = e.currentTarget.dataset.id
    let user = wx.getStorageSync('user')
    console.log(user)
    wx.showModal({
      title: '输入评价内容',
      editable: true,
      cancelColor: '取消',
      success: res => {
        // console.log('弹窗', res)
        if (res.confirm) {
          console.log('用户输入内容为:', res.content)
          if (res.content) {
            wx.cloud.database().collection('pinglun').add({
              data: {
                user_name: user.nickName,
                user_img: user.avatarUrl,
                order_id: id,
                content: res.content,
                pl_date: util.formatTime(new Date)
              }
            }).then(res => {

              wx.cloud.database().collection('order').doc(id)
                .update({
                  data: {
                    status: 2
                    //订单状态:(-1,取消订单),(0,代发货),(1,待评价),(2,已完成)
                  }
                })
              wx.showToast({
                title: '评价成功',
                icon: 'success'
              })
            })
          } else {
            wx.showToast({
              title: '评论内容为空',
              icon: 'error'
            })
          }
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },
  //查看评价
  goMycomment() {
    wx.navigateTo({
      url: '/pages/myComment/myComment'
    })
  }



})
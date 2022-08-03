const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],
    selectItems: [],
    selectAll: true,
    total: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    console.log('全局数据购物车列表', app.globalData.cartList)
    this.setData({
      cartList: app.globalData.cartList
    })
    //计算
    this.sum();



  },

  //提交选中商品
  getSelectOrder() {
    let order1 = []
    for (let i = 0; i < this.data.cartList.length; i++) {
      if (this.data.cartList[i].choose) {
        order1[i] = this.data.cartList[i]
      } else {
        order1.splice(i, 1)
      }
      this.setData({
        ["order"]: order1
      })
    }

    console.log('订单选中的商品:', this.data.order)

  },


  //选中与未选中的图标
  changeSelect: function (e) {
    console.log(e.currentTarget.dataset.index);
    let i = e.currentTarget.dataset.index;
    this.data.cartList[i].choose = !this.data.cartList[i].choose;

    //渲染
    this.setData({
      ["cartList[" + i + "]"]: this.data.cartList[i]
    });
    //判断
    if (this.data.cartList[i].choose) {
      let isAll = true;
      for (let j = 0; j < this.data.cartList.length; j++) {
        if (this.data.cartList[j].choose != this.data.cartList[i].choose) {
          isAll = false;
          break;
        }
      }
      if (isAll) {
        this.setData({
          selectAll: true
        })
      } else {
        this.setData({
          selectAll: false
        })
      }
    } else {
      this.setData({
        selectAll: false
      })
    }
    //计算
    this.sum();
    this.getSelectOrder();
  },
  //全选操作
  selectAll: function () {
    this.data.selectAll = !this.data.selectAll;
    console.log(this.data.selectAll);
    for (let i = 0; i < this.data.cartList.length; i++) {
      this.data.cartList[i].choose = this.data.selectAll;
    }
    //渲染
    this.setData({
      selectAll: this.data.selectAll,
      cartList: this.data.cartList
    });
    //
    this.sum();
    this.getSelectOrder();
  },
  jian: function (e) {
    console.log(e.currentTarget.dataset.index);
    let i = e.currentTarget.dataset.index;
    if (this.data.cartList[i].number != 1) {
      this.data.cartList[i].number = this.data.cartList[i].number - 1;
    } else {
      wx.showToast({
        title: '当前数量已经不能减少了',
        icon: 'none'
      })
    }
    this.setData({
      cartList: this.data.cartList
    });
    //计算
    this.sum();
  },
  jia: function (e) {
    console.log(e.currentTarget.dataset.index);
    let i = e.currentTarget.dataset.index;
    this.data.cartList[i].number = this.data.cartList[i].number + 1;
    this.setData({
      cartList: this.data.cartList
    });
    //计算
    this.sum();
  },
  remove: function (e) {
    console.log(e.currentTarget.dataset.index);
    let i = e.currentTarget.dataset.index;
    this.data.cartList.splice(i, 1);
    //渲染
    this.setData({
      cartList: this.data.cartList
    })
    //计算
    this.sum();
  },
  //计算总价
  sum: function () {
    let temp = 0;
    for (let i = 0; i < this.data.cartList.length; i++) {
      if (this.data.cartList[i].choose) {
        temp = temp + this.data.cartList[i].fPrice * this.data.cartList[i].number
      }
    }
    console.log(temp);
    //渲染
    this.setData({
      total: temp.toFixed(2)
    })
  },
  //跳入详情页
  goDetail: function (e) {
    // console.log('点击了',e)
    console.log('点击了', e.currentTarget.dataset.id)
    let id = e.currentTarget.dataset.id
    //  console.log(id)
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  },
  //提交订单
  addOrder() {
    let user = wx.getStorageSync('user')
    if (user) {
      if (this.data.name && this.data.phone && this.data.address && this.data.order.length > 0) {
        wx.cloud.database().collection('order').add({
          data: {
            name: this.data.name,
            phone: this.data.phone,
            address: this.data.address,
            goods: this.data.order,
            totalMoney: this.data.total,
            create_time: util.formatTime(new Date),
            note: this.data.cartList.note,
            status: 0
            //订单状态:(-1,取消订单),(0,代发货),(1,待收货+已发货),(2,待评价),(3,已完成)
          }
        }).then(res => {
          console.log(res)
          //清除全局数据（购物车列表）
          for (let i = 0; i < app.globalData.cartList.length;) {
            app.globalData.cartList.splice(i, 1)
          }
          //创建缓存信息
          wx.setStorageSync('cartList', app.globalData.cartList)
          console.log('提交后全局数据', app.globalData.cartList)

          wx.showToast({
            title: '提交成功！！！',
          })
          // wx.navigateTo({
          //   url: '/pages/myOrder/myOrder'
          // })
          this.onShow();
        })
      } else {
        wx.showToast({
          title: '请检查订单信息！！！',
          icon: 'error'
        })
        this.getSelectOrder();
      }
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
        },
        fail: res => {
          console.log('授权失败', res)
        }
      })
    }
  },
  //获取备注
  getNote(event) {
    console.log(event.detail.value)
    this.data.cartList.note = event.detail.value
    this.setData({
      cartList: this.data.cartList
    })
  },
  //获取地址信息
  addAdress() {
    let that = this
    wx.chooseAddress({
      success: (result) => {
        console.log(result)
        that.setData({
          phone: result.telNumber,
          name: result.userName,
          address: result.provinceName + result.cityName + result.countyName + result.detailInfo
        })
      }
    })
  }
})
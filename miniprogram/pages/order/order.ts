const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice: 0,
    totoalNum: 0
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
    console.log('订单信息列表', app.globalData.orderList)
    this.setData({
      orderList: app.globalData.orderList
    })
    this.sum();
  },

  //计算总价
  sum: function () {
    let temp = 0; //总价
    let Num = 0  //总数量
    for (let i = 0; i < this.data.orderList.length; i++) {
      // console.log('商品数量',this.data.orderList[i].number)
      // console.log('商品价格',this.data.orderList[i].fPrice)
      temp = temp + this.data.orderList[i].fPrice * this.data.orderList[i].number
      Num = Num + this.data.orderList[i].number
    }
    //渲染
    this.setData({
      totalPrice: temp.toFixed(2),
      totalNum: Num
    })
    // console.log('商品数量', this.data.totalNum)
    // console.log('总价格', this.data.totalPrice)
  },

  jian: function (e) {
    console.log('点击减号', e.currentTarget.dataset.index);
    let i = e.currentTarget.dataset.index;
    if (this.data.orderList[i].number != 1) {
      this.data.orderList[i].number = this.data.orderList[i].number - 1;
    } else {
      wx.showToast({
        title: '当前数量已经不能减少了',
        icon: 'none'
      })
    }
    this.setData({
      orderList: this.data.orderList
    });
    //计算
    this.sum();
  },
  jia: function (e) {
    console.log('点击加号', e.currentTarget.dataset.index);
    let i = e.currentTarget.dataset.index;
    this.data.orderList[i].number = this.data.orderList[i].number + 1;
    this.setData({
      orderList: this.data.orderList
    });
    //计算
    this.sum();
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
  },
  //获取备注
  getNote(event) {
    console.log(event.detail.value)
    this.data.orderList.note = event.detail.value
    this.setData({
      orderList: this.data.orderList
    })
  },
  //手动输入数量
  getNum(event) {
    console.log(event.detail.value)
    let num = event.detail.value
    this.data.orderList[0].number = num
    this.sum()
  },
  //提交订单
  addOrder() {
    if (this.data.name && this.data.phone && this.data.address && this.data.orderList.length != 0) {
      wx.cloud.database().collection('order').add({
        data: {
          name: this.data.name,
          phone: this.data.phone,
          address: this.data.address,
          goods: this.data.orderList,
          totalMoney: this.data.totalPrice,
          create_time: util.formatTime(new Date),
          note: this.data.orderList.note,
          status: 0
          //订单状态:(-1,取消订单),(0,代发货),(1,待收货+已发货),(2,待评价),(3,已完成)
        }
      }).then(res => {
        console.log(res)
        //清除备注
        // this.data.orderList.note=''
        wx.showToast({
          title: '提交成功！！！',
          icon:'success',
        })
        // wx.navigateTo({
        //   url: '/pages/myOrder/myOrder'
        // })
      })
    } else {
      wx.showToast({
        title: '请检查订单信息！！！',
        icon: 'error'
      })
    }



  }


})
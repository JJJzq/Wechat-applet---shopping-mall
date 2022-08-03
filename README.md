# 电商购物商城微信小程序（云开发）
## 更改云开发环境配置
### 在miniprogram/app.ts的onLaunch中配置云开发环境
### wx.cloud.init({env: ''})
### 云函数获取评论，须到cloud/getpinglun/index.js中配置cloud env

# 云开发---数据库----部分数据库字段由系统自动生成
##
## fProduct---------产品表（包含字段）：
### _id---id
### _createTime---创建时间
### _updateTime---更新时间
### fName---商品名称
### fImg---商品轮播图
### fDes---商品描述
### fPrice---商品价格
### fSellNum---销量
### fType---类目
### fXqImg---详情图
##
##  fType---------种类表
### _id---id
### _createTime---创建时间
### _updateTime---更新时间
### fType---类目
##
##  lunbo1---------首页轮播表
### _id---id
### _createTime---创建时间
### _updateTime---更新时间
### lunbo1_img---轮播图
##
##  order---------订单表
### _id---订单id
### _openid---买家id
### address---收获地址
### create_time---创建时间
### goods---订单商品
### name---买家姓名
### note---订单备注
### phone---买家手机
### status---订单状态
### totalMoney---订单金额
##
## pinglun---------评论表
### _id---单条评论id
### _openid---评论者id
### content---评论内容
### order_id---订单id
### pl_date---评论时间
### user_img---用户头像
### user_name---用户名
#
# 首页
## 搜索功能
## 轮播图
## 商品展示
#
# 商品详情页
## 商品轮播图
## 商品信息
## 商品评论
## 加入购物车
## 立即购买
#
# 分类页面
## 根据类目展示商品
#
# 购物车页面
## 获取地址
## 对选购商品的数量等编辑
## 添加订单备注
## 下单（受硬性条件影响，无法使用微信支付功能，所以跳过了支付环节）
#
# 客服页面
## 调用官方api
#
# 我的页面
## 登录/退出
## 用户头像
## 订单查询【订单状态:(-1,取消订单),(0,代发货),(1,待评价),(2,已完成)】
## 评论查询
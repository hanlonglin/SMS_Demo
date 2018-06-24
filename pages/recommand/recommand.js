// pages/recommand/recommand.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommandList: null,
    server: "",

    showModel: false,

    /*上传推荐中的变量 */
    animationData: {},
    imgPath: "/images/add.png",
    typeIndex: 0,
    typeArray: ['头条', '左图', '大图', '右图'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      server: app.globalData.server
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
    this.getRecommands();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取推荐列表
  getRecommands: function () {
    var self = this;
    wx.request({
      url: app.globalData.server + '/api/action',
      method: "GET",
      data: {
        flag: 'getrecommandsbypage',
        pagenow: 1,
        pagesize: 100
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("return from internet:");
        console.log(res.data)
        var result = res.data.result;
        var msg = res.data.msg;
        console.log("result:" + result + ",msg:" + msg);
        if (result == 1) {
          self.setData({
            recommandList: res.data.data
          })
        } else {
          wx.showModal({
            title: '获取联系人失败',
            content: msg,
            showCancel: false
          })
        }
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '登陆失败',
          content: res.errMsg,
          showCancel: false
        })
      }
    })
  },

  //进入推荐详情
  gotoDetail: function (e) {
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var recommand = this.data.recommandList[index];
    wx.navigateTo({
      url: '../recommandDetail/recommandDetail?recommand=' + JSON.stringify(recommand),
    })
  },

  //添加新的推荐
  addnew: function () {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear',
      transformOrigin:"100% 100% 0"
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(600).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      showModel: true,
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 200)

  },

  /* 这是上传推荐的方法 */

  //选择类型
  bindPickerChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      typeIndex: e.detail.value
    })
  },
  //选择照片
  chooseimg: function () {
    var self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length > 0) {
          self.setData({
            imgPath: tempFilePaths[0]
          })
        }
      },
    })
  },
  //提交表单
  onsubmit: function (e) {
    console.log(e);
    var title = e.detail.value.title;
    var content = e.detail.value.content;
    var type = this.data.typeIndex;
    var publisher = getApp().globalData.muserInfo.number;
    var imgPath = this.data.imgPath;

    if (title == "" || content == "" || imgPath == "/images/add.png") {
      wx.showModal({
        title: '存在未填写项！',
        showCancel: false,
      })
      return;
    }

    console.log("提交：title:" + title + ",content:" + content + ",type:" + type + ",publisher:" + publisher + ",imgPath:" + imgPath);
    wx.uploadFile({
      url: getApp().globalData.server + "/api/publish", //仅为示例，非真实的接口地址
      filePath: imgPath,
      name: 'imagefile',
      formData: {
        title: title,
        content: content,
        targeturl: "https://www.baidu.com",
        type: type,
        publisher: publisher
      },
      success: function (res) {
        var data = JSON.parse(res.data);
        var result = data.result;
        console.log("返回：" + data);
        if (result == "1") {
          //do something
          wx.showModal({
            title: '发布成功！',
            showCancel: false,
          })
        } else {
          wx.showModal({
            title: '失败',
            content: data.msg,
            showCancel: false,
          })
        }
      }
    })

  },
  //取消
  cancel: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(600).step()
    that.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        showModel: false
      })
    }, 300)
  }
})
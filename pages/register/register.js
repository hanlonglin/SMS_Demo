// pages/register/register.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onsubmit: function (e) {
    console.log(e.detail.value);

    var uname = e.detail.value.uname;
    var pnum = e.detail.value.number;
    var passwd = e.detail.value.passwd;
    var compasswd = e.detail.value.compasswd;

    if (uname == "" || pnum == "" || passwd == "" || compasswd == "") {
      wx.showModal({
        title: '失败',
        content: '不能输入空值',
        showCancel: false
      })
      return;
    }
    if (passwd != compasswd) {
      wx.showModal({
        title: '失败',
        content: '密码输入不一致',
        showCancel: false
      })
      return;
    }

    wx.request({
      url: app.globalData.server + '/api/action', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        flag: "register",
        number: pnum,
        password: passwd,
        name: uname
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log("成功：" + res.data.msg)
        var result = res.data.result;
        var msg = res.data.msg;
        if (result == 1) {
          wx.showModal({
            title: '成功',
            content: '注册成功，请登录',
            showCancel: false,
            success: function (res) {
              if (res.confirm)
                wx.navigateBack({
                  delta: 1
                })
            }
          })
        } else {
          wx.showModal({
            title: '注册失败',
            content: msg,
            showCancel: false
          })
        }
      },
      fail: function (res) {
        console.log("失败：" + res.data)
        wx.showModal({
          title: '连接失败',
          showCancel: false
        })
      }
    })
  }
})
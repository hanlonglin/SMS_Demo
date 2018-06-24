// pages/message/message.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getmessages();
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

  //获取消息列表
  getmessages: function () {
    var self = this;
    wx.request({
      url: app.globalData.server + '/api/action',
      method: "GET",
      data: {
        flag: 'getmsgbypage',
        number: getApp().globalData.muserInfo.number,
        pagesize: 100,
        pagenow: 1
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
          var mlist = res.data.data;
          for (var i = 0; i < mlist.length; i++) {
            mlist[i].message= JSON.parse(mlist[i].message);
          }
          self.setData({
            msgList: mlist
          })
        } else {
          wx.showModal({
            title: '获取消息失败',
            content: msg,
            showCancel: false
          })
        }
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '连接失败',
          content: res.errMsg,
          showCancel: false
        })
      }
    })
  }
})
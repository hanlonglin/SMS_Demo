// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    recommandList: null,
    server: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user: getApp().globalData.muserInfo,
      server: getApp().globalData.server,
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
    this.getMyRecommands();
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

  //获取我的推荐列表
  getMyRecommands: function () {
    var self = this;
    var number = getApp().globalData.muserInfo.number;
    wx.request({
      url: getApp().globalData.server + '/api/action',
      method: "GET",
      data: {
        flag: 'getmyrecommands',
        number: number,
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
  //删除
  deleteItem: function (e) {
    var self = this;
    var index = e.currentTarget.dataset.index;
    var recommand = this.data.recommandList[index];
    wx.showActionSheet({
      itemList: ["删除"],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          wx.request({
            url: getApp().globalData.server + '/api/action',
            method: "POST",
            data: {
              flag: 'deleterecommand',
              id: recommand.id,
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
                wx.showModal({
                  title: '删除成功',
                  showCancel: false,
                })
                self.getMyRecommands();
              } else {
                wx.showModal({
                  title: '删除失败',
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
      }
    })
  }

})
// pages/partner/partner.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPartner: true,
    showPush: false,
    showFreeSms: false,
    animationData: {},
    animationData1: {},

    userList: null,
    chooseUserIndex: -1,
    colors: [
      "#C6E2FF",
      "#FFE1FF",
      "#CAFF70",
      "#C1FFC1",
      "#FFEC8B",
      "#EED2EE",
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getusers();
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

  //获取联系人
  getusers: function () {
    var self = this;
    wx.request({
      url: app.globalData.server + '/api/action',
      method: "GET",
      data: {
        flag: 'getusers',
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
            userList: res.data.data
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
          title: '连接失败',
          content: res.errMsg,
          showCancel: false
        })
      }
    })
  },

  //选择联系人
  choosePartner: function (e) {
    console.log(e);
    this.hidePage("showPush");
    this.hidePage("showFreeSms");
    var index = e.currentTarget.dataset.index;

    this.setData({
      chooseUserIndex: index
    })
    console.log("choose:" + this.data.userList[index]);

    var numberTo = this.data.userList[index].number;
    console.log("numberTo:" + numberTo);

    var self = this;
    wx.showActionSheet({
      itemList: ['打电话', "推送消息", '发送免费短信'],
      success: function (res) {
        console.log("选择" + res.tapIndex)
        switch (res.tapIndex) {
          case 0:
            wx.makePhoneCall({
              phoneNumber: numberTo
            })
            break;
          case 1:
            self.showPage("showPush");
            break;
          case 2:
            self.showPage("showFreeSms");
            break;
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  //取消退送消息
  cancelPush: function () {
    this.hidePage("showPush");
    this.hidePage("showFreeSms");
  },

  //动画显示出现页面 内部方法
  showPage: function (modeltype) {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear',
      transformOrigin: "100% 100% 0"
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(300).step()
    // 用setData改变当前动画
    if (modeltype == "showPush") {
      that.setData({
        // 通过export()方法导出数据
        animationData: animation.export(),
        // 改变view里面的Wx：if
        showPush: true,
      })
      // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
      setTimeout(function () {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export()
        })
      }, 200)
    } else if (modeltype == "showFreeSms") {
      that.setData({
        // 通过export()方法导出数据
        animationData1: animation.export(),
        // 改变view里面的Wx：if
        showFreeSms: true,
      })
      // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
      setTimeout(function () {
        animation.translateY(0).step()
        that.setData({
          animationData1: animation.export()
        })
      }, 200)
    }

  },

  //动画隐藏页面 内部方法
  hidePage: function (modeltype) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(600).step()


    if (modeltype == "showPush") {
      that.setData({
        animationData: animation.export()
      })
      setTimeout(function () {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export(),
          showPush: false,
        })
      }, 300)
    } else if (modeltype == "showFreeSms") {
      that.setData({
        animationData1: animation.export()
      })
      setTimeout(function () {
        animation.translateY(0).step()
        that.setData({
          animationData: animation.export(),
          showFreeMsg: false,
        })
      }, 300)
    }
  },

  //提交推送消息
  onSubmitPush: function (e) {
    console.log(e);
    var self = this;

    var numberFrom = getApp().globalData.muserInfo.number;
    var nameFrom = getApp().globalData.muserInfo.name;
    var number = this.data.userList[this.data.chooseUserIndex].number;
    var MsgJson = {};
    MsgJson.title = e.detail.value.title;
    MsgJson.description = e.detail.value.content;

    if (e.detail.value.title == "" || e.detail.value.content == "") {
      wx.showModal({
        title: '不能推送空值',
        showCancel: false,
      })
      return;
    }
    var msg = JSON.stringify(MsgJson);
    wx.request({
      url: getApp().globalData.server + '/api/action',
      method: "POST",
      data: {
        flag: 'sendfreemessage',
        message: msg,
        numberTo: number,
        numberFrom: numberFrom,
        nameFrom: nameFrom
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
          wx.showToast({
            title: '推送成功',
          })
          //隐藏
          self.hidePage("showPush");
        } else {
          wx.showModal({
            title: '推送失败',
            content: msg,
            showCancel: false
          })
        }
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '连接失败',
          showCancel: false
        })
      }
    })
  },

  //取消免费短信
  cancelFreeSms: function () {
    this.hidePage("showFreeSms");
  },

  //提交发送免费
  onSubmitFreeSms: function (e) {
    console.log(e);
    var self = this;

    var content = e.detail.value.content;
    var numberFrom = getApp().globalData.muserInfo.number;
    var nameFrom = getApp().globalData.muserInfo.name;
    var number = this.data.userList[this.data.chooseUserIndex].number;
    var level = getApp().globalData.muserInfo.level;
    if (content == "") {
      wx.showModal({
        title: '内容不能为空',
        showCancel: false
      })
      return;
    }
    //判断用户等级
    if (level < 2) {
      wx.showModal({
        title: '发送失败',
        content: '您的权限等级太低，不能发送免费短信！请联系管理员提升',
        showCancel: false,
      })
      return ;
    }
    wx.request({
      url: getApp().globalData.server + '/api/action',
      method: "POST",
      data: {
        flag: 'wxsendfreemessage',
        message: content,
        numberTo: number,
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
          wx.showToast({
            title: '发送成功',
          })
          //隐藏
          self.hidePage("showFreeSms");
        } else {
          wx.showModal({
            title: '发送失败',
            content: msg,
            showCancel: false
          })
        }
      },
      fail: function (res) {
        console.log(res);
        wx.showModal({
          title: '连接失败',
          showCancel: false
        })
      }
    })

  }

})
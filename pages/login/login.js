////////re// pages/login/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number: "",
    passwd: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var num = wx.getStorageSync("number");
    var passwd = wx.getStorageSync("password");
    this.setData({
      number: num,
      passwd: passwd
    })

    //微信获取用户信息


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

  /*
   *自定义
   */
  formSubmit: function (e) {
    console.log("submit:", e.detail.value);
    var value = e.detail.value;
    var num = value.uname;
    var passwd = value.passwd;
    if (num == "" || passwd == "") {
      wx.showModal({
        title: '错误',
        content: '手机号密码不能为空！',
        showCancel: false
      })
      return ;
    }

    var ckGroup = value.ckgroup;
    var isCheck = true;
    if (ckGroup.length > 0)
      isCheck = true;
    else
      isCheck = false;

    this.dologin(num, passwd, isCheck);
  },
  dologin: function (num, passwd, isremember) {
    wx.request({
      url: app.globalData.server + '/api/action',
      method: "POST",
      data: {
        flag: 'login',
        number: num,
        password: passwd
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
            title: '登陆成功',
          })
          //记住密码
          wx.setStorageSync("number", num);
          if (isremember) {
            console.log("记住密码");
            wx.setStorageSync("password", passwd);
          } else {
            console.log("不记住密码");
            wx.setStorageSync("password", "");
          }
          //设置登陆者的信息
          app.globalData.muserInfo = res.data.data[0];

          //跳转界面
          wx.navigateTo({
            url: '../main/main',
          })
        } else {
          wx.showModal({
            title: '登陆失败',
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
  }
})
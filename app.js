//app.js
var QQMapWX = require('/libs/qqmap-wx-jssdk.js');
var qqmapsdk ;
App({
  onLaunch: function () {
    qqmapsdk = new QQMapWX({
      key: 'BRPBZ-6XNLV-6KJP3-UGG4L-7BEUK-BMBCA' // 必填
    });
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  //定位位置信息
  getLocation: function () {
    var self = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy

        console.log("获取latitude:" + latitude + ",longitude:" + longitude);
        

        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            console.log("回调成功: latitude:"+latitude+",longitude:"+longitude+",addr:"+address);
            self.uploadLocation(latitude, longitude,address);
            console.log("上传成功！");
          }
        })

      },
      fail: function () {
        wx.showToast({
          title: '定位失败！',
        })
      }
    })
  },
  //上传位置信息
  uploadLocation: function (latitude, longitude,address) {
    var self = this;
    wx.request({
      url: self.globalData.server + '/api/action',
      method: "POST",
      data: {
        flag: 'sendlocation',
        latitude: latitude,
        longitude: longitude,
        name: self.globalData.muserInfo.name,
        number: self.globalData.muserInfo.number,
        address: address
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

        } else {
          wx.showToast({
            title: '保存位置信息失败',
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
  globalData: {
    userInfo: null,
    muserInfo: null,
    server: "http://123.235.17.134:8888/Sms_demo",
  }
})
// pages/map/map.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    locationList: null,
    latitude: "",
    longitude: "",
    markers: [],

    colors: [
      "#C6E2FF",
      "#FFE1FF",
      "#CAFF70",
      "#C1FFC1",
      "#FFEC8B",
      "#EED2EE",
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlocations();
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
    app.getLocation();
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

  //获取位置信息
  getlocations: function () {
    var self = this;
    wx.request({
      url: app.globalData.server + '/api/action',
      method: "GET",
      data: {
        flag: 'getlocations',
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
            locationList: res.data.data
          })

          var markers = [];
          var locationList = res.data.data;
          for (var i = 0; i < locationList.length; i++) {
            var callout={};
            callout.borderRadius=10;
            callout.padding=5;
            callout.content = locationList[i].name + "\n" + locationList[i].addr + "\n" + locationList[i].time;

            var marker = {};
            marker.callout=callout;
            marker.height = 30;
            marker.width = 25;
            marker.latitude = locationList[i].latitude;
            marker.longitude = locationList[i].longitude;
            marker.id = i;
            if (locationList[i].number == "18765941102")
              marker.iconPath = "/images/hanlonglin.png";
            else if (locationList[i].number == "18724703520")
              marker.iconPath = "/images/liyangg.jpg";
            else
              marker.iconPath = "/images/dingwei.png";
            markers.push(marker);
          }
          self.setData({
            markers: markers,
            latitude: markers[0].latitude,
            longitude: markers[1].longitude,
          })
        } else {
          wx.showModal({
            title: '获取伙伴位置失败',
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

  //点击地图标记marker
  markertap: function (e) {
    console.log(e);
    var id=e.markerId;
    var location=this.data.locationList[id];

  },
  //点击列表
  choosePartner: function (e) {
    var index = e.currentTarget.dataset.index;
    var location = this.data.locationList[index];
    this.setData({
      latitude: location.latitude,
      longitude: location.longitude,
    })
  }
})
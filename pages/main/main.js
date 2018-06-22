// pages/main/main.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("name:" + app.globalData.muserInfo.name);
    this.setData({
      user: app.globalData.muserInfo
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

  /*自定义 */

  gopage:function(e){
    console.log(e);
    var page=e.currentTarget.dataset.page;
    if(page=="partner")
    {
      wx.navigateTo({
        url: '../partner/partner',
      })
    } else if (page =="message")
    {
      wx.navigateTo({
        url: '../message/message',
      })
    }else if(page=="recommand")
    {
      wx.navigateTo({
        url: '../recommand/recommand',
      })
    }
    else if (page == "map") {
      wx.navigateTo({
        url: '../map/map',
      })
    }
  }
})
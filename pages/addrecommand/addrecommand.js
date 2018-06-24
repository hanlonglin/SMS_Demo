// pages/addrecommand/addrecommand.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgPath: "/images/add.png",
    typeIndex: 0,
    typeArray: ['头条', '左图', '大图', '右图'],
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
    var imgPath=this.data.imgPath;

    if(title==""||content==""||imgPath=="/images/add.png")
    {
        wx.showModal({
          title: '存在未填写项！',
          showCancel:false,
        })
        return ;
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
        console.log("返回："+data);
        if (result == "1") {
          //do something
          wx.showModal({
            title: '发布成功！',
            showCancel:false,
          })
        }else{
          wx.showModal({
            title: '失败',
            content: data.msg,
            showCancel:false,
          })
        }
      }
    })

  }
})
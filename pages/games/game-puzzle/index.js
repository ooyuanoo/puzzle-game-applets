// pages/games/game-puzzle/index.js
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
    const context = wx.createCanvasContext('sketchpad');
    const width = wx.getSystemInfoSync().windowWidth;

    this.drawImageCanvas('./images/1.png', context)
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

  drawImageCanvas: function (src, ctx) {
    wx.getImageInfo({
      src: src,
      success(res) {
        console.log(res)
        ctx.drawImage(src, 0, 0, wx.getSystemInfoSync().windowWidth, wx.getSystemInfoSync().windowWidth);
        ctx.draw();
      }
    })
  },

  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
})
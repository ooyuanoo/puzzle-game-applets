// pages/games/game-puzzle/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth: 0
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
    const canvasEL = 'sketchpad';
    const context = wx.createCanvasContext(canvasEL);

    const query = wx.createSelectorQuery();
    query.select('#sketchpad').boundingClientRect().exec((res) => {
      this.canvasWidth = res[0].width;
    });

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
      success: (res) => {
        this.spliceCardImg(src, 9, ctx)
      }
    })
  },

  spliceCardImg: function (src, slice, ctx) {
    const lineNum = Math.sqrt(slice);
    const singleWidth = this.canvasWidth / lineNum;
    const splitLineWidth = 3;

    for (let i = 0; i < lineNum; i++) {
      for (let j = 0; j < lineNum; j++) {
        ctx.drawImage(src, i * singleWidth, j * singleWidth, singleWidth, singleWidth, i * singleWidth, j * singleWidth, singleWidth, singleWidth);
        ctx.setLineWidth(splitLineWidth);
        ctx.setStrokeStyle('#56A902');
        ctx.strokeRect(i * singleWidth, j * singleWidth, singleWidth, singleWidth);
      }
    }
    ctx.draw();
  },

  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
});

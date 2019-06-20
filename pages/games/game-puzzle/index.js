// pages/games/game-puzzle/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth: 0,
    dots: [],
    ctx: null,
    imgUrl: '',
    slice: 9 // 默认分割的片数
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
    this.data.ctx = wx.createCanvasContext(canvasEL);

    const query = wx.createSelectorQuery();
    query.select('#sketchpad').boundingClientRect().exec((res) => {
      this.data.canvasWidth = res[0].width;
    });

    this.drawImageCanvas('./images/1.png')
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

  drawImageCanvas: function (src) {
    wx.getImageInfo({
      src: src,
      success: (res) => {
        this.data.imgUrl = src;
        this.spliceCardImg()
      }
    })
  },

  spliceCardImg: function () {
    const lineNum = Math.sqrt(this.data.slice);
    const singleWidth = this.data.canvasWidth / lineNum;

    for (let i = 0; i < lineNum; i++) {
      for (let j = 0; j < lineNum; j++) {
        this.data.dots.push({
          x: i * singleWidth,
          y: j * singleWidth
        });
      }
    }

    let drawDots = this.data.dots.slice(0, this.data.dots.length - 1);

    drawDots = drawDots.sort((a, b) => {
      return 0.5 - Math.random();
    })

    drawDots.forEach((o) => {
      this.drawGameCard(o, singleWidth)
    })

    this.data.ctx.draw();
  },

  drawGameCard(item, singleWidth) {
    const splitLineWidth = 3;

    this.data.ctx.drawImage(this.data.imgUrl, item.x, item.y, singleWidth, singleWidth, item.x, item.y, singleWidth, singleWidth);
    this.data.ctx.setLineWidth(splitLineWidth);
    this.data.ctx.setStrokeStyle('#56A902');
    this.data.ctx.strokeRect(item.x, item.y, singleWidth, singleWidth);
  },

  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
});

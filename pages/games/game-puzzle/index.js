// pages/games/game-puzzle/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth: 0,
    dots: [],
    emptyDot: {
      x: 0,
      y: 0
    },
    ctx: null,
    imgUrl: '',
    slice: 9, // 默认分割的片数
    perWidth: ''
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

  loopSlice: function(callback) {
    const perLineNum = Math.sqrt(this.data.slice);
    this.data.perWidth = this.data.canvasWidth / perLineNum;

    // 保存正确的点
    for (let i = 0; i < perLineNum; i++) {
      for (let j = 0; j < perLineNum; j++) {
        callback && callback(i, j);
      }
    }
  },

  drawImageCanvas: function (src) {
    wx.getImageInfo({
      src: src,
      success: (res) => {
        this.data.imgUrl = src;
        this.drawGamePanel();
      }
    })
  },

  drawGamePanel: function() {
    // 保存正确的点
    this.loopSlice((i, j) => {
      this.data.dots.push({
        x: i * this.data.perWidth,
        y: j * this.data.perWidth,
        position: [i, j]
      });
    });

    // 获取n-1个碎片，并且打乱顺序
    let drawDots = this.data.dots.slice(0, this.data.dots.length - 1).sort((a, b) => {
      return 0.5 - Math.random();
    });

    // 记录一个空的节点
    this.data.emptyDot.x = this.data.dots[this.data.dots.length - 1].x;
    this.data.emptyDot.y = this.data.dots[this.data.dots.length - 1].y;

    // 循环画画
    this.drawGameCard(drawDots);
  },

  drawGameCard: function (drawDots) {
    const perLineNum = Math.sqrt(this.data.slice);
    const splitLineWidth = 3;
    let count = 0;

    this.loopSlice((i, j) => {
      if (i === perLineNum - 1 && j === perLineNum - 1) {
        return;
      }

      this.data.ctx.drawImage(
        this.data.imgUrl,
        drawDots[count].x,
        drawDots[count].y,
        this.data.perWidth,
        this.data.perWidth,
        i * this.data.perWidth,
        j * this.data.perWidth,
        this.data.perWidth,
        this.data.perWidth
      );
      this.data.ctx.setLineWidth(splitLineWidth);
      this.data.ctx.setStrokeStyle('#56A902');
      this.data.ctx.strokeRect(i * perWidth, j * perWidth, perWidth, perWidth);
      this.data.ctx.draw(true);
      count++;
    });
  },

  slideCard: function(e) {
    let count = 0;
    let matchedIndex = 0;
    let {x, y} = e.changedTouches[0];

    this.loopSlice((i, j) => {
      if (x > (i - 1) * this.data.perWidth && x < i * this.data.perWidth &&
        y > (j - 1) * this.data.perWidth && y < j * this.data.perWidth) {

      }

      count++;
    })
  },

  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
});

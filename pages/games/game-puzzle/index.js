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
      y: 0,
      index: 0
    },
    randomCardArray: [],
    ctx: null,
    imgUrl: '',
    slice: 9, // 默认分割的片数
    perWidth: '',
    countTimestamp: 0,
    countTime: '00:00',
    countTimeInter: null,
    stepCount: 0, // 步数
    levelType: 1,
    level: {
      1: '简单',
      2: '容易',
      3: '难'
    }
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

    this.drawImageCanvas('./images/1.png');

    // 开始计时
    this.data.countTimeInter =setInterval(() => {
      this.data.countTimestamp += 1;

      this.setData({
        countTime: String(Math.floor(this.data.countTimestamp / 60)).padStart(2, '0') + ':' + String(Math.floor(this.data.countTimestamp % 60)).padStart(2, '0')
      })
    }, 1000)
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
        callback && callback(j, i);
      }
    }
  },

  drawImageCanvas: function (src) {
    wx.getImageInfo({
      src: src,
      success: (res) => {
        console.log(res)
        this.data.imgUrl = src;
        this.drawGamePanel();
      },
      fail: (err) => {
        console.log(`图片加载失败${err}`);
      }
    })
  },

  drawGamePanel: function() {
    // 保存正确的点
    this.loopSlice((i, j) => {
      this.data.dots.push({
        x: i * this.data.perWidth, // 原图位置
        y: j * this.data.perWidth,
        position: [i, j]
      });
    });

    // 获取n-1个碎片，并且打乱顺序
    let drawDots = this.data.dots.slice(0, this.data.dots.length - 1).sort((a, b) => {
      return 0.5 - Math.random();
    });
    this.data.randomCardArray = drawDots;

    // 记录一个空的节点
    this.data.emptyDot.x = this.data.dots[this.data.dots.length - 1].x;
    this.data.emptyDot.y = this.data.dots[this.data.dots.length - 1].y;
    this.data.emptyDot.index = this.data.dots.length - 1;

    // 循环画画
    this.drawGameCard(drawDots);
  },

  drawGameCard: function (drawDots) {
    const perLineNum = Math.sqrt(this.data.slice);
    let count = 0;
    console.log(this.data.imgUrl)

    this.loopSlice((i, j) => {
      if (i === perLineNum - 1 && j === perLineNum - 1) {
        return;
      }

      // 记录画布上的位置
      drawDots[count].drawX = i * this.data.perWidth;
      drawDots[count].drawY = j * this.data.perWidth;

      this.data.ctx.drawImage(
        this.data.imgUrl,
        drawDots[count].x,
        drawDots[count].y,
        this.data.perWidth,
        this.data.perWidth,
        drawDots[count].drawX,
        drawDots[count].drawY,
        this.data.perWidth,
        this.data.perWidth
      );
      this.data.ctx.draw(true);
      count++;
    });

    this.drawRectBorder();
  },

  slideCard: function(e) {
    let count = 0;
    let matchedIndex = 0;
    let {x, y} = e.changedTouches[0];

    // 获取点中的一块
    const find = this.data.randomCardArray.find((o) => {
      return (x > o.drawX && x < o.drawX + this.data.perWidth &&
        y > o.drawY && y < o.drawY + this.data.perWidth)
    });

    if (!find) {
      return;
    }

    // 对比emptyDot
    if ((find.drawX === this.data.emptyDot.x && find.drawY === this.data.emptyDot.y - this.data.perWidth) ||
      (find.drawX === this.data.emptyDot.x - this.data.perWidth && this.data.emptyDot.y === find.drawY) ||
      (find.drawX === this.data.emptyDot.x + this.data.perWidth && this.data.emptyDot.y === find.drawY) ||
      (find.drawX === this.data.emptyDot.x && find.drawY === this.data.emptyDot.y + this.data.perWidth)) {
      // 记步数
      this.setData({
        stepCount: this.data.stepCount + 1
      })

      // 滑动滑动
      this.moveAnimation(find);

      // 画边框
      this.drawRectBorder();
    }
  },

  drawRectBorder() { // 画边框
    const splitLineWidth = 3;

    this.loopSlice((i, j) => {
      const dotX = i * this.data.perWidth;
      const dotY = j * this.data.perWidth;

      this.data.ctx.setLineWidth(splitLineWidth);
      this.data.ctx.setStrokeStyle('#76cafe');
      this.data.ctx.moveTo(dotX, dotY);
      this.data.ctx.lineTo(dotX + this.data.perWidth, dotY);
      this.data.ctx.moveTo(dotX, dotY);
      this.data.ctx.lineTo(dotX, dotY + this.data.perWidth);
      this.data.ctx.stroke();
      this.data.ctx.draw(true);
    });
  },

  moveAnimation(matched) {
    const curImage = matched;

    // 画图片
    this.data.ctx.drawImage(
      this.data.imgUrl,
      curImage.x,
      curImage.y,
      this.data.perWidth,
      this.data.perWidth,
      this.data.emptyDot.x,
      this.data.emptyDot.y,
      this.data.perWidth,
      this.data.perWidth
    );

    this.data.ctx.clearRect(curImage.drawX, curImage.drawY, this.data.perWidth, this.data.perWidth);
    this.data.ctx.draw(true);

    const { x, y } = this.data.emptyDot;
    this.data.emptyDot.x = curImage.drawX;
    this.data.emptyDot.y = curImage.drawY;
    matched.drawX = x;
    matched.drawY = y;

    if (this.checkIsComplete()) {
      wx.showModal({
        title: '恭喜完成拼图',
        content: `完成拼图，您总共用了${this.data.countTime}, ${this.data.stepCount}步`
      })
    }
  },

  checkIsComplete() { // 检查是否完成拼图
    const data = this.data.randomCardArray;
    let isComplete = true;

    for (let i = 0; i < data.length; i++) {
      if (data[i].x !== data[i].drawX || data[i].y !== data[i].drawY) {
        isComplete = false;
        break;
      }
    }

    // 如果已经完成清除定时器
    if (isComplete) {
      clearInterval(this.data.countTimeInter)
    }

    return isComplete;
  },

  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
});

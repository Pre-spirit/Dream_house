// pages/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperData:[
      {'id': 0, 'image': 'https://preview.qiantucdn.com/58pic/71/00/18/53n58PICPnzmqGtYCyb5N_origin_PIC2018.jpg!w1024_new_small_1'},
      {'id': 1, 'image': 'https://preview.qiantucdn.com/58pic/71/00/18/53n58PICPnzmqGtYCyb5N_origin_PIC2018.jpg!w1024_new_small_1'},
      {'id': 2, 'image': 'https://preview.qiantucdn.com/58pic/71/00/18/53n58PICPnzmqGtYCyb5N_origin_PIC2018.jpg!w1024_new_small_1'},
    ],

    gridData:[
      {'id': 0, 'name': '商品1', 
      'icon': 'https://preview.qiantucdn.com/58pic/71/00/18/53n58PICPnzmqGtYCyb5N_origin_PIC2018.jpg!w1024_new_small_1'},
      {'id': 1, 'name': '商品2', 
      'icon': 'https://preview.qiantucdn.com/58pic/71/00/18/53n58PICPnzmqGtYCyb5N_origin_PIC2018.jpg!w1024_new_small_1'},
      {'id': 2, 'name': '商品3', 
      'icon': 'https://preview.qiantucdn.com/58pic/71/00/18/53n58PICPnzmqGtYCyb5N_origin_PIC2018.jpg!w1024_new_small_1'},
      {'id': 3, 'name': '商品4', 
      'icon': 'https://preview.qiantucdn.com/58pic/71/00/18/53n58PICPnzmqGtYCyb5N_origin_PIC2018.jpg!w1024_new_small_1'},
      {'id': 4, 'name': '商品5', 
      'icon': 'https://preview.qiantucdn.com/58pic/71/00/18/53n58PICPnzmqGtYCyb5N_origin_PIC2018.jpg!w1024_new_small_1'},
      {'id': 5, 'name': '商品6', 
      'icon': 'https://preview.qiantucdn.com/58pic/71/00/18/53n58PICPnzmqGtYCyb5N_origin_PIC2018.jpg!w1024_new_small_1'},
      {'id': 6, 'name': '商品7', 
      'icon': 'https://preview.qiantucdn.com/58pic/71/00/18/53n58PICPnzmqGtYCyb5N_origin_PIC2018.jpg!w1024_new_small_1'},
      {'id': 7, 'name': '商品8', 
      'icon': 'https://preview.qiantucdn.com/58pic/71/00/18/53n58PICPnzmqGtYCyb5N_origin_PIC2018.jpg!w1024_new_small_1'},
      {'id': 8, 'name': '商品9', 
      'icon': 'https://preview.qiantucdn.com/58pic/71/00/18/53n58PICPnzmqGtYCyb5N_origin_PIC2018.jpg!w1024_new_small_1'},
      {'id': 9, 'name': '商品10', 
      'icon': 'https://preview.qiantucdn.com/58pic/71/00/18/53n58PICPnzmqGtYCyb5N_origin_PIC2018.jpg!w1024_new_small_1'},
    ],
    IFFlag: false,
    dreamImage: "https://preview.qiantucdn.com/58pic/71/00/18/53n58PICPnzmqGtYCyb5N_origin_PIC2018.jpg!w1024_new_small_1"
  },

  exchange: function (e) {
    try {
      // console.log(this.gridData[e.currentTarget.id])
      const data = {
        'user_id': wx.getStorageSync('key').user_id,
        'item_id': e.currentTarget.id,
      }
      wx.request({
        url: 'https://pre-spirit.cn/item/exchange_item',  // 替换为你的服务器 IP 或域名
        // 替换为你的服务器 IP 或域名
        method: 'GET',
        data: data,
        success: (res) => {
          this.dreamList()
        },
        fail: (err) => {
          console.error('请求失败:', err);
        }
      });
    } catch (error) {
      console.error('请求出错', error);
      wx.showToast({ title: '失败', icon: 'none' });
    }
  },


  onAddProduct: function(e) {
    this.setData({
      IFFlag: true
    })
  },

  onAddConfirm: function (e) {
    const data = {
      'user_id': wx.getStorageSync('key').user_id,
      'dream_item': e.detail.data.inputValue,
      'dream_consume_score': e.detail.data.inputScore,
      'dream_photo': e.detail.data.previewImages?e.detail.data.previewImages[0]: this.data.dreamImage,
    }
    wx.request({
      url: 'https://pre-spirit.cn/item/add_item',
      method: "GET",
      data: data,
 
      success: (res) => {
        this.dreamList()
      },         
      fail: (err) => {
        console.error('请求失败:', err);
      }
  
    }),

    this.setData({
      IFFlag: false
    })
  },

  dreamList: function () {
    try {
      if (wx.getStorageSync('key').user_id) {
        const data = {
          'user_id': wx.getStorageSync('key').user_id
        }
        wx.request({
          url: 'https://pre-spirit.cn/item/item_list',  // 替换为你的服务器 IP 或域名
          // 替换为你的服务器 IP 或域名
          method: 'GET',
          data: data,
          success: (res) => {
            this.setData({
              gridData: res.data.data
            });
            console.log(res.data.data);
          },
          fail: (err) => {
            console.error('请求失败:', err);
          }
        });
      } 
    } catch (error) {
      console.error('请求出错', error);
      wx.showToast({ title: '失败', icon: 'none' });
    }
  },

  handleUploadSuccess: function (e) {
    console.log(e.detail)
  },

  onAddCancel: function () {
    this.setData({
      IFFlag: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.dreamList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
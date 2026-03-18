// pages/contact/contact.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pickerHidden: true,
    chosen: '',
    inputDialogIsShow: false,
    userInfo: {},
    avatarUrl: defaultAvatarUrl,
    images: [],
  },


  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })

  },
  chooseImage: function() {
    const that = this;
    wx.chooseMedia({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({
          images: that.data.images.concat(res.tempFilePaths)
        });
        console.log(res)
      }
    });
  },

  login: function(e) {
    wx.login({
      success: (res) => {
        if (res.code) {
          // //发起网络请求
          // let URL='https://api.weixin.qq.com/sns/jscode2session?appid=wx19736cc3951a577b&secret=cfc7259996778a4d0ca15e87d7beb531&js_code=' + res.code + '&grant_type=authorization_code'
          // wx.request({
          //   url: URL,
          //     success: function(res) {
          //       console.log(res.code)
          //     }
          // })
          console.log(res.code)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
    })
  },

  getUserInfo: function () {
    const that = this
    console.log('1')
    console.log(this.data['ph'])
    wx.chooseMedia({
      count: 9,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res.tempFiles[0].tempFilePath)
        console.log(res.tempFiles[0].size)
        that.setData({ph: res.tempFiles[0].tempFilePath});
      }
    })
  },

  showInputDialog: function () {
    this.setData({
      inputDialogIsShow: true
    });
  },
  onInputDialogConfirm: function (e) {
    console.log('用户点击确定，输入内容为:', e.detail.inputValue);
  },
  onInputDialogCancel: function () {
    console.log('用户点击取消');
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
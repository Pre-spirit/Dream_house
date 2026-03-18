// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    taskData:[],
    inputDialogIsShow: false,
    smileIsShow: false,
    taskIsShow: true,
  },
  
  showInputDialog: function () {
    this.setData({
      inputDialogIsShow: true
    });
  },
  onInputDialogConfirm: function (e) {
    const data = {
      'user_id': wx.getStorageSync('key').user_id,
      'task': e.detail.data.inputValue,
      'dream_score': e.detail.data.inputScore,
    }
    wx.request({
      url: 'https://pre-spirit.cn/task/add_task',
      method: 'GET',
      data: data,

      success: (res) => {
        this.taskList()
      },         
      fail: (err) => {
        console.error('请求失败:', err);
      }
    })
  },
  
  onInputDialogCancel: function () {
    console.log('用户取消了添加');
  },

  onSmileConfirm: function () {
    
    this.setData({
      smileIsShow: false,
    })
    this.setData({
      taskIsShow: false,
    })
  },

  onAddTask: function () {
    console.log("添加")
  },

  finishButton: function(e) {
    const data = {
      'user_id': wx.getStorageSync('key').user_id,
      'task_id': e.currentTarget.id
    }
    wx.request({
      url: 'https://pre-spirit.cn/task/finish_task',
      method: 'GET',
      data: data,
      success: (res) => {
        this.taskList()
      },
    })
    this.setData({
      smileIsShow: true
    })
  },

  taskList: function () {
    try {
      if (wx.getStorageSync('key').user_id) {
        const data = {
          'user_id': wx.getStorageSync('key').user_id
        }
        wx.request({
          url: 'https://pre-spirit.cn/task/task_list',  // 替换为你的服务器 IP 或域名
          // 替换为你的服务器 IP 或域名
          method: 'GET',
          data: data,
          success: (res) => {
            console.log(res.data.data);
            this.setData({
              taskData: res.data.data
            });
          },
          fail: (err) => {
            console.error('请求失败:', err);
          }
        });
      }
    } catch (error) {
      console.error('登录请求出错', error);
      wx.showToast({ title: '登录失败', icon: 'none' });
    }
  },

  delTask: function(e) {
    try {
      const data = {
        'task_id': e.currentTarget.id
      }
      wx.request({
        url: 'https://pre-spirit.cn/task/del_task',  // 替换为你的服务器 IP 或域名
        // 替换为你的服务器 IP 或域名
        method: 'GET',
        data: data,
        success: (res) => {
          this.taskList()
        },
        fail: (err) => {
          console.error('请求失败:', err);
        }
      });
    } catch (error) {
      console.error('登录请求出错', error);
      wx.showToast({ title: '登录失败', icon: 'none' });
    }
  },

  tapTest: function(e) {
    wx.getNetworkType({
      success: function(res) {
        // networkType字段的有效值：
        console.log(res.networkType)
      }
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
    
    this.taskList()
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
    this.taskList()
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
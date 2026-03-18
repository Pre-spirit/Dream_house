Page({
  data: {
    userInfo: null,
    IFFlag: false
  },

  upUserData: function () {
    this.setData({
      IFFlag: true
    })
  },

  handleUploadSuccess: function (e) {
    console.log('上传成功，可访问URL:', e.detail.url);
  },

  onAddConfirm: function (e) {
    console.log(e.detail.data.previewImages[0]);
    const data = {
      'user_id': wx.getStorageSync('key').user_id,
      'user_photo': e.detail.data.previewImages?e.detail.data.previewImages[0]: '',
      'user_name': e.detail.data.inputValue,
    }
    wx.request({
      url: 'https://pre-spirit.cn/user/up_data',
      method: "GET",
      data: data,
 
      success: (res) => {
        console.log("res");
        console.log(res.data.data);
        const user_data = this.data.userInfo
        console.log("userData");
        console.log(user_data);
        user_data['user_photo'] = res.data.data['user_photo']
        user_data['user_name'] = res.data.data['user_name']
        this.setData({
          userInfo: user_data
        })
      },         
      fail: (err) => {
        console.error('请求失败:', err);
      }
    }),
    
    this.setData({
      IFFlag: false
    })
  },

  onAddCancel: function () {
    this.setData({
      IFFlag: false
    })
  },


  scores: function () {
    try {
      const data = {
        'user_id': wx.getStorageSync('key').user_id
      }
      wx.request({
        url: 'https://pre-spirit.cn/user/dream_score',  // 替换为你的服务器 IP 或域名
        // 替换为你的服务器 IP 或域名
        method: 'GET',
        data: data,
        success: (res) => {
          const user = this.data.userInfo
          user.user_current_score = res.data.data['current_score']
          setTimeout(() => console.log(), 1000);
          this.setData({
            userInfo: user
          });
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

  // 登录处理
  async handleLogin() {
    try {
      // 获取微信登录凭证 code
      const loginRes = await wx.login();
      const code = {
        'code': loginRes.code
      };

      if (!code) {
        return wx.showToast({ title: '登录失败', icon: 'none' });
      }

      wx.request({
        url: 'https://pre-spirit.cn/user/login',  // 替换为你的服务器 IP 或域名
        // 替换为你的服务器 IP 或域名
        method: 'GET',
        data: code,
        success: (res) => {
          this.setData({
            userInfo: res.data.data
          });
          setTimeout(() => console.log(), 1000);
          wx.setStorageSync('key', this.data.userInfo);
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

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('authToken');
          this.setData({ userInfo: null });
        }
      }
    });
  },

  onLoad() {
    this.setData({
      userInfo: wx.getStorageSync('key')
    }) 
  },

  onShow() {
    if (this.data.userInfo) {
      this.scores()
    }
  },

});


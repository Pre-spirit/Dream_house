// app.js
App({
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
          setTimeout(() => console.log(), 500);
          // console.log(res.data.data)
          wx.setStorageSync('key', res.data.data);
          console.log(wx.getStorageSync('key'))
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
  
  onLaunch: function () {
    this.handleLogin()
  }
})

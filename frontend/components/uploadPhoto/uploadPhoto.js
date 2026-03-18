// components/uploadPhoto/uploadPhoto.js
Component({
  methods: {
    getUserInfo: function (e) {
      const that = this;
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album'],
        maxDuration: 30,
        camera: 'back',
        success(res) {
          const avatarUrl = res.tempFiles[0].tempFilePath;
          that.triggerEvent('getUserInfo', { avatarUrl });
        }
      });
    }
  }
});
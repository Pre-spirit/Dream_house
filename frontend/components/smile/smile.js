Component({
  properties: {
      title: {
          type: String,
          value: '请输入'
      },
      smileIsShow: {
          type: Boolean,
          value: false
      }
  },
  data: {
  },
  methods: {
      confirm: function () {
          this.triggerEvent('confirm', {});
          this.setData({
              smileIsShow: false
          });
      },
      cancel: function () {
          this.triggerEvent('cancel');
          this.setData({
              isShow: false
          });
      }
  }
});
Component({
  properties: {
      title: {
          type: String,
          value: '请输入'
      },
      placeholderText: {
          type: String,
          value: '请输入内容'
      },
      placeholderScore: {
        type: Number,
        value: 5
    },
      isShow: {
          type: Boolean,
          value: false
      }
  },
  data: {
    inputValue: '',
    inputScore: 0,
  },
  methods: {
      onInputChange: function (e) {
          this.setData({
              inputValue: e.detail.value
          });
      },
      onInputScore: function (e) {
        this.setData({
            inputScore: e.detail.value
        });
        console.log(this.data.inputScore)
    },
    confirm: function () {
          this.triggerEvent('confirm', {
              data: this.data
          });
          this.setData({
              isShow: false
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
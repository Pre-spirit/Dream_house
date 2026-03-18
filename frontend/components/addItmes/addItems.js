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
    },

    // 上传接口地址
    uploadUrl: {
      type: String,
      value: 'https://pre-spirit.cn/upload'
    },
    // 上传文件字段名
    fieldName: {
      type: String,
      value: 'image'
    },
    // 最大上传数量
    maxCount: {
      type: Number,
      value: 1
    },
    // 文件大小限制（单位：MB）
    maxSize: {
      type: Number,
      value: 5
    },
    // 自定义按钮文本
    buttonText: {
      type: String,
      value: '上传图片'
    },
  },
  data: {
    inputValue: '',
    inputScore: 0,
    loading: false,
    previewImages: []
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
      },

    // 触发上传
    handleUpload() {
      if (this.data.loading) return
      
      wx.chooseMedia({
        count: this.properties.maxCount,
        success: res => {
          // console.log(res.tempFiles[0])
          this._checkAndUpload(res.tempFiles[0]['tempFilePath'])
        }
      })
    },

    // 校验并上传
    _checkAndUpload(filePaths) {
      const maxSize = this.properties.maxSize * 1024 * 1024
      const fs = wx.getFileSystemManager()

      fs.getFileInfo({
        filePath: filePaths,
        success: res => {
          if (res.size > maxSize) {
            this.triggerEvent('fail', {
              errMsg: `文件大小超过${this.properties.maxSize}MB限制`
            })
            return
          }
          this._doUpload(filePaths)
        },
        fail: err => {
          this.triggerEvent('fail', {
            errMsg: '文件信息获取失败：' + err.errMsg
          })
        }
      })
    },

    // 执行上传
    _doUpload(filePath) {
      this.setData({ loading: true })
      
      wx.uploadFile({
        url: this.properties.uploadUrl,
        filePath: filePath,
        name: this.properties.fieldName,
        success: res => {
          try {
            const response = JSON.parse(res.data)
            if (response.success) {
              this.triggerEvent('success', {
                url: response.url,
                file: filePath
              })
              this.setData({
                previewImages: [response.url]
              })
              console.log(response)
            } else {
              this.triggerEvent('fail', {
                errMsg: response.error || '上传失败'
              })
            }
          } catch (e) {
            this.triggerEvent('fail', {
              errMsg: '响应解析失败'
            })
          }
        },
        fail: err => {
          this.triggerEvent('fail', {
            errMsg: err.errMsg
          })
        },
        complete: () => {
          this.setData({ loading: false })
        }
      })
    },
  },
});
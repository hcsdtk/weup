/**
 * 全局使用的模块
 * 依赖于 weup.js
 * by Chasen
 */
export default {
  data: { //全局data
    useData: '我是commonUse派来的data'
  },
  //全局方法 全局封装一下微信的方法，每个页面或组件可以用 this 调用
  openModal(content = '') {
    content && wx.showModal({
      title: '你好呀',
      content,
      showCancel: false,
      confirmText: '我知道了',
      confirmColor: '#3CC51F',
    })
  },
  globalEvent() {
    this.openModal(`我是全局方法，页面上也可以直接调用`)
  }
}
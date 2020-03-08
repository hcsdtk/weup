/**
 * 我是用Page创建页面
 */
Page({
  data: {
    demoPageData: '我是demoPage派来的data，我没有mixin',
    phoneModel: ''
  },
  onLoad() {
    console.log(`我是demoPage中的页面生命周期onLoad`)
    // demo 获取全局变量
    let systemInfo = this.store.get('systemInfo')
    this.setData({
      phoneModel: systemInfo.model
    })
  },
  backToIndex() {
    this.goBack(`我是demoPage后退携带的数据`)
  }
})
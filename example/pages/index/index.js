import commonMixin from './../../common/commonMixin'
Page({
  mixins: [commonMixin],
  data: {
    pageData: '我是index页面派来的data',
    phoneModel: ''
  },
  onLoad() {
    console.log(`::我是index中的页面生命周期onLoad::`)
    // demo 获取全局变量
    let systemInfo = this.store.get('systemInfo')
    this.setData({
      phoneModel: systemInfo.model
    })
  },
  onBack(data) {
    console.log(`后退回来的数据->${data}`);
  },
  showMoreTips() {
    this.openModal(`我是页面上的showMoreTips方法`)
  }
})
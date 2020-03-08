/**
 * 我是用Component创建页面
 */
import commonBehavior from './../../common/commonBehavior'
Component({
  behaviors: [commonBehavior],
  data: {
    componentPageData: '我是componentPage派来的data',
    phoneModel: ''
  },
  lifetimes: {
    attached() {
      console.log(`::我是componentPage中的生命周期attached::`)
      // demo 获取全局变量
      let systemInfo = this.store.get('systemInfo')
      this.setData({
        phoneModel: systemInfo.model
      })
    }
  },
  methods: {
    onLoad() {
      console.log(`我是componentPage中的页面生命周期onLoad，如果你用Component定义页面你就看得到我了`)
    },
    showMoreTips() {
      this.openModal(`我是componentPage页面上的showMoreTips方法`)
    },
    backToIndex() {
      this.goBack(`我是componentPage后退携带的数据`)
    }
  }
})
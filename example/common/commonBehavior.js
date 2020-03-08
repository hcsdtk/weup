/**
 * 组件 behavior 复用
 * 文档  https://developers.weixin.qq.com/miniprogram/dev/reference/api/Behavior.html
 * by Chasen
 */
export default Behavior({
  data: {
    behaviorData: '我是commonBehavior派来的data'
  },
  lifetimes: {
    attached() {
      console.log(`::我是commonBehavior中的生命周期attached::`)
    }
  },
  methods: {
    onLoad() {
      console.log(`::我是commonBehavior中的页面生命周期onLoad，如果你用Component定义页面你就看得到我了::`)
    },
    showTips() {
      this.openModal(`我是commonBehavior中的showTips方法，你点我了`)
    }
  },
})
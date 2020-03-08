/**
 * mixin 混入
 * 依赖于 weup.js
 * by Chasen 
 */

export default {
  data: {
    mixinData: '我是commonMixin派来的data'
  },
  onLoad() {
    console.log(`::我是commonMixin中的页面生命周期onLoad::`)
  },
  showTips() {
    this.openModal(`我是commonMixin中的showTips方法，你点我了`)
  }
}
export default {
  data: {
    info: 'index mixin data',
    list: [{
      id: 1,
      list: [{
        id: 2
      }]
    }]
  },
  id: 'index mixin id',
  onLoad() {
    console.log('index mixin onload')
  },
  onShow() {
    console.log('index mixin onshow')
  },
  showIndexMixin() {
    console.log(`show index mixin method`)
  }
}
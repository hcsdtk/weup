export default {
  data: {
    info: 'test mixin data'
  },
  id: 'test mixin id',
  onLoad() {
    console.log('test mixin onload')
  },
  test(id = '') {
    console.log(`test mixin function ${id}`)
  }
}
/**
 * weapp-up
 * 微信小程序原生开发增强库
 * 1、增强Page开发体验
 * 2019-11-07 09:31:33
 * by chasen
 */
const fn = () => {}
const OLD_APP = App || fn
const OLD_PAGE = Page || fn
const OLD_COMPONENT = Component || fn

// namespace
const WEAPPUP = {}
/**
 * 获取mixins中的数据
 * 
 * 这里只拓展Page
 * Component组件本身微信就支持类似mixin的behaviors属性
 * @param {*} mixins 
 * */
// page 原生属性
const PAGE_PROP = ['data']
// page 原生方法
//TODO onShareAppMessage  在mixin中是不起作用的 这个方法必须定以在page里面 才有作用，但是事件可以触发
const PAGE_EVENT = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap']
export const getMixins = (mixins = []) => {
  let ret = {}
  if (!Array.isArray(mixins)) {
    console.error(`mixins 类型必须为数组！`)
    return {}
  }
  mixins.forEach(mixin => {
    if (Object.prototype.toString.call(mixin) !== '[object Object]') {
      throw new Error('mixin 类型必须为对象！')
    }
    // 遍历 mixin 
    for (let [key, value] of Object.entries(mixin)) {
      if (PAGE_PROP.includes(key)) {
        //原生属性混入，后mixin优先级高
        ret[key] = {
          ...ret[key],
          ...value
        }
      } else if (PAGE_EVENT.includes(key)) {
        //原生方法混入，后mixin先执行
        const prevFunc = ret[key]
        ret[key] = function (...args) {
          value.call(this, ...args)
          return prevFunc && prevFunc.call(this, ...args)
        }
      } else {
        // 自定义方法及属性混入
        ret[key] = value
      }
    }
  })
  return ret
}
// 合并mixin到page
export const mergeMixinToPage = (pageConf = {}, mixin = {}) => {
  Object.keys(mixin).forEach(key => {
    if (PAGE_PROP.includes(key)) {
      //属性
      pageConf[key] = {
        ...mixin[key],
        ...pageConf[key]
      }
    } else if (PAGE_EVENT.includes(key)) {
      // 方法
      const originFunc = pageConf[key]
      pageConf[key] = function (...args) {
        mixin[key].call(this, ...args)
        return originFunc && originFunc.call(this, ...args)
      }
    } else {
      // 自定义方法及属性混入
      if (pageConf[key] === undefined) {
        pageConf[key] = mixin[key]
      }
    }
  })
  return pageConf
}

WEAPPUP.install = () => {
  // 替换Page实例
  Page = function (pageConfig) {
    let mixins = getMixins(pageConfig.mixins || [])
    let options = mergeMixinToPage(pageConfig, mixins)
    OLD_PAGE.call(this, options)
  }
}
// 代理Page实例
WEAPPUP.Page = (pageConfig) => {
  let mixins = getMixins(pageConfig.mixins || [])
  let options = mergeMixinToPage(pageConfig, mixins)
  return OLD_PAGE(options)
}

export default WEAPPUP
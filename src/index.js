/**
 * weapp-up
 * 微信小程序原生开发增强库
 * 1、增强Page开发体验
 * 2019-11-07 09:31:33
 * by chasen
 */
const lodashClonedepp = require('lodash.clonedeep')
const lodashGet = require('lodash.get')
const lodashSet = require('lodash.set')
const fn = () => {}
const OLD_APP = App || fn
const OLD_PAGE = Page || fn
const OLD_COMPONENT = Component || fn
const isObject = v => v !== null && (typeof v === 'object' || typeof v === 'function')
const isArray = v => Array.isArray(v)
const isFunction = v => typeof v === 'function'
// namespace
const WEAPPUP = {}
// use模块
const USE = {}
// 全局数据
const STORE = {}
/**
 * 获取mixins中的数据
 * 
 * 这里只拓展Page
 * Component组件本身微信就支持类似mixin的behaviors属性
 * @param {*} mixins 
 * */
// page 原生属性
const PAGE_PROP = ['data', 'properties', 'options']
// page 原生方法
//TODO onShareAppMessage  在mixin中是不起作用的 这个方法必须定以在page里面 才有作用，但是事件可以触发
const PAGE_EVENT = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap']

const getMixins = (mixins = []) => {
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
// 合并mixin
const mergeMixin = (pageConf = {}) => {
  let mixin = getMixins(pageConf.mixins || [])
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
// use模块
WEAPPUP.use = (params) => {
  if (!params || isArray(params)) {
    return
  }
  if (isFunction(params)) {
    USE[`$${params.name}`] = params
  }
  if (isObject(params)) {
    Object.keys(params).forEach(key => {
      USE[`$${key}`] = params[key]
    })
  }
}

WEAPPUP.useStore = (params) => {
  if (!params || isArray(params) || isFunction(params)) {
    return
  }
  if (isObject(params)) {
    Object.keys(params).forEach(key => {
      STORE[`${key}`] = params[key]
    })
  }
}
// 
const setUse = (conf, type = 'page') => {
  let options = conf
  // 注入use 模块
  if (type === 'page') {
    options = mergeMixin(conf)
    Object.keys(USE).forEach(key => {
      options[key] = USE[key]
    })
  }
  if (type === 'component') {
    const {
      methods = {}
    } = options
    // 注入use 模块
    Object.keys(USE).forEach(key => {
      methods[key] = USE[key]
    })
    options.methods = methods
  }
  return options
}

WEAPPUP.install = () => {
  // 替换Page实例
  Page = function (pageConf) {
    OLD_PAGE.call(this, setUse(pageConf))
  }
  Component = function (componentConf) {
    OLD_COMPONENT.call(this, setUse(componentConf, 'component'))
  }
}
// 代理Page实例
WEAPPUP.Page = (pageConf) => {
  return OLD_PAGE(setUse(pageConf))
}
// 代理Page实例
WEAPPUP.Component = (componentConf) => {
  return OLD_PAGE(setUse(componentConf, 'component'))
}

export default WEAPPUP
/**
 * weapp-up
 * 微信小程序原生开发增强库
 * 1、增强Page开发体验
 * 2019-11-07 09:31:33
 * by chasen
 */
/** 
 * 助手工具
 * 1、拓展Page实例支持 Mixin。
 * 2、全局store。
 * by chasen.huang 
 */
import {
  isObject,
  isFunction,
  isArray,
  isEmpty,
  throttle,
  debounce
} from './util'
// namespace
const weup = {}
// use模块
const use = {}
/**
 * 全局事件总线，可以全局（跨页面）触发、监听事件。
 * 全局只有一个 $bus 实例
 */
if (!global._hsBus) {
  global._hsBus = {}
}
/**
 * 暴露一些工具类
 */
weup.utils = {
  isObject,
  isFunction,
  isArray,
  isEmpty,
  throttle,
  debounce
}
// 全局事件
weup.bus = {
  /**
   * 触发事件
   */
  emit(eventName, ...arg) {
    let cbs = global._hsBus[eventName]
    if (!cbs) {
      return false
    }
    for (let cb of cbs) {
      cb.apply(null, arg)
    }
  },
  /**
   * 监听事件
   */
  on(eventName, cb) {
    global._hsBus[eventName] = global._hsBus[eventName] || []
    global._hsBus[eventName].push(cb)
  },
  /**
   * 关闭事件
   */
  off(eventName, cb) {
    let cbs = global._hsBus[eventName] || []
    if (cb) {
      for (let index = 0; index < cbs.length; ++index) {
        if (cb === o) {
          cbs.splice(index, 1)
          break
        }
      }
    } else {
      global._hsBus[eventName] = []
    }
  }
}
/**
 * 获取mixins中的数据
 * 这里只拓展Page
 * Component组件本身微信就支持类似mixin的behaviors属性
 * @param {*} mixins 
 * */
// page 原生属性
const pageProp = ['data', 'properties', 'options']
// page 原生方法
// onShareAppMessage  在mixin中是不起作用的 这个方法必须定以在page里面 才有作用，但是事件可以触发
const pageEvent = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onResize', 'onTabItemTap']

/**
 * 合并mixin项
 * @param {*} origin 
 * @param {*} next 
 */
function merge(...mixins) {
  let options = {}
  mixins.forEach(mixin => {
    if (Object.prototype.toString.call(mixin) !== '[object Object]') {
      throw new Error('mixin 类型必须为对象！')
    }
    Object.keys(mixin).forEach(key => {
      // 不存在直接赋值
      if (options[key] === undefined) {
        options[key] = mixin[key]
      } else if (pageProp.includes(key)) {
        //属性合并，后加入为准
        options[key] = {
          ...options[key],
          ...mixin[key]
        }
      } else if (pageEvent.includes(key)) {
        // 合并方法
        const originFunc = options[key]
        options[key] = function (...arg) {
          mixin[key].call(this, ...arg)
          return originFunc && originFunc.call(this, ...arg)
        }
      } else {
        // 后面的覆盖前面
        options[key] = mixin[key]
      }
    })
  })
  return options
}
// 后退时间标识
const backEvent = 'pageBackData'
// 注册全局页面后退事件
function regBackEvent(context) {
  global.id = global.id || 1
  context.pageid = global.id++;
  weup.bus.on(backEvent, (id, data) => {
    if (id == context.pageid) {
      if (context.onBack) {
        context.onBack.call(context, data)
      }
    }
  })
}
// 后退事件
function goBack(data, delta) {
  delta = delta > 0 ? delta : 1
  if (data !== undefined) {
    let stack = getCurrentPages()
    let len = stack.length - delta - 1
    // 如果后退页面超过栈，回到第一页
    if (len < -1) {
      len = 0
    }
    // 如果还有页面栈，触发事件
    if (len >= 0) {
      weup.bus.emit(backEvent, stack[len].pageid, data)
    }
  }
  wx.navigateBack({
    delta: delta
  })
}
/**
 * 合并页面
 */
function setPage(conf) {
  let options = conf
  if (conf.mixins && isArray(conf.mixins) && conf.mixins.length) {
    options = merge(...conf.mixins, conf)
  }
  if (!isEmpty(use)) {
    options = merge(options, use)
  }
  const onLoad = options.onLoad
  options.onLoad = function (e) {
    this.bus = weup.bus
    regBackEvent(this)
    this.goBack = goBack
    onLoad && onLoad.call(this, e)
  }
  return options
}

/**
 * 合并组件
 */
function setComponent(conf) {
  let options = conf
  const {
    methods = {}
  } = options
  Object.keys(use).forEach(key => {
    if (pageProp.includes(key)) {
      options[key] = {
        ...options[key],
        ...use[key]
      }
    } else if (key !== 'store') {
      methods[key] = use[key]
    }
  })
  options.methods = methods
  options.lifetimes = options.lifetimes || {}
  //created 的时候取不到页面this.route，但是可以挂载一些属性
  const created = options.lifetimes.created || options.created
  options.created = options.lifetimes.created = function () {
    this.bus = weup.bus
    // 设置store模块
    if (!isEmpty(use.store)) {
      this.store = use.store
    }
    created && created.call(this)
  }
  //  如果是component申明页面，attached会比onLoad先执行，在这里挂载全局事件很OK
  const attached = options.lifetimes.attached || options.attached
  options.attached = options.lifetimes.attached = function () {
    // 如果component存在路由，那就表示是页面
    if (this.route) {
      regBackEvent(this)
      this.goBack = goBack
    }
    attached && attached.call(this)
  }
  return options
}

// use模块
weup.use = (params) => {
  if (!params || isArray(params)) {
    return
  }
  if (isFunction(params)) {
    use[`${params.name}`] = params
    return
  }
  if (isObject(params)) {
    Object.keys(params).forEach(key => {
      use[`${key}`] = params[key]
    })
  }
}
// 全局注册
weup.install = () => {
  try {
    const oldPage = Page
    const oldComponent = Component
    // 替换Page实例
    Page = function (conf) {
      oldPage.call(this, setPage(conf))
    }
    Component = function (conf) {
      oldComponent.call(this, setComponent(conf))
    }
  } catch (e) {
    throw new Error('全局注册weup失败，请使用weup.page/weup.component')
  }
}
// 代理Page实例
weup.page = (conf) => {
  return Page(setPage(conf))
}
// 代理Page实例
weup.component = (conf) => {
  return Component(setComponent(conf))
}

export default weup
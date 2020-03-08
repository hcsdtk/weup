/**
 * 一些工具类
 */
export const lodashGet = require('lodash.get')
export const lodashSet = require('lodash.set')
export const clonedeep = require('lodash.clonedeep')
export const isEmpty = require('lodash.isempty')
/**
 * 是否是数组
 * @param {*} v 
 */
export const isArray = v => Array.isArray(v)

/**
 * 是否对象
 * @param {*} value 
 */
export function isObject(value) {
  const type = typeof value
  return !!value && (type === 'object' || type === 'function') && !isArray(value)
}

/**
 * 是否是方法
 * @param {*} value 
 */
export function isFunction(value) {
  if (!isObject(value)) {
    return false
  }
  const tagList = ['[object Function]', '[object Function]', '[object GeneratorFunction]', '[object Proxy]']
  const tag = Object.prototype.toString.call(value)
  return tagList.indexOf(tag) >= 0
}
/**
 * throttle，函数节流，有节流阀的意思，节约触发的频率。
 * 开发适用：微信小程序原生开发。
 * 场景适用：滚动条频繁触发、防止按钮重复点击等。
 */
export function throttle(fn, interval = 1000) {
  let enterTime = 0; //触发的时间
  return function (...arg) {
    const context = this;
    const backTime = +new Date(); //第一次函数return即触发的时间 单位 ms
    if (backTime - enterTime > interval) {
      fn.call(context, ...arg);
      enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  }
}
/**
 * debounce，函数防抖，有防反跳的意思，防止重复触发。
 * 开发适用：微信小程序原生开发。
 * 场景适用：输入框匹配内容，滚动条滚动结束才触发等。
 */
export function debounce(fn, interval = 1000) {
  let timer;
  return function () {
    clearTimeout(timer);
    const context = this;
    const args = [...arguments]; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, ...args)
    }, interval)
  }
}
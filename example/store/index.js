/**
 * 封装全局变量
 * by Chasen
 */
import {
  GLOBALDATA
} from './global'
import {
  stringToPath,
  lodashGet,
  lodashSet
} from './../utils/index'
// 全局变量库
const STATE = {
  ...GLOBALDATA
}
export default {
  /**
   * 返回 getApp
   */
  app() {
    return getApp()
  },
  /**
   * 返回当前 page 实例
   */
  page() {
    const currentPages = getCurrentPages()
    return currentPages[currentPages.length - 1]
  },
  /**
   * 返回数据源
   */
  state() {
    return STATE
  },
  /**
   * 获取值 key可以多级 如 info.name
   * @param {string} key  key值
   * @param {number} type  0/取 state 里面的数据。1|取 localstorage 里面的数据
   * 
   */
  get(key, type = 0) {
    if (!key) return {}
    if (type === 0) {
      return lodashGet(this.state(), key)
    }
    try {
      const firstKey = stringToPath(key)[0]
      let obj = {}
      obj[firstKey] = wx.getStorageSync(firstKey)
      return lodashGet(obj, key)
    } catch (e) {
      return {}
    }
  },
  /**
   *  设置值 key可以多级 如 info.name
   * @param {string} key  key值
   * @param {number} type  0=设置state里面的数据 1=设置localstorage里面的数据 2=同时存两个地方
   * 
   */
  set(key, value, type = 0) {
    if (!key) return;
    if (type === 0 || type === 2) {
      lodashSet(this.state(), key, value)
    }
    // 如果只存state
    if (type === 0) {
      return
    }
    try {
      const firstKey = stringToPath(key)[0]
      let obj = {}
      obj[firstKey] = wx.getStorageSync(firstKey) || {}
      lodashSet(obj, key, value)
      wx.setStorage({
        key: firstKey,
        data: obj[firstKey]
      })
    } catch (e) {
      console.error('存储失败')
    }
  },
  /**
   * 存旗子，全局旗子，标识是否提示
   *  @param {string} key - 旗子key
   *  @param {string} value - 旗子value
   */
  setFlag(key, value) {
    this.set(`oneTimePrompt.${key}`, value, 2)
  },
  /** 
   * 取旗子
   * @param {string}  key - 旗子key
   * @returns {*} 旗子value
   */
  getFlag(key) {
    return this.get(`oneTimePrompt.${key}`)
  },
  /**
   * 清除旗子
   */
  clearFlag() {
    this.set('oneTimePrompt', {}, 2)
  },
  /**
   * 获取用户 token ,判断登录等状态，还是单独拿出来 比较方便
   */
  isLogin() {
    return !!this.get('userInfo.token')
  },
}
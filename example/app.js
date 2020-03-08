import weup from 'weup'
import store from './store/index'
import commonUse from './common/commonUse'
import {
  isEmpty
} from './utils/index'
weup.use({
  store,
  ...commonUse
})
// 安装
weup.install()
App({
  globaldata: {},
  onLaunch() {
    // 更新小程序
    this.updateWeapp()
    // 把localStorage里面的数据同步到全局变量，例如用户信息，设备信息等。
    this.syncLocalToStore()
  },
  // 同步本地缓存到全局变量
  syncLocalToStore() {
    // 同步用户信息
    this.setUserInfo()
    // 同步设备信息
    this.setSystemInfo()
  },
  // 用户信息
  setUserInfo() {
    let userInfo = store.get('userInfo', 1)
    if (userInfo) {
      store.set('userInfo', userInfo)
    }
  },
  // 设备信息
  setSystemInfo() {
    let systemInfo = store.get('systemInfo', 1) || {}
    if (!isEmpty(systemInfo)) {
      store.set('systemInfo', systemInfo)
      return
    }
    systemInfo = {}
    try {
      let res = wx.getSystemInfoSync()
      systemInfo = res
      // rpx 适配值 js 中写 px 单位的时候可以用
      systemInfo.scale = Number((res.screenWidth / 750).toFixed(3))
      // 设备判断
      systemInfo.isIphoneX = res.model.toLocaleLowerCase().indexOf(`iphone x`) !== -1
      systemInfo.isDevTools = res.platform.indexOf('devtools') !== -1
      systemInfo.isAndroid = res.system.toLowerCase().indexOf('android') !== -1
      systemInfo.isIos = res.system.toLowerCase().indexOf('ios') !== -1
      // 自定义导航栏高度 安卓=48px ios=44px，覆盖了大部分设备吧，其实不太准确，可以使用 "wx.getMenuButtonBoundingClientRect()" 计算。
      systemInfo.navHeight = systemInfo.isAndroid ? 48 : 44
      // 自定义导航栏的高度，包含了状态栏的高度
      systemInfo.customBarHeight = systemInfo.statusBarHeight + systemInfo.navHeight
      store.set('systemInfo', systemInfo, 2)
    } catch (e) {
      // 如果发生异常
      console.error(`:: 设置设备信息异常，2秒后重新设置 ::`, e)
      let timeId = setTimeout(() => {
        this.setSystemInfo()
        clearTimeout(timeId)
      }, 2000)
    }
  },
  /**
   * 更新小程序
   * 微信小程序更新机制请参考官方开发文档
   * 大致描述：
   * 小程序冷启动->检测版本，如果有新版本，下载新版本代码到本地->第二次冷启动，使用新版本代码。
   * 该方法可以在官方下载完新版本代码回调使用 API 直接重启小程序，使用新版本。
   */
  updateWeapp() {
    try {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调
        console.log(`:: 请求更新--${JSON.stringify(res)} ::`, )
      })
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否马上重启小程序？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        console.log(`:: 请求更新失败 ::`)
      })
    } catch (err) {
      console.error(`:: 更新异常 ::`, err)
    }
  },
  onPageNotFound() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
})
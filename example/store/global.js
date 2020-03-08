/**
 * 用户信息存储原始字段
 */
const USERINFO = {
  token: '', //请求 token
  isNew: 0, // 是否新用户
  openId: '', //用户 openid
  loginPhone: '', //登录手机号
  name: '', //姓名
  nickname: '', //昵称
  avatar: '' //头像
}

const GLOBALDATA = {
  systemInfo: {}, //设备信息，和微信接口基本保持一致，多出一个屏幕比例 scale 和 devtools标识
  userInfo: { //用户信息
    ...USERINFO
  },
  oneTimePrompt: {}, //一次性提示提示，比如一些只弹出一次的弹窗，统一记在一起，出口一个方法去写入
}

export {
  USERINFO,
  GLOBALDATA
}
# weup

> 微信小程序原生开发增强库，执着原生开发。

读音同“威普”。

# 特性

- 零入侵
- Page mixin
- 全局状态管理

# 快速使用

小程序开启 npm 模块。

```bash
npm install --save weup
```

全局引入

```javascript
// app.js
import weup from 'weup'
// 全局安装
weup.install()
```

单独引入

```javascript
// page.js
import weup from 'weup'
// 全局安装
weup.Page({
  onLoad() {}
})

// component.js
import weup from 'weup'
// 全局安装
weup.Component({
  ready() {}
})
```

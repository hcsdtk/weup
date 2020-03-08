# 快速上手

如果你打算用，我先肯定你是对微信原生开发很熟练了哈，暂时还没有详细的新手入门教程。

### 开始之前

微信开发者工具打开如下设置(位置麻烦自己找一下)：

- ES6 转 ES5
- 增强编译
- 使用 npm 模块

### 开始

准备一个原生开发的项目：

```bash
# 安装
npm install --save weup # 或者： yarn add weup
#之后记得： 开发者工具-工具-构建 npm
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
weup.page({
  onLoad() {}
})

// component.js
import weup from 'weup'
weup.component({
  ready() {}
})
```

### 开始之后
后面再搞个demo吧，尴尬。
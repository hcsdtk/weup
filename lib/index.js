!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var o in n)("object"==typeof exports?exports:e)[o]=n[o]}}(window,(function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t),n.d(t,"getMixins",(function(){return c})),n.d(t,"mergeMixinToPage",(function(){return f}));const o=()=>{},r=(App,Page||o),i=(Component,{}),l=["data"],u=["onLoad","onReady","onShow","onHide","onUnload","onPullDownRefresh","onReachBottom","onShareAppMessage","onPageScroll","onTabItemTap"],c=(e=[])=>{let t={};return Array.isArray(e)?(e.forEach(e=>{if("[object Object]"!==Object.prototype.toString.call(e))throw new Error("mixin 类型必须为对象！");for(let[n,o]of Object.entries(e))if(l.includes(n))t[n]={...t[n],...o};else if(u.includes(n)){const e=t[n];t[n]=function(...t){return o.call(this,...t),e&&e.call(this,...t)}}else t[n]=o}),t):(console.error("mixins 类型必须为数组！"),{})},f=(e={},t={})=>(Object.keys(t).forEach(n=>{if(l.includes(n))e[n]={...t[n],...e[n]};else if(u.includes(n)){const o=e[n];e[n]=function(...e){return t[n].call(this,...e),o&&o.call(this,...e)}}else void 0===e[n]&&(e[n]=t[n])}),e);i.install=()=>{Page=function(e){let t=c(e.mixins||[]),n=f(e,t);r.call(this,n)}},i.Page=e=>{let t=c(e.mixins||[]),n=f(e,t);return r(n)},t.default=i}])}));
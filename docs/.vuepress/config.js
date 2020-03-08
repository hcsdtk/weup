module.exports = {
  base: '/weup/',
  title: 'Weup',
  description: '微信小程序原生增强库',
  head: [
    ['link', {
      rel: 'icon',
      href: 'https://cdn.91hcs.com/weup/favicon.png'
    }]
  ],
  themeConfig: {
    repoLabel: 'github',
    lastUpdated: '上次更新',
    displayAllHeaders: false,
    sidebarDepth: 1,
    locales: {
      '/': {
        label: '简体中文',
        selectText: '选择语言',
        lastUpdated: '上次更新',
        nav: [{
            text: '首页',
            link: '/'
          },
          {
            text: '指南',
            link: '/guide/'
          },
          {
            text: 'GitHub',
            link: 'https://github.com/hcsdtk/weup',
            target: '_blank'
          }
        ],
        sidebar: {
          '/guide/': [{
            title: '指南',
            collapsable: false, // 不可折叠
            children: ['', 'start', 'update']
          }]
        }
      }
    }

  }
}
module.exports = {
  base: '/blog/',
  title: 'KF博客',
  description: '记录开发中遇到的问题',
  serviceWorker: false,
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  themeConfig: {
    repo: 'gaokaifeis/blog',
    editLinks: true,
    docsDir: 'docs',
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    nav: [
      {
        text: 'vue',
        link: '/vue/index/'
      },
      {
        text: 'react',
        link: '/react/index/'
      },
      {
        text: 'python',
        link: '/python/index/'
      }
    ],
    sidebar: {
      '/vue/': [
        {
          title: '初始化',
          collapsable: false,
          children: [
            ['index/', 'Introduction']
          ]
        },
      ],
      '/react/': [
        {
          title: '初始化',
          collapsable: false,
          children: [
            ['index/', 'Introduction']
          ]
        },
      ],
      '/python/': [
        {
          title: '基础学习',
          collapsable: false,
          children: [
            ['base/index/', 'Introduction']
          ]
        },
        {
          title: 'flask',
          collapsable: false,
          children: [
            ['flask/index/', 'Introduction']
          ]
        },
      ]
    }
  }
}
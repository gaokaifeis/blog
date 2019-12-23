module.exports = {
  base: '/blog/',
  title: 'KF博客',
  description: '记录开发中遇到的问题',
  serviceWorker: false,
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
      ]
    }
  }
}
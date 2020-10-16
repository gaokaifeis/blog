const path = require('path')
console.log(path.join(__dirname, '../static/asserts'))
module.exports = {
  base: '/blog/',
  title: 'gaokf',
  description: '记录开发中遇到的问题',
  serviceWorker: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@image': path.join(__dirname, 'asserts')
      }
    }
  },
  theme: 'reco',
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
      // {
      //   text: 'vue',
      //   link: '/vue/index/'
      // },
      // {
      //   text: 'react',
      //   link: '/react/index/'
      // },
      // {
      //   text: 'python',
      //   link: '/python/index/'
      // },
      // {
      //   text: 'nodejs',
      //   link: '/nodejs/index/'
      // },
      {
        text: '基础',
        // link: '/nodejs/index/'
        items: [
          { text: 'HTTP 协议', link: '/http/' },
          // { text: 'mongoose', link: '/nodejs/mongoose/' }
        ]
      }
    ],
    sidebar: {
      // '/vue/': [
      //   {
      //     title: '初始化',
      //     collapsable: false,
      //     children: [
      //       ['index/', 'Introduction']
      //     ]
      //   },
      // ],
      // '/react/': [
      //   {
      //     title: '初始化',
      //     collapsable: false,
      //     children: [
      //       ['index/', '简介']
      //     ]
      //   },
      // ],
      // '/python/': [
      //   {
      //     title: '基础学习',
      //     collapsable: false,
      //     children: [
      //       ['base/index/', 'Introduction']
      //     ]
      //   },
      //   {
      //     title: 'flask',
      //     collapsable: false,
      //     children: [
      //       ['flask/index/', 'Introduction']
      //     ]
      //   },
      // ],
      '/nodejs/mongoose/': [
        {
          title: 'mongoose',
          collapsable: false,
          children: [
            ['', '简介'],
            'second'
          ]
        }
      ],
      '/http/': [
        {
          title: 'HTTP协议',
          collapsable: false,
          children: [
            ['', 'HTTP协议简介'],
            // ['HTTPMethod', 'HTTPMethod'],
            ['HTTPdevhistory', 'HTTP协议基础及发展历史'],
            ['HTTPFeatures', 'HTTP各种特性概览'],
            // 'Nginx代理以及面向未来的HTTP'
          ]
        }
      ],
    }
  }
}
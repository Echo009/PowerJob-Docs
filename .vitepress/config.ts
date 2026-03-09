import { withMermaid } from "vitepress-plugin-mermaid"

// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: "PowerJob",
  description: "Distributed Scheduling and Computing Framework",

  // 多语言配置
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: 'PowerJob',
      description: '分布式调度与计算框架',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '文档', link: '/zh/guide/introduction' },
          { text: 'API', link: '/zh/api/openapi' },
          {
            text: '相关链接',
            items: [
              { text: 'GitHub', link: 'https://github.com/PowerJob/PowerJob' },
              { text: '在线试用', link: 'http://try.powerjob.tech' }
            ]
          }
        ],
        sidebar: {
          '/zh/guide/': [
            {
              text: '快速开始',
              items: [
                { text: '介绍', link: '/zh/guide/introduction' },
                { text: '安装部署', link: '/zh/guide/installation' },
                { text: '5分钟上手', link: '/zh/guide/quick-start' }
              ]
            },
            {
              text: '核心概念',
              items: [
                { text: '架构设计', link: '/zh/guide/architecture' },
                { text: '任务', link: '/zh/guide/task' },
                { text: '工作流', link: '/zh/guide/workflow' },
                { text: '执行器', link: '/zh/guide/worker' }
              ]
            },
            {
              text: '功能指南',
              items: [
                { text: '定时策略', link: '/zh/guide/schedule-strategy' },
                { text: '执行模式', link: '/zh/guide/execution-mode' },
                { text: '工作流编排', link: '/zh/guide/workflow-design' },
                { text: '任务运维', link: '/zh/guide/operation' },
                { text: '报警通知', link: '/zh/guide/alert' }
              ]
            },
            {
              text: '开发指南',
              items: [
                { text: 'Spring Boot 集成', link: '/zh/guide/spring-boot' },
                { text: '处理器开发', link: '/zh/guide/processor' },
                { text: 'OpenAPI 使用', link: '/zh/guide/openapi' }
              ]
            }
          ],
          '/zh/api/': [
            {
              text: 'API 参考',
              items: [
                { text: 'OpenAPI 文档', link: '/zh/api/openapi' }
              ]
            }
          ]
        },
        editLink: {
          pattern: 'https://github.com/PowerJob/PowerJob-Docs/edit/main/:path',
          text: '在 GitHub 上编辑此页'
        },
        footer: {
          message: 'Released under the Apache-2.0 License.',
          copyright: 'Copyright © 2020-present PowerJob Team'
        },
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        outline: {
          label: '页面导航'
        },
        lastUpdated: {
          text: '最后更新于',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'medium'
          }
        },
        langMenuLabel: '多语言',
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式'
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'PowerJob',
      description: 'Distributed Scheduling and Computing Framework',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/introduction' },
          { text: 'API', link: '/en/api/openapi' },
          {
            text: 'Links',
            items: [
              { text: 'GitHub', link: 'https://github.com/PowerJob/PowerJob' },
              { text: 'Online Demo', link: 'http://try.powerjob.tech' }
            ]
          }
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'Introduction', link: '/en/guide/introduction' },
                { text: 'Installation', link: '/en/guide/installation' },
                { text: 'Quick Start', link: '/en/guide/quick-start' }
              ]
            },
            {
              text: 'Core Concepts',
              items: [
                { text: 'Architecture', link: '/en/guide/architecture' },
                { text: 'Task', link: '/en/guide/task' },
                { text: 'Workflow', link: '/en/guide/workflow' },
                { text: 'Worker', link: '/en/guide/worker' }
              ]
            },
            {
              text: 'Feature Guide',
              items: [
                { text: 'Schedule Strategy', link: '/en/guide/schedule-strategy' },
                { text: 'Execution Mode', link: '/en/guide/execution-mode' },
                { text: 'Workflow Design', link: '/en/guide/workflow-design' },
                { text: 'Operation', link: '/en/guide/operation' },
                { text: 'Alert', link: '/en/guide/alert' }
              ]
            },
            {
              text: 'Development Guide',
              items: [
                { text: 'Spring Boot Integration', link: '/en/guide/spring-boot' },
                { text: 'Processor Development', link: '/en/guide/processor' },
                { text: 'OpenAPI Usage', link: '/en/guide/openapi' }
              ]
            }
          ],
          '/en/api/': [
            {
              text: 'API Reference',
              items: [
                { text: 'OpenAPI Documentation', link: '/en/api/openapi' }
              ]
            }
          ]
        },
        editLink: {
          pattern: 'https://github.com/PowerJob/PowerJob-Docs/edit/main/:path',
          text: 'Edit this page on GitHub'
        },
        footer: {
          message: 'Released under the Apache-2.0 License.',
          copyright: 'Copyright © 2020-present PowerJob Team'
        }
      }
    }
  },

  // 主题配置（通用）
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/PowerJob/PowerJob' }
    ],
    search: {
      provider: 'local'
    }
  },

  // 构建配置
  srcDir: '.',
  outDir: '.vitepress/dist',
  cacheDir: '.vitepress/cache',

  // 暂时忽略死链接（文档编写中）
  ignoreDeadLinks: true,

  // Head 配置
  head: [
    ['meta', { name: 'theme-color', content: '#6366f1' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'PowerJob' }]
  ],

  // Mermaid 图表渲染配置
  mermaid: {},
})

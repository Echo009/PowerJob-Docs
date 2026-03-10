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
          { text: '文档', link: '/zh/start/introduction' },
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
          '/zh/': [
            {
              text: '快速开始',
              collapsed: false,
              items: [
                { text: '介绍', link: '/zh/start/introduction' },
                { text: '安装部署', link: '/zh/start/installation' },
                { text: '5分钟上手', link: '/zh/start/quick-start' }
              ]
            },
            {
              text: '核心功能',
              collapsed: false,
              items: [
                { text: '架构设计', link: '/zh/core/architecture' },
                { text: '任务配置', link: '/zh/core/task' },
                { text: '处理器开发', link: '/zh/core/processor' },
                { text: '执行模式', link: '/zh/core/execution-mode' },
                { text: '调度策略', link: '/zh/core/schedule-strategy' }
              ]
            },
            {
              text: '进阶功能',
              collapsed: false,
              items: [
                { text: '工作流', link: '/zh/advanced/workflow' },
                { text: '工作流编排', link: '/zh/advanced/workflow-design' },
                { text: '高级任务', link: '/zh/advanced/advanced-task' },
                { text: 'Worker 配置', link: '/zh/advanced/worker' }
              ]
            },
            {
              text: '集成指南',
              collapsed: false,
              items: [
                { text: 'Spring Boot 集成', link: '/zh/integration/spring-boot' }
              ]
            },
            {
              text: '运维管理',
              collapsed: false,
              items: [
                { text: '告警配置', link: '/zh/ops/alert' },
                { text: '运维操作', link: '/zh/ops/operation' }
              ]
            },
            {
              text: 'API 参考',
              collapsed: false,
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
          { text: 'Guide', link: '/en/start/introduction' },
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
          '/en/': [
            {
              text: 'Getting Started',
              collapsed: false,
              items: [
                { text: 'Introduction', link: '/en/start/introduction' },
                { text: 'Installation', link: '/en/start/installation' },
                { text: 'Quick Start', link: '/en/start/quick-start' }
              ]
            },
            {
              text: 'Core Features',
              collapsed: false,
              items: [
                { text: 'Architecture', link: '/en/core/architecture' },
                { text: 'Task Configuration', link: '/en/core/task' }
              ]
            },
            {
              text: 'Advanced Features',
              collapsed: false,
              items: [
                { text: 'Worker Configuration', link: '/en/advanced/worker' }
              ]
            },
            {
              text: 'API Reference',
              collapsed: false,
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

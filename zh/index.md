---
layout: home

hero:
  name: "PowerJob"
  text: "分布式调度与计算框架"
  tagline: "全新一代分布式调度与计算框架，让您轻松完成作业的调度与繁杂任务的分布式计算"
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/guide/introduction
    - theme: alt
      text: GitHub
      link: https://github.com/PowerJob/PowerJob

features:
  - icon: 🚀
    title: 使用简单
    details: 提供前端 Web 界面，允许开发者可视化地完成调度任务的管理、状态监控和运行日志查看等功能
  - icon: ⏰
    title: 定时策略完善
    details: 支持 CRON 表达式、固定频率、固定延迟和 API 四种定时调度策略
  - icon: 🔄
    title: 执行模式丰富
    details: 支持单机、广播、Map、MapReduce 四种执行模式，MapReduce 模式可调动整个集群加速计算
  - icon: 🔀
    title: DAG 工作流支持
    details: 支持在线配置任务依赖关系，可视化对任务进行编排，支持上下游任务间的数据传递
  - icon: 💻
    title: 执行器支持广泛
    details: 支持 Spring Bean、内置/外置 Java 类、Shell、Python 等处理器，应用范围广
  - icon: 🛡️
    title: 高可用 & 高性能
    details: 无锁化调度设计，支持无限水平扩展，轻松实现高可用和高性能
---

<ParticleBackground class="home-particle-bg" />

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #6366f1 30%, #a855f7);
}

/* Hero 内容层级 */
.VPHero {
  position: relative;
  z-index: 1;
}

/* Features 区域渐变背景 */
.VPFeatures {
  position: relative;
  z-index: 1;
  background: linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.03) 100%);
}

.dark .VPFeatures {
  background: linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.08) 100%);
}
</style>

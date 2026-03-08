---
layout: home

hero:
  name: "PowerJob"
  text: "Distributed Scheduling & Computing"
  tagline: "Next-generation distributed scheduling and computing framework for easy job scheduling and distributed computing"
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide/introduction
    - theme: alt
      text: GitHub
      link: https://github.com/PowerJob/PowerJob

features:
  - icon: 🚀
    title: Easy to Use
    details: Web-based UI for visual task management, status monitoring, and log viewing
  - icon: ⏰
    title: Rich Scheduling Strategies
    details: Support for CRON expressions, fixed rate, fixed delay, and API-based scheduling
  - icon: 🔄
    title: Multiple Execution Modes
    details: Standalone, Broadcast, Map, and MapReduce execution modes for distributed computing
  - icon: 📊
    title: DAG Workflow
    details: Visual workflow design with task dependencies and data passing between tasks
  - icon: 💻
    title: Extensive Processor Support
    details: Support for Spring Bean, Java, Shell, Python and more processor types
  - icon: 🛡️
    title: High Availability & Performance
    details: Lock-free scheduling design with unlimited horizontal scaling
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

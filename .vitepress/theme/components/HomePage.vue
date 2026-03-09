<template>
  <div class="home-page" @mousemove="onMouseMove">
    <GridBackground />

    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-inner">
        <h1 class="hero-title">
          <span class="title-text">PowerJob</span>
        </h1>

        <p class="hero-subtitle">
          {{ locale === 'zh'
            ? '全新一代分布式调度与计算框架'
            : 'Next-Gen Distributed Scheduling & Computing' }}
        </p>
        <p class="hero-desc">
          {{ locale === 'zh'
            ? '让您轻松完成作业的调度与繁杂任务的分布式计算，支持 CRON、工作流、MapReduce 等丰富的调度与执行模式'
            : 'Effortlessly schedule jobs and distribute complex computing tasks with CRON, Workflow, MapReduce and more' }}
        </p>

        <div class="hero-actions">
          <a :href="locale === 'zh' ? '/zh/guide/introduction' : '/en/guide/introduction'" class="btn-primary">
            <span>{{ locale === 'zh' ? '快速开始' : 'Get Started' }}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </a>
          <a href="https://github.com/PowerJob/PowerJob" target="_blank" class="btn-ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>

        <div class="hero-stats">
          <div class="stat-item" v-for="(stat, i) in stats" :key="i"
            :style="{ animationDelay: `${1.2 + i * 0.1}s` }">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features-section">
      <div class="features-header">
        <h2 class="section-title">
          {{ locale === 'zh' ? '为什么选择 PowerJob？' : 'Why PowerJob?' }}
        </h2>
      </div>

      <div class="features-grid">
        <div class="feature-card" v-for="(feature, i) in features" :key="i"
          :style="{ '--delay': `${i * 0.08}s` }">
          <div class="feature-icon-wrap">
            <div class="feature-icon" v-html="feature.icon"></div>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.details }}</p>
        </div>
      </div>
    </section>

    <!-- Code Preview -->
    <section class="code-section">
      <div class="code-inner">
        <div class="code-text">
          <h2 class="section-title">
            {{ locale === 'zh' ? '几行代码，即刻启动' : 'Get Running in Minutes' }}
          </h2>
          <p class="code-desc">
            {{ locale === 'zh'
              ? '基于 Spring Boot Starter，仅需简单配置即可接入 PowerJob 强大的调度能力。无需复杂的基础设施改造，几分钟内让你的应用拥有企业级分布式调度。'
              : 'Based on Spring Boot Starter, simply configure to access PowerJob\'s powerful scheduling. No complex infrastructure changes needed — enterprise-grade distributed scheduling in minutes.' }}
          </p>
          <a :href="locale === 'zh' ? '/zh/guide/quick-start' : '/en/guide/quick-start'" class="btn-outline">
            {{ locale === 'zh' ? '查看完整文档' : 'View Full Documentation' }}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </a>
        </div>
        <div class="code-block-wrap">
          <div class="code-window">
            <div class="code-window-bar">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
              <span class="code-filename">BasicProcessor.java</span>
            </div>
            <pre class="code-content"><code><span class="c-keyword">@Component</span>
<span class="c-keyword">public class</span> <span class="c-class">BasicProcessor</span>
        <span class="c-keyword">implements</span> <span class="c-class">BasicProcessor</span> {

    <span class="c-keyword">@Override</span>
    <span class="c-keyword">public</span> <span class="c-class">ProcessResult</span> <span class="c-method">process</span>(<span class="c-class">TaskContext</span> context) {
        <span class="c-comment">// Your business logic here</span>
        <span class="c-class">OmsLogger</span> logger = context.<span class="c-method">getOmsLogger</span>();
        logger.<span class="c-method">info</span>(<span class="c-string">"Processing: {}"</span>, context.<span class="c-method">getJobParams</span>());
        <span class="c-keyword">return new</span> <span class="c-class">ProcessResult</span>(<span class="c-bool">true</span>, <span class="c-string">"Success"</span>);
    }
}</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer CTA -->
    <section class="cta-section">
      <div class="cta-divider"></div>
      <div class="cta-inner">
        <div class="cta-left">
          <h2 class="cta-title">
            {{ locale === 'zh' ? '准备好了吗？' : 'Ready to Start?' }}
          </h2>
          <p class="cta-desc">
            {{ locale === 'zh'
              ? '加入数千开发者的选择，构建可靠的分布式调度系统'
              : 'Join thousands of developers building reliable distributed scheduling' }}
          </p>
        </div>
        <div class="cta-right">
          <a :href="locale === 'zh' ? '/zh/guide/installation' : '/en/guide/installation'" class="btn-primary btn-lg">
            <span>{{ locale === 'zh' ? '开始部署' : 'Start Deploying' }}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
          <a href="http://try.powerjob.tech" target="_blank" class="btn-ghost">
            {{ locale === 'zh' ? '在线试用' : 'Online Demo' }}
          </a>
        </div>
      </div>
      <div class="cta-footer">
        <span>Released under the Apache-2.0 License.</span>
        <span>Copyright © 2020-present PowerJob Team</span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import GridBackground from './GridBackground.vue'

const { lang } = useData()
const locale = computed(() => lang.value?.startsWith('zh') ? 'zh' : 'en')

const mouseX = ref(0)
const mouseY = ref(0)
function onMouseMove(e) {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

const stats = computed(() => locale.value === 'zh' ? [
  { value: '7K+', label: 'GitHub Stars' },
  { value: '4种', label: '执行模式' },
  { value: '100%', label: '开源免费' },
  { value: '高可用', label: '无锁化设计' }
] : [
  { value: '7K+', label: 'GitHub Stars' },
  { value: '4', label: 'Execution Modes' },
  { value: '100%', label: 'Open Source' },
  { value: 'HA', label: 'Lock-free Design' }
])

const features = computed(() => locale.value === 'zh' ? [
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: '使用简单',
    details: '提供前端 Web 界面，允许开发者可视化地完成调度任务的管理、状态监控和运行日志查看'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    title: '定时策略完善',
    details: '支持 CRON 表达式、固定频率、固定延迟和 API 四种定时调度策略'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a4 4 0 00-8 0v2"/><circle cx="12" cy="14" r="1"/></svg>`,
    title: '执行模式丰富',
    details: '支持单机、广播、Map、MapReduce 四种执行模式，可调动整个集群加速计算'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    title: 'DAG 工作流',
    details: '支持在线配置任务依赖关系，可视化编排任务，上下游任务间数据传递'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    title: '执行器支持广泛',
    details: '支持 Spring Bean、内置/外置 Java 类、Shell、Python 等处理器类型'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    title: '高可用 & 高性能',
    details: '无锁化调度设计，支持无限水平扩展，轻松实现高可用和高性能'
  }
] : [
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    title: 'Easy to Use',
    details: 'Web-based UI for visual task management, status monitoring, and log viewing'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    title: 'Rich Scheduling',
    details: 'CRON expressions, fixed rate, fixed delay, and API-based scheduling strategies'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a4 4 0 00-8 0v2"/><circle cx="12" cy="14" r="1"/></svg>`,
    title: 'Multiple Modes',
    details: 'Standalone, Broadcast, Map, and MapReduce execution modes for distributed computing'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    title: 'DAG Workflow',
    details: 'Visual workflow design with task dependencies and data passing between tasks'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    title: 'Processor Support',
    details: 'Spring Bean, Java, Shell, Python and more processor types supported'
  },
  {
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    title: 'High Availability',
    details: 'Lock-free scheduling design with unlimited horizontal scaling'
  }
])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Outfit:wght@300;400;500;600;700;800&display=swap');

.home-page {
  --accent: #6366f1;
  --accent-light: #818cf8;
  --accent-glow: rgba(99, 102, 241, 0.35);
  --surface: rgba(255, 255, 255, 0.03);
  --border: rgba(255, 255, 255, 0.06);
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --radius: 16px;
  font-family: 'Outfit', system-ui, sans-serif;
  overflow-x: hidden;
}

/* ---- Hero ---- */
.hero-section {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 24px 80px;
}

.hero-inner {
  max-width: 800px;
  text-align: center;
}

.hero-title {
  font-size: clamp(56px, 10vw, 96px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  margin-bottom: 24px;
  animation: titleFadeIn 0.8s 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.title-text {
  background: linear-gradient(135deg, #fff 0%, #6366f1 50%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@keyframes titleFadeIn {
  from {
    opacity: 0;
    transform: translateY(32px);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.hero-subtitle {
  font-size: clamp(20px, 3vw, 28px);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 16px;
  animation: fadeInUp 0.7s 0.8s ease both;
}

.hero-desc {
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-secondary);
  max-width: 560px;
  margin: 0 auto 40px;
  animation: fadeInUp 0.7s 0.9s ease both;
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 0.7s 1s ease both;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  background: var(--accent);
  color: #fff;
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s ease;
  box-shadow: 0 0 0 0 var(--accent-glow), 0 4px 16px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  background: var(--accent-light);
  transform: translateY(-2px);
  box-shadow: 0 0 24px var(--accent-glow), 0 8px 24px rgba(99, 102, 241, 0.4);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s ease;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-2px);
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  margin-top: 64px;
  background: var(--border);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 24px 16px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  animation: fadeInUp 0.5s ease both;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* ---- Features ---- */
.features-section {
  position: relative;
  z-index: 1;
  padding: 100px 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.features-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.feature-card {
  padding: 40px 32px;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s var(--delay) ease both;
}

.feature-card:hover {
  background: rgba(99, 102, 241, 0.05);
}

.feature-icon-wrap {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.15);
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon-wrap {
  background: rgba(99, 102, 241, 0.15);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
}

.feature-icon {
  width: 22px;
  height: 22px;
  color: var(--accent-light);
}

.feature-icon svg {
  width: 100%;
  height: 100%;
}

.feature-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

.feature-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* ---- Code ---- */
.code-section {
  position: relative;
  z-index: 1;
  padding: 80px 24px 120px;
  max-width: 1100px;
  margin: 0 auto;
}

.code-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.code-desc {
  font-size: 15px;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 16px 0 32px;
}

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s ease;
}

.btn-outline:hover {
  border-color: var(--accent);
  color: var(--accent-light);
  background: rgba(99, 102, 241, 0.05);
}

.code-window {
  border-radius: 16px;
  border: 1px solid var(--border);
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(16px);
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
}

.code-window-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.dot.red { background: #ef4444; }
.dot.yellow { background: #eab308; }
.dot.green { background: #22c55e; }

.code-filename {
  margin-left: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--text-secondary);
}

.code-content {
  padding: 24px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  line-height: 1.8;
  color: #cbd5e1;
  overflow-x: auto;
  margin: 0;
}

.c-keyword { color: #c084fc; }
.c-class { color: #67e8f9; }
.c-method { color: #fbbf24; }
.c-string { color: #86efac; }
.c-comment { color: #64748b; font-style: italic; }
.c-bool { color: #f97316; }

/* ---- CTA ---- */
.cta-section {
  position: relative;
  z-index: 1;
  padding: 0 24px 60px;
  max-width: 1100px;
  margin: 0 auto;
}

.cta-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), rgba(99, 102, 241, 0.3), var(--border), transparent);
  margin-bottom: 64px;
}

.cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.cta-left {
  flex: 1;
}

.cta-title {
  font-size: clamp(26px, 3.5vw, 34px);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  margin-bottom: 8px;
}

.cta-desc {
  font-size: 15px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.cta-right {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.cta-footer {
  margin-top: 64px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
  opacity: 0.6;
}

.btn-lg {
  padding: 16px 32px;
  font-size: 16px;
}

/* ---- Animations ---- */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---- Light mode ---- */
:root:not(.dark) .home-page {
  --surface: rgba(0, 0, 0, 0.02);
  --border: rgba(0, 0, 0, 0.06);
  --text-primary: #0f172a;
  --text-secondary: #64748b;
}

:root:not(.dark) .stat-item,
:root:not(.dark) .feature-card {
  background: rgba(255, 255, 255, 0.7);
}

:root:not(.dark) .feature-card:hover {
  background: rgba(99, 102, 241, 0.03);
}

:root:not(.dark) .code-window {
  background: rgba(15, 23, 42, 0.95);
}


:root:not(.dark) .title-text {
  background: linear-gradient(135deg, #0f172a 0%, #6366f1 50%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .features-grid {
    grid-template-columns: 1fr;
  }
  .code-inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .hero-section {
    padding: 100px 20px 60px;
  }
}

@media (max-width: 480px) {
  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .feature-card {
    padding: 28px 24px;
  }
  .cta-inner {
    flex-direction: column;
    text-align: center;
    gap: 28px;
  }
  .cta-footer {
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
}
</style>

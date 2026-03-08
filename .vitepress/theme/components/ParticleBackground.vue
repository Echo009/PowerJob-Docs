<template>
  <canvas ref="canvasRef" class="particle-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let animationId = null
let particles = []
let mouse = { x: null, y: null, radius: 120 }
let canvasWidth = 0
let canvasHeight = 0

// 配置
const config = {
  particleCount: 60,
  particleMinRadius: 2,
  particleMaxRadius: 5,
  connectionDistance: 150,
  particleSpeed: 0.3,
  colors: ['#6366f1', '#818cf8', '#a78bfa', '#a855f7', '#c084fc']
}

// 粒子类
class Particle {
  constructor(width, height) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.radius = Math.random() * (config.particleMaxRadius - config.particleMinRadius) + config.particleMinRadius
    this.speedX = (Math.random() - 0.5) * config.particleSpeed * 2
    this.speedY = (Math.random() - 0.5) * config.particleSpeed * 2
    this.color = config.colors[Math.floor(Math.random() * config.colors.length)]
    this.opacity = Math.random() * 0.5 + 0.3
    this.pulseSpeed = Math.random() * 0.02 + 0.01
    this.pulsePhase = Math.random() * Math.PI * 2
  }

  update(time, width, height) {
    this.x += this.speedX
    this.y += this.speedY

    if (this.x < 0 || this.x > width) this.speedX *= -1
    if (this.y < 0 || this.y > height) this.speedY *= -1

    this.currentRadius = this.radius + Math.sin(time * this.pulseSpeed + this.pulsePhase) * 1

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x
      const dy = mouse.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius
        this.x -= dx * force * 0.02
        this.y -= dy * force * 0.02
      }
    }
  }

  draw(ctx) {
    const r = this.currentRadius || this.radius

    // 发光效果
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r * 3)
    gradient.addColorStop(0, this.color)
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.beginPath()
    ctx.arc(this.x, this.y, r * 3, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.globalAlpha = this.opacity * 0.4
    ctx.fill()

    // 核心粒子
    ctx.beginPath()
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.globalAlpha = this.opacity
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

// 绘制连线
function drawConnections(ctx, particles) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < config.connectionDistance) {
        const opacity = (1 - distance / config.connectionDistance) * 0.35
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }
  }
}

// 动画循环
function animate(ctx, width, height, time) {
  ctx.clearRect(0, 0, width, height)

  particles.forEach(p => {
    p.update(time, width, height)
    p.draw(ctx)
  })

  drawConnections(ctx, particles)

  animationId = requestAnimationFrame(() => animate(ctx, width, height, time + 1))
}

// 检查是否偏好减少动画
const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

let resizeHandler = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas || prefersReducedMotion) return

  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1

  function resize() {
    canvasWidth = window.innerWidth
    canvasHeight = window.innerHeight
    canvas.width = canvasWidth * dpr
    canvas.height = canvasHeight * dpr
    canvas.style.width = canvasWidth + 'px'
    canvas.style.height = canvasHeight + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  resize()
  resizeHandler = resize
  window.addEventListener('resize', resizeHandler)

  // 初始化粒子
  particles = []
  for (let i = 0; i < config.particleCount; i++) {
    particles.push(new Particle(canvasWidth, canvasHeight))
  }

  // 鼠标事件 - 使用 window 而不是 canvas
  const handleMouseMove = (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  }

  const handleMouseLeave = () => {
    mouse.x = null
    mouse.y = null
  }

  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseleave', handleMouseLeave)

  // 页面可见性处理
  const handleVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId)
      animationId = null
    } else {
      if (!animationId) {
        animate(ctx, canvasWidth, canvasHeight, 0)
      }
    }
  }

  document.addEventListener('visibilitychange', handleVisibility)

  // 开始动画
  animate(ctx, canvasWidth, canvasHeight, 0)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
})
</script>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
}
</style>

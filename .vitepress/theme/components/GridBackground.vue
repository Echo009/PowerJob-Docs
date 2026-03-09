<template>
  <div class="grid-bg">
    <div class="grid-bg-gradient"></div>
    <canvas ref="canvasRef" class="grid-canvas"></canvas>
    <div class="grid-bg-noise"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let animationId = null
let resizeHandler = null

const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas || prefersReducedMotion) return

  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  let w = 0, h = 0
  let time = 0

  function resize() {
    w = window.innerWidth
    h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  resize()
  resizeHandler = resize
  window.addEventListener('resize', resizeHandler)

  const gridSize = 60
  const dotRadius = 0.8

  function drawGrid() {
    const isDark = document.documentElement.classList.contains('dark')
    const dotColor = isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(100, 116, 139, 0.08)'
    const lineColor = isDark ? 'rgba(99, 102, 241, 0.06)' : 'rgba(99, 102, 241, 0.04)'

    for (let x = gridSize; x < w; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 0.5
      ctx.stroke()
    }
    for (let y = gridSize; y < h; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 0.5
      ctx.stroke()
    }

    for (let x = gridSize; x < w; x += gridSize) {
      for (let y = gridSize; y < h; y += gridSize) {
        ctx.beginPath()
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2)
        ctx.fillStyle = dotColor
        ctx.fill()
      }
    }
  }

  const pulses = []
  const maxPulses = 3

  function spawnPulse() {
    if (pulses.length >= maxPulses) return
    const isVertical = Math.random() > 0.5
    pulses.push({
      isVertical,
      pos: isVertical
        ? Math.floor(Math.random() * (w / gridSize)) * gridSize + gridSize
        : Math.floor(Math.random() * (h / gridSize)) * gridSize + gridSize,
      progress: 0,
      speed: 1.5 + Math.random() * 1.5,
      length: 120 + Math.random() * 180,
      hue: 240 + Math.random() * 40
    })
  }

  function drawPulses() {
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i]
      p.progress += p.speed

      const maxDist = p.isVertical ? h : w
      if (p.progress - p.length > maxDist) {
        pulses.splice(i, 1)
        continue
      }

      const gradient = p.isVertical
        ? ctx.createLinearGradient(p.pos, p.progress - p.length, p.pos, p.progress)
        : ctx.createLinearGradient(p.progress - p.length, p.pos, p.progress, p.pos)

      gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, 0)`)
      gradient.addColorStop(0.5, `hsla(${p.hue}, 80%, 70%, 0.3)`)
      gradient.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`)

      ctx.beginPath()
      if (p.isVertical) {
        ctx.moveTo(p.pos, Math.max(0, p.progress - p.length))
        ctx.lineTo(p.pos, Math.min(maxDist, p.progress))
      } else {
        ctx.moveTo(Math.max(0, p.progress - p.length), p.pos)
        ctx.lineTo(Math.min(maxDist, p.progress), p.pos)
      }
      ctx.strokeStyle = gradient
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
  }

  const glowDots = []
  const maxGlowDots = 5

  function spawnGlowDot() {
    if (glowDots.length >= maxGlowDots) return
    glowDots.push({
      x: Math.floor(Math.random() * (w / gridSize)) * gridSize + gridSize,
      y: Math.floor(Math.random() * (h / gridSize)) * gridSize + gridSize,
      life: 0,
      maxLife: 100 + Math.random() * 100,
      radius: 3 + Math.random() * 3
    })
  }

  function drawGlowDots() {
    for (let i = glowDots.length - 1; i >= 0; i--) {
      const d = glowDots[i]
      d.life++
      if (d.life > d.maxLife) {
        glowDots.splice(i, 1)
        continue
      }

      const lifeRatio = d.life / d.maxLife
      const alpha = lifeRatio < 0.3
        ? lifeRatio / 0.3
        : lifeRatio > 0.7
          ? (1 - lifeRatio) / 0.3
          : 1

      const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius * 6)
      grad.addColorStop(0, `rgba(99, 102, 241, ${0.4 * alpha})`)
      grad.addColorStop(0.5, `rgba(99, 102, 241, ${0.1 * alpha})`)
      grad.addColorStop(1, 'rgba(99, 102, 241, 0)')
      ctx.beginPath()
      ctx.arc(d.x, d.y, d.radius * 6, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      ctx.beginPath()
      ctx.arc(d.x, d.y, d.radius * alpha, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(165, 180, 252, ${0.8 * alpha})`
      ctx.fill()
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h)
    time++

    drawGrid()

    if (time % 80 === 0) spawnPulse()
    if (time % 60 === 0) spawnGlowDot()

    drawPulses()
    drawGlowDots()

    animationId = requestAnimationFrame(animate)
  }

  const handleVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId)
      animationId = null
    } else if (!animationId) {
      animate()
    }
  }
  document.addEventListener('visibilitychange', handleVisibility)

  animate()
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})
</script>

<style scoped>
.grid-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.grid-bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 70%),
    radial-gradient(ellipse 40% 40% at 80% 50%, rgba(168, 85, 247, 0.06) 0%, transparent 70%);
}

:root:not(.dark) .grid-bg-gradient {
  background:
    radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99, 102, 241, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 40% 40% at 80% 50%, rgba(168, 85, 247, 0.03) 0%, transparent 70%);
}

.grid-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.grid-bg-noise {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px;
}
</style>

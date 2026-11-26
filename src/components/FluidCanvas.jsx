import { useEffect, useRef } from 'react'

/**
 * Lightweight "fluid" background: particles advected by a divergence-free
 * velocity field u = (∂ψ/∂y, -∂ψ/∂x) built from a time-varying stream function ψ.
 * Because the field comes from a stream function, ∇·u = 0 — the same
 * incompressibility constraint as in Navier–Stokes.
 */
export default function FluidCanvas({ count = 1400, speed = 1, hue = 195, opacity = 0.9 }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    let w, h, raf
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = '#05070d'
      ctx.fillRect(0, 0, w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    const P = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      life: Math.random() * 200,
    }))

    // velocity from stream function ψ(x,y,t) = Σ a·sin(kx·x + φ)·sin(ky·y + θ)
    const modes = [
      [1.0, 2.1, 1.3, 0.13],
      [0.7, 3.7, 2.9, -0.21],
      [0.45, 5.3, 4.1, 0.31],
    ]
    const vel = (x, y, t) => {
      const X = (x / w) * Math.PI
      const Y = (y / h) * Math.PI
      let u = 0, v = 0
      for (const [a, kx, ky, om] of modes) {
        const px = kx * X + om * t
        const py = ky * Y - om * t * 0.7
        // ψ = a sin(px) sin(py) → u = ∂ψ/∂y, v = -∂ψ/∂x
        u += a * ky * Math.sin(px) * Math.cos(py)
        v += -a * kx * Math.cos(px) * Math.sin(py)
      }
      return [u, v]
    }

    let t = 0
    const tick = () => {
      t += 0.01 * speed
      ctx.fillStyle = 'rgba(5,7,13,0.08)'
      ctx.fillRect(0, 0, w, h)
      for (const p of P) {
        const [u, v] = vel(p.x, p.y, t)
        const nx = p.x + u * 0.9 * speed
        const ny = p.y + v * 0.9 * speed
        const s = Math.min(1, Math.hypot(u, v) / 6)
        ctx.strokeStyle = `hsla(${hue + s * 60}, 90%, ${45 + s * 30}%, ${opacity * (0.25 + s * 0.6)})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(nx, ny)
        ctx.stroke()
        p.x = nx
        p.y = ny
        p.life -= 1
        if (p.life < 0 || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
          p.x = Math.random() * w
          p.y = Math.random() * h
          p.life = 100 + Math.random() * 200
        }
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [count, speed, hue, opacity])

  return <canvas ref={ref} className="fluid-canvas" />
}

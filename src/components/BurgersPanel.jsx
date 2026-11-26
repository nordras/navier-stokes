import { useEffect, useRef, useState } from 'react'
import { createBurgers } from '../sim/burgers.js'
import { useT } from '../i18n.jsx'

/**
 * Live pseudo-spectral simulation of 1D Burgers (see src/sim/burgers.js).
 * Top: u(x, t). Bottom: max |∂u/∂x| over time (log scale).
 */
export default function BurgersPanel({ nu, alpha = 1, color = '#34d399', title, tMax = 2.4, stopAt = null, width = 440, height = 200, stepsPerFrame = 2 }) {
  const t = useT()
  const uRef = useRef(null)
  const gRef = useRef(null)
  const [stat, setStat] = useState({ t: 0, g: 1, stopped: false })

  useEffect(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const setup = (c, w, h) => {
      c.width = w * dpr; c.height = h * dpr
      c.style.width = `${w}px`; c.style.height = `${h}px`
      const ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      return ctx
    }
    const GH = 110
    const cu = setup(uRef.current, width, height)
    const cg = setup(gRef.current, width, GH)

    let sim, hist, raf, hold, lastStat = 0
    const reset = () => {
      sim = createBurgers({ N: 256, nu, alpha, dt: 0.002 })
      hist = [{ t: 0, g: sim.maxGrad() }]
      hold = 0
    }
    reset()

    const pad = 26
    const X = (x) => pad + (x / (2 * Math.PI)) * (width - 2 * pad)
    const Yu = (u) => height / 2 - u * (height / 2 - 18)
    const Xt = (tt) => pad + (tt / tMax) * (width - 2 * pad)
    const Yg = (g) => GH - 18 - (Math.log10(Math.max(g, 1)) / 2.2) * (GH - 30)

    const draw = () => {
      const stopped = stopAt != null && sim.t >= stopAt
      // u(x)
      cu.clearRect(0, 0, width, height)
      cu.strokeStyle = 'rgba(148,163,184,0.25)'
      cu.beginPath(); cu.moveTo(pad, height / 2); cu.lineTo(width - pad, height / 2); cu.stroke()
      cu.setLineDash([4, 5]); cu.beginPath()
      for (let i = 0; i <= 128; i++) { const x = (i / 128) * 2 * Math.PI; i ? cu.lineTo(X(x), Yu(Math.sin(x))) : cu.moveTo(X(x), Yu(Math.sin(x))) }
      cu.stroke(); cu.setLineDash([])
      const f = sim.field()
      cu.strokeStyle = color; cu.lineWidth = 2.5; cu.shadowColor = color; cu.shadowBlur = 10
      cu.beginPath()
      for (let i = 0; i <= f.length; i++) {
        const j = i % f.length
        const x = i === f.length ? 2 * Math.PI : sim.x[j]
        const v = Math.max(-1.4, Math.min(1.4, f[j]))
        i ? cu.lineTo(X(x), Yu(v)) : cu.moveTo(X(x), Yu(v))
      }
      cu.stroke(); cu.shadowBlur = 0; cu.lineWidth = 1
      cu.fillStyle = 'rgba(148,163,184,0.8)'; cu.font = '12px JetBrains Mono, monospace'
      cu.fillText(`u(x, t)   t = ${sim.t.toFixed(2)}`, pad, 14)

      // max |u_x| history
      cg.clearRect(0, 0, width, GH)
      cg.strokeStyle = 'rgba(148,163,184,0.35)'
      cg.beginPath(); cg.moveTo(pad, GH - 18); cg.lineTo(width - pad, GH - 18); cg.stroke()
      if (stopAt != null) {
        cg.setLineDash([5, 5]); cg.strokeStyle = 'rgba(248,113,113,0.8)'
        cg.beginPath(); cg.moveTo(Xt(1), 6); cg.lineTo(Xt(1), GH - 18); cg.stroke(); cg.setLineDash([])
        cg.fillStyle = 'rgba(248,113,113,0.9)'; cg.fillText('T* = 1', Xt(1) + 5, 16)
      }
      cg.strokeStyle = color; cg.lineWidth = 2; cg.beginPath()
      hist.forEach((h, i) => (i ? cg.lineTo(Xt(h.t), Yg(h.g)) : cg.moveTo(Xt(h.t), Yg(h.g))))
      cg.stroke(); cg.lineWidth = 1
      cg.fillStyle = 'rgba(148,163,184,0.8)'
      cg.fillText('max |∂u/∂x|  (log)', pad, GH - 4)
      return stopped
    }

    const tick = (now) => {
      const stopped = stopAt != null && sim.t >= stopAt
      if (!stopped && sim.t < tMax) {
        for (let s = 0; s < stepsPerFrame; s++) sim.step()
        hist.push({ t: sim.t, g: sim.maxGrad() })
      } else {
        hold++
        if (hold > 150) reset()
      }
      draw()
      if (now - lastStat > 120) {
        lastStat = now
        const last = hist[hist.length - 1]
        setStat({ t: sim.t, g: last.g, stopped: stopped })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [nu, alpha, color, tMax, stopAt, width, height, stepsPerFrame])

  return (
    <div className="burgers" style={{ '--c': color, width }}>
      {title && <div className="burgers-title">{title}</div>}
      <canvas ref={uRef} />
      <canvas ref={gRef} />
      <div className={`burgers-stat ${stat.stopped || stat.g > 45 ? 'boom' : ''}`}>
        {stat.stopped
          ? t('choque: o gradiente explode em t = 1', 'shock: the gradient blows up at t = 1')
          : `max |∂u/∂x| ≈ ${stat.g.toFixed(1)}${stat.g > 45 ? t(' — além da resolução da grade (as ondulações são isso)', ' — beyond grid resolution (that is what the wiggles are)') : ''}`}
      </div>
    </div>
  )
}

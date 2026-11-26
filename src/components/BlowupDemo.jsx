import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const T_STAR = 1 // blow-up time (normalized)
const LOOP_MS = 6500

/**
 * Cartoon of a self-similar blow-up: a vortex that shrinks (length scale ~ √(T*−t))
 * and spins faster (speed ~ 1/√(T*−t)) until the velocity is unbounded at t = T*.
 * Left: the vortex. Right: max |u| over time with the asymptote at T*.
 */
export default function BlowupDemo() {
  const canvasRef = useRef(null)
  const [t, setT] = useState(0)
  const [boom, setBoom] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const S = 360
    canvas.width = S * dpr
    canvas.height = S * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const N = 900
    const parts = Array.from({ length: N }, () => ({
      r: 0.15 + Math.random() ** 0.7 * 0.85,
      a: Math.random() * Math.PI * 2,
    }))

    let start = performance.now()
    let raf
    let lastBoom = false
    const frame = (now) => {
      const el = (now - start) % LOOP_MS
      const tt = Math.min(el / (LOOP_MS * 0.82), 0.999) // spend last ~18% "blown up"
      const blown = el > LOOP_MS * 0.82
      if (blown !== lastBoom) { setBoom(blown); lastBoom = blown }
      setT(tt)

      const tau = Math.max(T_STAR - tt, 0.004)
      const L = Math.sqrt(tau) // shrinking length scale
      const omega = 0.02 / tau // spin rate

      ctx.fillStyle = blown ? 'rgba(5,7,13,0.35)' : 'rgba(5,7,13,0.18)'
      ctx.fillRect(0, 0, S, S)
      const c = S / 2
      for (const p of parts) {
        p.a += omega / (p.r + 0.15)
        const rr = blown ? p.r * (1 + (el - LOOP_MS * 0.82) / 120) : p.r * L
        const x = c + Math.cos(p.a) * rr * c * 0.95
        const y = c + Math.sin(p.a) * rr * c * 0.95 * 0.92
        const heat = Math.min(1, 0.15 / (tau + 0.05))
        ctx.fillStyle = blown
          ? `hsla(${10 + Math.random() * 30}, 100%, 60%, 0.8)`
          : `hsla(${195 - heat * 180}, 95%, ${50 + heat * 20}%, 0.85)`
        ctx.fillRect(x, y, 1.6, 1.6)
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  // chart
  const W = 420, H = 300, pad = 36
  const maxU = 8
  const xOf = (x) => pad + x * (W - pad * 2)
  const yOf = (u) => H - pad - Math.min(u / maxU, 1.05) * (H - pad * 2)
  const pts = []
  for (let i = 0; i <= 200; i++) {
    const x = (i / 200) * t
    pts.push(`${xOf(x)},${yOf(1 / Math.sqrt(T_STAR - x + 1e-4))}`)
  }
  const curU = 1 / Math.sqrt(T_STAR - t + 1e-4)

  return (
    <div className="blowup">
      <div className="blowup-vortex">
        <canvas ref={canvasRef} style={{ width: 360, height: 360 }} />
        <AnimatePresence>
          {boom && (
            <motion.div
              className="nan-badge"
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 14 }}
            >
              NaN
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <svg width={W} height={H} className="blowup-chart">
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} className="axis" />
        <line x1={pad} y1={pad / 2} x2={pad} y2={H - pad} className="axis" />
        <line x1={xOf(T_STAR)} y1={pad / 2} x2={xOf(T_STAR)} y2={H - pad} className="asymptote" />
        <text x={xOf(T_STAR) - 6} y={H - pad + 22} className="lbl" textAnchor="middle">T*</text>
        <text x={W - pad} y={H - pad + 22} className="lbl" textAnchor="end">time →</text>
        <text x={pad + 6} y={pad / 2 + 10} className="lbl">max |u|</text>
        <polyline points={pts.join(' ')} className="curve" />
        <circle cx={xOf(t)} cy={yOf(curU)} r={5} className="dot" />
        <text x={xOf(T_STAR) + 6} y={pad + 10} className="lbl hot">∞ in finite time</text>
      </svg>
    </div>
  )
}

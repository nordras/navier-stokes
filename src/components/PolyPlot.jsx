import { motion } from 'motion/react'

/** p(x) = x³ − x² − x + 1 = (x−1)²(x+1), drawn on [−1.4, 2]. */
export default function PolyPlot({ wrong = false }) {
  const W = 420, H = 260, pad = 30
  const x0 = -1.4, x1 = 2, y0 = -1.2, y1 = 3
  const X = (x) => pad + ((x - x0) / (x1 - x0)) * (W - 2 * pad)
  const Y = (y) => H - pad - ((y - y0) / (y1 - y0)) * (H - 2 * pad)
  const p = (x) => x ** 3 - x ** 2 - x + 1
  const q = (x) => (x - 1) * (x + 1) ** 2 // the wrong factorisation
  const path = (f) => {
    let d = ''
    for (let i = 0; i <= 160; i++) {
      const x = x0 + (i / 160) * (x1 - x0)
      const y = Math.max(y0 - 0.5, Math.min(y1 + 0.5, f(x)))
      d += `${i ? 'L' : 'M'}${X(x).toFixed(1)},${Y(y).toFixed(1)}`
    }
    return d
  }
  return (
    <svg width={W} height={H} className="poly">
      <rect x={X(-1)} y={pad / 2} width={X(x1) - X(-1)} height={H - pad * 1.5} className="domain" />
      <line x1={pad} x2={W - pad} y1={Y(0)} y2={Y(0)} className="axis" />
      <line x1={X(0)} x2={X(0)} y1={pad / 2} y2={H - pad} className="axis" />
      <text x={X(-1)} y={Y(0) + 18} className="lbl" textAnchor="middle">−1</text>
      <text x={X(1)} y={Y(0) + 18} className="lbl" textAnchor="middle">1</text>
      <text x={X(-1) + 6} y={pad / 2 + 14} className="lbl">x ≥ −1</text>
      {wrong && (
        <motion.path d={path(q)} className="curve wrong" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
      )}
      <motion.path d={path(p)} className="curve" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 0.3 }} />
      <motion.circle cx={X(1)} cy={Y(0)} r={6} className="root" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6, type: 'spring' }} />
      <motion.circle cx={X(-1)} cy={Y(0)} r={6} className="root" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8, type: 'spring' }} />
    </svg>
  )
}

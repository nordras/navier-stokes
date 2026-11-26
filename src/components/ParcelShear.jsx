import { useEffect, useRef } from 'react'

/**
 * Momentum balance on a fluid parcel in channel (Poiseuille) flow:
 * u(y) is parabolic, the parcel is advected and sheared, and three
 * forces act on it — pressure gradient, viscous stress from neighbours, external force.
 */
export default function ParcelShear({ width = 560, height = 300, high = 'p high', low = 'p low' }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    c.width = width * dpr; c.height = height * dpr
    c.style.width = `${width}px`; c.style.height = `${height}px`
    const ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const top = 30, bot = height - 30
    const H = bot - top
    const U = 3.2
    const u = (y) => { const s = (y - top) / H; return U * 4 * s * (1 - s) }
    const streaks = Array.from({ length: 70 }, () => ({ x: Math.random() * width, y: top + 6 + Math.random() * (H - 12) }))
    const S = 46
    const y0 = top + H * 0.3
    let parcel
    const resetParcel = () => {
      const x0 = 70
      parcel = [[x0, y0], [x0 + S, y0], [x0 + S, y0 + S], [x0, y0 + S]]
    }
    resetParcel()

    const arrow = (x, y, dx, dy, col, label) => {
      const L = Math.hypot(dx, dy); if (L < 1) return
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx, y + dy); ctx.stroke()
      const a = Math.atan2(dy, dx)
      ctx.beginPath()
      ctx.moveTo(x + dx, y + dy)
      ctx.lineTo(x + dx - 10 * Math.cos(a - 0.4), y + dy - 10 * Math.sin(a - 0.4))
      ctx.lineTo(x + dx - 10 * Math.cos(a + 0.4), y + dy - 10 * Math.sin(a + 0.4))
      ctx.closePath(); ctx.fill()
      if (label) { ctx.font = '13px JetBrains Mono, monospace'; ctx.fillText(label, x + dx + 6 * Math.sign(dx || 1), y + dy + (dy > 0 ? 16 : -6)) }
      ctx.lineWidth = 1
    }

    let raf
    const tick = () => {
      // pressure background: high on the left, low on the right
      const g = ctx.createLinearGradient(0, 0, width, 0)
      g.addColorStop(0, 'rgba(167,139,250,0.22)'); g.addColorStop(1, 'rgba(167,139,250,0.02)')
      ctx.fillStyle = '#05070d'; ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = g; ctx.fillRect(0, top, width, H)
      ctx.fillStyle = 'rgba(148,163,184,0.6)'; ctx.fillRect(0, top - 3, width, 3); ctx.fillRect(0, bot, width, 3)
      ctx.font = '12px JetBrains Mono, monospace'
      ctx.fillStyle = 'rgba(167,139,250,0.9)'; ctx.fillText(high, 8, top + 16)
      ctx.textAlign = 'right'; ctx.fillText(low, width - 8, top + 16); ctx.textAlign = 'left'

      // velocity profile
      ctx.strokeStyle = 'rgba(56,189,248,0.6)'; ctx.beginPath()
      for (let y = top; y <= bot; y += 4) { const x = width - 120 + u(y) * 22; y === top ? ctx.moveTo(x, y) : ctx.lineTo(x, y) }
      ctx.stroke()
      for (let y = top + 15; y < bot; y += 30) arrow(width - 120, y, u(y) * 22, 0, 'rgba(56,189,248,0.45)')

      // streaks
      for (const s of streaks) {
        const sp = u(s.y)
        ctx.strokeStyle = 'rgba(56,189,248,0.35)'; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.moveTo(s.x - sp * 6, s.y); ctx.lineTo(s.x, s.y); ctx.stroke()
        s.x += sp * 0.6; if (s.x > width) s.x = 0
      }

      // parcel: advect each vertex with u(y) → it shears
      for (const p of parcel) p[0] += u(p[1]) * 0.6
      if (parcel[0][0] > width - 260) resetParcel()
      ctx.fillStyle = 'rgba(244,114,182,0.25)'; ctx.strokeStyle = '#f472b6'; ctx.lineWidth = 2
      ctx.beginPath(); parcel.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.lineWidth = 1
      const cx = parcel.reduce((a, p) => a + p[0], 0) / 4
      const cy = parcel.reduce((a, p) => a + p[1], 0) / 4

      // forces on the parcel
      arrow(cx - 70, cy, 50, 0, '#a78bfa', '−∇p')
      // parcel sits between the wall (slow, above) and the centre (fast, below):
      arrow((parcel[0][0] + parcel[1][0]) / 2, parcel[0][1] - 4, -34, 0, '#34d399', '')    // slower layer above drags back
      arrow((parcel[2][0] + parcel[3][0]) / 2, parcel[2][1] + 4, 34, 0, '#34d399', 'νΔu')  // faster layer below pulls forward
      arrow(cx, cy + 4, 0, 34, '#fbbf24', 'f')
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [width, height, high, low])
  return <canvas ref={ref} className="parcel-canvas" />
}

import { useEffect, useRef } from 'react'

/**
 * Continuity in a pipe: half-width h(x) narrows in the middle, so speed
 * v(x) = Q / (2h(x)) must increase there — what goes in must come out.
 */
export default function PipeFlow({ width = 620, height = 260 }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    c.width = width * dpr; c.height = height * dpr
    c.style.width = `${width}px`; c.style.height = `${height}px`
    const ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const cy = height / 2 + 6
    const H0 = 88
    const h = (x) => H0 * (1 - 0.55 * Math.exp(-(((x - width / 2) / 95) ** 2)))
    const v = (x) => 1.6 * (H0 / h(x))
    const P = Array.from({ length: 260 }, () => ({ x: Math.random() * width, s: Math.random() * 2 - 1 }))
    const gates = [width * 0.14, width / 2, width * 0.86]

    let raf
    const tick = () => {
      ctx.clearRect(0, 0, width, height)
      // walls
      ctx.strokeStyle = 'rgba(148,163,184,0.7)'; ctx.lineWidth = 2
      for (const sgn of [-1, 1]) {
        ctx.beginPath()
        for (let x = 0; x <= width; x += 4) { const y = cy + sgn * h(x); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y) }
        ctx.stroke()
      }
      // gates
      gates.forEach((gx) => {
        ctx.strokeStyle = 'rgba(56,189,248,0.35)'; ctx.setLineDash([4, 4])
        ctx.beginPath(); ctx.moveTo(gx, cy - h(gx)); ctx.lineTo(gx, cy + h(gx)); ctx.stroke(); ctx.setLineDash([])
      })
      // particles
      for (const p of P) {
        const sp = v(p.x)
        const y = cy + p.s * h(p.x) * 0.88
        const heat = Math.min(1, (sp - 1.6) / 2.4)
        ctx.strokeStyle = `hsla(${195 - heat * 175}, 95%, ${55 + heat * 10}%, 0.9)`
        ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(p.x - sp * 4, y); ctx.lineTo(p.x, y); ctx.stroke()
        p.x += sp
        if (p.x > width + 10) { p.x = -10; p.s = Math.random() * 2 - 1 }
      }
      // labels
      ctx.font = '13px JetBrains Mono, monospace'; ctx.textAlign = 'center'
      gates.forEach((gx) => {
        const A = (2 * h(gx)) / (2 * H0)
        const sp = v(gx) / 1.6
        ctx.fillStyle = 'rgba(226,232,240,0.9)'
        ctx.fillText(`A=${A.toFixed(2)}  v=${sp.toFixed(2)}`, gx, cy - h(gx) - 22)
        ctx.fillStyle = 'rgba(52,211,153,0.95)'
        ctx.fillText(`A·v = ${(A * sp).toFixed(2)}`, gx, cy - h(gx) - 6)
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [width, height])
  return <canvas ref={ref} className="pipe-canvas" />
}

import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import BurgersPanel from '../components/BurgersPanel.jsx'
import ParcelShear from '../components/ParcelShear.jsx'
import PipeFlow from '../components/PipeFlow.jsx'
import Tex from '../components/Tex.jsx'
import { useT } from '../i18n.jsx'

const up = (d = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] },
})

function useStep(times) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const ids = times.map((ms, i) => setTimeout(() => setStep(i + 1), ms))
    return () => ids.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return step
}

/** A derivation shown one line at a time. */
function Derivation({ lines, step, offset = 0 }) {
  return (
    <div className="deriv">
      {lines.map((l, i) => (
        <motion.div key={i} className={`deriv-line ${l.hot ? 'hot' : ''}`} initial={{ opacity: 0, x: -16 }} animate={{ opacity: step > i + offset ? 1 : 0.08, x: step > i + offset ? 0 : -16 }} transition={{ duration: 0.45 }}>
          <Tex display>{l.tex}</Tex>
          <div className="deriv-note">{l.note}</div>
        </motion.div>
      ))}
    </div>
  )
}

/* ───────────────────────── Continuity ───────────────────────── */
export function Continuity() {
  const t = useT()
  const step = useStep([900, 2100, 3300])
  const lines = [
    { tex: '\\frac{\\partial \\rho}{\\partial t} + \\nabla\\cdot(\\rho\\,\\mathbf{u}) = 0', note: t('massa não se cria nem se destrói', 'mass is neither created nor destroyed') },
    { tex: '\\rho = \\text{const}', note: t('fluido incompressível (água, ar devagar)', 'incompressible fluid (water, slow air)') },
    { tex: '\\nabla\\cdot\\mathbf{u} = 0', note: t('o que entra em qualquer volume, sai', 'whatever flows into any volume flows out'), hot: true },
  ]
  return (
    <div className="slide">
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 1 · Peça 1 de 2', 'Part 1 · Piece 1 of 2')}</motion.div>
        <motion.h2 {...up(0.1)}>{t('Conservação de massa: a equação da continuidade', 'Conservation of mass: the continuity equation')}</motion.h2>
        <div className="two-col wide phys">
          <div>
            <Derivation lines={lines} step={step} />
            <motion.p className="lead small" initial={{ opacity: 0 }} animate={{ opacity: step > 2 ? 1 : 0 }}>
              {t('É a lei de Kirchhoff dos fluidos: num nó, a corrente que entra é a que sai. Se o cano estreita, o fluido ', "It's Kirchhoff's law for fluids: at a node, current in equals current out. If the pipe narrows, the fluid ")}
              <b>{t('precisa acelerar', 'has to speed up')}</b>.
            </motion.p>
          </div>
          <motion.div {...up(0.3)} className="viz-box">
            <PipeFlow width={600} height={250} />
            <div className="viz-cap">{t('Área × velocidade é a mesma em cada seção tracejada.', 'Area × speed is the same at every dashed section.')}</div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Momentum ───────────────────────── */
export function Momentum() {
  const t = useT()
  const step = useStep([800, 2000, 3200, 4400])
  const lines = [
    { tex: '\\rho\\,\\frac{D\\mathbf{u}}{Dt} = \\nabla\\cdot\\sigma + \\rho\\,\\mathbf{f}', note: t('F = ma para cada parcela de fluido (Cauchy)', 'F = ma for every fluid parcel (Cauchy)') },
    { tex: '\\frac{D\\mathbf{u}}{Dt} = \\frac{\\partial \\mathbf{u}}{\\partial t} + (\\mathbf{u}\\cdot\\nabla)\\mathbf{u}', note: t('derivada material: seguir a parcela, não um ponto fixo', 'material derivative: follow the parcel, not a fixed point') },
    { tex: '\\sigma = -p\\,I + \\mu\\,(\\nabla\\mathbf{u} + \\nabla\\mathbf{u}^{\\top})', note: t('fluido newtoniano: atrito ∝ taxa de deformação', 'Newtonian fluid: friction ∝ rate of deformation') },
    { tex: '\\frac{\\partial \\mathbf{u}}{\\partial t} + (\\mathbf{u}\\cdot\\nabla)\\mathbf{u} = -\\nabla p + \\nu\\,\\Delta\\mathbf{u} + \\mathbf{f}', note: t('+ ∇·u = 0  ⇒  Navier–Stokes (com ρ = 1)', '+ ∇·u = 0  ⇒  Navier–Stokes (with ρ = 1)'), hot: true },
  ]
  return (
    <div className="slide">
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 1 · Peça 2 de 2', 'Part 1 · Piece 2 of 2')}</motion.div>
        <motion.h2 {...up(0.1)}>{t('Conservação de momento: Newton para cada gota', 'Conservation of momentum: Newton for every drop')}</motion.h2>
        <div className="two-col wide phys">
          <Derivation lines={lines} step={step} />
          <motion.div {...up(0.3)} className="viz-box">
            <ParcelShear width={540} height={280} high={t('p alta', 'high p')} low={t('p baixa', 'low p')} />
            <div className="viz-cap">
              {t('Uma parcela num canal: a pressão empurra (', 'A parcel in a channel: pressure pushes (')}
              <span style={{ color: '#a78bfa' }}>−∇p</span>
              {t('), as camadas vizinhas puxam e freiam (', '), neighbouring layers pull and drag (')}
              <span style={{ color: '#34d399' }}>νΔu</span>
              {t(') e ela se deforma porque o centro anda mais rápido que a parede.', ') and it deforms because the centre moves faster than the wall.')}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── Euler ───────────────────────── */
export function Euler() {
  const t = useT()
  return (
    <div className="slide">
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 1 · Desligando a viscosidade', 'Part 1 · Switching viscosity off')}</motion.div>
        <motion.h2 {...up(0.1)}>{t('Euler: Navier–Stokes com ν = 0', 'Euler: Navier–Stokes with ν = 0')}</motion.h2>
        <motion.div className="eq-compare" {...up(0.2)}>
          <div><span className="eq-tag ns">Navier–Stokes</span><Tex>{'\\partial_t \\mathbf{u} + (\\mathbf{u}\\cdot\\nabla)\\mathbf{u} = -\\nabla p + \\boxed{\\nu\\,\\Delta\\mathbf{u}} + \\mathbf{f}'}</Tex></div>
          <div><span className="eq-tag eu">Euler</span><Tex>{'\\partial_t \\mathbf{u} + (\\mathbf{u}\\cdot\\nabla)\\mathbf{u} = -\\nabla p + \\phantom{\\boxed{\\nu\\,\\Delta\\mathbf{u}} +{}} \\mathbf{f}'}</Tex></div>
        </motion.div>
        <motion.div className="sims" {...up(0.4)}>
          <BurgersPanel nu={0.05} alpha={1} color="#34d399" title={t('com viscosidade (ν = 0,05)', 'with viscosity (ν = 0.05)')} stopAt={null} tMax={2.4} width={430} height={170} />
          <BurgersPanel nu={0} alpha={1} color="#f472b6" title={t('sem viscosidade (ν = 0)', 'no viscosity (ν = 0)')} stopAt={0.97} tMax={2.4} width={430} height={170} />
        </motion.div>
        <motion.p className="footnote" {...up(0.7)}>
          {t('Simulação ao vivo da equação de Burgers 1D, ', 'Live simulation of the 1D Burgers equation, ')}
          <Tex>{'u_t + u\\,u_x = \\nu\\,u_{xx}'}</Tex>
          {t(' — o "primo de brinquedo" de Navier–Stokes: mesma briga entre advecção e viscosidade, numa dimensão. Sem viscosidade a onda empina até virar um choque. É por isso que Euler é o caso "mais fácil de quebrar" — mas Euler 3D não forma choques assim; lá o mecanismo é o esticamento de vórtices.', ' — Navier–Stokes\'s "toy cousin": same fight between advection and viscosity, in one dimension. Without viscosity the wave steepens into a shock. That is why Euler is the "easier to break" case — though 3D Euler does not form shocks like this; there the mechanism is vortex stretching.')}
        </motion.p>
      </div>
    </div>
  )
}

/* ───────────────────────── Hypodissipative ───────────────────────── */
const ALPHAS = [1, 0.75, 0.5, 0.25]
export function Hypo() {
  const t = useT()
  const [alpha, setAlpha] = useState(1)
  const color = alpha >= 1 ? '#34d399' : alpha >= 0.5 ? '#fbbf24' : '#f472b6'
  // number line 0 … 1.5
  const W = 520, X = (a) => 20 + (a / 1.5) * (W - 40)
  return (
    <div className="slide">
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 1 · Enfraquecendo a viscosidade', 'Part 1 · Weakening viscosity')}</motion.div>
        <motion.h2 {...up(0.1)}>{t('Navier–Stokes hipodissipativo', 'Hypodissipative Navier–Stokes')}</motion.h2>
        <div className="two-col wide phys">
          <div>
            <motion.div className="deriv" {...up(0.2)}>
              <div className="deriv-line hot">
                <Tex display>{'\\partial_t \\mathbf{u} + (\\mathbf{u}\\cdot\\nabla)\\mathbf{u} = -\\nabla p - \\nu\\,(-\\Delta)^{\\alpha}\\,\\mathbf{u} + \\mathbf{f}'}</Tex>
              </div>
              <div className="deriv-line">
                <Tex display>{'\\text{Fourier: } -\\Delta \\;\\leftrightarrow\\; |k|^2 \\quad\\Rightarrow\\quad (-\\Delta)^{\\alpha} \\;\\leftrightarrow\\; |k|^{2\\alpha}'}</Tex>
                <div className="deriv-note">{t('α controla quão forte o "blur" age nas escalas pequenas (k alto). α = 1 é a viscosidade real.', 'α sets how hard the "blur" hits small scales (high k). α = 1 is real viscosity.')}</div>
              </div>
            </motion.div>

            <motion.svg width={W} height={124} className="alpha-line" {...up(0.4)}>
              <line x1={X(0)} x2={X(1.5)} y1={60} y2={60} className="axis" />
              <rect x={X(0)} y={52} width={X(1) - X(0)} height={16} className="zone hypo" />
              <rect x={X(0)} y={50} width={Math.max(6, X(0.046) - X(0))} height={20} className="zone blow" />
              <rect x={X(1.25)} y={52} width={X(1.5) - X(1.25)} height={16} className="zone safe" />
              {[[0, 'Euler'], [0.5, '½'], [1, 'NS'], [1.25, '5/4']].map(([a, l]) => (
                <g key={l}>
                  <line x1={X(a)} x2={X(a)} y1={48} y2={72} className="tick" />
                  <text x={X(a)} y={90} textAnchor="middle" className="lbl">{l}</text>
                </g>
              ))}
              <text x={X(0.5)} y={40} textAnchor="middle" className="lbl hypo">{t('hipodissipativo', 'hypodissipative')}</text>
              <text x={X(1)} y={40} textAnchor="middle" className="lbl q">?</text>
              <text x={X(1.375)} y={40} textAnchor="middle" className="lbl safe">{t('provado suave', 'proved smooth')}</text>
              <motion.circle cy={60} r={8} className="cursor" style={{ fill: color }} animate={{ cx: X(alpha) }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} />
              <text x={X(0) + 10} y={112} className="lbl small blow">{t('↑ blow-up forçado já construído (α < 0,05)', '↑ forced blow-up already built (α < 0.05)')}</text>
            </motion.svg>
            <motion.p className="lead small" {...up(0.6)}>
              {t('Com α ≥ 5/4 já se sabe que tudo fica suave (J.-L. Lions). O α = 1 real fica na zona de dúvida. Em 2024, Córdoba, Martínez-Zoroa e Zheng construíram blow-up forçado — mas só para α muito pequeno (perto de Euler) e com uma força que não é totalmente suave. Essas são as "lacunas".', 'For α ≥ 5/4 everything is known to stay smooth (J.-L. Lions). The real α = 1 sits in the zone of doubt. In 2024, Córdoba, Martínez-Zoroa and Zheng built forced blow-up — but only for very small α (close to Euler) and with a force that is not fully smooth. Those are the "gaps".')}
            </motion.p>
          </div>
          <motion.div {...up(0.3)} className="viz-box">
            <div className="alpha-btns">
              {ALPHAS.map((a) => (
                <button key={a} className={`btn ${alpha === a ? 'on' : ''}`} onClick={() => setAlpha(a)}>
                  α = {a.toLocaleString(t('pt-BR', 'en-US'))}{a === 1 ? ' (NS)' : ''}
                </button>
              ))}
            </div>
            <BurgersPanel key={alpha} nu={0.05} alpha={alpha} color={color} tMax={2.4} width={500} height={180} />
            <div className="viz-cap">
              {t('Burgers 1D com dissipação ', '1D Burgers with dissipation ')}<Tex>{'-\\nu(-\\Delta)^{\\alpha}u'}</Tex>
              {t('. Quanto menor o α, mais íngreme a frente fica. No Burgers fracionário, abaixo de α = ½ formam-se choques em tempo finito (Kiselev, Nazarov & Shterenberg, 2008).', '. The smaller α, the steeper the front gets. In fractal Burgers, below α = ½ shocks form in finite time (Kiselev, Nazarov & Shterenberg, 2008).')}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

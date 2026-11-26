import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import FluidCanvas from '../components/FluidCanvas.jsx'
import BlowupDemo from '../components/BlowupDemo.jsx'
import Counter from '../components/Counter.jsx'
import PolyPlot from '../components/PolyPlot.jsx'
import Tex from '../components/Tex.jsx'
import { Ref } from '../components/Excerpt.jsx'
import { useLang, useT } from '../i18n.jsx'
import { Continuity, Momentum, Euler, Hypo } from './physics.jsx'
import { REFERENCES } from '../references.js'

const up = (d = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] },
})

/* useStep: reveals a slide in stages over time */
function useStep(times) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const ids = times.map((ms, i) => setTimeout(() => setStep(i + 1), ms))
    return () => ids.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return step
}

/* ───────────────────────── 1. Title ───────────────────────── */
function Title() {
  const t = useT()
  return (
    <div className="slide title-slide">
      <FluidCanvas />
      <div className="title-content">
        <motion.div className="kicker" {...up(0.1)}>{t('Um tour de 10 minutos · set–nov 2026', 'A 10-minute tour · Sep–Nov 2026')}</motion.div>
        <motion.h1 {...up(0.25)}>
          {t('A IA resolveu ', 'Did AI solve ')}<span className="grad">Navier–Stokes</span>?
        </motion.h1>
        <motion.p className="subtitle" {...up(0.45)}>
          {t('A física, a execução de 88 horas, a briga por prioridade —', 'The physics, the 88-hour agent run, the priority fight —')}
          <br />
          {t('e por que ', 'and why ')}<code>lean --check ✓</code>{t(' não é o fim da história.', " isn't the end of the story.")}
        </motion.p>
      </div>
    </div>
  )
}

/* ───────────────────────── 2. The equation ───────────────────────── */
function Equation() {
  const t = useT()
  const TERMS = [
    { tex: '\\frac{\\partial \\mathbf{u}}{\\partial t}', name: t('Derivada no tempo', 'Time derivative'), what: t('Como o campo de velocidade muda de um instante para o outro.', 'How the velocity field changes from one instant to the next.'), swe: t('o update de estado — u(t) → u(t + dt)', 'the state update — u(t) → u(t + dt)'), color: '#7dd3fc' },
    { op: '+' },
    { tex: '(\\mathbf{u}\\cdot\\nabla)\\mathbf{u}', name: t('Advecção (não linear)', 'Advection (nonlinear)'), what: t('O fluido carrega a própria velocidade. u multiplica u.', 'The fluid carries its own velocity along. u multiplies u.'), swe: t('um loop de feedback — a saída realimenta a entrada. Todo o problema mora aqui.', 'a feedback loop — the output feeds the input. All the trouble lives here.'), color: '#f472b6' },
    { op: '=' },
    { tex: '-\\nabla p', name: t('Pressão', 'Pressure'), what: t('Empurra o fluido da alta para a baixa pressão, instantaneamente, em todo lugar.', 'Pushes fluid from high to low pressure, instantly, everywhere.'), swe: t('um solver de restrição global que garante o invariante abaixo', 'a global constraint solver enforcing the invariant below'), color: '#a78bfa' },
    { op: '+' },
    { tex: '\\nu\\,\\Delta \\mathbf{u}', name: t('Viscosidade', 'Viscosity'), what: t('Atrito interno. Difunde momento e suaviza gradientes bruscos.', 'Internal friction. Diffuses momentum and smooths sharp gradients.'), swe: t('um filtro de blur — o termo que deveria nos salvar', 'a blur filter — the thing that should save us'), color: '#34d399' },
    { op: '+' },
    { tex: '\\mathbf{f}', name: t('Força externa', 'External force'), what: t('Qualquer coisa empurrando o fluido de fora: gravidade, uma colher mexendo.', 'Anything pushing on the fluid from outside: gravity, a stirring spoon.'), swe: t('input do usuário', 'user input'), color: '#fbbf24' },
  ]
  const CONSTRAINT = { tex: '\\nabla\\cdot\\mathbf{u} = 0', name: t('Incompressibilidade', 'Incompressibility'), what: t('O volume é conservado — sem compressão, sem vácuo.', 'Volume is conserved — no compression, no vacuum.'), swe: t('um invariante que precisa valer a cada passo', 'an invariant that must hold at every step'), color: '#94a3b8' }
  const items = [...TERMS.filter((x) => x.tex), CONSTRAINT]
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => setActive((a) => (a + 1) % items.length), 3200)
    return () => clearInterval(id)
  }, [auto, items.length])
  const cur = items[active]
  let k = -1
  return (
    <div className="slide">
      <FluidCanvas count={500} opacity={0.35} speed={0.6} />
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 1 · A física', 'Part 1 · The physics')}</motion.div>
        <motion.h2 {...up(0.1)}>{t('Navier–Stokes é a engine de física de todo fluido', 'Navier–Stokes is the physics engine for every fluid')}</motion.h2>
        <motion.p className="lead" {...up(0.2)}>
          {t('Ar numa asa, sangue numa artéria, o clima. As mesmas duas linhas — ', 'Air over a wing, blood in an artery, the weather. Same two lines — ')}
          <Tex>{'F = ma'}</Tex>
          {t(' de Newton aplicado a cada ponto do fluido.', " Newton's law applied to every point of a fluid.")}
        </motion.p>
        <div className="equation" onMouseLeave={() => setAuto(true)}>
          {TERMS.map((term, i) => {
            if (term.op) return <motion.span key={i} className="op" {...up(0.3 + i * 0.07)}>{term.op}</motion.span>
            k++
            const idx = k
            return (
              <motion.span key={i} className={`term ${active === idx ? 'on' : ''}`} style={{ '--c': term.color }} onMouseEnter={() => { setAuto(false); setActive(idx) }} {...up(0.3 + i * 0.07)}>
                <Tex>{term.tex}</Tex>
              </motion.span>
            )
          })}
          <span className="sep" />
          <motion.span className={`term ${active === items.length - 1 ? 'on' : ''}`} style={{ '--c': CONSTRAINT.color }} onMouseEnter={() => { setAuto(false); setActive(items.length - 1) }} {...up(1)}>
            <Tex>{CONSTRAINT.tex}</Tex>
          </motion.span>
        </div>
        <motion.div key={active + cur.name} className="term-card" style={{ '--c': cur.color }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
          <div className="term-name">{cur.name}</div>
          <div className="term-what">{cur.what}</div>
          <div className="term-swe"><span>{t('// em termos de código:', '// in code terms:')}</span> {cur.swe}</div>
        </motion.div>
      </div>
    </div>
  )
}

/* ───────────────────────── 3. Blow-up ───────────────────────── */
function Blowup() {
  const t = useT()
  return (
    <div className="slide">
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 1 · O que pode dar errado', 'Part 1 · What could go wrong')}</motion.div>
        <motion.h2 {...up(0.1)}>{t('"Blow-up": a própria matemática retorna NaN', '"Blow-up": the math itself returns NaN')}</motion.h2>
        <motion.p className="lead" {...up(0.2)}>
          {t('A advecção ', 'Advection ')}<span style={{ color: '#f472b6' }}>{t('concentra', 'concentrates')}</span>
          {t(' energia em redemoinhos cada vez menores. A viscosidade ', ' energy into ever-smaller swirls. Viscosity ')}
          <span style={{ color: '#34d399' }}>{t('suaviza', 'smooths')}</span>
          {t('. Se a concentração vencer, a velocidade vai a infinito num tempo finito ', ' it out. If concentration wins, velocity becomes infinite at a finite time ')}
          <Tex>{'T^*'}</Tex>
          {t(' — não é bug de ponto flutuante, é uma singularidade de verdade.', ' — not a floating-point bug, a genuine singularity.')}
        </motion.p>
        <motion.div {...up(0.35)}><BlowupDemo /></motion.div>
        <motion.p className="footnote" {...up(0.6)}>
          {t('Desenho de um colapso auto-similar: tamanho ~ √(T*−t), velocidade ~ 1/√(T*−t). Não é uma simulação da construção real.', 'Cartoon of a self-similar collapse: size ~ √(T*−t), speed ~ 1/√(T*−t). Not a simulation of the actual construction.')}
        </motion.p>
      </div>
    </div>
  )
}

/* ───────────────────────── 4. Millennium problem ───────────────────────── */
function Millennium({ step = 0 }) {
  const t = useT()
  const ALTS = [
    { id: 'A', claim: false, title: t('Sempre suave', 'Always smooth'), where: t('no espaço 3D inteiro', 'in all of 3D space'), force: t('sem força externa', 'no external force'), text: t('Todo estado inicial suave gera uma solução suave para sempre.', 'Every smooth initial state yields a solution that stays smooth forever.') },
    { id: 'B', claim: false, title: t('Sempre suave', 'Always smooth'), where: t('numa caixa periódica', 'on a periodic box'), force: t('sem força externa', 'no external force'), text: t('O mesmo que (A), mas num domínio que se repete (um "toro").', 'Same as (A), but on a domain that wraps around (a "torus").') },
    { id: 'C', claim: true, title: t('Quebra', 'Breaks down'), where: t('no espaço 3D inteiro', 'in all of 3D space'), force: t('com força externa suave', 'with a smooth external force'), text: t('Existe um estado inicial e uma força, ambos suaves, em que a solução explode.', 'There is a smooth initial state and a smooth force for which the solution blows up.') },
    { id: 'D', claim: true, title: t('Quebra', 'Breaks down'), where: t('numa caixa periódica', 'on a periodic box'), force: t('com força externa suave', 'with a smooth external force'), text: t('O mesmo que (C), na caixa periódica.', 'Same as (C), on the periodic box.') },
  ]
  const [votes, setVotes] = useState({})
  const toggle = (id) => setVotes((v) => ({ ...v, [id]: !v[id] }))
  const revealed = step >= 1
  return (
    <div className="slide">
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 1 · A pergunta de US$ 1 milhão', 'Part 1 · The $1,000,000 question')}</motion.div>
        <motion.h2 {...up(0.1)}>{t('Um dos sete Problemas do Milênio do Clay Institute', 'One of the seven Clay Millennium Prize Problems')}</motion.h2>
        <motion.p className="lead" {...up(0.2)}>
          {t('O enunciado oficial de Charles Fefferman tem quatro alternativas, e provar ', "Charles Fefferman's official statement has four alternatives, and proving ")}
          <b>{t('qualquer uma', 'any one')}</b>
          {t(' resolve o problema. ', ' solves the problem. ')}
          <span className="poll-q">{t('Quais vocês acham que são verdadeiras?', 'Which ones do you think are true?')}</span>
        </motion.p>
        <div className="alts">
          {ALTS.map((a, i) => {
            const state = !revealed ? 'neutral' : a.claim ? 'claimed' : 'other'
            return (
              <motion.button
                key={a.id}
                className={`alt poll ${state} ${votes[a.id] ? 'voted' : ''}`}
                onClick={(e) => { toggle(a.id); e.currentTarget.blur() }}
                initial={{ opacity: 0, rotateX: -60, y: 30 }}
                animate={{ opacity: 1, rotateX: 0, y: revealed && a.claim ? -8 : 0 }}
                transition={{ delay: revealed ? 0 : 0.35 + i * 0.15, type: 'spring', stiffness: 120, damping: 14 }}
              >
                <div className="alt-top">
                  <span className="alt-id">({a.id})</span>
                  {votes[a.id] && <span className="vote-mark">✋ {t('votada', 'voted')}</span>}
                </div>
                <div className="alt-title">{a.title}</div>
                <div className="alt-meta">{a.where} · {a.force}</div>
                <div className="alt-text">{a.text}</div>
                {revealed && a.claim && (
                  <motion.div className="claim-badge" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + (a.id === 'D' ? 0.15 : 0), type: 'spring', stiffness: 300, damping: 15 }}>
                    {t('alegação da OpenAI', "OpenAI's claim")}
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
        <div className="poll-foot">
          {step === 0 && (
            <motion.p className="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              {t('Clique nas cartas para marcar os votos da plateia · → revela a alegação da OpenAI', 'Click the cards to mark the audience votes · → reveals OpenAI\'s claim')}
            </motion.p>
          )}
          {step >= 1 && (
            <motion.p className="callout" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              ⚡ {t('Setembro de 2026: a OpenAI alega ter provado ', 'September 2026: OpenAI claims to have proved ')}<b>(C)</b>{t(' e ', ' and ')}<b>(D)</b>{t(' — um blow-up forçado.', ' — a forced blow-up.')}
            </motion.p>
          )}
          {step >= 2 && (
            <motion.p className="callout soft" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              🤔 {t('Pegadinha: (A) e (C) não se contradizem. A força em (C) é escolhida por quem prova — então "sempre suave sem força" continua em aberto.', 'Catch: (A) and (C) do not contradict each other. The force in (C) is chosen by the prover — so "always smooth without force" remains open.')}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── 5. Simulation ≠ proof · Lean ───────────────────────── */
function LeanPrimer() {
  const t = useT()
  const step = useStep([1400, 2600])
  return (
    <div className="slide">
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 1 · Simulação ≠ prova', 'Part 1 · Simulation ≠ proof')}</motion.div>
        <motion.h2 {...up(0.1)}>{t('Lean: um type checker para matemática', 'Lean: a type checker for mathematics')}</motion.h2>
        <div className="two-col wide">
          <div>
            <motion.p className="lead" {...up(0.2)}>
              {t('Uma simulação pode ', 'A simulation can ')}<i>{t('sugerir', 'suggest')}</i>
              {t(' blow-up, mas um NaN numérico nunca prova nada. Para o prêmio é preciso uma ', ' blow-up, but a numerical NaN never proves anything. The prize needs a ')}
              <b>{t('prova', 'proof')}</b>.
            </motion.p>
            <motion.p className="lead" {...up(0.35)}>
              {t('Em Lean, ', 'In Lean, ')}<b>{t('enunciados são tipos e provas são programas', 'statements are types and proofs are programs')}</b>
              {t('. Se compila, a prova do enunciado formal está correta — sem precisar confiar em ninguém.', '. If it compiles, the proof of the formal statement is correct — no trust required.')}
            </motion.p>
          </div>
          <motion.div {...up(0.3)}>
            <pre className="code">
              <span className="c">{t('-- enunciado = tipo', '-- statement = type')}</span>{'\n'}
              <span className="k">theorem</span> add_comm' (a b : ℕ) :{'\n'}
              {'    '}a + b = b + a := <span className="k">by</span>{'\n'}
              {'  '}<span className="f">exact</span> Nat.add_comm a b{'\n'}
              <span className="ok">{t('-- ✓ compilou ⇒ provado', '-- ✓ compiles ⇒ proved')}</span>
            </pre>
          </motion.div>
        </div>
        <div className="gap-row">
          <motion.div className="card checks" initial={{ opacity: 0, y: 20 }} animate={{ opacity: step > 0 ? 1 : 0, y: step > 0 ? 0 : 20 }}>
            <div className="card-h">✓ {t('O que o Lean garante', 'What Lean guarantees')}</div>
            <p>{t('A prova formal prova o enunciado formal.', 'The formal proof proves the formal statement.')}</p>
          </motion.div>
          <motion.div className="card gap" initial={{ opacity: 0, y: 20 }} animate={{ opacity: step > 1 ? 1 : 0, y: step > 1 ? 0 : 20 }}>
            <div className="card-h">? {t('O que o Lean NÃO garante', "What Lean does NOT guarantee")}</div>
            <p>{t('Que o enunciado formal é o que o paper em português/inglês diz. Guarde isso para a Parte 3.', 'That the formal statement is what the English paper says. Hold that thought for Part 3.')}</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── 6. Road to the claim ───────────────────────── */
function Road() {
  const t = useT()
  const ROAD = [
    { when: '2013', who: 'Luo & Hou', what: t('Evidência numérica de que soluções de Euler (viscosidade zero) poderiam explodir em tempo finito.', 'Numerical evidence that Euler (zero-viscosity) solutions could blow up in finite time.') },
    { when: '2023–24', who: 'Córdoba, Martínez-Zoroa (+ Zheng)', what: t('Novas construções de blow-up: Euler 3D sem forçamento, NS hipodissipativo forçado. Perto — com lacunas.', 'New blow-up constructions: unforced 3D Euler, forced hypodissipative NS. Close — with gaps.') },
    { when: t('set 2025', 'Sep 2025'), who: t('22 autores, incl. DeepMind e Buckmaster', '22 authors incl. DeepMind & Buckmaster'), what: t('Singularidades numéricas para as equações IPM (meios porosos) e Boussinesq.', 'Numerical singularities for porous-media (IPM) and Boussinesq equations.') },
    { when: t('ago 2026', 'Aug 2026'), who: t('Buckmaster & Alpöge (em sigilo)', 'Buckmaster & Alpöge (privately)'), what: t('Blow-up forçado para Euler, IPM e Boussinesq — verificado em Lean, não publicado. Feito com LLMs.', 'Forced blow-up for Euler, IPM, Boussinesq — verified in Lean, unpublished. Built with LLMs.') },
    { when: t('set 2026', 'Sep 2026'), who: 'OpenAI', what: t('Anuncia blow-up forçado para o próprio Navier–Stokes.', 'Claims forced blow-up for Navier–Stokes itself.'), hot: true },
  ]
  return (
    <div className="slide">
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 2 · Como chegamos aqui', 'Part 2 · How we got here')}</motion.div>
        <motion.h2 {...up(0.1)}>{t('Uma década de humanos chegando perto', 'A decade of humans closing in')}</motion.h2>
        <div className="road">
          <motion.div className="road-line" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, delay: 0.3, ease: 'easeInOut' }} />
          {ROAD.map((r, i) => (
            <motion.div key={r.who} className={`road-node ${r.hot ? 'hot' : ''}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.3, duration: 0.5 }}>
              <motion.div className="road-dot" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.3, type: 'spring', stiffness: 300 }} />
              <div className="road-when">{r.when}</div>
              <div className="road-who">{r.who}</div>
              <div className="road-what">{r.what}</div>
            </motion.div>
          ))}
        </div>
        <motion.p className="lead small" {...up(2.2)}>
          {t('Boa parte do esforço moderno ataca ', 'Most of the modern push studies ')}<b>Euler</b>
          {t(' primeiro — Navier–Stokes com o termo de viscosidade (o "blur") desligado — porque é o caso mais fácil de quebrar.', ' first — Navier–Stokes with the viscosity term (the "blur filter") switched off — because it is the easier case to break.')}
        </motion.p>
        <motion.div className="refs" {...up(2.4)}><Ref id="wiki-background" /></motion.div>
      </div>
    </div>
  )
}

/* ───────────────────────── 7. The 88-hour run ───────────────────────── */
function Run() {
  const t = useT()
  const lang = useLang()
  const loc = lang === 'en' ? 'en-US' : 'pt-BR'
  const stats = [
    { n: 88, suffix: 'h', label: t('de relógio, desde 1º/set', 'wall-clock, from Sep 1') },
    { n: 10000, suffix: '+', label: t('agentes', 'agents') },
    { n: 2.7, suffix: t(' mi', 'M'), label: t('mensagens', 'messages'), fmt: (v) => v.toLocaleString(loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) },
    { n: 130, suffix: t(' bi', 'B'), label: t('tokens de saída', 'output tokens') },
    { n: 166, suffix: '', label: t('páginas de paper', 'page paper') },
  ]
  return (
    <div className="slide">
      <FluidCanvas count={700} opacity={0.3} speed={1.6} hue={330} />
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 2 · A alegação da OpenAI', "Part 2 · OpenAI's claim")}</motion.div>
        <motion.h2 {...up(0.1)}>{t('Uma execução multiagente de 88 horas', 'An 88-hour multi-agent run')}</motion.h2>
        <div className="stats">
          {stats.map((s, i) => (
            <motion.div key={i} className="stat" {...up(0.25 + i * 0.12)}>
              <div className="stat-n">
                <Counter to={s.n} delay={0.3 + i * 0.12} format={s.fmt ?? ((v) => Math.round(v).toLocaleString(loc))} />
                {s.suffix}
              </div>
              <div className="stat-l">{s.label}</div>
            </motion.div>
          ))}
        </div>
        <motion.div className="two-col" {...up(1)}>
          <div className="card">
            <div className="card-h">{t('Resultado', 'Output')}</div>
            <p>{t('Uma prova de 166 páginas em linguagem natural ', 'A 166-page natural-language proof ')}<b>{t('mais', 'plus')}</b>{t(' uma formalização verificada em Lean. Alegação: alternativas (C) e (D) de Fefferman.', " a machine-checked Lean formalisation. Claimed: Fefferman's alternatives (C) and (D).")}</p>
          </div>
          <div className="card">
            <div className="card-h">{t('Custo', 'Cost')}</div>
            <p>{t('Só a eletricidade foi estimada em ', 'Electricity alone estimated in the ')}<b>{t('milhões de dólares', 'millions of dollars')}</b>{t(' — confirmado por Noam Brown (OpenAI). Anunciado em 8/set/2026; Terence Tao deu os parabéns publicamente.', " — confirmed by OpenAI's Noam Brown. Announced Sep 8, 2026; Terence Tao congratulated publicly.")}</p>
          </div>
        </motion.div>
        <motion.div className="refs" {...up(1.3)}><Ref id="wiki-run" /></motion.div>
      </div>
    </div>
  )
}

/* ───────────────────────── 8. Priority controversy ───────────────────────── */
function Fight() {
  const t = useT()
  const FIGHT = [
    { t: t('2/set', 'Sep 2'), who: 'Alpöge → OpenAI', what: t('Avisado de que o trabalho inédito dele e de Buckmaster tinha vazado.', 'Tipped off that his and Buckmaster’s unpublished work had leaked.') },
    { t: t('6/set · 11h48', 'Sep 6 · 11:48'), who: 'Bubeck (OpenAI) → Alpöge', what: t('Mensagens sobre a solução da OpenAI; reunião com Buckmaster à tarde.', 'Messages about OpenAI’s solution; a meeting with Buckmaster follows that afternoon.') },
    { t: t('7/set · ~23h59', 'Sep 7 · ~23:59'), who: 'Buckmaster', what: t('Publica uma declaração + os resultados para Euler / IPM / Boussinesq.', 'Posts a statement + the Euler / IPM / Boussinesq results.') },
    { t: t('8/set · 12h00', 'Sep 8 · 12:00'), who: 'OpenAI', what: t('Anuncia a solução de Navier–Stokes, ~12 horas depois.', 'Announces its Navier–Stokes solution, ~12 hours later.'), hot: true },
  ]
  return (
    <div className="slide">
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 2 · A briga por prioridade', 'Part 2 · The priority fight')}</motion.div>
        <motion.h2 {...up(0.1)}>{t('Quem chegou primeiro — e com as ideias de quem?', 'Who got there first — and with whose ideas?')}</motion.h2>
        <div className="fight">
          <div className="fight-tl">
            {FIGHT.map((f, i) => (
              <motion.div key={i} className={`ft ${f.hot ? 'hot' : ''}`} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.25 }}>
                <div className="ft-t">{f.t}</div>
                <div><b>{f.who}</b> — {f.what}</div>
              </motion.div>
            ))}
            <motion.div className="refs" {...up(1.4)}><Ref id="wiki-timeline" /></motion.div>
          </div>
          <div className="fight-sides">
            <motion.div className="card side-a" {...up(1.3)}>
              <div className="card-h">{t('Buckmaster (NYU) e Alpöge (Anthropic, a título pessoal)', 'Buckmaster (NYU) & Alpöge (Anthropic, personal capacity)')}</div>
              <p>{t('Os resultados deles para Euler podem ter vazado e inspirado os prompts dos agentes da OpenAI. A OpenAI usou dados de usuários do Codex?', "Their Euler results may have leaked and inspired OpenAI's agent prompts. Did OpenAI use Codex user data?")}</p>
            </motion.div>
            <motion.div className="card side-b" {...up(1.5)}>
              <div className="card-h">OpenAI</div>
              <p>{t('As provas diferem "significativamente". Depois confirmou que dados de uso desidentificados ', 'The proofs differ "significantly". Later confirmed de-identified usage data ')}<i>{t('podem', 'may')}</i>{t(' ter sido usados em treino — mas nega qualquer influência dos prompts de Buckmaster.', " have been used in training — but denies any influence from Buckmaster's prompts.")}</p>
            </motion.div>
            <motion.div className="refs" {...up(1.7)}><Ref id="wiki-dispute" /></motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── 9. Reactions ───────────────────────── */
function Reactions() {
  const t = useT()
  const R = [
    { who: t('25 medalhistas Fields', '25 Fields Medalists'), what: t('Carta "A Severe Misalignment of AI in Mathematics": contra tratar problemas abertos como benchmark.', 'Letter "A Severe Misalignment of AI in Mathematics": against treating open problems as benchmarks.'), c: '#a78bfa' },
    { who: 'Terence Tao', what: t('Elogiou os resultados de Euler; criticou anunciar matemática por press release e rede social em vez de preprint.', 'Praised the Euler results; criticised announcing math via press releases and social media instead of preprints.'), c: '#38bdf8' },
    { who: 'Diego Córdoba', what: t('Não foi avisado por ninguém. Sem o trabalho do grupo dele, diz, a IA não teria resolvido.', "Wasn't notified by anyone. Without his group's work, he says, AI would not have solved it."), c: '#f472b6' },
    { who: 'Steven Strogatz', what: t('O prêmio deveria ir para Córdoba e Martínez-Zoroa.', 'The prize should go to Córdoba and Martínez-Zoroa.'), c: '#fbbf24' },
    { who: 'Yau · Wiedemann', what: t('Disparidade de recursos: quem consegue pagar 10 mil agentes?', 'Resource gap: who can afford 10,000 agents?'), c: '#34d399' },
  ]
  return (
    <div className="slide">
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 2 · A reação', 'Part 2 · The backlash')}</motion.div>
        <motion.h2 {...up(0.1)}>{t('A comunidade matemática responde', 'The math community responds')}</motion.h2>
        <div className="reactions">
          {R.map((r, i) => (
            <motion.div key={i} className="card reaction" style={{ '--c': r.c }} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.18, type: 'spring', stiffness: 160, damping: 16 }}>
              <div className="card-h">{r.who}</div>
              <p>{r.what}</p>
            </motion.div>
          ))}
        </div>
        <motion.div className="refs" {...up(1.4)}><Ref id="wiki-reactions" /></motion.div>
      </div>
    </div>
  )
}

/* ───────────────────────── 10. Lost in translation ───────────────────────── */
function Translation() {
  const t = useT()
  const step = useStep([900, 1800, 2700, 3800])
  const pipe = [t('Prova de 166 páginas (texto + matemática)', '166-page proof (English + math)'), t('IA traduz para Lean', 'AI translates to Lean'), 'lean ✓ compiles']
  return (
    <div className="slide">
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 3 · O paper crítico (arXiv 2610.08144)', 'Part 3 · The critique paper (arXiv 2610.08144)')}</motion.div>
        <motion.h2 {...up(0.1)}>"Navier–Stokes Lost in Translation"</motion.h2>
        <motion.p className="lead small" {...up(0.15)}>Bastounis (King's College London), Circelli & Hansen (Cambridge) · {t('out 2026', 'Oct 2026')}</motion.p>
        <div className="pipeline">
          {pipe.map((s, i) => (
            <motion.div key={i} className={`pipe ${i === 2 ? 'ok' : ''}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: step > i ? 1 : 0.15, scale: step > i ? 1 : 0.9 }}>
              {s}
              {i < 2 && <span className="arrow">→</span>}
            </motion.div>
          ))}
          <motion.div className="pipe q" initial={{ opacity: 0 }} animate={{ opacity: step > 2 ? 1 : 0 }}>
            {t('…mas é a ', '…but is it the ')}<i>{t('mesma', 'same')}</i>{t(' prova?', ' proof?')}
          </motion.div>
        </div>
        <motion.div className="two-col" initial={{ opacity: 0, y: 20 }} animate={{ opacity: step > 3 ? 1 : 0, y: step > 3 ? 0 : 20 }}>
          <div className="card">
            <div className="card-h">{t('Tipo (i) · tradução de prova', 'Type (i) · proof translation')}</div>
            <p>{t('O enunciado já está formalizado; a IA só precisa achar ', 'The statement is already formalised; the AI just needs to find ')}<b>{t('alguma', 'some')}</b>{t(' prova que compile. Fácil de checar.', ' proof that compiles. Easy to check.')}</p>
          </div>
          <div className="card gap">
            <div className="card-h">{t('Tipo (ii) · tradução semântica fiel', 'Type (ii) · faithful semantic translation')}</div>
            <p>{t('Traduzir o texto ', 'Translate the ')}<b>{t('inteiro', 'whole')}</b>{t(' — definições, enunciados, provas — preservando o significado. É isso que "a prova da OpenAI foi verificada em Lean" pressupõe.', ' text — definitions, statements, proofs — preserving meaning. That is what "OpenAI\'s proof was verified in Lean" presupposes.')}</p>
          </div>
        </motion.div>
        <motion.p className="footnote" initial={{ opacity: 0 }} animate={{ opacity: step > 3 ? 1 : 0 }} transition={{ delay: 0.4 }}>
          {t('Os autores ', 'The authors make ')}<b>{t('não afirmam', 'no claim')}</b>{t(' se a prova em linguagem natural da OpenAI está certa ou errada — só que a checagem em Lean não a certifica.', " about whether OpenAI's natural-language proof is right or wrong — only that the Lean check doesn't certify it.")}
        </motion.p>
        <motion.div className="refs" initial={{ opacity: 0 }} animate={{ opacity: step > 3 ? 1 : 0 }}><Ref id="paper-intro" /></motion.div>
      </div>
    </div>
  )
}

/* ───────────────────────── 11. Toy example 2.1 ───────────────────────── */
function Toy() {
  const t = useT()
  const step = useStep([1200, 2600, 3800])
  return (
    <div className="slide">
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 3 · Um exemplo de brinquedo', 'Part 3 · A toy example')}</motion.div>
        <motion.h2 {...up(0.1)}>{t('O tradutor consertou o bug — e ninguém viu', 'The translator fixed the bug — and nobody noticed')}</motion.h2>
        <div className="two-col wide">
          <div>
            <motion.div className="claim" {...up(0.25)}>
              <Tex display>{'p(x) = x^3 - x^2 - x + 1 \\;\\ge\\; 0 \\quad (x \\ge -1)'}</Tex>
            </motion.div>
            <motion.div className="factor wrong" initial={{ opacity: 0, x: -20 }} animate={{ opacity: step > 0 ? 1 : 0, x: 0 }}>
              <span className="tag">{t('prova em texto', 'NL proof')}</span>
              <Tex>{'p(x) = (x-1)(x+1)^2'}</Tex>
              <motion.span className="strike" initial={{ scaleX: 0 }} animate={{ scaleX: step > 1 ? 1 : 0 }} transition={{ duration: 0.5 }} />
              <span className="verdict bad">✗ {t('multiplicidades erradas', 'wrong multiplicities')}</span>
            </motion.div>
            <motion.div className="factor right" initial={{ opacity: 0, x: -20 }} animate={{ opacity: step > 1 ? 1 : 0, x: 0 }}>
              <span className="tag">Lean</span>
              <Tex>{'p(x) = (x-1)^2(x+1)'}</Tex>
              <span className="verdict good">✓ compiles</span>
            </motion.div>
            <motion.p className="lead small" initial={{ opacity: 0 }} animate={{ opacity: step > 2 ? 1 : 0 }}>
              {t('Pediram ao chatbot para formalizar a prova errada. Ele achou as multiplicidades certas e entregou um Lean que compila. É como um PR com bug passando no CI porque o CI rodou num código que outra pessoa reescreveu.', 'A chatbot was asked to formalise the wrong proof. It found the right multiplicities and returned Lean that compiles. Like a buggy PR passing CI because CI ran on code someone else rewrote.')}
            </motion.p>
          </div>
          <motion.div {...up(0.4)}>
            <PolyPlot wrong={step > 0} />
            <div className="legend"><span className="sw ok" /> p(x) <span className="sw bad" /> (x−1)(x+1)²</div>
          </motion.div>
        </div>
        <motion.div className="refs" {...up(1)}><Ref id="paper-ex21" /><Ref id="paper-ex22" /></motion.div>
      </div>
    </div>
  )
}

/* ───────────────────────── 12. Navier–Stokes mistranslations ───────────────────────── */
function NSDiffs() {
  const t = useT()
  const step = useStep([700, 2000, 3200])
  return (
    <div className="slide">
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 3 · No paper de verdade', 'Part 3 · In the real paper')}</motion.div>
        <motion.h2 {...up(0.1)}>{t('Compila. Mas não é o que o paper diz.', "It compiles. But it isn't what the paper says.")}</motion.h2>

        <motion.div className="diff" initial={{ opacity: 0, y: 20 }} animate={{ opacity: step > 0 ? 1 : 0, y: step > 0 ? 0 : 20 }}>
          <div className="diff-h">{t('Lema 8.6 · ', 'Lemma 8.6 · ')}<span className="mono-dim">SmoothFamilyTorusInverse.lean › norm_derivativeWord_inverse_le</span></div>
          <div className="diff-row del"><span className="sign">−</span> <span className="src">paper</span> <Tex>{'\\|N^{-1}F\\|_{C^m} \\le C_m\\,\\|F\\|_{C^{\\,m+4}}'}</Tex></div>
          <div className="diff-row add"><span className="sign">+</span> <span className="src">lean</span> <Tex>{'\\|N^{-1}F\\|_{C^m} \\le K_m\\,\\|F\\|_{C^{\\,m+5}}'}</Tex></div>
          <div className="diff-note">{t('Uma derivada a mais: o Lean provou um lema ', 'One extra derivative: Lean proved a ')}<b>{t('mais fraco', 'weaker')}</b>{t(' do que o paper afirma.', ' lemma than the paper claims.')} <Ref id="paper-ex31" label={t('Ex. 3.1', 'Ex. 3.1')} /></div>
        </motion.div>

        <motion.div className="diff" initial={{ opacity: 0, y: 20 }} animate={{ opacity: step > 1 ? 1 : 0, y: step > 1 ? 0 : 20 }}>
          <div className="diff-h">{t('Fluxo de pressão, eq. 10.19 · ', 'Pressure flux, eq. 10.19 · ')}<span className="mono-dim">PressureFlux.lean › exists_uniform_actual_pressure_flux_bound</span></div>
          <div className="diff-note">{t('Enunciado e prova mudaram: o limite do Lean depende de uma quantidade extra (', 'Both statement and proof changed: the Lean bound depends on an extra quantity (')}<Tex>{'A_R'}</Tex>{t('), usa outras desigualdades e outros expoentes. Os dois limites nem são diretamente comparáveis.', '), uses different inequalities and exponents. The two bounds are not even directly comparable.')} <Ref id="paper-ex33" label={t('Ex. 3.3', 'Ex. 3.3')} /></div>
        </motion.div>

        <motion.div className="badges" initial={{ opacity: 0 }} animate={{ opacity: step > 2 ? 1 : 0 }}>
          <span className="badge">{t('benigna: outra prova correta', 'benign: a different correct proof')}</span>
          <span className="badge warn">{t('conserta erros do texto', 'repairs errors in the text')}</span>
          <span className="badge bad">{t('enfraquece ou fortalece o resultado', 'weakens or strengthens the result')}</span>
          <Ref id="paper-taxonomy" />
        </motion.div>
      </div>
    </div>
  )
}

/* ───────────────────────── 13. Why it's hard ───────────────────────── */
function Hard() {
  const t = useT()
  const LADDER = [
    { label: t('Problema da parada', 'Halting problem'), sci: '1', h: 22 },
    { label: t('"nₑ está bem definido?" (Σ⁰₂)', '"Is nₑ well-defined?" (Σ⁰₂)'), sci: '2', h: 40 },
    { label: t('…um problema em cada nível', '…a problem at every level'), sci: 'l', h: 62 },
    { label: t('Autoformalização fiel', 'Faithful autoformalisation'), sci: '∞', h: 100, hot: true },
  ]
  return (
    <div className="slide">
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Parte 3 · Por que isso é difícil', 'Part 3 · Why this is hard')}</motion.div>
        <motion.h2 {...up(0.1)}>{t('Os testes passam. A spec está errada.', 'Tests pass. The spec is wrong.')}</motion.h2>
        <div className="two-col wide">
          <motion.div {...up(0.25)}>
            <pre className="code">
              <span className="c">{t('-- texto: "seja nₑ o menor n tal que P n"', '-- paper: "let nₑ be the least n such that P n"')}</span>{'\n'}
              <span className="k">noncomputable def</span> nₑ : ℕ := <span className="f">sInf</span> {'{'}n | P n{'}'}{'\n\n'}
              <span className="c">{t('-- e se esse n não existir…', '-- if no such n exists…')}</span>{'\n'}
              <span className="k">example</span> : <span className="f">sInf</span> (∅ : Set ℕ) = <span className="n">0</span> := <span className="f">Nat.sInf_empty</span>{'\n'}
              <span className="ok">{t('-- ✓ compila. "indefinido" virou 0 em silêncio.', '-- ✓ compiles. "undefined" silently became 0.')}</span>
            </pre>
            <p className="lead small">
              {t('Como um ', 'Like ')}<code>valor ?? 0</code>{t(' engolindo um campo ausente. E o loop atual de IA é basicamente:', ' swallowing a missing field. And the current AI loop is basically:')}
            </p>
            <pre className="code small">
              <span className="k">while not</span> lean_compiles(tr):{'\n'}
              {'    '}tr = ai.revise(tr){'\n'}
              <span className="c">{t('# aceita QUALQUER tradução que compila', '# accepts ANY translation that compiles')}</span>
            </pre>
            <div className="refs"><Ref id="paper-sinf" /></div>
          </motion.div>
          <motion.div className="ladder-wrap" {...up(0.4)}>
            <div className="ladder">
              {LADDER.map((l, i) => (
                <div key={i} className="rung">
                  <motion.div className={`bar ${l.hot ? 'hot' : ''}`} initial={{ height: 0 }} animate={{ height: `${l.h}%` }} transition={{ delay: 0.7 + i * 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
                    <span>SCI {l.sci}</span>
                  </motion.div>
                  <div className="rung-l">{l.label}</div>
                </div>
              ))}
            </div>
            <p className="footnote">{t('Solvability Complexity Index. O paper argumenta que resolver ambiguidade em texto matemático tem SCI = ∞ — informalmente, mais difícil que o problema da parada, mesmo com um oráculo para ele.', 'Solvability Complexity Index. The paper argues resolving ambiguity in mathematical text has SCI = ∞ — informally, harder than the Halting problem, even with a Halting oracle.')}</p>
            <div className="refs"><Ref id="paper-sci" /></div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── 14. Where it stands ───────────────────────── */
function Status() {
  const t = useT()
  const TAKE = [
    { icon: '✓≠✓', h: t('"Compila" ≠ "correto"', '"Compiles" ≠ "correct"'), p: t('O Lean certifica o enunciado formal que recebeu — não o paper. A spec é a parte difícil, igualzinho a software.', 'Lean certifies the formal statement it was given — not the paper. The spec is the hard part, exactly like in software.') },
    { icon: '⚙', h: t('Compute virou instrumento de pesquisa', 'Compute is a research instrument'), p: t('10 mil+ agentes por 88 horas. Quem consegue bancar matemática de fronteira?', '10,000+ agents for 88 hours. Who can afford frontier math?') },
    { icon: '⛓', h: t('Proveniência importa', 'Provenance matters'), p: t('Dados de treino, crédito e citações — Córdoba e Martínez-Zoroa só foram citados numa versão revisada.', 'Training data, credit and citations — Córdoba & Martínez-Zoroa were only referenced in a revised version.') },
  ]
  return (
    <div className="slide">
      <FluidCanvas count={600} opacity={0.3} speed={0.5} />
      <div className="content">
        <motion.div className="kicker" {...up()}>{t('Em novembro de 2026', 'As of November 2026')}</motion.div>
        <motion.h2 {...up(0.1)}>Status: <span className="grad">{t('em aberto', 'unresolved')}</span></motion.h2>
        <motion.div className="status-row" {...up(0.2)}>
          <span className="pill">{t('Clay: ninguém reconhecido — exige publicação revisada por pares', 'Clay: no one recognized — peer-reviewed publication required')}</span>
          <span className="pill">{t('OpenAI: não vai reivindicar o prêmio', "OpenAI: won't claim the prize")}</span>
          <span className="pill">{t('Status no site do Clay: "active"', 'Clay website status: "active"')}</span>
          <Ref id="wiki-clay" />
        </motion.div>
        <div className="takeaways">
          {TAKE.map((x, i) => (
            <motion.div key={i} className="card take" {...up(0.4 + i * 0.15)}>
              <div className="take-icon">{x.icon}</div>
              <div className="card-h">{x.h}</div>
              <p>{x.p}</p>
            </motion.div>
          ))}
        </div>
        <motion.div className="sources" {...up(1)}>
          {t('Fontes', 'Sources')}: Wikipedia, "Navier–Stokes priority controversy" · Bastounis, Circelli & Hansen, arXiv:2610.08144 · Luis Serrano Academy (YouTube)
        </motion.div>
      </div>
    </div>
  )
}

/* ───────────────────────── References ───────────────────────── */
function References() {
  const t = useT()
  const lang = useLang()
  return (
    <div className="slide">
      <div className="content refs-slide">
        <motion.div className="kicker" {...up()}>{t('Para ir mais fundo', 'To go deeper')}</motion.div>
        <motion.h2 {...up(0.1)}>{t('Referências', 'References')}</motion.h2>
        <div className="ref-grid">
          {REFERENCES.map((g, gi) => (
            <motion.div key={gi} className="ref-group" {...up(0.2 + gi * 0.12)}>
              <div className="ref-group-h">{g.group[lang]}</div>
              <ol>
                {g.items.map((it, k) => (
                  <li key={k}>
                    {it.url ? <a href={it.url} target="_blank" rel="noreferrer">{it.text}</a> : <span>{it.text}</span>}
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────── registry ───────────────────────── */
export const slides = [
  { id: 'title', C: Title, time: 15, notes: {
    pt: 'Gancho: em setembro de 2026 a OpenAI disse que um sistema de IA resolveu um dos sete Problemas do Milênio. Dois meses depois, ninguém aceitou oficialmente. Em 10 minutos: a física, a alegação, a briga e um paper que explica por que "passou no type checker" não basta.',
    en: 'Hook: in September 2026 OpenAI said an AI system solved one of the seven Millennium Prize Problems. Two months later nobody has officially accepted it. In ten minutes: the physics, the claim, the fight, and a paper explaining why "it type-checks" is not enough.' } },
  { id: 'equation', C: Equation, time: 35, notes: {
    pt: 'Navier–Stokes é o F = ma de Newton para fluidos. Passe o mouse em cada termo. Destaque dois: a advecção é NÃO LINEAR — velocidade vezes velocidade, um loop de feedback. A viscosidade é um filtro de blur que suaviza. O problema inteiro é a briga entre esses dois. A pressão é um "solver global" que garante o invariante ∇·u = 0.',
    en: "Navier–Stokes is Newton's F = ma for fluids. Hover each term. Stress two: advection is NONLINEAR — velocity times velocity, a feedback loop. Viscosity is a blur filter. The whole problem is the fight between those two. Pressure is a global solver enforcing the invariant ∇·u = 0." } },
  { id: 'continuity', C: Continuity, time: 40, notes: {
    pt: 'Primeira peça: conservação de massa. A forma geral diz que massa não se cria nem se destrói; com densidade constante, sobra ∇·u = 0. Na prática: o que entra em qualquer volume tem que sair — Kirchhoff para fluidos. Mostre o cano: onde ele estreita, a velocidade sobe, e A·v fica constante nas três seções.',
    en: 'First piece: conservation of mass. The general form says mass is neither created nor destroyed; with constant density, ∇·u = 0 remains. In practice: whatever flows into any volume flows out — Kirchhoff for fluids. Show the pipe: where it narrows, speed rises, and A·v stays constant at the three sections.' } },
  { id: 'momentum', C: Momentum, time: 50, notes: {
    pt: 'Segunda peça: F = ma para cada parcela. A derivada material D/Dt é "seguir a gota" — e é dela que sai o termo não linear (u·∇)u. A hipótese de fluido newtoniano (atrito proporcional à deformação) gera o termo de viscosidade. Juntando com ∇·u = 0, temos Navier–Stokes. Na animação: pressão empurra da esquerda, a camada lenta perto da parede freia, a rápida no centro puxa, e a parcela se deforma.',
    en: 'Second piece: F = ma for every parcel. The material derivative D/Dt means "follow the drop" — and that is where the nonlinear term (u·∇)u comes from. The Newtonian-fluid assumption (friction proportional to deformation) gives the viscosity term. Add ∇·u = 0 and you have Navier–Stokes. In the animation: pressure pushes from the left, the slow layer near the wall drags, the fast centre pulls, and the parcel deforms.' } },
  { id: 'euler', C: Euler, time: 45, notes: {
    pt: 'Euler é Navier–Stokes sem o "blur". A simulação é real (Burgers 1D, espectral, rodando no navegador): com viscosidade a frente fica íngreme mas estabiliza; sem viscosidade ela vira um choque e o gradiente explode em t = 1. Ressalva honesta: em 3D o mecanismo é outro (esticamento de vórtices), mas a intuição é a mesma — sem dissipação é mais fácil quebrar. Por isso Hou-Luo e Córdoba atacaram Euler primeiro.',
    en: 'Euler is Navier–Stokes without the "blur". The simulation is real (spectral 1D Burgers, running in the browser): with viscosity the front steepens but stabilises; without it a shock forms and the gradient blows up at t = 1. Honest caveat: in 3D the mechanism differs (vortex stretching), but the intuition holds — without dissipation it is easier to break. That is why Hou–Luo and Córdoba attacked Euler first.' } },
  { id: 'hypo', C: Hypo, time: 50, notes: {
    pt: 'Meio-termo: em vez de desligar a viscosidade, enfraquecer. No espaço de Fourier, o Laplaciano vira |k|²; trocando por |k|^{2α} com α < 1, as escalas pequenas são menos amortecidas. Clique nos botões de α: a frente fica cada vez mais íngreme. Na reta: α ≥ 5/4 é provado suave (Lions), α = 1 é o problema real e está em aberto, e Córdoba, Martínez-Zoroa e Zheng construíram blow-up forçado só para α muito pequeno (perto de 0) e com força não totalmente suave. É essa distância até α = 1 com força suave que a OpenAI diz ter fechado.',
    en: 'Middle ground: instead of switching viscosity off, weaken it. In Fourier space the Laplacian becomes |k|²; replacing it with |k|^{2α} for α < 1 damps small scales less. Click the α buttons: the front gets steeper and steeper. On the line: α ≥ 5/4 is proved smooth (Lions), α = 1 is the real, open problem, and Córdoba, Martínez-Zoroa and Zheng built forced blow-up only for very small α (near 0) and with a not-fully-smooth force. That distance to α = 1 with a smooth force is what OpenAI claims to have closed.' } },
  { id: 'blowup', C: Blowup, time: 45, notes: {
    pt: 'Todo engenheiro já viu uma simulação explodir em NaN. Normalmente é bug numérico. A pergunta aqui é: a solução VERDADEIRA, com matemática exata, pode explodir — velocidade infinita num tempo finito? Se o redemoinho concentrar mais rápido do que a viscosidade suaviza, sim.',
    en: "Every engineer has seen a simulation explode into NaN. Usually it's a numerics bug. The question: can the TRUE solution, with exact math, blow up — infinite velocity at a finite time? If the swirl concentrates faster than viscosity smooths it, yes." } },
  { id: 'millennium', C: Millennium, time: 55, steps: 2, notes: {
    pt: 'ENQUETE. Leia as quatro alternativas e pergunte: quais vocês acham verdadeiras? Clique nas cartas para marcar os votos. → revela: a OpenAI alega (C) e (D), o lado "quebra se você empurrar com uma força suave". → de novo: a pegadinha — (A) e (C) podem ser verdadeiras ao mesmo tempo, porque em (C) quem prova escolhe a força. Ou seja, mesmo que a OpenAI esteja certa, "sem força, é sempre suave?" continua em aberto.',
    en: 'POLL. Read the four alternatives and ask: which do you think are true? Click the cards to mark votes. → reveals: OpenAI claims (C) and (D), the "it breaks if you push it with a smooth force" side. → again: the catch — (A) and (C) can both be true, because in (C) the prover chooses the force. So even if OpenAI is right, "without force, is it always smooth?" remains open.' } },
  { id: 'lean', C: LeanPrimer, time: 40, notes: {
    pt: 'Antes da história, um conceito-chave: simulação não prova nada. Lean é uma linguagem onde enunciado é tipo e prova é programa — se compila, está provado. MAS o Lean só garante que a prova formal prova o enunciado formal. Ele não sabe se o enunciado formal é o que o paper diz. Essa é a frase que fecha a palestra.',
    en: "Before the story, one key idea: simulations prove nothing. Lean is a language where a statement is a type and a proof is a program — if it compiles, it's proved. BUT Lean only guarantees the formal proof proves the formal statement. It doesn't know whether that statement is what the paper says. That line pays off at the end." } },
  { id: 'road', C: Road, time: 45, notes: {
    pt: 'Isso não surgiu do nada. Hou & Luo 2013, numérico; Córdoba & Martínez-Zoroa 2023, construções; DeepMind + Buckmaster 2025, singularidades numéricas. E — chave para a polêmica — Buckmaster & Alpöge já tinham, em sigilo, blow-ups forçados para Euler em agosto de 2026, verificados em Lean, usando LLMs. (Abra o chip da Wikipedia se alguém perguntar.)',
    en: "This didn't come from nowhere. Hou & Luo 2013 numerics; Córdoba & Martínez-Zoroa 2023 constructions; DeepMind + Buckmaster 2025 numerical singularities. And — key for the controversy — Buckmaster & Alpöge privately had forced blow-ups for Euler by August 2026, verified in Lean, using LLMs." } },
  { id: 'run', C: Run, time: 50, notes: {
    pt: 'A execução da OpenAI: sistema multiagente interno, 88 horas, mais de 10 mil agentes, 2,7 milhões de mensagens, 130 bilhões de tokens de saída. Saída: paper de 166 páginas + formalização em Lean. Eletricidade na casa dos milhões. Tao deu os parabéns no dia.',
    en: "OpenAI's run: an internal multi-agent system, 88 hours, 10k+ agents, 2.7M messages, 130B output tokens. Output: a 166-page paper plus a Lean formalisation. Electricity in the millions. Tao congratulated them on the day." } },
  { id: 'fight', C: Fight, time: 55, notes: {
    pt: 'Linha do tempo comprimida. Alpöge descobre que o trabalho vazou; a OpenAI procura os dois; Buckmaster publica na noite anterior; a OpenAI anuncia ~12h depois. A disputa: ideias vazadas ou dados de usuários do Codex moldaram os prompts? A OpenAI diz que as provas são diferentes, admite que dados de uso desidentificados podem ter ido para o treino, nega influência.',
    en: "Compressed timeline. Alpöge hears their work leaked; OpenAI reaches out; Buckmaster publishes the night before; OpenAI announces ~12h later. The dispute: did leaked ideas or Codex user data shape the prompts? OpenAI says the proofs differ, admits de-identified usage data may have been used in training, denies influence." } },
  { id: 'reactions', C: Reactions, time: 40, notes: {
    pt: 'Reação rápida e dura: carta de medalhistas Fields contra tratar problemas abertos como benchmark; Tao contra anunciar matemática por press release; Córdoba nem foi avisado; Strogatz quer o prêmio para Córdoba e Martínez-Zoroa; Yau e Wiedemann sobre disparidade de recursos.',
    en: 'Fast, sharp reaction: Fields Medalists\' letter against treating open problems as benchmarks; Tao against math-by-press-release; Córdoba wasn\'t even notified; Strogatz wants the prize for Córdoba & Martínez-Zoroa; Yau and Wiedemann on the resource gap.' } },
  { id: 'translation', C: Translation, time: 50, notes: {
    pt: 'O paper que dá base à Parte 3. Todo mundo disse "está verificado em Lean". Os autores separam dois tipos de autoformalização: (i) achar alguma prova que compile para um enunciado já formal; (ii) traduzir o texto inteiro preservando o significado. A frase "a prova foi verificada" pressupõe o tipo (ii). Importante: eles NÃO dizem que a prova está errada.',
    en: 'The paper behind Part 3. Everyone said "it\'s verified in Lean". The authors separate (i) finding some compiling proof of an already-formal statement from (ii) translating the whole text preserving meaning. "The proof was verified" presupposes (ii). Important: they do NOT say the proof is wrong.' } },
  { id: 'toy', C: Toy, time: 40, notes: {
    pt: 'Exemplo de brinquedo do próprio paper: a prova em texto fatora o polinômio errado. O chatbot formaliza, "corrige" sozinho e o Lean compila. Resultado: um selo de verificado em cima de uma prova errada. Analogia: PR com bug passa no CI porque o CI rodou em outro código.',
    en: "The paper's own toy example: the NL proof factors the polynomial wrong. The chatbot formalises it, silently fixes it, and Lean compiles. Result: a verified badge on top of a wrong proof. Analogy: a buggy PR passes CI because CI ran on different code." } },
  { id: 'nsdiffs', C: NSDiffs, time: 45, notes: {
    pt: 'Agora no paper real da OpenAI. Lema 8.6: o texto precisa de m+4 derivadas, o Lean de m+5 — é outro lema, mais fraco. Eq. 10.19: enunciado e prova mudaram, depende de outra quantidade. Más traduções podem ser benignas, consertar erros, ou mudar o resultado. Clique nos chips para mostrar os trechos.',
    en: "Now in OpenAI's real paper. Lemma 8.6: the text needs m+4 derivatives, Lean needs m+5 — a different, weaker lemma. Eq. 10.19: statement and proof both changed. Mistranslations can be benign, repair errors, or change the result. Click the chips to show the excerpts." } },
  { id: 'hard', C: Hard, time: 45, notes: {
    pt: 'Por que isso acontece: em Lean, o ínfimo do conjunto vazio é 0, então "o menor n tal que…" compila mesmo quando esse n não existe. Como um ?? 0 escondendo bug. E o loop de IA aceita qualquer tradução que compila. Os autores argumentam que resolver ambiguidade fielmente tem SCI = ∞ — informalmente, mais difícil que o problema da parada.',
    en: 'Why it happens: Lean defines sInf of the empty set as 0, so "the least n such that…" compiles even when no such n exists. Like a ?? 0 hiding a bug. And the AI loop accepts any compiling translation. The authors argue faithful disambiguation has SCI = ∞ — informally, harder than the Halting problem.' } },
  { id: 'status', C: Status, time: 40, notes: {
    pt: 'Onde estamos: o Clay não reconheceu ninguém e exige publicação revisada por pares; a OpenAI diz que não vai pedir o prêmio. Três lições para engenheiros: compilar não é estar correto — a spec é a parte difícil; compute virou instrumento de pesquisa; proveniência e crédito importam.',
    en: "Where it stands: Clay hasn't recognized anyone and requires peer-reviewed publication; OpenAI says it won't claim the prize. Three takeaways: compiling isn't being correct — the spec is the hard part; compute is now a research instrument; provenance and credit matter." } },
  { id: 'references', C: References, time: 0, notes: {
    pt: 'Deixe na tela durante as perguntas. Todas as referências com link abrem numa nova aba.',
    en: 'Leave up during Q&A. Every linked reference opens in a new tab.' } },
]

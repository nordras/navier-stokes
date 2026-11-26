import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { slides } from './slides/index.jsx'
import { ExcerptContext, LangContext } from './i18n.jsx'
import { ExcerptModal } from './components/Excerpt.jsx'

const fromHash = () => {
  const n = parseInt(window.location.hash.replace(/^#(slide-)?\/?/, ''), 10)
  return Number.isFinite(n) && n >= 1 && n <= slides.length ? n - 1 : 0
}
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const loadLang = () => {
  try { return localStorage.getItem('ns-lang') || 'pt' } catch { return 'pt' }
}

const UI = {
  pt: { notes: 'Notas do apresentador', target: 'meta', paused: '(pausado — T)', help: 'Atalhos', next: 'próximo', prev: 'anterior', notesK: 'notas', timer: 'iniciar/pausar cronômetro', reset: 'zerar', full: 'tela cheia', lang: 'português / inglês', esc: 'fecha o trecho aberto', helpK: 'esta ajuda' },
  en: { notes: 'Speaker notes', target: 'target', paused: '(paused — T)', help: 'Shortcuts', next: 'next', prev: 'previous', notesK: 'notes', timer: 'start/pause timer', reset: 'reset', full: 'fullscreen', lang: 'Portuguese / English', esc: 'closes the open excerpt', helpK: 'this help' },
}

export default function App() {
  const [i, setI] = useState(fromHash)
  const [dir, setDir] = useState(1)
  const [notes, setNotes] = useState(false)
  const [help, setHelp] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [lang, setLang] = useState(loadLang)
  const [excerpt, setExcerpt] = useState(null)
  const [sub, setSub] = useState(0) // in-slide step (for slides with `steps`)
  const ui = UI[lang]

  const go = useCallback((n, atEnd = false) => {
    const next = Math.max(0, Math.min(slides.length - 1, n))
    setI((cur) => {
      setDir(next >= cur ? 1 : -1)
      return next
    })
    setSub(atEnd ? slides[next].steps ?? 0 : 0)
    setExcerpt(null)
  }, [])
  const forward = useCallback(() => {
    if (sub < (slides[i].steps ?? 0)) setSub(sub + 1)
    else go(i + 1)
  }, [i, sub, go])
  const back = useCallback(() => {
    if (sub > 0) setSub(sub - 1)
    else go(i - 1, true)
  }, [i, sub, go])

  const iRef = useRef(i)
  useEffect(() => { iRef.current = i; window.location.hash = `slide-${i + 1}` }, [i])
  useEffect(() => {
    const onHash = () => { const n = fromHash(); if (n !== iRef.current) go(n) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [go])

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
    try { localStorage.setItem('ns-lang', lang) } catch { /* storage unavailable */ }
  }, [lang])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  useEffect(() => {
    const onKey = (e) => {
      if (excerpt) {
        if (e.key === 'Escape') setExcerpt(null)
        return // keyboard nav paused while an excerpt is open
      }
      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); forward(); setRunning(true) }
      else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); back() }
      else if (e.key === 'Home') go(0)
      else if (e.key === 'End') go(slides.length - 1)
      else if (e.key === 'n' || e.key === 'N') setNotes((v) => !v)
      else if (e.key === 't' || e.key === 'T') setRunning((v) => !v)
      else if (e.key === 'r' || e.key === 'R') { setElapsed(0); setRunning(false) }
      else if (e.key === 'l' || e.key === 'L') setLang((l) => (l === 'pt' ? 'en' : 'pt'))
      else if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) document.exitFullscreen()
        else document.documentElement.requestFullscreen?.().catch(() => {})
      } else if (e.key === '?' || e.key === 'h') setHelp((v) => !v)
      else if (e.key === 'Escape') setHelp(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [i, go, excerpt, forward, back])

  const S = slides[i]
  const budget = slides.slice(0, i + 1).reduce((a, s) => a + s.time, 0)
  const total = slides.reduce((a, s) => a + s.time, 0)

  return (
    <LangContext.Provider value={lang}>
      <ExcerptContext.Provider value={setExcerpt}>
        <div className="deck">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={S.id + lang}
              className="stage"
              custom={dir}
              initial={{ opacity: 0, x: 60 * dir, filter: 'blur(6px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -60 * dir, filter: 'blur(6px)' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <S.C step={sub} />
            </motion.div>
          </AnimatePresence>

          <div className="hud">
            <div className="lang-toggle" role="group" aria-label="Language">
              {['pt', 'en'].map((l) => (
                <button key={l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
              ))}
            </div>
            <button className="nav" onClick={back} disabled={i === 0 && sub === 0} aria-label="Previous">‹</button>
            <span className="count">
              {i + 1} / {slides.length}
              {S.steps ? <span className="substeps">{Array.from({ length: S.steps + 1 }, (_, k) => <i key={k} className={k <= sub ? 'on' : ''} />)}</span> : null}
            </span>
            <button className="nav" onClick={() => { forward(); setRunning(true) }} disabled={i === slides.length - 1} aria-label="Next">›</button>
          </div>
          <motion.div className="progress" animate={{ scaleX: (i + 1) / slides.length }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />

          <AnimatePresence>
            {notes && (
              <motion.aside className="notes" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}>
                <div className="notes-top">
                  <span>{ui.notes} · ~{S.time}s</span>
                  <span className={elapsed > budget ? 'late' : ''}>
                    ⏱ {fmt(elapsed)} · {ui.target} {fmt(budget)} / {fmt(total)} {running ? '' : ui.paused}
                  </span>
                </div>
                <p>{S.notes[lang]}</p>
              </motion.aside>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {help && (
              <motion.div className="help" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setHelp(false)}>
                <div>
                  <h3>{ui.help}</h3>
                  <p><kbd>→</kbd> <kbd>Space</kbd> {ui.next} · <kbd>←</kbd> {ui.prev}</p>
                  <p><kbd>N</kbd> {ui.notesK} · <kbd>T</kbd> {ui.timer} · <kbd>R</kbd> {ui.reset}</p>
                  <p><kbd>L</kbd> {ui.lang} · <kbd>F</kbd> {ui.full}</p>
                  <p><kbd>Esc</kbd> {ui.esc} · <kbd>?</kbd> {ui.helpK}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ExcerptModal id={excerpt} onClose={() => setExcerpt(null)} />
        </div>
      </ExcerptContext.Provider>
    </LangContext.Provider>
  )
}

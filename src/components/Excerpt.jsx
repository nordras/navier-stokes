import { AnimatePresence, motion } from 'motion/react'
import { EXCERPTS, SOURCES } from '../excerpts.js'
import { useLang, useOpenExcerpt, useT } from '../i18n.jsx'
import PdfViewer from './PdfViewer.jsx'
import Tex from './Tex.jsx'

/** Chip clicável que abre o trecho da fonte num modal. */
export function Ref({ id, label }) {
  const open = useOpenExcerpt()
  const lang = useLang()
  const ex = EXCERPTS[id]
  if (!ex) return null
  return (
    <button className={`ref ref-${ex.source}`} onClick={(e) => { e.stopPropagation(); open(id) }}>
      <span className="ref-icon">{ex.source === 'paper' ? '📄' : 'W'}</span>
      {label ?? ex.where[lang]}
    </button>
  )
}

function Summary({ ex, lang }) {
  return (
    <>
      <div className={`modal-src src-${ex.source}`}>{SOURCES[ex.source].name}</div>
      <div className="modal-where">{ex.where[lang]}{ex.page ? ` · p. ${ex.page}` : ''}</div>
      <h3 className="modal-title">{ex.title[lang]}</h3>
      {ex.quote && <blockquote className="modal-quote">{ex.quote}</blockquote>}
      {ex.tex && (
        <div className="modal-tex">
          {ex.tex.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.12 }}>
              <Tex display>{s}</Tex>
            </motion.div>
          ))}
        </div>
      )}
      <div className="modal-body">
        {ex.body[lang].map((p, i) => (
          <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>{p}</motion.p>
        ))}
      </div>
      {ex.code && <pre className="code modal-code">{ex.code}</pre>}
    </>
  )
}

export function ExcerptModal({ id, onClose }) {
  const t = useT()
  const lang = useLang()
  const ex = id ? EXCERPTS[id] : null
  const isPaper = ex?.source === 'paper'

  return (
    <AnimatePresence>
      {ex && (
        <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className={`modal ${isPaper ? 'modal-paper' : ''}`}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
            {isPaper ? (
              <div className="paper-layout">
                <PdfViewer page={ex.page} find={ex.find} />
                <aside className="paper-side">
                  <Summary ex={ex} lang={lang} />
                  <div className="modal-foot">
                    <a className="btn primary" href={SOURCES.paper.url} target="_blank" rel="noreferrer">arXiv ↗</a>
                  </div>
                </aside>
              </div>
            ) : (
              <>
                <Summary ex={ex} lang={lang} />
                <div className="modal-foot">
                  <span className="modal-note">{t('Resumo do trecho, com a referência na fonte.', 'Summary of the passage, with the reference in the source.')}</span>
                  <a className="btn primary" href={SOURCES[ex.source].url} target="_blank" rel="noreferrer">{t('Abrir fonte ↗', 'Open source ↗')}</a>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

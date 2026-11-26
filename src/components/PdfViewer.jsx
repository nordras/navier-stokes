import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useT } from '../i18n.jsx'

// Local copy of the paper (public/2610.08144v1.pdf), served with the app.
export const PDF_URL = `${import.meta.env.BASE_URL}2610.08144v1.pdf`

// pdf.js is loaded lazily the first time a paper excerpt is opened.
let docPromise = null
let pdfjsLib = null
function loadDoc() {
  if (!docPromise) {
    docPromise = (async () => {
      const pdfjs = await import('pdfjs-dist')
      const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
      pdfjsLib = pdfjs
      return pdfjs.getDocument(PDF_URL).promise
    })().catch((e) => { docPromise = null; throw e })
  }
  return docPromise
}

const norm = (s) => s.replace(/\s+/g, '')

/** Finds `needle` in the page text and returns the union rectangle (canvas px). */
function locate(textContent, viewport, needle) {
  if (!needle) return null
  const items = textContent.items.filter((it) => typeof it.str === 'string')
  let text = ''
  const owner = []
  items.forEach((it, i) => {
    const s = norm(it.str)
    text += s
    for (let k = 0; k < s.length; k++) owner.push(i)
  })
  const n = norm(needle)
  const at = text.indexOf(n)
  if (at < 0) return null
  const first = owner[at]
  const last = owner[at + n.length - 1]
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (let i = first; i <= last; i++) {
    const it = items[i]
    const tx = pdfjsLib.Util.transform(viewport.transform, it.transform)
    const h = Math.hypot(tx[2], tx[3])
    const x = tx[4]
    const y = tx[5] - h
    const w = it.width * viewport.scale
    x0 = Math.min(x0, x); y0 = Math.min(y0, y)
    x1 = Math.max(x1, x + w); y1 = Math.max(y1, y + h * 1.25)
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
}

export default function PdfViewer({ page: startPage = 1, find }) {
  const t = useT()
  const scrollRef = useRef(null)
  const canvasRef = useRef(null)
  const [page, setPage] = useState(startPage)
  const [numPages, setNumPages] = useState(null)
  const [hl, setHl] = useState(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [status, setStatus] = useState('loading')

  useEffect(() => setPage(startPage), [startPage])

  useEffect(() => {
    let cancelled = false
    let task = null
    ;(async () => {
      try {
        setStatus('loading')
        const doc = await loadDoc()
        if (cancelled) return
        setNumPages(doc.numPages)
        const pdfPage = await doc.getPage(page)
        const box = scrollRef.current
        const base = pdfPage.getViewport({ scale: 1 })
        const scale = (box.clientWidth - 24) / base.width
        const viewport = pdfPage.getViewport({ scale })
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const canvas = canvasRef.current
        canvas.width = Math.floor(viewport.width * dpr)
        canvas.height = Math.floor(viewport.height * dpr)
        canvas.style.width = `${viewport.width}px`
        canvas.style.height = `${viewport.height}px`
        setSize({ w: viewport.width, h: viewport.height })
        task = pdfPage.render({ canvasContext: canvas.getContext('2d'), viewport, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null })
        await task.promise
        if (cancelled) return
        let rect = null
        if (page === startPage && find) {
          rect = locate(await pdfPage.getTextContent(), viewport, find)
        }
        setHl(rect)
        box.scrollTo({ top: rect ? Math.max(0, rect.y - 80) : 0, behavior: rect ? 'smooth' : 'auto' })
        setStatus('ok')
      } catch (e) {
        if (!cancelled && e?.name !== 'RenderingCancelledException') {
          console.error(e)
          setStatus('error')
        }
      }
    })()
    return () => { cancelled = true; task?.cancel() }
  }, [page, startPage, find])

  return (
    <div className="pdfv">
      <div className="pdfv-bar">
        <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>‹</button>
        <span className="pdfv-page">{t('página', 'page')} {page}{numPages ? ` / ${numPages}` : ''}</span>
        <button className="btn" onClick={() => setPage((p) => Math.min(numPages || p, p + 1))} disabled={numPages != null && page >= numPages}>›</button>
        {page !== startPage && (
          <button className="btn" onClick={() => setPage(startPage)}>{t('↩ voltar ao trecho', '↩ back to excerpt')}</button>
        )}
        <a className="btn ghost" href={`${PDF_URL}#page=${page}`} target="_blank" rel="noreferrer">{t('PDF em nova aba ↗', 'PDF in new tab ↗')}</a>
      </div>
      <div className="pdfv-scroll" ref={scrollRef}>
        <div className="pdfv-sheet" style={{ width: size.w || undefined, height: size.h || undefined }}>
          <canvas ref={canvasRef} />
          {hl && (
            <motion.div
              key={`${page}-${find}`}
              className="pdfv-hl"
              style={{ left: hl.x - 6, top: hl.y - 4, width: hl.w + 12, height: hl.h + 8 }}
              initial={{ opacity: 0, scale: 1.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 220, damping: 18 }}
            />
          )}
        </div>
        {status === 'loading' && <div className="pdfv-msg">{t('Carregando o PDF…', 'Loading PDF…')}</div>}
        {status === 'error' && <div className="pdfv-msg err">{t('Não foi possível carregar o PDF.', 'Could not load the PDF.')}</div>}
      </div>
    </div>
  )
}

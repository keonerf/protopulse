import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MODEL_EVENT } from '../lib/modelBus'

/**
 * Interactive 3D model viewer — a full-screen modal that embeds the
 * ProtoPulse isometric film (public/film/index.html) in an iframe.
 *
 * Any component opens it via openModel() (see ../lib/modelBus).
 */
const ModelViewer: React.FC = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener(MODEL_EVENT, onOpen)
    return () => window.removeEventListener(MODEL_EVENT, onOpen)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-modal bg-charcoal/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl aspect-[16/10] max-h-[86vh] rounded-2xl overflow-hidden border border-rust/25 bg-black shadow-2xl shadow-black/60"
            onClick={e => e.stopPropagation()}
          >
            {/* header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3 bg-gradient-to-b from-charcoal/90 to-transparent pointer-events-none">
              <span className="font-mono text-[11px] text-rust-light uppercase tracking-[0.28em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rust animate-[blink_1.4s_ease-in-out_infinite]" />
                Baker-01 · Interactive
              </span>
              <button
                onClick={() => setOpen(false)}
                className="pointer-events-auto font-mono text-[11px] text-cream/70 hover:text-cream uppercase tracking-wider border border-cream/20 hover:border-cream/40 rounded-full px-3 py-1.5 transition-colors"
                aria-label="Close viewer"
              >
                Close ✕
              </button>
            </div>

            <iframe
              src="/film/index.html"
              title="Baker-01 interactive 3D model"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ModelViewer

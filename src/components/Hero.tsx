import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// The three-beat brand motto. The active index travels machine → software → hour.
const motto = ['One machine', 'One software', 'One hour']

const Hero: React.FC = () => {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const id = setInterval(() => setActive(i => (i + 1) % motto.length), 1400)
    return () => clearInterval(id)
  }, [reduceMotion])

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-rust px-6 pt-28 pb-16"
    >
      {/* giant brand wordmark — stretches across the page */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
        className="logo-hover logo-hover-hero inline-block cursor-default w-full text-center"
      >
        <h1 className="font-logo logo-sweep text-[clamp(2.5rem,10vw,7rem)] leading-[0.9] tracking-tight">
          protopulse
        </h1>
      </motion.div>

      {/* lively three-beat motto */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mt-6"
        aria-label="One machine, one software, one hour"
      >
        {motto.map((phrase, i) => (
          <React.Fragment key={phrase}>
            {i > 0 && (
              <motion.span
                aria-hidden
                className="font-mono text-charcoal/50 select-none"
                animate={reduceMotion ? undefined : { rotate: active === i ? 90 : 0, opacity: active === i || active === i - 1 ? 1 : 0.4 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                ·
              </motion.span>
            )}
            <motion.span
              className="relative font-mono text-sm sm:text-base uppercase tracking-[0.28em]"
              animate={reduceMotion ? undefined : { color: active === i ? '#0f0e0c' : 'rgba(15,14,12,0.55)', y: active === i ? -2 : 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              {phrase}
              {!reduceMotion && active === i && (
                <motion.span
                  layoutId="motto-accent"
                  className="absolute -bottom-1.5 left-0 right-0 h-px bg-charcoal"
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                />
              )}
            </motion.span>
          </React.Fragment>
        ))}
      </motion.div>

      {/* two showcase cards — the build film + the interactive model */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
        className="grid sm:grid-cols-2 gap-5 w-full max-w-3xl mt-12"
      >
        {/* Card 1 — the build film (video) */}
        <a
          href="/film/watch.html"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative rounded-2xl overflow-hidden bg-charcoal border border-charcoal-lighter text-left shadow-xl transition-transform duration-400 hover:-translate-y-1"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-charcoal-light">
            <img
              src="/assets/renders/baker-assembled.png"
              alt="Baker-01 assembly film"
              className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.05]"
            />
            <span className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[9px] text-cream uppercase tracking-[0.2em] bg-charcoal/70 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className="text-rust">▶</span> Film
            </span>
          </div>
          <div className="p-5">
            <h3 className="font-heading text-base font-semibold text-cream mb-0.5">Watch it build</h3>
            <p className="font-mono text-[10px] text-cream/45 uppercase tracking-wider">90-second assembly film →</p>
          </div>
        </a>

        {/* Card 2 — interactive scroll-driven model */}
        <a
          href="/film/explore.html"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative rounded-2xl overflow-hidden bg-charcoal border border-charcoal-lighter text-left shadow-xl transition-transform duration-400 hover:-translate-y-1"
          aria-label="Open the interactive Baker-01 model"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-charcoal-light">
            <img
              src="/assets/renders/baker-exploded.png"
              alt="Baker-01 interactive exploded model"
              className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.05]"
            />
            <span className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[9px] text-cream uppercase tracking-[0.2em] bg-charcoal/70 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rust" style={{ animation: 'blink 1.6s ease-in-out infinite' }} /> Live
            </span>
          </div>
          <div className="p-5">
            <h3 className="font-heading text-base font-semibold text-cream mb-0.5">Explore the model</h3>
            <p className="font-mono text-[10px] text-cream/45 uppercase tracking-wider">Interactive 3D view →</p>
          </div>
        </a>
      </motion.div>
    </section>
  )
}

export default Hero

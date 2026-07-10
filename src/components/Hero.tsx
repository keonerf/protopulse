import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { openModel } from '../lib/modelBus'

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

      {/* exploded 3D model — click to open the interactive viewer */}
      <motion.button
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.75 }}
        onClick={openModel}
        className="group relative mt-8 block"
        aria-label="Open the interactive Baker-01 model"
      >
        <img
          src="/assets/renders/baker-exploded.png"
          alt="Baker-01 desktop PCB fabrication station, exploded view"
          className="h-[34vh] sm:h-[38vh] max-h-[420px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04] drop-shadow-2xl"
        />
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 font-mono text-[10px] text-charcoal/70 uppercase tracking-[0.22em] whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-charcoal" style={{ animation: 'blink 1.6s ease-in-out infinite' }} />
          Tap to explore Baker-01
        </span>
      </motion.button>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="flex flex-wrap gap-4 justify-center mt-12"
      >
        <a
          href="#preorder"
          className="font-body text-sm font-medium bg-charcoal text-cream px-7 py-3 rounded-full hover:bg-charcoal-light hover:scale-[1.03] active:scale-95 transition-all duration-300"
        >
          Pre-order
        </a>
        <a
          href="#process"
          className="font-body text-sm font-medium border border-charcoal/30 text-charcoal px-7 py-3 rounded-full hover:border-charcoal/60 hover:bg-charcoal/5 transition-all duration-300"
        >
          See it work →
        </a>
      </motion.div>
    </section>
  )
}

export default Hero

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

      {/* three-beat motto — stacked lines, circuit traces route to the live one */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.5 }}
        className="flex flex-col items-center gap-2.5 mt-7"
        aria-label="One machine, one software, one hour"
      >
        {motto.map((phrase, i) => {
          const on = !reduceMotion && active === i
          return (
            <div key={phrase} className="relative flex items-center justify-center">
              {/* left trace — routes in from the west like a PCB track */}
              <span aria-hidden className="hidden sm:block absolute right-full mr-3.5">
                <svg width="74" height="16" viewBox="0 0 74 16" fill="none">
                  <motion.path
                    d="M2 14 H26 L38 8 H62"
                    stroke="#0f0e0c"
                    strokeWidth="1.2"
                    initial={false}
                    animate={{ pathLength: on ? 1 : 0, opacity: on ? 0.8 : 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                  <motion.rect
                    x="64" y="5" width="6" height="6"
                    fill="#0f0e0c"
                    initial={false}
                    animate={{ opacity: on ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: on ? 0.35 : 0 }}
                  />
                  <motion.circle
                    cx="2" cy="14" r="2.2"
                    fill="#0f0e0c"
                    initial={false}
                    animate={{ opacity: on ? 0.7 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
              </span>
              <motion.span
                className="font-mono text-sm sm:text-base uppercase tracking-[0.3em] whitespace-nowrap"
                initial={false}
                animate={
                  reduceMotion
                    ? undefined
                    : { color: on ? '#0f0e0c' : 'rgba(15,14,12,0.42)', scale: on ? 1.06 : 1 }
                }
                transition={{ duration: 0.45, ease: 'easeOut' }}
              >
                {phrase}
              </motion.span>
              {/* right trace — mirrored */}
              <span aria-hidden className="hidden sm:block absolute left-full ml-3.5 -scale-x-100">
                <svg width="74" height="16" viewBox="0 0 74 16" fill="none">
                  <motion.path
                    d="M2 14 H26 L38 8 H62"
                    stroke="#0f0e0c"
                    strokeWidth="1.2"
                    initial={false}
                    animate={{ pathLength: on ? 1 : 0, opacity: on ? 0.8 : 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                  <motion.rect
                    x="64" y="5" width="6" height="6"
                    fill="#0f0e0c"
                    initial={false}
                    animate={{ opacity: on ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: on ? 0.35 : 0 }}
                  />
                  <motion.circle
                    cx="2" cy="14" r="2.2"
                    fill="#0f0e0c"
                    initial={false}
                    animate={{ opacity: on ? 0.7 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
              </span>
            </div>
          )
        })}
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
              src="/assets/renders/baker-intermediate.png"
              alt="Baker-01 assembly film"
              className="absolute inset-0 w-full h-full scale-[1.3] object-contain p-6 transition-transform duration-500 group-hover:scale-[1.35]"
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

        {/* Card 2 — guided slide-by-slide build walkthrough */}
        <a
          href="/film/explore.html"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative rounded-2xl overflow-hidden bg-charcoal border border-charcoal-lighter text-left shadow-xl transition-transform duration-400 hover:-translate-y-1"
          aria-label="Step through the Baker-01 build, stage by stage"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-charcoal-light">
            <img
              src="/assets/renders/baker-exploded.png"
              alt="Baker-01 interactive exploded model"
              className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.05]"
            />
            <span className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[9px] text-cream uppercase tracking-[0.2em] bg-charcoal/70 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rust" style={{ animation: 'blink 1.6s ease-in-out infinite' }} /> Guided
            </span>
          </div>
          <div className="p-5">
            <h3 className="font-heading text-base font-semibold text-cream mb-0.5">Step through the build</h3>
            <p className="font-mono text-[10px] text-cream/45 uppercase tracking-wider">Scroll stage by stage →</p>
          </div>
        </a>
      </motion.div>
    </section>
  )
}

export default Hero

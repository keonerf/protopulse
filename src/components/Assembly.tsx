import React, { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import PCBBoard from './PCBBoard'
import Eyebrow from './Eyebrow'
import ScrollReveal from './ScrollReveal'

const STATIONS = [
  { id: 'L1', name: 'Mill', time: '~20 min', line: 'A V-bit carves 0.1 mm isolation channels around every trace at 10,000 RPM, then peck-drills the holes.' },
  { id: 'L2', name: 'Paste', time: '~7 min', line: 'A CNC-cut Mylar stencil aligns on fiducials — one squeegee pass lays solder paste across all fifteen pads.' },
  { id: 'L3', name: 'Place', time: '~5 min', line: 'Components load into a mould, flip onto the board over registration pins, and a vibration table settles them.' },
  { id: 'L4', name: 'Reflow', time: '~5 min', line: 'A controlled ramp to 245 °C wets every joint into permanent SAC305 solder. The board comes off blinking.' },
]

const Assembly: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [stage, setStage] = useState(0)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  // continuous fill for the guide line: 0 at L1 centre → 1 at L4 centre
  const railFill = useTransform(scrollYProgress, [0.06, 0.94], [0, 1], { clamp: true })

  // advance the discrete stage as the pinned section scrolls
  useMotionValueEvent(scrollYProgress, 'change', v => {
    const next = Math.min(3, Math.max(0, Math.floor(v * 4)))
    setStage(prev => (prev === next ? prev : next))
  })

  // reduced-motion visitors see the finished board without scroll choreography
  const shown = reduced ? 3 : stage

  return (
    <section id="process" className="relative bg-charcoal">
      {/* tall track drives the pinned scene */}
      <div ref={trackRef} className="relative h-[280vh]">
        <div className="sticky top-0 min-h-screen flex items-center py-24 lg:py-28">
          <div className="max-w-6xl mx-auto px-6 lg:px-10 w-full">
            <ScrollReveal>
              <Eyebrow label="Live assembly" />
              <h2 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold text-cream leading-[0.90] tracking-tight mb-6 text-center text-wrap-balance">
                Watch a board build itself.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="font-body text-cream-muted text-base max-w-lg mx-auto mb-14 text-center leading-relaxed">
                The test circuit Bakers Studio ships with — a 555 blinker, 19 traces, 15 pads —
                assembled exactly the way Baker-01 runs it. Scroll to drive the line.
              </p>
            </ScrollReveal>

            <div className="grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-16 items-center">
              {/* assembly line — four fixed-height stations */}
              <div className="order-last lg:order-first">
                <ol className="relative">
                  {/* full guide rail — spans exactly from L1 centre to L4 centre */}
                  <span
                    className="absolute left-4 -translate-x-1/2 w-px bg-cream/10"
                    style={{ top: '12.5%', height: '75%' }}
                    aria-hidden
                  />
                  {/* copper fill that tracks scroll */}
                  <motion.span
                    className="absolute left-4 -translate-x-1/2 w-px bg-rust origin-top"
                    style={{ top: '12.5%', height: '75%', scaleY: reduced ? 1 : railFill }}
                    aria-hidden
                  />
                  {STATIONS.map((s, i) => {
                    const active = shown === i
                    const done = shown > i
                    return (
                      <li key={s.id} className="relative flex items-center gap-5 h-24">
                        <span
                          className={`relative z-10 flex-shrink-0 grid place-items-center w-8 h-8 rounded-full border font-mono text-[10px] transition-all duration-500 bg-charcoal ${
                            active
                              ? 'bg-rust border-rust text-charcoal scale-110'
                              : done
                                ? 'border-rust/50 text-rust-light'
                                : 'bg-charcoal-lighter border-cream/15 text-cream/40'
                          }`}
                        >
                          {s.id}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-baseline gap-3">
                            <span className={`font-heading text-lg font-semibold transition-colors duration-300 ${active ? 'text-cream' : 'text-cream/50'}`}>
                              {s.name}
                            </span>
                            <span className="font-mono text-[11px] text-cream/40">{s.time}</span>
                          </span>
                          <motion.span
                            className="block font-body text-sm leading-relaxed mt-1 line-clamp-2"
                            animate={{ color: active ? 'rgb(141 137 127)' : 'rgba(141,137,127,0.45)' }}
                            transition={{ duration: 0.4 }}
                          >
                            {s.line}
                          </motion.span>
                        </span>
                      </li>
                    )
                  })}
                </ol>
              </div>

              {/* the live board */}
              <div className="order-first lg:order-last">
                <div className="relative rounded-[16px] bg-charcoal-light border border-white/5 p-5 lg:p-8">
                  <PCBBoard stage={shown} />

                  {/* corner readout */}
                  <div className="absolute top-5 right-5 lg:top-7 lg:right-7 font-mono text-[10px] text-cream/35 uppercase tracking-wider">
                    Baker-01 · stage {shown + 1}/4
                  </div>

                  {/* live output chip on reflow */}
                  <div className="absolute left-0 right-0 -bottom-4 flex justify-center pointer-events-none">
                    <AnimatePresence>
                      {shown >= 3 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
                          className="flex items-center gap-2.5 font-mono text-[10px] text-rust-light uppercase tracking-wider bg-charcoal border border-rust/30 rounded-full px-4 py-2 whitespace-nowrap"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rust animate-[blink_1.1s_ease-in-out_infinite]" />
                          output — LED blinking @ ~3 Hz
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Assembly

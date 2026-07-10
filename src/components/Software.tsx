import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

/* Each feature maps to a hotspot on the real app screenshot. */
const features = [
  {
    id: '01',
    title: 'Gerber in, four outputs out',
    desc: 'Drop a standard Gerber + BOM. Bakers Studio auto-generates mill G-code, stencil G-code, the placement mould STL, and the reflow thermal profile — each mapped to the hardware it drives.',
    pin: { x: 30, y: 12 },
  },
  {
    id: '02',
    title: 'Live toolpath preview',
    desc: 'Layer-by-layer 3D preview of every tool motion before the spindle turns. Zoom, rotate, scrub the timeline — catch errors without wasting copper.',
    pin: { x: 49, y: 55 },
  },
  {
    id: '03',
    title: 'Direct machine control',
    desc: 'One-click send to Baker-01 over USB or Wi-Fi. Real-time position readout, feed overrides, and emergency stop — all from the same window.',
    pin: { x: 86, y: 24 },
  },
  {
    id: '04',
    title: 'Job console & telemetry',
    desc: 'Live thermocouple graph, spindle load, step count, and per-board cost estimate. Every run is logged so you can replay or export a manufacturing report.',
    pin: { x: 83, y: 74 },
  },
]

const outputs = ['mill.gcode', 'stencil.gcode', 'mould.stl', 'reflow.profile']
const edaTools = ['KiCad', 'Altium', 'EAGLE', 'EasyEDA', 'gEDA', 'Fusion Electronics', 'DipTrace', 'OrCAD']

const Software: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-20% 0px -20% 0px' })
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if (reduced || !inView || hovering) return
    const t = setInterval(() => setActive(a => (a + 1) % features.length), 2600)
    return () => clearInterval(t)
  }, [inView, hovering, reduced])

  return (
    <section id="software" className="relative bg-charcoal-light py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <div className="flex items-center gap-3 mb-5 justify-center">
            <span className="font-mono text-[11px] text-rust uppercase tracking-[0.28em]">
              INCLUDED · FREE
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold text-cream leading-[0.90] tracking-tight mb-6 text-center text-wrap-balance">
            Drop a Gerber. Watch it build.
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="font-body text-cream-muted text-base max-w-lg mx-auto mb-8 text-center leading-relaxed">
            Bakers Studio is the single CAM app that drives the whole Baker-01 —
            preview toolpaths, queue jobs, monitor every stage from one canvas.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <div className="flex flex-col items-center gap-2 mb-16">
            <a
              href="/downloads/BakersStudio-v1.0.0-Win64.zip"
              download
              className="font-body text-sm font-medium bg-rust text-charcoal px-7 py-3 rounded-full hover:bg-rust-light hover:scale-[1.03] active:scale-95 transition-all duration-300 inline-flex items-center gap-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
              </svg>
              Download Bakers Studio
            </a>
            <span className="font-mono text-[10px] text-cream/40 uppercase tracking-wider">
              Free · Windows 64-bit · v1.0.0
            </span>
          </div>
        </ScrollReveal>

        <div ref={ref} className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center">
          {/* interactive feature list */}
          <div
            className="flex flex-col gap-2"
            onMouseLeave={() => setHovering(false)}
          >
            {features.map((f, i) => {
              const on = active === i
              return (
                <ScrollReveal key={f.id} delay={0.05 + i * 0.08}>
                  <button
                    onMouseEnter={() => {
                      setHovering(true)
                      setActive(i)
                    }}
                    onFocus={() => setActive(i)}
                    className={`w-full text-left rounded-xl p-4 lg:p-5 border transition-all duration-400 ${
                      on
                        ? 'bg-charcoal border-rust/40'
                        : 'bg-transparent border-transparent hover:bg-charcoal/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1.5">
                      <span
                        className={`grid place-items-center w-6 h-6 rounded-full font-mono text-[10px] transition-colors duration-300 ${
                          on ? 'bg-rust text-cream' : 'bg-cream/10 text-cream/50'
                        }`}
                      >
                        {f.id}
                      </span>
                      <h3 className={`font-heading text-base font-semibold transition-colors duration-300 ${on ? 'text-cream' : 'text-cream/60'}`}>
                        {f.title}
                      </h3>
                    </div>
                    <motion.p
                      className="font-body text-sm text-cream-muted leading-relaxed overflow-hidden pl-9"
                      animate={{ height: on ? 'auto' : 0, opacity: on ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      {f.desc}
                    </motion.p>
                  </button>
                </ScrollReveal>
              )
            })}
          </div>

          {/* app window with live hotspot pins */}
          <div className="relative">
            <div className="rounded-[14px] overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
              {/* title bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-charcoal border-b border-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-rust/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-cream/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-cream/20" />
                <span className="font-mono text-[10px] text-cream/40 tracking-wider ml-3">
                  bakers-studio — led_driver_r3.zip
                </span>
              </div>
              {/* screenshot + pins */}
              <div className="relative bg-charcoal">
                <img
                  src="/assets/software_ui.jpg"
                  alt="Bakers Studio — Gerber loaded, toolpaths generated"
                  className="w-full h-auto block"
                  loading="lazy"
                />
                {/* dim veil that lifts around the active hotspot */}
                {features.map((f, i) => {
                  const on = active === i
                  return (
                    <div
                      key={f.id}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ left: `${f.pin.x}%`, top: `${f.pin.y}%` }}
                    >
                      {on && (
                        <motion.span
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-rust"
                          initial={{ width: 14, height: 14, opacity: 0.9 }}
                          animate={{ width: 46, height: 46, opacity: 0 }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                        />
                      )}
                      <motion.span
                        className={`relative block rounded-full ${on ? 'bg-rust' : 'bg-cream/40'}`}
                        animate={{ width: on ? 16 : 10, height: on ? 16 : 10 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <span className="absolute inset-0 grid place-items-center font-mono text-[8px] text-cream">
                          {on ? f.id : ''}
                        </span>
                      </motion.span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* floating label for the active pin */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mt-4 flex items-center gap-2 justify-center lg:justify-start"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rust animate-[blink_1.4s_ease-in-out_infinite]" />
                <span className="font-mono text-[10px] text-cream/50 uppercase tracking-wider">
                  {features[active].title}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Gerber → Bakers Studio → outputs flow */}
        <ScrollReveal delay={0.1}>
          <div className="mt-20 flex flex-wrap items-center justify-center gap-4">
            <span className="font-mono text-[11px] text-cream/60 uppercase tracking-wider border border-cream/15 rounded-full px-4 py-2">
              your.gerber
            </span>
            <span className="text-rust font-mono text-lg">→</span>
            <span className="font-heading text-sm font-semibold text-cream bg-rust/15 border border-rust/30 rounded-full px-4 py-2">
              Bakers Studio
            </span>
            <span className="text-rust font-mono text-lg">→</span>
            <div className="flex flex-wrap gap-2 justify-center">
              {outputs.map((o, i) => (
                <motion.span
                  key={o}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                  className="font-mono text-[11px] text-rust-light uppercase tracking-wider border border-rust/25 rounded-full px-3 py-2"
                >
                  {o}
                </motion.span>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* supported EDA tools marquee */}
        <div className="mt-16">
          <p className="font-mono text-[10px] text-cream/35 uppercase tracking-[0.28em] text-center mb-6">
            Reads the file your EDA already exports
          </p>
          <div className="marquee-mask relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
            <div className="marquee-track gap-12 pr-12">
              {[...edaTools, ...edaTools].map((t, i) => (
                <span key={i} className="font-heading text-lg font-medium text-cream/25 whitespace-nowrap">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Software

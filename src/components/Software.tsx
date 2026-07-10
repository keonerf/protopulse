import React from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

/* Bakers Studio — the CAM suite that drives Baker-01. Plain feature copy. */
const features = [
  {
    id: '01',
    title: 'Gerber in, four outputs out',
    desc: 'Drop a standard Gerber + BOM. Bakers Studio auto-generates mill G-code, stencil G-code, the placement mould STL, and the reflow thermal profile — each mapped to the hardware it drives.',
  },
  {
    id: '02',
    title: 'Live toolpath preview',
    desc: 'Layer-by-layer 3D preview of every tool motion before the spindle turns. Zoom, rotate and scrub the timeline to catch errors without wasting copper.',
  },
  {
    id: '03',
    title: 'Direct machine control',
    desc: 'One-click send to Baker-01 over USB or Wi-Fi. Real-time position readout, feed overrides and emergency stop — all from the same window.',
  },
  {
    id: '04',
    title: 'Job console & telemetry',
    desc: 'Live thermocouple graph, spindle load, step count and per-board cost estimate. Every run is logged so you can replay or export a manufacturing report.',
  },
]

const outputs = ['mill.gcode', 'stencil.gcode', 'mould.stl', 'reflow.profile']
const edaTools = ['KiCad', 'Altium', 'EAGLE', 'EasyEDA', 'gEDA', 'Fusion Electronics', 'DipTrace', 'OrCAD']

const Software: React.FC = () => {
  return (
    <section id="software" className="relative bg-charcoal-light py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <div className="flex items-center justify-center mb-5">
            <span className="font-mono text-[11px] text-rust uppercase tracking-[0.28em]">
              The Software Suite
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold text-cream leading-[0.90] tracking-tight mb-6 text-center text-wrap-balance">
            Drop a Gerber. Watch it build.
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="font-body text-cream-muted text-base max-w-xl mx-auto mb-16 text-center leading-relaxed">
            Bakers Studio is the single CAM app that drives the whole Baker-01 — preview toolpaths,
            queue jobs and monitor every stage from one canvas. It ships with every machine.
          </p>
        </ScrollReveal>

        {/* feature grid — plain information */}
        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <ScrollReveal key={f.id} delay={0.05 + i * 0.08}>
              <div className="glass-card h-full p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid place-items-center w-7 h-7 rounded-full bg-rust/15 border border-rust/30 font-mono text-[10px] text-rust-light">
                    {f.id}
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-cream">{f.title}</h3>
                </div>
                <p className="font-body text-sm text-cream-muted leading-relaxed">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Gerber → Bakers Studio → outputs flow */}
        <ScrollReveal delay={0.1}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
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

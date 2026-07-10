import React from 'react'
import { motion } from 'framer-motion'
import Eyebrow from './Eyebrow'
import ScrollReveal from './ScrollReveal'

const capabilities = [
  {
    tag: 'Cut',
    title: 'CNC mill + laser stencil',
    note: 'One gantry, two tools',
    desc: 'A single precision gantry carries both the milling spindle and the laser stencil head — isolation routing and stencil cutting without a tool change.',
  },
  {
    tag: 'Coat',
    title: 'Mask · paste · UV dispenser',
    note: 'One unit, three jobs',
    desc: 'The dispenser lays solder mask, deposits paste and cures under UV — the wet chemistry of a fab line handled by one head.',
  },
  {
    tag: 'Fuse',
    title: 'Reflow oven + 3D-print bay',
    note: 'SAC305 · molds in parallel',
    desc: 'A built-in oven runs the full SAC305 reflow profile while the print bay turns out placement molds alongside — no waiting, no second machine.',
  },
]

const Capabilities: React.FC = () => {
  return (
    <section id="capabilities" className="relative bg-charcoal-light py-24 lg:py-32 overflow-hidden">
      {/* copper glow behind the render */}
      <div
        className="pointer-events-none absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] rounded-full opacity-[0.09] blur-3xl"
        style={{ background: 'radial-gradient(circle, #CF8F4E 0%, transparent 60%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <Eyebrow label="One box · Six machines" />
          <h2 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold text-cream leading-[0.92] tracking-tight mb-6 text-center text-wrap-balance">
            The whole SMT line,<br className="hidden sm:block" /> on your desk.
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="font-body text-cream-muted text-base max-w-lg mx-auto mb-12 text-center leading-relaxed">
            Six machines fold into one enclosure. Baker-01 hands the board from one tool to the
            next — no jigs to align, no vendors to chase.
          </p>
        </ScrollReveal>

        {/* hero render */}
        <ScrollReveal delay={0.15}>
          <div className="relative mx-auto max-w-2xl mb-14">
            <div className="relative aspect-[4/3]">
              <img
                src="/assets/renders/baker-exploded.png"
                alt="Baker-01 gantry, dispenser and reflow systems, exploded"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <div className="flex justify-center">
              <span className="font-mono text-[10px] text-rust-light uppercase tracking-wider bg-charcoal/80 border border-rust/30 rounded-full px-4 py-2 whitespace-nowrap">
                Baker-01 · exploded view
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* capability cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {capabilities.map((c, i) => (
            <ScrollReveal key={c.title} delay={0.1 + i * 0.08}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="glass-card h-full p-6 lg:p-7 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] text-rust uppercase tracking-[0.28em]">{c.tag}</span>
                  <span className="font-mono text-[10px] text-cream/40 uppercase tracking-wider">{c.note}</span>
                </div>
                <h3 className="font-heading text-lg lg:text-xl font-bold text-cream leading-tight mb-3">
                  {c.title}
                </h3>
                <p className="font-body text-sm text-cream-muted leading-relaxed">{c.desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Capabilities

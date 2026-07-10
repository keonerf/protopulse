import React from 'react'
import Eyebrow from './Eyebrow'
import ScrollReveal from './ScrollReveal'
import { openModel } from '../lib/modelBus'

const flagshipFeatures = [
  'CNC mill + laser stencil head',
  'Mask · paste · UV dispenser',
  'Built-in SAC305 reflow oven',
]

const MachinesKits: React.FC = () => {
  return (
    <section id="machines" className="relative bg-charcoal py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <Eyebrow label="The Lineup" />
          <h2 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold text-cream leading-[0.90] tracking-tight mb-6 text-center text-wrap-balance">
            Machines &amp; Kits
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="font-body text-cream-muted text-base max-w-md mx-auto mb-16 text-center leading-relaxed">
            Start with the box. Add paste, stencils and reels when you scale from prototype
            to small batch.
          </p>
        </ScrollReveal>

        {/* Flagship — Baker-01, full-width card */}
        <ScrollReveal delay={0.05}>
          <button
            onClick={openModel}
            className="group glass-card w-full text-left p-7 lg:p-9 grid md:grid-cols-2 gap-8 items-center mb-5"
            aria-label="Open the interactive Baker-01 model"
          >
            <div className="relative min-h-[260px] rounded-xl bg-charcoal/60 overflow-hidden">
              <img
                src="/assets/renders/baker-assembled.png"
                alt="Baker-01 desktop PCB fabrication station"
                className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[10px] text-rust uppercase tracking-[0.28em]">Flagship</span>
                <span className="font-mono text-[10px] text-cream/40 uppercase tracking-wider border border-cream/15 rounded-full px-3 py-1 group-hover:border-rust/40 group-hover:text-rust-light transition-colors">
                  Tap to explore →
                </span>
              </div>
              <h3 className="font-heading text-3xl font-bold text-cream mb-1">Baker-01</h3>
              <p className="font-mono text-[11px] text-rust uppercase tracking-[0.22em] mb-5">Desktop PCB Fab</p>
              <ul className="space-y-2 mb-6">
                {flagshipFeatures.map(f => (
                  <li key={f} className="flex items-center gap-2.5 font-body text-sm text-cream-muted">
                    <span className="text-rust font-mono">›</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="font-mono text-[10px] text-cream/45 uppercase tracking-wider">
                First batch · ships Q1 2027
              </div>
            </div>
          </button>
        </ScrollReveal>

        {/* Three equal cards — Lab Kit · Consumables · Bakers Studio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Lab Kit */}
          <ScrollReveal delay={0.08}>
            <div className="glass-card h-full p-6 lg:p-7 flex flex-col">
              <span className="font-mono text-[10px] text-rust uppercase tracking-[0.28em] mb-4">Bundle</span>
              <h3 className="font-heading text-xl font-bold text-cream mb-2">Baker-01 · Lab Kit</h3>
              <p className="font-body text-sm text-cream-muted leading-relaxed">
                Baker-01 plus a 6-month supply of paste, stencils, mill bits and starter reels.
              </p>
              <div className="mt-auto pt-6 font-mono text-[10px] text-cream/45 uppercase tracking-wider">
                Everything to start
              </div>
            </div>
          </ScrollReveal>

          {/* Consumables Pack */}
          <ScrollReveal delay={0.14}>
            <div className="glass-card h-full p-6 lg:p-7 flex flex-col">
              <span className="font-mono text-[10px] text-rust uppercase tracking-[0.28em] mb-4">Add</span>
              <h3 className="font-heading text-xl font-bold text-cream mb-2">Consumables Pack</h3>
              <p className="font-body text-sm text-cream-muted leading-relaxed">
                SAC305 paste, UV solder mask, stencil film and carbide mill bits. Subscribe &amp; save.
              </p>
              <div className="mt-auto pt-6 font-mono text-[10px] text-rust-light uppercase tracking-wider">
                Subscribe · save
              </div>
            </div>
          </ScrollReveal>

          {/* Bakers Studio software — same card format as the demo */}
          <ScrollReveal delay={0.2}>
            <a
              href="/downloads/BakersStudio-v1.0.0-Win64.zip"
              download
              className="group glass-card h-full p-6 lg:p-7 flex flex-col"
            >
              <span className="font-mono text-[10px] text-rust uppercase tracking-[0.28em] mb-4">Included · Free</span>
              <h3 className="font-heading text-xl font-bold text-cream mb-2">Bakers Studio</h3>
              <p className="font-body text-sm text-cream-muted leading-relaxed">
                Drop a Gerber + BOM, preview the toolpath, and queue the whole line from one canvas.
              </p>
              <div className="mt-auto pt-6 font-mono text-[10px] text-rust-light uppercase tracking-wider group-hover:text-rust transition-colors">
                Download for Windows →
              </div>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

export default MachinesKits

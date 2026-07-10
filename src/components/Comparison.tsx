import React from 'react'
import { motion } from 'framer-motion'
import Eyebrow from './Eyebrow'
import ScrollReveal from './ScrollReveal'
import AnimatedCounter from './AnimatedCounter'

type Row = { label: string; value: string }
type Card = { name: string; tagline: string; rows: Row[]; highlight?: boolean }

const cards: Card[] = [
  {
    name: 'Traditional fab',
    tagline: 'Overseas fabrication house',
    rows: [
      { label: 'Turnaround', value: '2–4 weeks' },
      { label: 'Cost / board', value: '₹4,000–16,000 + shipping' },
      { label: 'Placement', value: 'Separate assembly' },
      { label: 'Software', value: 'Multiple tools' },
      { label: 'Iterations / day', value: 'N/A' },
    ],
  },
  {
    name: 'Manual CNC',
    tagline: 'DIY mill + hand soldering',
    rows: [
      { label: 'Turnaround', value: 'Several hours' },
      { label: 'Cost / board', value: '~₹400 + labour' },
      { label: 'Placement', value: 'Manual (tweezers)' },
      { label: 'Software', value: 'Separate CAM' },
      { label: 'Iterations / day', value: '1–2' },
    ],
  },
  {
    name: 'Baker-01',
    tagline: 'One desktop box',
    highlight: true,
    rows: [
      { label: 'Turnaround', value: '~60 minutes' },
      { label: 'Cost / board', value: '₹150–400 material' },
      { label: 'Placement', value: 'Automated via mould' },
      { label: 'Software', value: 'Bakers Studio — one app' },
      { label: 'Iterations / day', value: '8–10' },
    ],
  },
]

const stats: { target: number; prefix?: string; suffix?: string; label: string }[] = [
  { target: 90, suffix: '%+', label: 'Cost reduction' },
  { target: 90, suffix: '%+', label: 'Time reduction' },
  { target: 60, suffix: ' min', label: 'Per board' },
]

const Comparison: React.FC = () => {
  return (
    <section id="comparison" className="relative bg-charcoal py-24 lg:py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <Eyebrow label="How it compares" />
          <h2 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold text-cream leading-[0.92] tracking-tight mb-6 text-center text-wrap-balance">
            Weeks of waiting, gone.
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="font-body text-cream-muted text-base max-w-lg mx-auto mb-16 text-center leading-relaxed">
            Pick-and-place lines cost ₹4,00,000 and up. A 3D-printed mould and one unified
            machine collapse the whole cycle onto your desk.
          </p>
        </ScrollReveal>

        {/* comparison cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-20 items-stretch">
          {cards.map((card, i) => (
            <ScrollReveal key={card.name} delay={0.08 + i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className={`glass-card h-full p-6 lg:p-7 flex flex-col ${
                  card.highlight ? 'border-rust/50 shadow-[0_8px_40px_rgba(207,143,78,0.12)]' : ''
                }`}
              >
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-heading text-xl font-bold ${card.highlight ? 'text-rust-light' : 'text-cream'}`}>
                      {card.name}
                    </h3>
                    {card.highlight && (
                      <span className="font-mono text-[9px] text-charcoal bg-rust rounded-full px-2 py-0.5 uppercase tracking-wider">
                        Ours
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-cream/40 uppercase tracking-wider">{card.tagline}</p>
                </div>

                <dl className="flex flex-col gap-3">
                  {card.rows.map(row => (
                    <div key={row.label} className="flex flex-col gap-0.5 border-t border-cream/8 pt-3 first:border-t-0 first:pt-0">
                      <dt className="font-mono text-[9px] text-cream/40 uppercase tracking-wider">{row.label}</dt>
                      <dd className={`font-body text-sm ${card.highlight ? 'text-cream font-medium' : 'text-cream-muted'}`}>
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* headline stats with animated counters */}
        <ScrollReveal delay={0.15}>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-10">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <AnimatedCounter
                  target={s.target}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  className="font-heading text-4xl lg:text-5xl font-bold text-rust-light leading-none"
                />
                <div className="font-mono text-[10px] text-cream/50 uppercase tracking-wider mt-2">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default Comparison

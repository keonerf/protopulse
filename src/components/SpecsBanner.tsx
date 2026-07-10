import React from 'react'
import ScrollReveal from './ScrollReveal'

const specs = [
  { label: 'Footprint', value: '560×420×500', sub: 'mm · ≤ 25 kg' },
  { label: 'Noise', value: '< 60 dB', sub: 'office-quiet' },
  { label: 'Reflow', value: '245 °C', sub: 'SAC305 profile' },
  { label: 'Tools', value: '6-in-1', sub: 'one gantry' },
  { label: 'Input', value: 'Gerber', sub: '+ BOM · out: PCB' },
]

const SpecsBanner: React.FC = () => {
  return (
    <section id="specs" className="relative bg-charcoal border-y border-rust/12 py-14 lg:py-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-y-10 gap-x-4">
          {specs.map((s, i) => (
            <ScrollReveal key={s.label} delay={0.05 + i * 0.06}>
              <div className="spec-divider text-center px-2">
                <div className="font-mono text-[10px] text-rust uppercase tracking-[0.28em] mb-2">
                  {s.label}
                </div>
                <div className="font-heading text-xl lg:text-2xl font-bold text-cream leading-none mb-1.5">
                  {s.value}
                </div>
                <div className="font-mono text-[10px] text-cream/45 uppercase tracking-wider">
                  {s.sub}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SpecsBanner

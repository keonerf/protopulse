import React from 'react'
import ScrollReveal from './ScrollReveal'

const team = [
  {
    name: 'Soham Nalawade',
    role: 'Co-Founder',
    domain: 'Technology',
    bio: 'Technical architect behind Baker-01. Lead engineer for the proprietary multi-stage assembly line, delivering industrial-grade precision in a desktop footprint.',
    initials: 'SN',
  },
  {
    name: 'Avi Prakash Jaiswal',
    role: 'Co-Founder',
    domain: 'Business',
    bio: 'Strategic lead for growth, product-market fit, and investor relations. Drives go-to-market strategy to set a new global standard for desktop PCB fabrication.',
    initials: 'AP',
  },
]

const Founders: React.FC = () => {
  return (
    <section id="founders" className="relative bg-charcoal py-24 lg:py-40 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <div className="flex items-center justify-center mb-5">
            <span className="font-mono text-[11px] text-rust uppercase tracking-[0.28em]">
              THE TEAM
            </span>
          </div>
          <h2 className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-bold text-cream leading-[0.90] tracking-tight mb-6 text-center text-wrap-balance">
            The Founders
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="font-body text-cream-muted text-base max-w-md mx-auto text-center mb-20 leading-relaxed">
            Two co-founders building the future of hardware prototyping from Delhi, India.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-16 lg:gap-20">
          {team.map((member, i) => (
            <ScrollReveal key={i} delay={0.2 + i * 0.15}>
              <div className="glass-card border-l-2 border-rust rounded-xl p-6 lg:p-8 text-center md:text-left">
                <div className="font-heading text-[clamp(4rem,10vw,6rem)] font-bold text-cream/10 leading-none mb-4 select-none">
                  {member.initials}
                </div>
                <h3 className="font-heading text-xl font-semibold text-cream mb-1">
                  {member.name}
                </h3>
                <div className="font-mono text-[10px] text-rust uppercase tracking-wider mb-0.5">
                  {member.domain}
                </div>
                <div className="font-mono text-[10px] text-cream-muted uppercase tracking-wider mb-4">
                  {member.role}
                </div>
                <p className="font-body text-sm text-cream-muted leading-relaxed max-w-sm mx-auto md:mx-0">
                  {member.bio}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Founders

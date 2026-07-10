import React from 'react'

const machineLinks = ['Baker-01', 'Lab Kit', 'Consumables', 'Specs']
const companyLinks = ['About', 'Pre-order', 'Capabilities', 'Careers']
const supportLinks = ['Documentation', 'Bakers Studio', 'Warranty', 'Contact']

const Footer: React.FC = () => {
  return (
    <footer id="support" className="relative bg-charcoal border-t border-cream/10">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        {/* top section — 4-column grid */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* col 1 — brand */}
          <div>
            <div className="flex items-center font-logo text-xl text-cream mb-4">
              <span className="w-2 h-2 rounded-full bg-rust inline-block mr-2" />
              protopulse
            </div>
            <p className="font-body text-sm text-cream-muted leading-relaxed max-w-xs">
              Desktop PCB fabrication. The whole prototyping line, folded under one lid.
            </p>
          </div>

          {/* col 2 — machines */}
          <div>
            <h4 className="font-mono text-[11px] text-cream-muted uppercase tracking-[0.28em] mb-4">
              MACHINES
            </h4>
            <div className="flex flex-col gap-2">
              {machineLinks.map(link => (
                <a
                  key={link}
                  href="#"
                  className="font-body text-sm text-cream-muted hover:text-cream transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* col 3 — company */}
          <div>
            <h4 className="font-mono text-[11px] text-cream-muted uppercase tracking-[0.28em] mb-4">
              COMPANY
            </h4>
            <div className="flex flex-col gap-2">
              {companyLinks.map(link => (
                <a
                  key={link}
                  href="#"
                  className="font-body text-sm text-cream-muted hover:text-cream transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* col 4 — support */}
          <div>
            <h4 className="font-mono text-[11px] text-cream-muted uppercase tracking-[0.28em] mb-4">
              SUPPORT
            </h4>
            <div className="flex flex-col gap-2">
              {supportLinks.map(link => (
                <a
                  key={link}
                  href="#"
                  className="font-body text-sm text-cream-muted hover:text-cream transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="py-6 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs text-cream-muted">
            © 2026 PROTOPULSE ROBOTICS · MADE IN INDIA
          </span>
          <span className="font-mono text-xs text-cream-muted">
            PRIVACY · TERMS · EN-IN
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

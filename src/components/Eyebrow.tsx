import React from 'react'

/** Small editorial section label — a copper rule + uppercase marketing label.
 *  `tone="cream"` for use on the copper background. No page numbers. */
const Eyebrow: React.FC<{
  label: string
  align?: 'center' | 'left'
  tone?: 'rust' | 'cream'
}> = ({ label, align = 'center', tone = 'rust' }) => {
  const lbl = tone === 'cream' ? 'text-cream/80' : 'text-rust'
  return (
    <div className={`flex items-center mb-5 ${align === 'center' ? 'justify-center' : ''}`}>
      <span className={`font-mono text-[11px] uppercase tracking-[0.28em] ${lbl}`}>{label}</span>
    </div>
  )
}

export default Eyebrow

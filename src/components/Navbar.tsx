import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Machines', href: '#machines' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Specs', href: '#specs' },
  { label: 'Support', href: '#support' },
]

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Announcement banner */}
      <div className="announcement-banner z-banner fixed top-0 left-0 right-0 py-2 px-4 text-center">
        <p className="font-mono text-[10px] sm:text-[11px] text-charcoal uppercase tracking-[0.2em] font-medium">
          First-batch reservations open{' '}
          <span className="opacity-60">·</span> Baker-01 ships Q1 2027{' '}
          <span className="opacity-60">·</span> Free freight across India
        </p>
      </div>

      {/* Main navbar */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="fixed top-[32px] left-0 right-0 z-sticky px-4 sm:px-6 lg:px-8 py-3"
      >
        <div className="max-w-7xl mx-auto relative flex items-center justify-between">
          {/* Left — logo */}
          <div
            className={`flex items-center rounded-full px-5 py-2.5 transition-all duration-500 ${
              scrolled ? 'bg-charcoal/85 backdrop-blur-sm' : 'bg-transparent'
            }`}
          >
            <a href="#top" className="logo-hover inline-flex items-center">
              <span className="font-logo logo-sweep text-lg leading-none">
                protopulse
              </span>
            </a>
          </div>

          {/* Center — nav links, pinned to the true centre of the bar */}
          <div
            className={`hidden md:flex items-center gap-1 rounded-full px-2 py-1.5 absolute left-1/2 -translate-x-1/2 transition-all duration-500 ${
              scrolled ? 'bg-charcoal/85 backdrop-blur-sm' : 'bg-transparent border border-white/10'
            }`}
          >
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="font-body text-[13px] text-cream/70 hover:text-cream px-3 py-1.5 rounded-full hover:bg-white/5 transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right — pre-order */}
          <div className="hidden md:flex items-center">
            <a
              href="#preorder"
              className="font-mono text-[11px] font-medium bg-rust text-charcoal px-5 py-2 rounded-full hover:bg-rust-light hover:scale-[1.04] active:scale-95 transition-all duration-300 uppercase tracking-wider"
            >
              Pre-order
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-cream p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-modal bg-charcoal/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 md:hidden"
          >
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="font-heading text-2xl text-cream hover:text-rust transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href="#preorder" className="font-heading text-2xl text-rust" onClick={() => setMenuOpen(false)}>
              Pre-order
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar

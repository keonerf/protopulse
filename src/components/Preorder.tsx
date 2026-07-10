import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Eyebrow from './Eyebrow'
import ScrollReveal from './ScrollReveal'

type Status = 'idle' | 'submitting' | 'submitted' | 'error'

const Preorder: React.FC = () => {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/preorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          org: data.get('org'),
          company: data.get('company'), // honeypot
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Something went wrong. Please try again.')
      }

      setStatus('submitted')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <section id="preorder" className="relative bg-charcoal-light py-24 lg:py-32 overflow-hidden">
      {/* copper glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full opacity-[0.08] blur-3xl"
        style={{ background: 'radial-gradient(circle, #CF8F4E 0%, transparent 60%)' }}
      />
      <div className="relative z-10 max-w-2xl mx-auto px-6 lg:px-10">
        <ScrollReveal>
          <Eyebrow label="First Batch · Baker-01" />
          <h2 className="font-heading text-[clamp(2.5rem,6vw,4rem)] font-bold text-cream leading-[0.92] tracking-tight mb-6 text-center text-wrap-balance">
            Reserve a build slot
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="font-body text-cream-muted text-base max-w-md mx-auto mb-12 text-center leading-relaxed">
            First-batch units ship Q1 2027 with free freight across India. Reserve your place
            in the production queue.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="glass-card p-7 lg:p-10">
            <AnimatePresence mode="wait">
              {status === 'submitted' ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="grid place-items-center w-14 h-14 rounded-full bg-rust/15 border border-rust/40 mx-auto mb-6">
                    <span className="text-rust text-2xl">✓</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-cream mb-2">Slot reserved</h3>
                  <p className="font-body text-sm text-cream-muted max-w-sm mx-auto">
                    You're on the first-batch list. We'll be in touch with production and shipping
                    details before Baker-01 ships.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  {/* honeypot — hidden from real users, bots tend to fill every field */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    className="absolute -left-[9999px] w-px h-px opacity-0"
                    aria-hidden="true"
                  />
                  <div>
                    <label htmlFor="po-name" className="block font-mono text-[10px] text-cream/45 uppercase tracking-[0.2em] mb-2">
                      Full name
                    </label>
                    <input
                      id="po-name"
                      name="name"
                      type="text"
                      required
                      placeholder="Ada Lovelace"
                      className="w-full bg-charcoal border border-cream/12 rounded-lg px-4 py-3 font-body text-sm text-cream placeholder:text-cream/25 focus:border-rust/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="po-email" className="block font-mono text-[10px] text-cream/45 uppercase tracking-[0.2em] mb-2">
                      Email
                    </label>
                    <input
                      id="po-email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@lab.in"
                      className="w-full bg-charcoal border border-cream/12 rounded-lg px-4 py-3 font-body text-sm text-cream placeholder:text-cream/25 focus:border-rust/50 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="po-org" className="block font-mono text-[10px] text-cream/45 uppercase tracking-[0.2em] mb-2">
                      Company / Institution <span className="text-cream/25 normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id="po-org"
                      name="org"
                      type="text"
                      placeholder="Lab, startup or college"
                      className="w-full bg-charcoal border border-cream/12 rounded-lg px-4 py-3 font-body text-sm text-cream placeholder:text-cream/25 focus:border-rust/50 focus:outline-none transition-colors"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="font-body text-sm text-red-400">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full font-body text-sm font-medium bg-rust text-charcoal px-7 py-3.5 rounded-full hover:bg-rust-light hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {status === 'submitting' ? 'Reserving…' : 'Reserve →'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default Preorder

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Hero = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section id="product" ref={containerRef} style={{
            height: '100vh',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg-deep)'
        }}>
            {/* Background Gradients */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                left: '-10%',
                width: '60vw',
                height: '60vw',
                background: 'radial-gradient(circle, rgba(0,255,255,0.08) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(60px)',
                zIndex: 0
            }} />

            <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%', padding: '0 4vw' }}>
                <motion.div style={{ y: yText, opacity: opacityText }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(3rem, 12vw, 16rem)',
                            lineHeight: '0.85',
                            color: 'var(--color-text-primary)',
                            textTransform: 'uppercase',
                            marginBottom: '1rem',
                            letterSpacing: '-0.03em'
                        }}
                    >
                        Proto<span style={{ color: 'var(--color-accent)' }}>Pulse</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
                            color: 'var(--color-text-secondary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            marginBottom: '2rem' // Reduced from 4rem
                        }}
                    >
                        From Gerber to Prototype in <span style={{ color: 'var(--color-text-primary)' }}>60 Minutes</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}
                    >
                        <a href="#assembly" style={{
                            padding: '1rem 2.5rem',
                            border: '1px solid var(--color-accent)',
                            color: 'var(--color-accent)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            fontSize: '0.9rem',
                            transition: 'all 0.3s ease',
                            background: 'rgba(0,255,255,0.05)'
                        }} className="btn-primary">
                            Discover ProtoBlock-1
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator Removed for cleaner aesthetic */}
        </section>
    );
};

export default Hero;

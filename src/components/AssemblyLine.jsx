import React, { useRef } from 'react';
import { motion, useTransform, useScroll } from 'framer-motion';

const steps = [
    {
        id: 1,
        title: "Isolation Milling",
        desc: "High-speed spindle carves excessive copper, isolating traces with 0.2mm precision. No chemicals, just physics.",
        stat: "0.2mm Precision"
    },
    {
        id: 2,
        title: "Solder Stenciling",
        desc: "Automated paste application ensures perfect volume for every pad. Eliminates bridging and dry joints.",
        stat: "Automated Paste"
    },
    {
        id: 3,
        title: "Pick & Place",
        desc: "Computer vision aligns components with 0.05mm accuracy. From 0402 passives to BGA packages.",
        stat: "0.05mm Accuracy"
    },
    {
        id: 4,
        title: "Reflow Soldering",
        desc: "Precision thermal profiling activates flux and creates intermetallic bonds. Factory-grade reliability on your desktop.",
        stat: "Thermal Profile"
    }
];

const AssemblyLine = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    return (
        <section ref={targetRef} style={{ height: '220vh', position: 'relative' }} id="product">
            <div style={{
                position: 'sticky',
                top: 0,
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                background: 'var(--color-bg-surface)'
            }}>
                {steps.map((step, i) => {
                    // Logic: i=0 should be visible quickly
                    const rangeStep = 1 / steps.length;
                    const start = i * rangeStep;
                    const end = (i + 1) * rangeStep;

                    // Special case for last item: Don't fade out at "end". Stay visible.
                    const isLast = i === steps.length - 1;

                    // Input: [start, middle, end]
                    // We want it to be visible during most of its "slot"
                    const opacity = useTransform(scrollYProgress,
                        [start, start + (rangeStep * 0.2), end - (rangeStep * 0.2), end],
                        isLast ? [0, 1, 1, 1] : [0, 1, 1, 0] // LAST ITEM STAYS VISIBLE
                    );

                    // Special case for first item: stay visible if scroll is near 0
                    const isFirst = i === 0;

                    // For motion effect
                    const scale = useTransform(scrollYProgress, [start, end], [0.95, 1.05]);

                    return (
                        <motion.div
                            key={step.id}
                            style={{
                                opacity: isFirst ? useTransform(scrollYProgress, [0, rangeStep], [1, 0]) : opacity, // First item visible immediately
                                position: 'absolute',
                                width: '100%',
                                textAlign: 'center',
                                padding: '0 2rem',
                                zIndex: 10
                            }}
                        >
                            <div style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '25vw',
                                lineHeight: 1,
                                opacity: 0.15,
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: -1,
                                whiteSpace: 'nowrap'
                            }}>
                                0{i + 1}
                            </div>

                            <h2 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                                textTransform: 'uppercase',
                                marginBottom: '1.5rem',
                                color: '#fff'
                            }}>
                                {step.title}
                            </h2>

                            <motion.p style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: 'clamp(1rem, 1.25vw, 1.25rem)',
                                color: 'var(--color-text-secondary)',
                                maxWidth: '500px',
                                margin: '0 auto 2rem auto',
                                lineHeight: 1.4
                            }}>
                                {step.desc}
                            </motion.p>

                            <div style={{
                                display: 'inline-block',
                                padding: '0.8rem 2rem',
                                border: '1px solid var(--color-accent)',
                                color: 'var(--color-accent)',
                                fontFamily: 'var(--font-mono)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.2em',
                                fontSize: '0.8rem'
                            }}>
                                {step.stat}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default AssemblyLine;

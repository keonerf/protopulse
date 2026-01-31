import React from 'react';

const SoftwareSuite = () => {
    return (
        <section id="software" style={{ padding: '8rem 5vw', background: 'var(--color-bg-deep)', position: 'relative' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        textTransform: 'uppercase',
                        marginBottom: '1rem',
                        color: '#fff'
                    }}>
                        ProtoPulse <span style={{ color: 'var(--color-accent)' }}>Suite</span>
                    </h2>
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '1.2rem',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Unified control software for seamless PCB fabrication. From schematic to physical board in one fluid workflow.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Feature 1: Integration */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-sm)'
                    }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Unified Pipeline</h3>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                            Integrates directly with your existing EDA tools (Altium, KiCad, Eagle). Automatically processes logic and generates manufacturing-ready <strong>Gerber & STL files</strong> for the ProtoBlock-1.
                        </p>
                    </div>

                    {/* Feature 2: Component Repo */}
                    <div style={{
                        background: 'rgba(0, 255, 255, 0.05)',
                        border: '1px solid var(--color-accent)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-sm)'
                    }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--color-accent)' }}>Subscription Library</h3>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                            Access a vast, cloud-hosted component repository directly within the software. Drag-and-drop footprint integration ensures your physical board matches your digital design perfectly.
                        </p>
                    </div>

                    {/* Feature 3: One-Click Print */}
                    <div style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '2rem',
                        borderRadius: 'var(--radius-sm)'
                    }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>One-Click Fabrication</h3>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                            Eliminate CAM configuration. The ProtoPulse Suite handles toolpath generation, drill mapping, and isolation milling strategies automatically.
                        </p>
                    </div>
                </div>

                {/* Visual Placeholder for UI */}
                <div style={{
                    marginTop: '6rem',
                    width: '100%',
                    height: '400px',
                    background: 'linear-gradient(180deg, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--color-text-secondary)',
                        letterSpacing: '0.2em',
                        fontSize: '0.8rem',
                        zIndex: 2
                    }}>
                        [ UI INTERFACE MOCKUP ]
                    </div>
                    {/* Abstract Grid Line */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        width: '100%',
                        height: '1px',
                        background: 'var(--color-accent)',
                        opacity: 0.2
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: 0,
                        height: '100%',
                        width: '1px',
                        background: 'var(--color-accent)',
                        opacity: 0.2
                    }}></div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <button style={{
                        background: 'transparent',
                        color: 'var(--color-accent)',
                        border: '1px solid var(--color-accent)',
                        padding: '1rem 3rem',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        transition: 'all 0.3s ease'
                    }}>
                        View Subscription Plans
                    </button>
                </div>
            </div>
        </section>
    );
};

export default SoftwareSuite;

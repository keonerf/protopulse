import React from 'react';

const FounderVision = () => {
    return (
        <section id="vision" style={{ padding: '6rem 5vw', background: 'var(--color-bg-surface)', position: 'relative' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    textTransform: 'uppercase',
                    marginBottom: '3rem',
                    color: '#fff'
                }}>
                    The <span style={{ color: 'var(--color-accent)' }}>Architects</span>
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', textAlign: 'center' }}>
                    {[
                        { name: "Avi Prakash Jaiswal", role: "Co-Founder", bio: "Strategic lead for business operations and market disruption, dedicated to transforming complex engineering into seamless, logic ready user experiences. Drives the company's growth strategy and product-market fit to set a new global standard for rapid prototyping." },
                        { name: "Soham Nalawade", role: "Co-Founder", bio: "Technical architect of the ProtoPulse ecosystem, specializing in deep hardware-software integration and industrial automation. Lead engineer for the proprietary multi-stage assembly line, ensuring every system delivers industrial-grade precision in a desktop footprint." }
                    ].map((founder, i) => (
                        <div key={i} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', textTransform: 'uppercase', color: '#fff' }}>{founder.name}</h3>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-accent)', marginBottom: '1rem', textTransform: 'uppercase' }}>{founder.role}</div>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                                {founder.bio}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FounderVision;

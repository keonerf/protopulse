import React from 'react';

const Roadmap = () => {
    const steps = [
        { month: "Month 3", title: "Integration", desc: "Finalization of hardware-software integration and prototype refinement." },
        { month: "Month 6", title: "Validation", desc: "Batch validation and consistency testing for 90%+ yield rates." },
        { month: "Month 9", title: "Pilot", desc: "Launch of pilot programs with hardware startups and private R&D labs." },
        { month: "Month 12", title: "Launch", desc: "Official market launch and full footprint repository expansion." }
    ];

    const sectionStyle = {
        padding: '6rem 2rem',
        background: 'var(--color-bg-surface)',
        color: '#fff',
    };

    const containerStyle = {
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
    };

    const lineStyle = {
        position: 'absolute',
        left: '50%',
        top: '0',
        bottom: '0',
        width: '2px',
        background: 'var(--color-primary)',
        transform: 'translateX(-50%)',
        zIndex: 0,
    };

    const itemStyle = (index) => ({
        display: 'flex',
        justifyContent: index % 2 === 0 ? 'flex-end' : 'flex-start',
        padding: '2rem 0',
        position: 'relative',
        zIndex: 1,
    });

    const contentStyle = (index) => ({
        width: '45%',
        padding: '1.5rem',
        background: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px',
        textAlign: index % 2 === 0 ? 'right' : 'left',
        position: 'relative',
    });

    const nodeStyle = {
        position: 'absolute',
        top: '50%',
        width: '16px',
        height: '16px',
        background: 'var(--color-primary)',
        borderRadius: '50%',
        transform: 'translateY(-50%)',
        boxShadow: '0 0 10px var(--color-primary)',
    };

    return (
        <section style={sectionStyle} id="roadmap">
            <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '4rem', textTransform: 'uppercase' }}>Strategic Roadmap</h2>

            <div style={containerStyle}>
                <div style={lineStyle}></div>

                {steps.map((step, index) => (
                    <div key={index} style={itemStyle(index)}>
                        <div style={contentStyle(index)}>
                            <div style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                {step.month}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                            <p style={{ color: '#aaa', fontSize: '1rem' }}>{step.desc}</p>

                            {/* Node on the line */}
                            <div style={{
                                ...nodeStyle,
                                [index % 2 === 0 ? 'right' : 'left']: '-5.5%', // Adjust based on width/gap
                            }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Roadmap;

import React from 'react';

const FounderVision = () => {
    const sectionStyle = {
        padding: '8rem 2rem',
        backgroundColor: 'var(--color-bg-surface)',
        textAlign: 'center',
    };

    const containerStyle = {
        maxWidth: '1000px',
        margin: '0 auto',
    };

    const sectionTitleStyle = {
        fontSize: '2.5rem',
        marginBottom: '4rem',
        fontWeight: '800',
        letterSpacing: '-0.02em',
    };

    const cardContainerStyle = {
        display: 'flex',
        gap: '2rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
    };

    const cardStyle = {
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        padding: '2rem',
        borderRadius: '4px',
        width: '300px',
        textAlign: 'left',
        transition: 'transform 0.3s ease, border-color 0.3s ease',
        cursor: 'default',
    };

    const nameStyle = {
        color: 'var(--color-primary)',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
    };

    const roleStyle = {
        color: 'var(--color-text-muted)',
        fontSize: '0.9rem',
        marginBottom: '1rem',
        fontFamily: 'var(--font-mono)',
    };

    const narrativeStyle = {
        marginTop: '6rem',
        fontSize: '1.2rem',
        lineHeight: '1.8',
        color: '#ccc',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderLeft: '4px solid var(--color-primary)',
        paddingLeft: '2rem',
        textAlign: 'left',
    };

    return (
        <section style={sectionStyle} id="vision">
            <div style={containerStyle}>
                <h2 style={sectionTitleStyle}>THE ARCHITECTS</h2>

                <div style={cardContainerStyle}>
                    <div style={cardStyle}>
                        <div style={nameStyle}>Avi Prakash Jaiswal</div>
                        <div style={roleStyle}>Co-Founder & CEO</div>
                        <p>Product Strategy, Business Modeling & Vision.</p>
                    </div>
                    <div style={cardStyle}>
                        <div style={nameStyle}>Soham Nalawade</div>
                        <div style={roleStyle}>Co-Founder & CTO</div>
                        <p>Systems Architecture, Embedded Logic & Precision Engineering.</p>
                    </div>
                </div>

                <div style={narrativeStyle}>
                    <p>
                        "NexusFlow was born from a simple frustration: the hardware supply chain is broken.
                        It takes weeks to get a PCB that you can verify in minutes. We built the OmniProto Station
                        to bridge the gap between digital design and functional reality—turning the 'wait time'
                        into 'build time'."
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FounderVision;

import React from 'react';

const NarrativeHook = () => {
    const sectionStyle = {
        padding: '8rem 2rem',
        backgroundColor: '#000', // Pure black for high contrast
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
    };

    const hookHeadlineStyle = {
        fontSize: '3.5rem',
        fontWeight: '900',
        textAlign: 'center',
        background: 'linear-gradient(to bottom, #fff, #666)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '2rem',
        maxWidth: '900px',
    };

    const subCopyStyle = {
        fontSize: '1.5rem',
        color: 'var(--color-primary)',
        marginBottom: '3rem',
        fontWeight: '500',
    };

    const exampleBoxStyle = {
        border: '1px solid var(--color-border)',
        padding: '3rem',
        maxWidth: '800px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(5px)',
        position: 'relative',
    };

    const highlightStyle = {
        color: 'var(--color-primary)',
        fontWeight: 'bold',
    };

    return (
        <section style={sectionStyle}>
            <h2 style={hookHeadlineStyle}>STOP PROTOTYPING BOARDS.<br />START PROTOTYPING IDEAS.</h2>
            <p style={subCopyStyle}>Logic-Ready in 60 Minutes.</p>

            <div style={exampleBoxStyle}>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                    Competitors leave you with a bare board and a bag of components. We deliver a <span style={highlightStyle}>logic-ready assembly</span>.
                    <br /><br />
                    If you are building an RC car with a logic-controlled turret, you need to test the signals covering the motor drivers, not just the copper traces.
                    NexusFlow gets you to the <strong>signal-testing phase</strong> in one hour.
                </p>
                {/* Visual accent: A "Signal" line graphic */}
                <div style={{
                    height: '2px',
                    width: '100%',
                    background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
                    marginTop: '2rem',
                    boxShadow: '0 0 10px var(--color-primary)'
                }}></div>
            </div>
        </section>
    );
};

export default NarrativeHook;

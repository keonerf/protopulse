import React from 'react';

const Hero = () => {
    const heroSectionStyle = {
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%)',
    };

    const contentStyle = {
        zIndex: 10,
        textAlign: 'center',
        maxWidth: '1200px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        alignItems: 'center',
        padding: '0 2rem',
    };

    const textColumnStyle = {
        textAlign: 'left',
    };

    const headlineStyle = {
        fontSize: '4rem',
        fontWeight: '900',
        lineHeight: '1.1',
        marginBottom: '1.5rem',
        background: 'linear-gradient(to right, #fff, #a0a0a0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    };

    const subHeadlineStyle = {
        fontSize: '1.2rem',
        color: 'var(--color-text-muted)',
        marginBottom: '2.5rem',
        maxWidth: '500px',
    };

    const ctaButtonStyle = {
        padding: '1rem 2.5rem',
        fontSize: '1rem',
        fontWeight: '700',
        backgroundColor: 'transparent',
        color: 'var(--color-primary)',
        border: '1px solid var(--color-primary)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        transition: 'all 0.3s ease',
        boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)',
    };

    // Placeholder 3D effect - simulating the machine
    // We use the uploaded image but add some CSS perspective
    const imageContainerStyle = {
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: 'perspective(1000px) rotateY(-15deg)',
        transition: 'transform 0.5s ease',
    };

    const imageStyle = {
        width: '100%',
        height: 'auto',
        filter: 'drop-shadow(0 0 30px rgba(0, 255, 255, 0.15))',
        opacity: 0.9,
    };

    return (
        <section style={heroSectionStyle}>
            {/* Background Grid Effect */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
                zIndex: 1,
                maskImage: 'radial-gradient(circle at 50% 50%, black 40%, transparent 80%)'
            }}></div>

            <div style={contentStyle}>
                <div style={textColumnStyle}>
                    <h1 style={headlineStyle}>
                        FROM GERBER TO <span style={{ color: 'var(--color-primary)', WebkitTextFillColor: 'var(--color-primary)' }}>PROTOTYPE</span><br />
                        IN 60 MINUTES.
                    </h1>
                    <p style={subHeadlineStyle}>
                        The world’s first desktop assembly line that mills, places, and solders your PCBs—fully automated.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button style={{ ...ctaButtonStyle, backgroundColor: 'var(--color-primary)', color: '#000' }}>
                            Demo
                        </button>
                        <button style={ctaButtonStyle}>
                            Explore
                        </button>
                    </div>
                </div>

                <div style={imageContainerStyle}>
                    <img src="/assets/cad_render_1.png" alt="OmniProto Station Internal View" style={imageStyle} />
                    {/* Decorative circle behind */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) translateZ(-50px)',
                        width: '80%',
                        height: '80%',
                        border: '1px solid var(--color-primary)',
                        borderRadius: '50%',
                        opacity: 0.2
                    }}></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

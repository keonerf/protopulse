import React, { useState, useEffect } from 'react';

const AssemblyLine = () => {
    const steps = [
        {
            title: "Isolation Milling",
            desc: "High-precision CNC milling achieving 0.2mm trace accuracy. No hazardous chemicals; just high-speed, office-safe isolation carving.",
            stats: "0.2mm accuracy",
            color: "#00FFFF" // Electric Cyan
        },
        {
            title: "Solder Stenciling",
            desc: "Integrated stenciling process using a 0.1mm V-bit at 8000 RPM. Creates perfect pads ready for component placement.",
            stats: "8000 RPM",
            color: "#FF00FF" // Magenta for contrast
        },
        {
            title: "Robotic Placement",
            desc: "A robotic manipulator using custom-generated 3D-printed molds to accurately position components ranging from 0402 chips to larger QFPs.",
            stats: "0402 to QFPs",
            color: "#FFFF00" // Yellow
        },
        {
            title: "PID Reflow",
            desc: "A PID-controlled thermal profile that peaks at 220°C for perfect solder joints every time.",
            stats: "220°C Peak",
            color: "#FF3333" // Red
        }
    ];

    const [activeStep, setActiveStep] = useState(0);

    // Simple scroll simulation logic could be implemented with IntersectionObserver
    // For now, we'll make it interactive on hover/click or a self-playing cycle to "wow" the user
    // A vertical timeline is requested. Let's do a sticky side-by-side layout.

    const sectionStyle = {
        padding: '6rem 2rem',
        background: 'var(--color-bg-base)',
        color: '#fff',
    };

    const containerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'start',
    };

    const headerStyle = {
        fontSize: '3rem',
        fontWeight: '900',
        marginBottom: '4rem',
        textAlign: 'center',
        gridColumn: '1 / -1',
        textTransform: 'uppercase',
    };

    const stepListStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    };

    const stepItemStyle = (isActive, color) => ({
        padding: '2rem',
        borderLeft: `4px solid ${isActive ? color : '#333'}`,
        background: isActive ? 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)' : 'transparent',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        opacity: isActive ? 1 : 0.5,
    });

    const displayWindowStyle = {
        position: 'sticky',
        top: '100px',
        height: '400px',
        background: '#1a1a1a',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: activeStep >= 0 ? `0 0 50px ${steps[activeStep].color}20` : 'none',
        transition: 'box-shadow 0.5s ease',
    };

    return (
        <section style={sectionStyle} id="process">
            <div style={containerStyle}>
                <h2 style={headerStyle}>The Assembly Line</h2>

                <div style={stepListStyle}>
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            style={stepItemStyle(activeStep === index, step.color)}
                            onMouseEnter={() => setActiveStep(index)}
                        >
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: step.color }}>{step.title}</h3>
                            <p style={{ color: '#ccc', marginBottom: '1rem' }}>{step.desc}</p>
                            <div style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.5rem',
                                background: step.color,
                                color: '#000',
                                fontWeight: 'bold',
                                fontSize: '0.8rem',
                                borderRadius: '2px'
                            }}>
                                {step.stats}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={displayWindowStyle}>
                    {/* Visual representation of the active step */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: '5rem',
                            color: steps[activeStep].color,
                            textShadow: `0 0 20px ${steps[activeStep].color}`,
                            marginBottom: '1rem'
                        }}>
                            {indexToIcon(activeStep)}
                        </div>
                        <div style={{ color: '#fff', fontSize: '1.2rem', textTransform: 'uppercase' }}>
                            {steps[activeStep].title} Station
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Helper for rough icon visualization
const indexToIcon = (index) => {
    switch (index) {
        case 0: return "⚙️"; // Milling
        case 1: return "💧"; // Paste
        case 2: return "🤖"; // Robot
        case 3: return "🔥"; // Heat
        default: return "❓";
    }
};

export default AssemblyLine;

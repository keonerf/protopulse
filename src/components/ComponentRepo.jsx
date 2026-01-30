import React, { useState } from 'react';

const ComponentRepo = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const components = [
        { id: 'C001', name: 'ATmega328P', package: 'TQFP-32', type: 'Microcontroller' },
        { id: 'C002', name: 'ESP32-WROOM', package: 'Module', type: 'WiFi/BT' },
        { id: 'R001', name: '10k Resistor', package: '0603', type: 'Passive' },
        { id: 'C003', name: '100nF Capacitor', package: '0402', type: 'Passive' },
        { id: 'L001', name: 'Green LED', package: '0805', type: 'Opto' },
        { id: 'M001', name: 'DRV8825', package: 'HTSSOP-28', type: 'Driver' },
        { id: 'U001', name: 'USB-C Connector', package: 'SMD', type: 'Connector' },
        { id: 'S001', name: 'Tactile Switch', package: 'SMD', type: 'Electromechanical' },
        { id: 'Q001', name: '2N2222 Transistor', package: 'SOT-23', type: 'Active' },
    ];

    const filteredComponents = components.filter(comp =>
        comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.package.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sectionStyle = {
        padding: '6rem 2rem',
        background: '#121212',
        color: '#fff',
        textAlign: 'center',
    };

    const searchInputStyle = {
        padding: '1rem 2rem',
        width: '100%',
        maxWidth: '500px',
        fontSize: '1.2rem',
        background: '#1a1a1a',
        border: '1px solid #333',
        color: '#fff',
        borderRadius: '30px',
        marginBottom: '3rem',
        outline: 'none',
        transition: 'border-color 0.3s',
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
    };

    const cardStyle = {
        background: '#1a1a1a',
        border: '1px solid #333',
        padding: '1.5rem',
        borderRadius: '8px',
        textAlign: 'left',
        transition: 'transform 0.2s',
    };

    return (
        <section style={sectionStyle} id="repo">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textTransform: 'uppercase' }}>Component Repository</h2>
            <p style={{ color: '#aaa', marginBottom: '3rem' }}>Access our extensive library of verified footprints. Drag. Drop. Done.</p>

            <input
                type="text"
                placeholder="Search components (e.g., 'ESP32', '0603')"
                style={searchInputStyle}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
            />

            <div style={gridStyle}>
                {filteredComponents.map(comp => (
                    <div key={comp.id} style={cardStyle}>
                        <div style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 'bold' }}>{comp.id}</div>
                        <h4 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>{comp.name}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.9rem' }}>
                            <span>{comp.package}</span>
                            <span>{comp.type}</span>
                        </div>
                    </div>
                ))}
            </div>
            {filteredComponents.length === 0 && <p style={{ color: '#666', marginTop: '2rem' }}>No components found.</p>}
        </section>
    );
};

export default ComponentRepo;

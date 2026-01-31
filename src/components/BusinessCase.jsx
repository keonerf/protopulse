import React from 'react';

const BusinessCase = () => {
    const sectionStyle = {
        padding: '6rem 2rem',
        background: '#0a0a0a',
        color: '#fff',
        textAlign: 'center',
    };

    const tableStyle = {
        width: '100%',
        maxWidth: '900px',
        margin: '4rem auto',
        borderCollapse: 'collapse',
        border: '1px solid #333',
    };

    const thStyle = {
        padding: '1.5rem',
        borderBottom: '2px solid var(--color-primary)',
        textTransform: 'uppercase',
        fontSize: '1.1rem',
        color: 'var(--color-primary)',
    };

    const tdStyle = {
        padding: '1.5rem',
        borderBottom: '1px solid #333',
        fontSize: '1.2rem',
    };

    const highlightStyle = {
        color: 'var(--color-primary)',
        fontWeight: 'bold',
        fontSize: '1.3rem',
    };

    return (
        <section style={sectionStyle} id="business">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', textTransform: 'uppercase' }}>The Competitive Edge</h2>
            <p style={{ color: '#aaa', fontSize: '1.2rem' }}>Why wait 2 weeks for what you can build in an hour?</p>

            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Metric</th>
                        <th style={{ ...thStyle, color: '#aaa' }}>External Vendors</th>
                        <th style={thStyle}>ProtoBlock-1</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={tdStyle}>Cost per Prototype</td>
                        <td style={tdStyle}>₹4,415 – ₹8,830</td>
                        <td style={{ ...tdStyle, ...highlightStyle }}>₹442 – ₹1,060</td>
                    </tr>
                    <tr>
                        <td style={tdStyle}>Turnaround Time</td>
                        <td style={tdStyle}>5 – 14 Days</td>
                        <td style={{ ...tdStyle, ...highlightStyle }}>45 – 90 Minutes</td>
                    </tr>
                    <tr>
                        <td style={tdStyle}>Design Security</td>
                        <td style={tdStyle}>Shared Files (IP Risk)</td>
                        <td style={{ ...tdStyle, ...highlightStyle }}>In-House (100% Secure)</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginTop: '3rem' }}>
                <div>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>50%</div>
                    <div style={{ color: '#aaa' }}>Reduction in Expense</div>
                </div>
                <div>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>70%</div>
                    <div style={{ color: '#aaa' }}>Faster Production</div>
                </div>
            </div>
        </section>
    );
};

export default BusinessCase;

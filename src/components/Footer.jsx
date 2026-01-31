import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            padding: '4rem 2rem',
            background: '#000',
            color: '#666',
            textAlign: 'center',
            borderTop: '1px solid #333'
        }} id="contact">
            <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem', textTransform: 'uppercase' }}>ProtoPulse</h3>
            <p style={{ marginBottom: '2rem' }}>The Future of Hardware Prototyping.</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
                <a href="#" style={{ color: '#aaa' }}>Twitter</a>
                <a href="#" style={{ color: '#aaa' }}>LinkedIn</a>
                <a href="#" style={{ color: '#aaa' }}>Instagram</a>
                <a href="mailto:contact@protopulse.com" style={{ color: 'var(--color-primary)' }}>contact@protopulse.com</a>
            </div>

            <p style={{ fontSize: '0.8rem' }}>© 2026 ProtoPulse. All rights reserved.</p>
        </footer>
    );
};

export default Footer;

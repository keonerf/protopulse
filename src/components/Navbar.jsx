import React from 'react';
import '../index.css';

const Navbar = () => {
    const navStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 4rem',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(18, 18, 18, 0.7)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    };

    const logoStyle = {
        color: 'var(--color-primary)',
        fontWeight: '800',
        fontSize: '1.5rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
    };

    const linkContainerStyle = {
        display: 'flex',
        gap: '2rem',
    };

    const linkStyle = {
        color: 'var(--color-text-main)',
        fontSize: '0.9rem',
        fontWeight: '500',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
    };

    return (
        <nav style={navStyle}>
            <div style={logoStyle}>NexusFlow</div>
            <div style={linkContainerStyle}>
                <a href="#vision" style={linkStyle}>Vision</a>
                <a href="#product" style={linkStyle}>Product</a>
                <a href="#repo" style={linkStyle}>Components</a>
                <a href="#contact" style={{ ...linkStyle, color: 'var(--color-primary)' }}>Pre-Order</a>
            </div>
        </nav>
    );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
                position: 'fixed',
                top: '20px',
                left: 0,
                right: 0,
                margin: '0 auto',
                width: 'max-content',
                maxWidth: '95vw',
                padding: '0.8rem 2.5rem',
                display: 'flex',
                gap: '2rem',
                alignItems: 'center',
                zIndex: 1000,
                color: '#fff',
                background: 'rgba(5,5,5,0.90)',
                backdropFilter: 'blur(20px)',
                borderRadius: '100px',
                border: '1px solid rgba(0, 255, 255, 0.4)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 15px rgba(0, 255, 255, 0.1)'
            }}
        >
            {/* Left Portion of Links */}
            <div style={{ display: 'flex', gap: '2rem' }}>
                <a href="#vision" style={linkStyle}>Vision</a>
                <a href="#product" style={linkStyle}>Product</a>
            </div>

            {/* Right Portion of Links */}
            <div style={{ display: 'flex', gap: '2rem' }}>
                <a href="#software" style={linkStyle}>Software</a>
                <a href="#gallery" style={linkStyle}>Gallery</a>
            </div>
        </motion.nav>
    );
};

const linkStyle = {
    fontFamily: 'var(--font-body)',
    textTransform: 'uppercase',
    fontSize: '0.75rem',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
};

export default Navbar;

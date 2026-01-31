import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const MediaGallery = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // 3D Rotation simulation
    return (
        <section id="gallery" style={{
            padding: '4rem 5vw',
            background: 'var(--color-bg-deep)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3rem'
        }}>
            <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 6vw, 5rem)', // Compressed
                textAlign: 'center',
                marginBottom: '1rem' // Tighter
            }}>
                Visual <span style={{ color: 'var(--color-accent)' }}>Evidence</span>
            </h2>

            {/* Symmetrical Grid: Video Key, Images Flanking */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '1.5rem',
                width: '100%',
                maxWidth: '1400px'
            }}>
                {/* Main Video - Centered and Large */}
                <div style={{
                    gridColumn: 'span 12',
                    aspectRatio: '16/9',
                    background: '#000',
                    border: '1px solid #333',
                    position: 'relative'
                }}>
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/9xvnhxmLzIU?si=eL5tWj6y1h3y4sg_"
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ display: 'block' }} // Removed filters
                    ></iframe>
                </div>

                {/* Symmetrical Images Below - 50/50 Split */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        gridColumn: 'span 6',
                        aspectRatio: '16/9', // Match video aspect ratio
                        background: '#111',
                        border: '1px solid var(--color-border)',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                    <img src="/assets/cad_render_1.png" alt="Render Top" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', opacity: 0.9 }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '1rem',
                        left: '1rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        background: 'rgba(0,0,0,0.6)',
                        padding: '0.2rem 0.5rem',
                        color: 'white',
                        zIndex: 2
                    }}>FIG_01: ISO_VIEW</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    style={{
                        gridColumn: 'span 6',
                        aspectRatio: '16/9', // Match video
                        background: '#111',
                        border: '1px solid var(--color-border)',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                    <img src="/assets/cad_render_2.png" alt="Render Side" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', opacity: 0.9 }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '1rem',
                        left: '1rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        background: 'rgba(0,0,0,0.6)',
                        padding: '0.2rem 0.5rem',
                        color: 'white',
                        zIndex: 2
                    }}>FIG_02: TOP_DOWN</div>
                </motion.div>
            </div>
        </section >
    );
};

export default MediaGallery;

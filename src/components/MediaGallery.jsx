import React from 'react';

const MediaGallery = () => {
    const sectionStyle = {
        padding: '6rem 2rem',
        background: '#050505',
        color: '#fff',
        textAlign: 'center',
    };

    const containerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
    };

    const videoWrapperStyle = {
        position: 'relative',
        paddingBottom: '56.25%', /* 16:9 */
        height: 0,
        marginBottom: '4rem',
        border: '1px solid #333',
        overflow: 'hidden',
        borderRadius: '12px',
        boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
    };

    const iframeStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 0,
    };

    const imageGridStyle = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
    };

    const imageContainerStyle = {
        border: '1px solid #333',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
    };

    const labelStyle = {
        position: 'absolute',
        bottom: '1rem',
        left: '1rem',
        background: 'rgba(0,0,0,0.8)',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        color: 'var(--color-primary)',
        fontWeight: 'bold',
        fontSize: '0.9rem',
    };

    return (
        <section style={sectionStyle} id="media">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textTransform: 'uppercase' }}>See It In Action</h2>

            <div style={containerStyle}>
                {/* Video Embed */}
                <div style={videoWrapperStyle}>
                    <iframe
                        src="https://www.youtube.com/embed/9xvnhxmLzIU"
                        title="NexusFlow Demo"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={iframeStyle}
                    ></iframe>
                </div>

                {/* Image Gallery Placeholders */}
                <div style={imageGridStyle}>
                    <div style={imageContainerStyle}>
                        <img src="/assets/cad_render_1.png" alt="Full Assembly" style={{ width: '100%', opacity: 0.8 }} />
                        <div style={labelStyle}>Full Assembly Frame</div>
                    </div>
                    <div style={imageContainerStyle}>
                        <img src="/assets/cad_render_2.png" alt="Work Station" style={{ width: '100%', opacity: 0.8 }} />
                        <div style={labelStyle}>Precision Head Detail</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MediaGallery;

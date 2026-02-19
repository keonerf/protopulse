import React, { useState, useRef, useEffect } from 'react';

interface Message {
    role: 'user' | 'model';
    content: string;
}

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [displayedResponse, setDisplayedResponse] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const hasGreeted = useRef(false);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, displayedResponse]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Welcome message on first open
    useEffect(() => {
        if (isOpen && !hasGreeted.current && messages.length === 0) {
            hasGreeted.current = true;
            setMessages([{
                role: 'model',
                content: 'Hey! 👋 I\'m the ProtoPulse AI assistant. Ask me anything about our ProtoBlock-1 system, the ProtoPulse Suite, pricing, specs, or any PCB/electronics questions you have!'
            }]);
        }
    }, [isOpen, messages.length]);

    // Typewriter effect for AI responses
    const typeResponse = (fullText: string): void => {
        setIsTyping(true);
        setDisplayedResponse('');
        let i = 0;
        const interval = setInterval(() => {
            if (i < fullText.length) {
                setDisplayedResponse(fullText.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
                setIsTyping(false);
                setDisplayedResponse('');
                setMessages(prev => [...prev, { role: 'model', content: fullText }]);
            }
        }, 12);
    };

    const sendMessage = async (): Promise<void> => {
        const trimmed = input.trim();
        if (!trimmed || isLoading || isTyping) return;

        const userMessage: Message = { role: 'user', content: trimmed };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages.map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to get response');
            }

            const data = await res.json();
            setIsLoading(false);
            typeResponse(data.response);
        } catch (error) {
            setIsLoading(false);
            setMessages(prev => [...prev, {
                role: 'model',
                content: 'Sorry, I encountered an error. Please try again or reach out to contact@protopulse.com.'
            }]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    // Simple markdown-ish rendering (bold, bullets)
    const renderContent = (text: string): React.JSX.Element => {
        const lines = text.split('\n');
        return (
            <>
                {lines.map((line, i) => {
                    // Bold
                    let processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    // Bullet points
                    const isBullet = /^[-•]\s/.test(line);
                    if (isBullet) {
                        processed = processed.replace(/^[-•]\s/, '');
                        return (
                            <div key={i} style={{ paddingLeft: '1rem', position: 'relative', marginBottom: '0.25rem' }}>
                                <span style={{ position: 'absolute', left: 0, color: 'var(--color-accent, cyan)' }}>•</span>
                                <span dangerouslySetInnerHTML={{ __html: processed }} />
                            </div>
                        );
                    }
                    return (
                        <span key={i}>
                            <span dangerouslySetInnerHTML={{ __html: processed }} />
                            {i < lines.length - 1 && <br />}
                        </span>
                    );
                })}
            </>
        );
    };

    const panelStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: '6rem',
        right: '1.5rem',
        width: '400px',
        maxWidth: 'calc(100vw - 2rem)',
        height: '550px',
        maxHeight: 'calc(100vh - 8rem)',
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 255, 255, 0.2)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 10000,
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 255, 255, 0.08)',
        animation: 'chatSlideUp 0.3s ease-out',
    };

    const headerStyle: React.CSSProperties = {
        padding: '1rem 1.25rem',
        background: 'rgba(0, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(0, 255, 255, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
    };

    return (
        <>
            {/* Global animation keyframes */}
            <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,255,255,0.3), 0 0 40px rgba(0,255,255,0.1); }
          50% { box-shadow: 0 0 25px rgba(0,255,255,0.5), 0 0 50px rgba(0,255,255,0.2); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>

            {/* Chat Panel */}
            {isOpen && (
                <div style={panelStyle}>
                    {/* Header */}
                    <div style={headerStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#00ff88',
                                boxShadow: '0 0 8px #00ff88',
                            }} />
                            <span style={{
                                fontFamily: 'var(--font-body, sans-serif)',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                color: '#fff',
                                letterSpacing: '0.05em',
                            }}>
                                ProtoPulse AI
                            </span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '1.4rem',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                lineHeight: 1,
                                transition: 'color 0.2s',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
                            onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                            aria-label="Close chat"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                    }}>
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                    background: msg.role === 'user'
                                        ? 'linear-gradient(135deg, rgba(0,255,255,0.2), rgba(0,255,255,0.1))'
                                        : 'rgba(255,255,255,0.06)',
                                    border: msg.role === 'user'
                                        ? '1px solid rgba(0,255,255,0.3)'
                                        : '1px solid rgba(255,255,255,0.08)',
                                    color: msg.role === 'user' ? '#fff' : 'rgba(255,255,255,0.85)',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.5,
                                    fontFamily: 'var(--font-body, sans-serif)',
                                }}
                            >
                                {renderContent(msg.content)}
                            </div>
                        ))}

                        {/* Typing indicator (loading) */}
                        {isLoading && (
                            <div style={{
                                alignSelf: 'flex-start',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '14px 14px 14px 4px',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                display: 'flex',
                                gap: '4px',
                            }}>
                                {[0, 1, 2].map(i => (
                                    <div key={i} style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: 'rgba(0,255,255,0.6)',
                                        animation: `dotBounce 1.2s infinite`,
                                        animationDelay: `${i * 0.15}s`,
                                    }} />
                                ))}
                            </div>
                        )}

                        {/* Typewriter response */}
                        {isTyping && displayedResponse && (
                            <div style={{
                                alignSelf: 'flex-start',
                                maxWidth: '85%',
                                padding: '0.75rem 1rem',
                                borderRadius: '14px 14px 14px 4px',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.85)',
                                fontSize: '0.875rem',
                                lineHeight: 1.5,
                                fontFamily: 'var(--font-body, sans-serif)',
                            }}>
                                {renderContent(displayedResponse)}
                                <span style={{
                                    display: 'inline-block',
                                    width: '2px',
                                    height: '1em',
                                    background: 'var(--color-accent, cyan)',
                                    marginLeft: '2px',
                                    animation: 'pulseGlow 1s infinite',
                                    verticalAlign: 'text-bottom',
                                }} />
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Bar */}
                    <div style={{
                        padding: '0.75rem 1rem',
                        borderTop: '1px solid rgba(0, 255, 255, 0.1)',
                        display: 'flex',
                        gap: '0.5rem',
                        flexShrink: 0,
                        background: 'rgba(0,0,0,0.3)',
                    }}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                            disabled={isLoading || isTyping}
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                padding: '0.7rem 1rem',
                                color: '#fff',
                                fontSize: '0.875rem',
                                fontFamily: 'var(--font-body, sans-serif)',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => (e.target.style.borderColor = 'rgba(0,255,255,0.4)')}
                            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={isLoading || isTyping || !input.trim()}
                            style={{
                                background: input.trim() && !isLoading && !isTyping
                                    ? 'linear-gradient(135deg, rgba(0,255,255,0.3), rgba(0,255,255,0.15))'
                                    : 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(0,255,255,0.3)',
                                borderRadius: '10px',
                                padding: '0.7rem 1rem',
                                color: input.trim() && !isLoading && !isTyping ? 'cyan' : 'rgba(255,255,255,0.3)',
                                cursor: input.trim() && !isLoading && !isTyping ? 'pointer' : 'not-allowed',
                                fontSize: '1rem',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            aria-label="Send message"
                        >
                            ▸
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '1.5rem',
                    right: '1.5rem',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(0,255,255,0.25), rgba(0,255,255,0.1))',
                    border: '1px solid rgba(0,255,255,0.4)',
                    color: 'cyan',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    zIndex: 10001,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    animation: isOpen ? 'none' : 'pulseGlow 3s infinite',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,255,255,0.35), rgba(0,255,255,0.2))';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,255,255,0.25), rgba(0,255,255,0.1))';
                }}
                aria-label={isOpen ? 'Close chat' : 'Open ProtoPulse AI chat'}
            >
                {isOpen ? '✕' : '💬'}
            </button>
        </>
    );
};

export default ChatWidget;

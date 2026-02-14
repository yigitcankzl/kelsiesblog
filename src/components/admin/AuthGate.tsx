import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useBlogStore } from '../../store/store';

const font = { fontFamily: "'Press Start 2P', monospace" } as const;

const inputStyle: React.CSSProperties = {
    ...font,
    fontSize: '10px',
    width: '100%',
    padding: '14px 16px 14px 42px',
    backgroundColor: '#0a0a0a',
    border: '2px solid #333',
    color: 'var(--brand)',
    outline: 'none',
    transition: 'all 0.3s',
    letterSpacing: '0.2em',
};

export default function AuthGate() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setAuthenticated } = useBlogStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setAuthenticated(true);
        } catch {
            setError(true);
            setTimeout(() => setError(false), 3000);
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: '420px' }}
            >
                <div style={{
                    border: '2px solid #1a1a1a',
                    padding: '40px 32px',
                    backgroundColor: '#050505',
                    boxShadow: '0 0 30px rgba(0, 255, 65, 0.05)',
                }}>
                    {/* Terminal header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                        <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--brand)', boxShadow: '0 0 6px rgba(0,255,65,0.5)' }} />
                        <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--neon-amber)' }} />
                        <div style={{ width: '8px', height: '8px', backgroundColor: '#333' }} />
                        <span style={{ ...font, fontSize: '6px', color: '#444', marginLeft: '8px', letterSpacing: '0.2em' }}>
                            TERMINAL v2.0
                        </span>
                    </div>

                    <h2 style={{ ...font, fontSize: '14px', color: '#fff', marginBottom: '8px', textTransform: 'uppercase' }}>
                        ACCESS DENIED
                    </h2>
                    <p style={{ ...font, fontSize: '7px', color: '#555', marginBottom: '32px', lineHeight: '2' }}>
                        {'>'} ENTER CREDENTIALS TO PROCEED_
                    </p>

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ position: 'relative', marginBottom: '12px' }}>
                            <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#444' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="EMAIL"
                                style={inputStyle}
                                onFocus={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(0,255,65,0.15)'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.boxShadow = 'none'; }}
                            />
                        </div>

                        {/* Password */}
                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                            <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#444' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="PASSWORD"
                                style={{
                                    ...inputStyle,
                                    borderColor: error ? '#FF00E4' : '#333',
                                    boxShadow: error ? '0 0 10px rgba(255,0,228,0.2)' : 'none',
                                }}
                                onFocus={e => { if (!error) e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(0,255,65,0.15)'; }}
                                onBlur={e => { if (!error) e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.boxShadow = 'none'; }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="cursor-pointer"
                                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#444', padding: '4px' }}
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ ...font, fontSize: '7px', color: '#FF00E4', marginBottom: '12px', textAlign: 'center' }}
                            >
                                ✗ ACCESS DENIED — INVALID CREDENTIALS
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="cursor-pointer"
                            style={{
                                ...font,
                                fontSize: '9px',
                                width: '100%',
                                padding: '14px',
                                backgroundColor: 'var(--brand)',
                                color: '#000',
                                border: 'none',
                                letterSpacing: '0.15em',
                                boxShadow: '0 0 15px rgba(0, 255, 65, 0.3)',
                                transition: 'all 0.3s',
                                opacity: loading ? 0.6 : 1,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 65, 0.5)'; }}
                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 65, 0.3)'; }}
                        >
                            {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
                        </button>
                    </form>
                </div>

                <p style={{ ...font, fontSize: '5px', textAlign: 'center', color: '#333', marginTop: '20px', letterSpacing: '0.2em' }}>
                    SYSTEM ONLINE — ADMIN PORTAL
                </p>
            </motion.div>
        </div>
    );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, LogOut, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useBlogStore } from '../store/store';
import AuthGate from '../components/admin/AuthGate';
import PostList from '../components/admin/PostList';
import PostForm from '../components/admin/PostForm';
import GalleryManager from '../components/admin/GalleryManager';
import AboutManager from '../components/admin/AboutManager';
import type { BlogPost } from '../types';

const font = { fontFamily: "'Press Start 2P', monospace" } as const;

type AdminTab = 'posts' | 'gallery' | 'about';

export default function AdminPage() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useBlogStore();
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState<AdminTab>('posts');

    const handleLogout = () => {
        signOut(auth);
        logout();
    };


    if (!isAuthenticated) {
        return <AuthGate />;
    }

    const showForm = isCreating || editingPost !== null;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#000' }}>
            {/* Header */}
            <header style={{
                borderBottom: '1px solid #1a1a1a',
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backgroundColor: '#000',
                boxShadow: '0 0 20px rgba(0, 255, 65, 0.05)',
            }}>
                <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            onClick={() => navigate('/')}
                            className="cursor-pointer"
                            style={{
                                ...font,
                                fontSize: '7px',
                                color: 'var(--brand)',
                                background: 'none',
                                border: '1px solid #333',
                                padding: '8px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 8px rgba(0,255,65,0.2)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <ArrowLeft className="w-3 h-3" />
                            <Globe className="w-3 h-3" />
                        </button>
                        <div>
                            <h1 style={{ ...font, fontSize: '12px', color: '#fff' }}>
                                ADMIN PANEL
                            </h1>
                            <p style={{ ...font, fontSize: '6px', color: '#555', marginTop: '4px', letterSpacing: '0.15em' }}>
                                SYSTEM CONTROL
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {activeTab === 'posts' && !showForm && (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="cursor-pointer"
                                style={{
                                    ...font,
                                    fontSize: '7px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    backgroundColor: 'var(--brand)',
                                    color: '#000',
                                    border: 'none',
                                    padding: '10px 16px',
                                    letterSpacing: '0.1em',
                                    boxShadow: '0 0 12px rgba(0, 255, 65, 0.3)',
                                    transition: 'all 0.3s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.5)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 255, 65, 0.3)'; }}
                            >
                                <Plus className="w-3 h-3" />
                                NEW POST
                            </button>
                        )}

                        <button
                            onClick={handleLogout}
                            className="cursor-pointer"
                            style={{
                                ...font,
                                fontSize: '7px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'none',
                                border: '1px solid #333',
                                color: '#555',
                                padding: '10px 12px',
                                transition: 'all 0.3s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color = '#FF00E4'; e.currentTarget.style.borderColor = '#FF00E4'; }}
                            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#333'; }}
                        >
                            <LogOut className="w-3 h-3" />
                            EXIT
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'flex', gap: '0', borderTop: '1px solid #1a1a1a' }}>
                        {([
                            { key: 'posts' as AdminTab, label: 'POSTS' },
                            { key: 'gallery' as AdminTab, label: 'GALLERY' },
                            { key: 'about' as AdminTab, label: 'ABOUT' },
                        ]).map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setActiveTab(tab.key);
                                    setEditingPost(null);
                                    setIsCreating(false);
                                }}
                                className="cursor-pointer"
                                style={{
                                    ...font,
                                    fontSize: '7px',
                                    padding: '14px 24px',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: activeTab === tab.key ? '2px solid var(--brand)' : '2px solid transparent',
                                    color: activeTab === tab.key ? 'var(--brand)' : '#555',
                                    letterSpacing: '0.15em',
                                    transition: 'all 0.3s',
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Content */}
            <main style={{ maxWidth: '1024px', margin: '0 auto', padding: '32px 24px' }}>
                <AnimatePresence mode="wait">
                    {activeTab === 'posts' ? (
                        showForm ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <PostForm
                                    post={editingPost}
                                    onSave={() => {
                                        setEditingPost(null);
                                        setIsCreating(false);
                                    }}
                                    onCancel={() => {
                                        setEditingPost(null);
                                        setIsCreating(false);
                                    }}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <PostList onEdit={setEditingPost} />
                            </motion.div>
                        )
                    ) : activeTab === 'gallery' ? (
                        <motion.div
                            key="gallery"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <GalleryManager />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="about"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <AboutManager />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}


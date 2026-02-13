import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, LogOut, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBlogStore } from '../store/store';
import AuthGate from '../components/admin/AuthGate';
import PostList from '../components/admin/PostList';
import PostForm from '../components/admin/PostForm';
import type { BlogPost } from '../types';

export default function AdminPage() {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useBlogStore();
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    if (!isAuthenticated) {
        return <AuthGate />;
    }

    const showForm = isCreating || editingPost !== null;

    return (
        <div className="min-h-screen bg-[var(--admin-bg)]">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <Globe className="w-4 h-4" />
                        </motion.button>
                        <div>
                            <h1 className="text-xl font-bold font-display">
                                Admin Dashboard
                            </h1>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Kelsie Sharp Blog</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {!showForm && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsCreating(true)}
                                className="flex items-center gap-2 bg-[var(--brand-deep)] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[var(--brand-dark)] transition-colors cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                New Post
                            </motion.button>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={logout}
                            className="flex items-center gap-2 text-gray-500 hover:text-red-500 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                    {showForm ? (
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
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

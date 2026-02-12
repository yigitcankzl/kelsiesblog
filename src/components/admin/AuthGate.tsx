import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Globe, Eye, EyeOff } from 'lucide-react';
import { useBlogStore } from '../../store/store';

export default function AuthGate() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { authenticate } = useBlogStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = authenticate(password);
        if (!success) {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#1a472a] to-[#2d6a4f] rounded-2xl flex items-center justify-center shadow-lg">
                            <Globe className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h2
                        className="text-2xl font-bold text-center mb-1"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        Admin Access
                    </h2>
                    <p className="text-center text-gray-500 text-sm mb-8">
                        Enter the admin password to manage posts
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="relative mb-4">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className={`w-full pl-11 pr-12 py-3.5 rounded-xl border-2 transition-all outline-none text-sm ${error
                                        ? 'border-red-300 bg-red-50 shake'
                                        : 'border-gray-200 focus:border-[#2d6a4f] bg-gray-50 focus:bg-white'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs mb-3 text-center"
                            >
                                Incorrect password. Please try again.
                            </motion.p>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#1a472a] to-[#2d6a4f] text-white py-3.5 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                        >
                            Sign In
                        </motion.button>
                    </form>
                </div>

                <p className="text-center text-gray-400 text-xs mt-6">
                    Kelsie Sharp Blog · Admin Panel
                </p>
            </motion.div>
        </div>
    );
}

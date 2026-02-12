import { motion } from 'framer-motion';
import { Globe, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBlogStore } from '../store/store';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setSelectedCountry, setSelectedPost } = useBlogStore();

    const goHome = () => {
        setSelectedCountry(null);
        setSelectedPost(null);
        if (location.pathname !== '/') navigate('/');
    };

    return (
        <nav className="sticky top-0 z-[1000] bg-white/90 backdrop-blur-xl border-b border-gray-100/80">
            <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
                {/* Brand */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={goHome}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <div className="w-9 h-9 bg-gradient-to-br from-[#2d6a4f] to-[#1a472a] rounded-xl flex items-center justify-center shadow-md">
                        <Globe className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div className="text-left">
                        <h1 className="text-[17px] font-bold tracking-tight leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Kelsie Sharp
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium leading-none">
                            Travel Journal
                        </p>
                    </div>
                </motion.button>

                {/* Links */}
                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={goHome}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${location.pathname === '/' ? 'bg-[#f0fdf4] text-[#1a472a]' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Home
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/admin')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${location.pathname === '/admin' ? 'bg-[#1a472a] text-white' : 'bg-[#1a472a]/10 text-[#1a472a] hover:bg-[#1a472a] hover:text-white'
                            }`}
                    >
                        <Settings className="w-3.5 h-3.5" />
                        Admin
                    </motion.button>
                </div>
            </div>
        </nav>
    );
}

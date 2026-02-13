import { useNavigate, useLocation } from 'react-router-dom';
import { useBlogStore } from '@/store/store';

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
        <nav className="fixed w-full z-[1000] bg-black border-b-2 border-[var(--brand)]"
            style={{ boxShadow: '0 2px 12px rgba(0, 255, 65, 0.2)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Brand */}
                    <button
                        onClick={goHome}
                        className="flex-shrink-0 cursor-pointer"
                    >
                        <span
                            className="text-sm sm:text-base font-bold tracking-tight text-white"
                            style={{ fontFamily: "'Press Start 2P', monospace" }}
                        >
                            Kelsie Sharp
                            <span className="text-[var(--brand)] neon-glow text-lg sm:text-xl">.</span>
                        </span>
                    </button>

                    {/* Links */}
                    <div className="hidden sm:flex items-center gap-6">
                        {['Destinations', 'Guides', 'About'].map((item) => (
                            <button
                                key={item}
                                onClick={goHome}
                                className="relative text-[8px] font-medium tracking-[0.15em] text-gray-400 hover:text-[var(--brand)] transition-colors uppercase cursor-pointer group"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[var(--brand)] transition-all duration-300 group-hover:w-full"
                                    style={{ boxShadow: '0 0 6px rgba(0, 255, 65, 0.5)' }} />
                            </button>
                        ))}
                        <button
                            onClick={goHome}
                            className="px-4 py-2 text-[8px] font-medium text-[var(--brand)] border-2 border-[var(--brand)] hover:bg-[var(--brand)] hover:text-black transition-all duration-300 cursor-pointer uppercase tracking-[0.12em]"
                            style={{
                                fontFamily: "'Press Start 2P', monospace",
                                boxShadow: '0 0 8px rgba(0, 255, 65, 0.2)',
                            }}
                        >
                            ▶ START
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="sm:hidden flex items-center gap-2">
                        <button
                            onClick={goHome}
                            className="p-2 text-[var(--brand)] hover:text-white cursor-pointer text-[8px] uppercase tracking-wider font-medium"
                            style={{ fontFamily: "'Press Start 2P', monospace" }}
                        >
                            ≡ MENU
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

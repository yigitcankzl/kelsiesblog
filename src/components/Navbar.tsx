import { useNavigate, useLocation } from 'react-router-dom';
import { useBlogStore } from '@/store/store';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { activePage, setActivePage, setSelectedCountry, setSelectedPost } = useBlogStore();

    const goHome = () => {
        setSelectedCountry(null);
        setSelectedPost(null);
        setActivePage('map');
        if (location.pathname !== '/') navigate('/');
    };

    return (
        <nav className="fixed w-full z-[10000] bg-black border-b-2 border-[var(--brand)]"
            style={{ boxShadow: '0 2px 12px rgba(0, 255, 65, 0.2)' }}>
            <div style={{ maxWidth: '1024px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
                <div className="flex justify-between items-center h-20">
                    {/* Brand */}
                    <button
                        onClick={goHome}
                        className="flex-shrink-0 cursor-pointer group"
                    >
                        <span
                            className="text-sm sm:text-base font-bold tracking-tight text-white text-glitch"
                            style={{ fontFamily: "'Press Start 2P', monospace" }}
                            data-text="Kelsie Sharp."
                        >
                            Kelsie Sharp
                            <span className="text-[var(--brand)] neon-glow text-lg sm:text-xl blink-cursor" style={{ marginLeft: 0 }}>.</span>
                        </span>
                    </button>

                    {/* Links */}
                    <div className="hidden sm:flex items-center gap-6">
                        {[
                            { label: 'Stories', page: 'stories' as const },
                            { label: 'Gallery', page: 'gallery' as const },
                            { label: 'About', page: 'about' as const },
                        ].map((item) => (
                            <button
                                key={item.label}
                                onClick={() => {
                                    if (location.pathname !== '/') navigate('/');
                                    setActivePage(item.page);
                                }}
                                className={`relative text-[8px] font-medium tracking-[0.15em] transition-colors uppercase cursor-pointer group ${activePage === item.page ? 'text-[var(--brand)]' : 'text-gray-400 hover:text-[var(--brand)]'
                                    }`}
                                style={{ fontFamily: "'Press Start 2P', monospace" }}
                            >
                                {item.label}
                                <span className={`absolute -bottom-1 left-0 h-[2px] bg-[var(--brand)] transition-all duration-300 ${activePage === item.page ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`}
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
                            ▶ HOME
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

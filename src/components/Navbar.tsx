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
        <nav className="fixed w-full z-[1000] bg-white/95 dark:bg-[#10221c]/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Brand */}
                    <button
                        onClick={goHome}
                        className="flex-shrink-0 cursor-pointer"
                    >
                        <span
                            className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            Kelsie Sharp
                            <span className="text-[var(--brand)] text-3xl sm:text-4xl">.</span>
                        </span>
                    </button>

                    {/* Links */}
                    <div className="hidden sm:flex items-center gap-8">
                        <button
                            onClick={goHome}
                            className="text-xs font-medium tracking-[0.15em] text-gray-500 dark:text-gray-300 hover:text-[var(--brand)] transition-colors uppercase cursor-pointer"
                        >
                            Destinations
                        </button>
                        <button
                            onClick={goHome}
                            className="text-xs font-medium tracking-[0.15em] text-gray-500 dark:text-gray-300 hover:text-[var(--brand)] transition-colors uppercase cursor-pointer"
                        >
                            Travel Guides
                        </button>
                        <button
                            onClick={goHome}
                            className="text-xs font-medium tracking-[0.15em] text-gray-500 dark:text-gray-300 hover:text-[var(--brand)] transition-colors uppercase cursor-pointer"
                        >
                            About
                        </button>
                        <button
                            onClick={goHome}
                            className="px-6 py-2.5 text-xs font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-[var(--brand)] transition-all hover:shadow-lg cursor-pointer uppercase tracking-[0.12em] rounded-full"
                        >
                            Subscribe
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="sm:hidden flex items-center gap-2">
                        <button
                            onClick={goHome}
                            className="p-2 text-gray-500 hover:text-[var(--brand)] cursor-pointer text-xs uppercase tracking-wider font-medium"
                        >
                            Menu
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

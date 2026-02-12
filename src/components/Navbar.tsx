import { Globe, Settings, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBlogStore } from '@/store/store';
import { Button } from '@/components/ui/button';

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
        <nav className="sticky top-0 z-[1000] bg-[#1a472a]/95 backdrop-blur-xl shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Brand */}
                    <button
                        onClick={goHome}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center group-hover:bg-white/25 transition-colors">
                            <Globe className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                            <h1
                                className="text-base font-bold text-white leading-tight tracking-tight"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                Kelsie Sharp
                            </h1>
                            <p className="text-[9px] text-white/50 uppercase tracking-[0.2em] font-medium leading-none">
                                Travel Journal
                            </p>
                        </div>
                    </button>

                    {/* Links */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={goHome}
                            className="text-white/70 hover:text-white hover:bg-white/10 cursor-pointer gap-1.5 text-xs font-medium"
                        >
                            <Home className="w-3.5 h-3.5" />
                            Home
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/admin')}
                            className="text-white/70 hover:text-white hover:bg-white/10 cursor-pointer gap-1.5 text-xs font-medium"
                        >
                            <Settings className="w-3.5 h-3.5" />
                            Admin
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

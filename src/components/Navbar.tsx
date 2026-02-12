import { Globe, Settings } from 'lucide-react';
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
        <nav className="sticky top-0 z-[1000] bg-white/90 backdrop-blur-xl border-b border-border">
            <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
                {/* Brand */}
                <button
                    onClick={goHome}
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <div className="w-9 h-9 bg-gradient-to-br from-[#2d6a4f] to-[#1a472a] rounded-xl flex items-center justify-center shadow-md">
                        <Globe className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div className="text-left">
                        <h1 className="text-[17px] font-bold tracking-tight leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Kelsie Sharp
                        </h1>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium leading-none">
                            Travel Journal
                        </p>
                    </div>
                </button>

                {/* Links */}
                <div className="flex items-center gap-2">
                    <Button
                        variant={location.pathname === '/' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={goHome}
                        className="cursor-pointer"
                    >
                        Home
                    </Button>
                    <Button
                        variant={location.pathname === '/admin' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => navigate('/admin')}
                        className="cursor-pointer gap-2"
                    >
                        <Settings className="w-3.5 h-3.5" />
                        Admin
                    </Button>
                </div>
            </div>
        </nav>
    );
}

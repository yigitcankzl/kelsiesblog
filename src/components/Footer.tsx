export default function Footer() {
    return (
        <footer className="border-t-2 border-[var(--brand)] bg-black"
            style={{ boxShadow: '0 -2px 12px rgba(0, 255, 65, 0.15)' }}>

            {/* ASCII art top border */}
            <div className="text-center py-2 overflow-hidden">
                <span className="text-[6px] text-[var(--brand)] tracking-[0.3em] opacity-40"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                </span>
            </div>

            <div className="flex items-center justify-between max-w-screen-lg mx-auto px-6 py-6">
                {/* Brand + Copyright */}
                <div className="flex items-center gap-4 flex-1">
                    <span className="text-[8px] font-bold tracking-tight text-white"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        Kelsie Sharp<span className="text-[var(--brand)] neon-glow">.</span>
                    </span>
                    <span className="text-[7px] text-gray-500"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        &copy; 2026
                    </span>
                </div>

                {/* System status */}
                <div className="hidden sm:flex items-center justify-center gap-3 flex-1">
                    <div className="w-2 h-2 bg-[var(--brand)]"
                        style={{ boxShadow: '0 0 6px rgba(0, 255, 65, 0.6), 0 0 12px rgba(0, 255, 65, 0.3)' }} />
                    <span className="text-[6px] text-[var(--brand)] uppercase tracking-[0.2em] opacity-60"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        SYS ONLINE
                    </span>
                </div>

                {/* Retro icons */}
                <div className="flex items-center gap-4 flex-1 justify-end">
                    <a href="/admin" className="text-gray-500 hover:text-[var(--brand)] transition-colors"
                        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '5px', letterSpacing: '0.15em', opacity: 0.4, transition: 'all 0.3s' }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '0.4'; }}
                    >
                        ADMIN
                    </a>
                </div>
            </div>

            {/* Dedication */}
            <div className="text-center pb-4 pt-2 overflow-hidden">
                <span className="text-[5px] text-[var(--neon-magenta)] tracking-[0.3em] block mb-2"
                    style={{ fontFamily: "'Press Start 2P', monospace", textShadow: '0 0 8px rgba(255, 0, 228, 0.4)' }}>
                    ♥ CRAFTED WITH LOVE BY YIGITCAN KIZIL ♥
                </span>
                <span className="text-[5px] text-gray-500 tracking-[0.2em] block mb-3"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                    FOR THE MOST BEAUTIFUL ADVENTURER I KNOW
                </span>
                <div className="flex justify-center gap-0.5">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5"
                            style={{
                                backgroundColor: i % 5 === 2 ? '#FF00E4' : i % 3 === 0 ? '#00FF41' : i % 3 === 1 ? '#00FFFF' : 'transparent',
                                opacity: i % 5 === 2 ? 0.6 : 0.3,
                            }}
                        />
                    ))}
                </div>
            </div>
        </footer>
    );
}

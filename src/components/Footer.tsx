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

            <div className="flex items-center justify-between" style={{ maxWidth: '1024px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px', paddingTop: '24px', paddingBottom: '24px' }}>
                {/* Brand + Copyright */}
                <div className="flex items-center gap-4">
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
                <div className="hidden sm:flex items-center gap-3">
                    <div className="w-2 h-2 bg-[var(--brand)]"
                        style={{ boxShadow: '0 0 6px rgba(0, 255, 65, 0.6), 0 0 12px rgba(0, 255, 65, 0.3)' }} />
                    <span className="text-[6px] text-[var(--brand)] uppercase tracking-[0.2em] opacity-60"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        SYS ONLINE
                    </span>
                    <span className="text-[6px] text-[var(--neon-cyan)] uppercase tracking-[0.15em] opacity-40"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        v2.0.4
                    </span>
                </div>

                {/* Retro icons */}
                <div className="flex items-center gap-4">
                    <a href="#" className="text-gray-500 hover:text-[var(--neon-magenta)] transition-colors">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            />
                        </svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-[var(--neon-cyan)] transition-colors">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <rect x="2" y="2" width="20" height="20" rx="0" />
                            <circle cx="12" cy="12" r="5" />
                            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                        </svg>
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

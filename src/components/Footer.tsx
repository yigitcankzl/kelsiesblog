export default function Footer() {
    return (
        <footer className="border-t-2 border-[var(--brand)] bg-black"
            style={{ boxShadow: '0 -2px 12px rgba(0, 255, 65, 0.15)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 flex items-center justify-between">
                {/* Brand + Copyright */}
                <div className="flex items-center gap-4">
                    <span className="text-[8px] font-bold tracking-tight text-white"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        Kelsie Sharp<span className="text-[var(--brand)] neon-glow">.</span>
                    </span>
                    <span className="text-[7px] text-gray-500"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        &copy; 2024
                    </span>
                </div>

                {/* Retro icons */}
                <div className="flex items-center gap-4">
                    <a href="#" className="text-gray-500 hover:text-[var(--brand)] transition-colors">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            />
                        </svg>
                    </a>
                    <a href="#" className="text-gray-500 hover:text-[var(--brand)] transition-colors">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <rect x="2" y="2" width="20" height="20" rx="0" />
                            <circle cx="12" cy="12" r="5" />
                            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Retro pixel decoration */}
            <div className="flex justify-center pb-4 gap-1">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5"
                        style={{
                            backgroundColor: i % 2 === 0 ? '#00FF41' : 'transparent',
                            opacity: 0.4,
                        }}
                    />
                ))}
            </div>
        </footer>
    );
}

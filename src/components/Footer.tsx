export default function Footer() {
    return (
        <footer className="border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-6 flex items-center justify-between">
                {/* Brand + Copyright */}
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold tracking-tight font-display">
                        Kelsie Sharp<span className="text-[var(--brand)]">.</span>
                    </span>
                    <span className="text-xs text-gray-400 font-light">
                        &copy; 2024. All rights reserved.
                    </span>
                </div>

                {/* Social icons */}
                <div className="flex items-center gap-4">
                    <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            />
                        </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <rect x="2" y="2" width="20" height="20" rx="5" />
                            <circle cx="12" cy="12" r="5" />
                            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}

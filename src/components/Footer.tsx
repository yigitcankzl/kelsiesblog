export default function Footer() {
    return (
        <footer className="bg-white dark:bg-[#10221c] border-t border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-8 md:flex md:items-center md:justify-between lg:px-12">
                {/* Social links */}
                <div className="flex justify-center space-x-5 md:order-2">
                    {/* Facebook */}
                    <a href="#" className="text-gray-400 hover:text-[var(--brand)] transition-colors">
                        <span className="sr-only">Facebook</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            />
                        </svg>
                    </a>
                    {/* Instagram */}
                    <a href="#" className="text-gray-400 hover:text-[var(--brand)] transition-colors">
                        <span className="sr-only">Instagram</span>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <rect x="2" y="2" width="20" height="20" rx="5" />
                            <circle cx="12" cy="12" r="5" />
                            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                        </svg>
                    </a>
                </div>

                {/* Branding */}
                <div className="mt-8 md:mt-0 md:order-1 flex items-center gap-4">
                    <span
                        className="font-bold text-xl tracking-tight text-gray-900 dark:text-white"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        Kelsie Sharp.
                    </span>
                    <p className="text-xs text-gray-500 font-light border-l border-gray-300 dark:border-gray-700 pl-4">
                        © 2024. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

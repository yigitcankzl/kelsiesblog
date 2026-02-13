import { ArrowRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0f1f1a] text-white">
            {/* Main footer content */}
            <div className="max-w-7xl mx-auto py-20 px-4 sm:px-8 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
                    {/* Branding column */}
                    <div className="md:col-span-5">
                        <span
                            className="text-3xl font-bold tracking-tight"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            Kelsie Sharp
                            <span className="text-[var(--brand)]">.</span>
                        </span>
                        <p className="mt-4 text-gray-400 text-sm font-light leading-relaxed max-w-sm">
                            Stories from around the world — capturing moments of beauty, culture,
                            and the joy of wandering without a plan.
                        </p>
                        {/* Social icons */}
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-[var(--brand)] hover:bg-[var(--brand)] transition-all duration-300">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                    />
                                </svg>
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-[var(--brand)] hover:bg-[var(--brand)] transition-all duration-300">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <rect x="2" y="2" width="20" height="20" rx="5" />
                                    <circle cx="12" cy="12" r="5" />
                                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                                </svg>
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-[var(--brand)] hover:bg-[var(--brand)] transition-all duration-300">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="md:col-span-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">
                            Navigate
                        </h4>
                        <ul className="space-y-3">
                            {['Destinations', 'Travel Guides', 'About', 'Contact'].map(link => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors font-light flex items-center group/nav">
                                        {link}
                                        <ArrowRight className="w-3 h-3 ml-1 opacity-0 -translate-x-1 group-hover/nav:opacity-100 group-hover/nav:translate-x-0 transition-all" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter mini */}
                    <div className="md:col-span-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">
                            Stay Connected
                        </h4>
                        <p className="text-sm text-gray-400 font-light mb-5 leading-relaxed">
                            Get travel stories and tips delivered to your inbox weekly.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 text-sm px-4 py-2.5 bg-white/5 border border-gray-700 focus:border-[var(--brand)] outline-none text-white placeholder-gray-500 transition-colors rounded-lg"
                            />
                            <button className="px-4 py-2.5 bg-[var(--brand)] text-white text-sm font-medium hover:bg-[var(--brand)]/80 transition-all rounded-lg cursor-pointer">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500 font-light">
                        © 2024 Kelsie Sharp. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors font-light">Privacy</a>
                        <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors font-light">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

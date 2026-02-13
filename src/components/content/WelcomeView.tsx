import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { useBlogStore } from '@/store/store';

export default function WelcomeView() {
    const { posts, setSelectedCountry, setSelectedPost } = useBlogStore();

    const handlePostClick = (post: typeof posts[0]) => {
        setSelectedCountry(post.country);
        setSelectedPost(post);
    };

    // Posts mapped to reference grid slots:
    // [0] Santorini = tall left card
    // [1] Istanbul Coffee = middle-top card
    // [2] Tokyo = middle-bottom small card
    // [3] Cinque Terre = tall right card
    const santorini = posts[0];
    const istanbul = posts[1];
    const tokyo = posts[2];
    const cinqueTerre = posts[3];

    return (
        <section className="bg-background py-20 px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <motion.div
                    className="flex items-end justify-between mb-14"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <span className="text-[var(--brand)] font-bold tracking-[0.15em] text-[10px] uppercase block mb-3">
                            Journal
                        </span>
                        <h2
                            className="text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white leading-tight"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            Latest Stories
                        </h2>
                    </div>
                    <button className="hidden sm:flex items-center text-sm font-medium text-gray-900 dark:text-white border-b border-gray-900 dark:border-white pb-1 hover:text-[var(--brand)] hover:border-[var(--brand)] transition-all group cursor-pointer">
                        View Archive
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>

                {/* Main grid — 3 columns matching reference */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

                    {/* === Column 1: Tall Santorini card === */}
                    {santorini && (
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            onClick={() => handlePostClick(santorini)}
                            className="group cursor-pointer flex flex-col"
                        >
                            <div className="relative overflow-hidden aspect-[3/4] mb-5">
                                <img
                                    src={santorini.coverImage}
                                    alt={santorini.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                            <div className="flex items-center text-[10px] font-medium text-gray-400 mb-2.5 space-x-2 uppercase tracking-wider">
                                <span>{santorini.date}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span>{santorini.category}</span>
                            </div>
                            <h3
                                className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[var(--brand)] transition-colors leading-snug"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                {santorini.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-relaxed mb-4 flex-1">
                                {santorini.sections[0]?.content}
                            </p>
                            <span
                                className="text-sm font-medium text-gray-900 dark:text-white border-b border-gray-900 dark:border-white pb-0.5 self-start hover:text-[var(--brand)] hover:border-[var(--brand)] transition-colors cursor-pointer"
                            >
                                Read Story
                            </span>
                        </motion.article>
                    )}

                    {/* === Column 2: Stacked — Istanbul top + Tokyo bottom === */}
                    <div className="flex flex-col gap-8">
                        {/* Istanbul coffee card (horizontal image + text below) */}
                        {istanbul && (
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                onClick={() => handlePostClick(istanbul)}
                                className="group cursor-pointer"
                            >
                                <div className="relative overflow-hidden aspect-[16/10] mb-5">
                                    <img
                                        src={istanbul.coverImage}
                                        alt={istanbul.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex items-center text-[10px] font-medium text-gray-400 mb-2.5 space-x-2 uppercase tracking-wider">
                                    <span>{istanbul.date}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span>{istanbul.category}</span>
                                </div>
                                <h3
                                    className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[var(--brand)] transition-colors leading-snug"
                                    style={{ fontFamily: 'Playfair Display, serif' }}
                                >
                                    {istanbul.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-light line-clamp-2 leading-relaxed">
                                    {istanbul.sections[0]?.content}
                                </p>
                            </motion.article>
                        )}

                        {/* Divider */}
                        <hr className="border-gray-100 dark:border-gray-800" />

                        {/* Tokyo small card (thumbnail + text side by side) */}
                        {tokyo && (
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                onClick={() => handlePostClick(tokyo)}
                                className="group cursor-pointer flex gap-4 items-start"
                            >
                                <div className="relative overflow-hidden w-24 h-20 flex-shrink-0">
                                    <img
                                        src={tokyo.coverImage}
                                        alt={tokyo.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center text-[10px] font-medium text-gray-400 mb-1.5 space-x-2 uppercase tracking-wider">
                                        <span className="text-[var(--brand)] font-bold">{tokyo.country}</span>
                                        <span>{tokyo.date}</span>
                                    </div>
                                    <h3
                                        className="text-base font-bold text-gray-900 dark:text-white group-hover:text-[var(--brand)] transition-colors leading-snug"
                                        style={{ fontFamily: 'Playfair Display, serif' }}
                                    >
                                        {tokyo.title}
                                    </h3>
                                </div>
                            </motion.article>
                        )}
                    </div>

                    {/* === Column 3: Tall Cinque Terre card + Newsletter === */}
                    <div className="flex flex-col gap-8">
                        {/* Cinque Terre tall card */}
                        {cinqueTerre && (
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25, duration: 0.5 }}
                                onClick={() => handlePostClick(cinqueTerre)}
                                className="group cursor-pointer"
                            >
                                <div className="relative overflow-hidden aspect-[3/4] mb-5">
                                    <img
                                        src={cinqueTerre.coverImage}
                                        alt={cinqueTerre.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex items-center text-[10px] font-medium text-gray-400 mb-2.5 space-x-2 uppercase tracking-wider">
                                    <span>{cinqueTerre.date}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span>{cinqueTerre.category}</span>
                                </div>
                                <h3
                                    className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[var(--brand)] transition-colors leading-snug"
                                    style={{ fontFamily: 'Playfair Display, serif' }}
                                >
                                    {cinqueTerre.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-light line-clamp-2 leading-relaxed">
                                    {cinqueTerre.sections[0]?.content}
                                </p>
                            </motion.article>
                        )}

                        {/* Newsletter signup */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="bg-gray-50 dark:bg-gray-900 p-8"
                        >
                            <Mail className="w-7 h-7 text-[var(--brand)] mb-4" strokeWidth={1.5} />
                            <h4
                                className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                Don't miss a post
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-light leading-relaxed">
                                Join 15,000+ travelers getting weekly updates, curated guides, and travel tips.
                            </p>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full text-sm px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-black focus:ring-1 focus:ring-[var(--brand)] outline-none"
                                />
                                <button className="bg-gray-900 dark:bg-white text-white dark:text-black font-medium text-sm py-3 px-4 hover:bg-[var(--brand)] transition-colors uppercase tracking-wider w-full cursor-pointer">
                                    Subscribe
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Mobile view-all */}
                <div className="mt-12 text-center sm:hidden">
                    <button className="inline-flex items-center px-8 py-3 border border-gray-900 dark:border-white text-xs font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors uppercase tracking-[0.15em] cursor-pointer">
                        View All Stories
                    </button>
                </div>
            </div>
        </section>
    );
}

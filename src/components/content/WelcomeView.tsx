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
        <section className="bg-background py-28 px-4 sm:px-8 lg:px-12 relative z-10">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <motion.div
                    className="flex items-end justify-between mb-16"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <span className="text-[var(--brand)] font-bold tracking-[0.15em] text-xs uppercase block mb-3">
                            Journal
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white leading-tight font-display">
                            Latest Stories
                        </h2>
                    </div>
                    <button className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-900 dark:text-white px-5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-[var(--brand)] hover:text-white hover:border-[var(--brand)] transition-all duration-300 cursor-pointer uppercase tracking-[0.12em] group">
                        View Archive
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </motion.div>

                {/* Main grid — 3 columns matching reference */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">

                    {/* === Column 1: Tall Santorini card === */}
                    {santorini && (
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            onClick={() => handlePostClick(santorini)}
                            className="group cursor-pointer flex flex-col transition-transform duration-500 hover:-translate-y-1"
                        >
                            <div className="relative overflow-hidden aspect-[3/4] mb-7 rounded-lg">
                                <img
                                    src={santorini.coverImage}
                                    alt={santorini.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <span className="absolute top-4 left-4 bg-[var(--tag-bg)] text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                                    {santorini.country}
                                </span>
                            </div>
                            <div className="flex items-center text-xs font-medium text-gray-400 mb-4 gap-3 uppercase tracking-wider">
                                <span>{santorini.date}</span>
                                <span className="text-gray-300">&bull;</span>
                                <span>{santorini.category}</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-5 group-hover:text-[var(--brand)] transition-colors leading-snug font-display">
                                {santorini.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-light leading-[1.8] mb-8 flex-1">
                                {santorini.sections[0]?.content}
                            </p>
                            <span
                                className="text-sm font-semibold text-[var(--brand)] self-start cursor-pointer inline-flex items-center gap-2 group/link hover:gap-3 transition-all duration-300 uppercase tracking-wider"
                            >
                                Read Story
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </motion.article>
                    )}

                    {/* === Column 2: Stacked — Istanbul top + Tokyo bottom === */}
                    <div className="flex flex-col gap-10">
                        {/* Istanbul coffee card (horizontal image + text below) */}
                        {istanbul && (
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                onClick={() => handlePostClick(istanbul)}
                                className="group cursor-pointer transition-transform duration-500 hover:-translate-y-1"
                            >
                                <div className="relative overflow-hidden aspect-[4/3] mb-7 rounded-lg">
                                    <img
                                        src={istanbul.coverImage}
                                        alt={istanbul.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <span className="absolute top-4 left-4 bg-[var(--tag-bg)] text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                                        {istanbul.country}
                                    </span>
                                </div>
                                <div className="flex items-center text-xs font-medium text-gray-400 mb-4 gap-3 uppercase tracking-wider">
                                    <span>{istanbul.date}</span>
                                    <span className="text-gray-300">&bull;</span>
                                    <span>{istanbul.category}</span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-[var(--brand)] transition-colors leading-snug font-display">
                                    {istanbul.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-light line-clamp-4 leading-[1.8]">
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
                                className="group cursor-pointer flex gap-5 items-start"
                            >
                                <div className="relative overflow-hidden w-28 h-24 flex-shrink-0 rounded-lg">
                                    <img
                                        src={tokyo.coverImage}
                                        alt={tokyo.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center text-xs font-medium text-gray-400 mb-2 gap-3 uppercase tracking-wider">
                                        <span className="text-[var(--brand)] font-bold">{tokyo.country}</span>
                                        <span>{tokyo.date}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[var(--brand)] transition-colors leading-snug font-display">
                                        {tokyo.title}
                                    </h3>
                                </div>
                            </motion.article>
                        )}
                    </div>

                    {/* === Column 3: Tall Cinque Terre card + Newsletter === */}
                    <div className="flex flex-col gap-10">
                        {/* Cinque Terre tall card */}
                        {cinqueTerre && (
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25, duration: 0.5 }}
                                onClick={() => handlePostClick(cinqueTerre)}
                                className="group cursor-pointer transition-transform duration-500 hover:-translate-y-1"
                            >
                                <div className="relative overflow-hidden aspect-[3/4] mb-7 rounded-lg">
                                    <img
                                        src={cinqueTerre.coverImage}
                                        alt={cinqueTerre.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <span className="absolute top-4 left-4 bg-[var(--tag-bg)] text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                                        {cinqueTerre.country}
                                    </span>
                                </div>
                                <div className="flex items-center text-xs font-medium text-gray-400 mb-4 gap-3 uppercase tracking-wider">
                                    <span>{cinqueTerre.date}</span>
                                    <span className="text-gray-300">&bull;</span>
                                    <span>{cinqueTerre.category}</span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-[var(--brand)] transition-colors leading-snug font-display">
                                    {cinqueTerre.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-light line-clamp-2 leading-[1.8]">
                                    {cinqueTerre.sections[0]?.content}
                                </p>
                            </motion.article>
                        )}

                        {/* Newsletter signup */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm p-10 rounded-2xl border border-gray-100 dark:border-gray-800"
                        >
                            <Mail className="w-7 h-7 text-[var(--brand)] mb-5" strokeWidth={1.5} />
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 font-display">
                                Don't miss a post
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-8 font-light leading-relaxed">
                                Join 15,000+ travelers getting weekly updates, curated guides, and travel tips.
                            </p>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full text-sm px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-black focus:ring-2 focus:ring-[var(--brand)]/30 focus:border-[var(--brand)] outline-none transition-all rounded-lg"
                                />
                                <button className="bg-gray-900 dark:bg-white text-white dark:text-black font-medium text-sm py-3 px-4 hover:bg-[var(--brand)] transition-all hover:shadow-lg cursor-pointer uppercase tracking-wider w-full rounded-lg">
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
        </section >
    );
}

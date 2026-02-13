import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { useBlogStore } from '@/store/store';

export default function WelcomeView() {
    const { posts, setSelectedCountry, setSelectedPost } = useBlogStore();

    const handlePostClick = (post: typeof posts[0]) => {
        setSelectedCountry(post.country);
        setSelectedPost(post);
    };

    // Top row: first 3 posts (equal cards)
    const topRow = posts.slice(0, 3);
    // Bottom row: remaining posts
    const bottomRow = posts.slice(3);

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

                {/* Top row: 3 equal cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-10">
                    {topRow.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                            onClick={() => handlePostClick(post)}
                            className="group cursor-pointer"
                        >
                            <div className="relative overflow-hidden aspect-[4/5] mb-5">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="inline-block px-3 py-1 bg-white dark:bg-black text-[10px] font-bold tracking-[0.15em] uppercase text-gray-900 dark:text-white">
                                        {post.country}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center text-[10px] font-medium text-gray-400 mb-2.5 space-x-2 uppercase tracking-wider">
                                <span>{post.date}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span>{post.category}</span>
                            </div>
                            <h3
                                className="text-lg md:text-xl font-medium text-gray-900 dark:text-white mb-2 group-hover:text-[var(--brand)] transition-colors leading-snug"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                {post.title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-light line-clamp-2 leading-relaxed">
                                {post.sections[0]?.content}
                            </p>
                        </motion.article>
                    ))}
                </div>

                {/* Bottom row: asymmetric layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {/* Large card - left */}
                    {bottomRow[0] && (
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            onClick={() => handlePostClick(bottomRow[0])}
                            className="group cursor-pointer"
                        >
                            <div className="relative overflow-hidden aspect-[4/3] mb-5">
                                <img
                                    src={bottomRow[0].coverImage}
                                    alt={bottomRow[0].title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                            <div className="flex items-center text-[10px] font-medium text-gray-400 mb-2.5 space-x-2 uppercase tracking-wider">
                                <span>{bottomRow[0].date}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span>{bottomRow[0].sections.length * 3} min read</span>
                            </div>
                            <h3
                                className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-2 group-hover:text-[var(--brand)] transition-colors leading-snug"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                {bottomRow[0].title}
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-light line-clamp-2 leading-relaxed">
                                {bottomRow[0].sections[0]?.content}
                            </p>
                        </motion.article>
                    )}

                    {/* Small card - middle */}
                    {bottomRow[1] && (
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            onClick={() => handlePostClick(bottomRow[1])}
                            className="group cursor-pointer"
                        >
                            <div className="relative overflow-hidden aspect-[16/10] mb-5">
                                <img
                                    src={bottomRow[1].coverImage}
                                    alt={bottomRow[1].title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            </div>
                            <div className="flex items-center text-[10px] font-medium text-gray-400 mb-2.5 space-x-2 uppercase tracking-wider">
                                <span className="text-[var(--brand)]">{bottomRow[1].country}</span>
                                <span>{bottomRow[1].date}</span>
                            </div>
                            <h3
                                className="text-lg font-medium text-gray-900 dark:text-white mb-1 group-hover:text-[var(--brand)] transition-colors leading-snug"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                {bottomRow[1].title}
                            </h3>
                        </motion.article>
                    )}

                    {/* Third bottom card + Newsletter */}
                    <div className="flex flex-col gap-8">
                        {bottomRow[2] && (
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55, duration: 0.5 }}
                                onClick={() => handlePostClick(bottomRow[2])}
                                className="group cursor-pointer"
                            >
                                <div className="relative overflow-hidden aspect-[4/3] mb-5">
                                    <img
                                        src={bottomRow[2].coverImage}
                                        alt={bottomRow[2].title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex items-center text-[10px] font-medium text-gray-400 mb-2.5 space-x-2 uppercase tracking-wider">
                                    <span>{bottomRow[2].date}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span>{bottomRow[2].category}</span>
                                </div>
                                <h3
                                    className="text-lg font-medium text-gray-900 dark:text-white mb-1 group-hover:text-[var(--brand)] transition-colors leading-snug"
                                    style={{ fontFamily: 'Playfair Display, serif' }}
                                >
                                    {bottomRow[2].title}
                                </h3>
                            </motion.article>
                        )}

                        {/* Newsletter signup */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="bg-gray-50 dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-800"
                        >
                            <MapPin className="w-7 h-7 text-[var(--brand)] mb-3" />
                            <h4
                                className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                Don't miss a post
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 font-light leading-relaxed">
                                Join travelers getting weekly updates, curated guides, and travel tips.
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

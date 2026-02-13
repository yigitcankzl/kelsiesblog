import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { useBlogStore } from '@/store/store';

export default function WelcomeView() {
    const { posts, setSelectedCountry, setSelectedPost } = useBlogStore();

    const handlePostClick = (post: typeof posts[0]) => {
        setSelectedCountry(post.country);
        setSelectedPost(post);
    };

    const featured = posts[0];
    const second = posts[1];
    const third = posts[2];
    const fourth = posts[3];
    const rest = posts.slice(4);

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

                {/* Asymmetric editorial grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {/* Column 1: Large portrait featured */}
                    {featured && (
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            onClick={() => handlePostClick(featured)}
                            className="group cursor-pointer flex flex-col h-full"
                        >
                            <div className="relative overflow-hidden aspect-[3/4] mb-6">
                                <img
                                    src={featured.coverImage}
                                    alt={featured.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute top-5 left-5">
                                    <span className="inline-block px-3 py-1 bg-white dark:bg-black text-[10px] font-bold tracking-[0.15em] uppercase text-gray-900 dark:text-white">
                                        {featured.country}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col flex-grow">
                                <div className="flex items-center text-[10px] font-medium text-gray-400 mb-3 space-x-3 uppercase tracking-wider">
                                    <span>{featured.city}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span>{featured.sections.length * 3} min read</span>
                                </div>
                                <h3
                                    className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-900 dark:text-white mb-3 group-hover:text-[var(--brand)] transition-colors leading-tight"
                                    style={{ fontFamily: 'Playfair Display, serif' }}
                                >
                                    {featured.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-light line-clamp-3 mb-4 leading-relaxed">
                                    {featured.sections[0]?.content}
                                </p>
                                <span className="mt-auto text-gray-900 dark:text-white font-medium text-sm border-b border-gray-200 group-hover:border-[var(--brand)] pb-1 self-start transition-colors">
                                    Read Story
                                </span>
                            </div>
                        </motion.article>
                    )}

                    {/* Column 2: Medium card + compact card */}
                    <div className="flex flex-col gap-10">
                        {second && (
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                onClick={() => handlePostClick(second)}
                                className="group cursor-pointer"
                            >
                                <div className="relative overflow-hidden aspect-[4/3] mb-6">
                                    <img
                                        src={second.coverImage}
                                        alt={second.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-5 left-5">
                                        <span className="inline-block px-3 py-1 bg-white dark:bg-black text-[10px] font-bold tracking-[0.15em] uppercase text-gray-900 dark:text-white">
                                            {second.country}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center text-[10px] font-medium text-gray-400 mb-3 space-x-3 uppercase tracking-wider">
                                    <span>{second.city}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span>{second.sections.length * 3} min read</span>
                                </div>
                                <h3
                                    className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-2 group-hover:text-[var(--brand)] transition-colors leading-snug"
                                    style={{ fontFamily: 'Playfair Display, serif' }}
                                >
                                    {second.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-light line-clamp-2 leading-relaxed">
                                    {second.sections[0]?.content}
                                </p>
                            </motion.article>
                        )}

                        {third && (
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                onClick={() => handlePostClick(third)}
                                className="group cursor-pointer pt-8 border-t border-gray-100 dark:border-gray-800"
                            >
                                <div className="flex gap-5 items-center">
                                    <div className="w-28 h-28 flex-shrink-0 relative overflow-hidden">
                                        <img
                                            src={third.coverImage}
                                            alt={third.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="flex items-center text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">
                                            <span className="text-[var(--brand)] mr-2">{third.country}</span>
                                            <span>{third.city}</span>
                                        </div>
                                        <h3
                                            className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-[var(--brand)] transition-colors leading-snug"
                                            style={{ fontFamily: 'Playfair Display, serif' }}
                                        >
                                            {third.title}
                                        </h3>
                                    </div>
                                </div>
                            </motion.article>
                        )}
                    </div>

                    {/* Column 3: Portrait card + newsletter */}
                    <div className="flex flex-col gap-10">
                        {fourth && (
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25, duration: 0.5 }}
                                onClick={() => handlePostClick(fourth)}
                                className="group cursor-pointer"
                            >
                                <div className="relative overflow-hidden aspect-[3/4] mb-6">
                                    <img
                                        src={fourth.coverImage}
                                        alt={fourth.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-5 left-5">
                                        <span className="inline-block px-3 py-1 bg-white dark:bg-black text-[10px] font-bold tracking-[0.15em] uppercase text-gray-900 dark:text-white">
                                            {fourth.country}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center text-[10px] font-medium text-gray-400 mb-3 space-x-3 uppercase tracking-wider">
                                    <span>{fourth.city}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <span>{fourth.sections.length * 3} min read</span>
                                </div>
                                <h3
                                    className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-2 group-hover:text-[var(--brand)] transition-colors leading-snug"
                                    style={{ fontFamily: 'Playfair Display, serif' }}
                                >
                                    {fourth.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-light line-clamp-2 leading-relaxed">
                                    {fourth.sections[0]?.content}
                                </p>
                            </motion.article>
                        )}

                        {/* Newsletter signup */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.5 }}
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

                {/* Extra posts row if any */}
                {rest.length > 0 && (
                    <>
                        <div className="flex items-center gap-4 my-12">
                            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                More Stories
                            </span>
                            <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {rest.map((post, index) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + index * 0.06, duration: 0.4 }}
                                    onClick={() => handlePostClick(post)}
                                    className="group cursor-pointer"
                                >
                                    <div className="relative overflow-hidden aspect-[4/3] mb-5">
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="inline-block px-3 py-1 bg-white/90 dark:bg-black/80 text-[10px] font-bold tracking-[0.12em] uppercase text-gray-900 dark:text-white">
                                                {post.country}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-[10px] font-medium text-gray-400 mb-2 space-x-3 uppercase tracking-wider">
                                        <span>{post.city}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span>{post.sections.length * 3} min read</span>
                                    </div>
                                    <h3
                                        className="text-lg font-medium text-gray-900 dark:text-white mb-1.5 group-hover:text-[var(--brand)] transition-colors leading-snug"
                                        style={{ fontFamily: 'Playfair Display, serif' }}
                                    >
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm font-light line-clamp-2 leading-relaxed">
                                        {post.sections[0]?.content}
                                    </p>
                                </motion.article>
                            ))}
                        </div>
                    </>
                )}

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

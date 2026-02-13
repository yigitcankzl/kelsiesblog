import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useBlogStore } from '@/store/store';

export default function CountryPostsView() {
    const { selectedCountry, posts, setSelectedCountry, setSelectedPost } = useBlogStore();
    const countryPosts = posts.filter(p => p.country === selectedCountry);

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    className="flex items-end gap-6 mb-12"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <button
                        onClick={() => setSelectedCountry(null)}
                        className="flex items-center gap-2 text-xs font-medium text-gray-900 dark:text-white px-5 py-2.5 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-[var(--brand)] hover:text-white hover:border-[var(--brand)] transition-all duration-300 cursor-pointer uppercase tracking-[0.12em] group shrink-0"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                        All Posts
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-px h-10 bg-gray-200 dark:bg-gray-700" />
                        <div>
                            <h2
                                className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white leading-tight"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                {selectedCountry}
                            </h2>
                            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">
                                {countryPosts.length} {countryPosts.length === 1 ? 'story' : 'stories'}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {countryPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 + index * 0.08, duration: 0.4 }}
                            onClick={() => setSelectedPost(post)}
                            className="group cursor-pointer transition-transform duration-500 hover:-translate-y-1"
                        >
                            <div className="relative overflow-hidden aspect-[4/3] mb-5 rounded-lg">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2e35] text-[10px] font-bold tracking-[0.12em] uppercase text-white rounded-full">
                                        <MapPin className="w-3 h-3" />
                                        {post.city}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center text-[10px] font-medium text-gray-400 mb-2 space-x-3 uppercase tracking-wider">
                                <span>{post.city}, {post.country}</span>
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
            </div>
        </section>
    );
}

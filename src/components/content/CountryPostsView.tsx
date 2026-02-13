import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useBlogStore } from '@/store/store';

export default function CountryPostsView() {
    const { selectedCountry, posts, setSelectedCountry, setSelectedPost } = useBlogStore();
    const countryPosts = posts.filter(p => p.country === selectedCountry);

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
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
                        className="flex items-center gap-2 text-[7px] font-medium text-[var(--brand)] px-4 py-2 border-2 border-[var(--brand)] hover:bg-[var(--brand)] hover:text-black transition-all duration-300 cursor-pointer uppercase tracking-[0.12em] group shrink-0"
                        style={{
                            fontFamily: "'Press Start 2P', monospace",
                            boxShadow: '0 0 8px rgba(0, 255, 65, 0.2)',
                        }}
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                        ◂ BACK
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-px h-10 bg-[var(--brand)]" style={{ opacity: 0.3 }} />
                        <div>
                            <h2 className="text-base sm:text-xl font-medium text-white leading-tight"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                {selectedCountry}
                            </h2>
                            <p className="text-[6px] text-[var(--brand)] mt-2 uppercase tracking-wider font-medium"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                {countryPosts.length} {countryPosts.length === 1 ? 'STORY' : 'STORIES'} FOUND
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
                            className="group cursor-pointer transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="relative overflow-hidden aspect-[4/3] mb-5 border-2 border-[var(--brand)]"
                                style={{ boxShadow: '0 0 10px rgba(0, 255, 65, 0.15)' }}>
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                    style={{ filter: 'saturate(0.4) brightness(0.7)' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--brand)] text-[6px] font-bold tracking-[0.12em] uppercase text-black"
                                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                        <MapPin className="w-3 h-3" />
                                        {post.city}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center text-[6px] font-medium text-gray-500 mb-2 space-x-3 uppercase tracking-wider"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                <span>{post.city}, {post.country}</span>
                                <span className="w-1.5 h-1.5 bg-[var(--brand)]" />
                                <span>{post.sections.length * 3} MIN</span>
                            </div>
                            <h3 className="text-[9px] font-medium text-white mb-1.5 group-hover:text-[var(--brand)] transition-colors leading-relaxed"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                {post.title}
                            </h3>
                            <p className="text-gray-500 text-[7px] line-clamp-2 leading-[2]"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                {post.sections[0]?.content?.substring(0, 80)}...
                            </p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}

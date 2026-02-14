import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useBlogStore } from '@/store/store';

const categories = ['Culture', 'History', 'Tourism', 'Transportation', 'Politic', 'Food'];

export default function CountryPostsView() {
    const { selectedCountry, posts, setSelectedCountry, setSelectedPost } = useBlogStore();
    const countryPosts = posts.filter(p => p.country === selectedCountry);

    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const filteredPosts = activeCategory
        ? countryPosts.filter(p => p.category.includes(activeCategory))
        : countryPosts;

    return (
        <section className="py-16 bg-black">
            <div style={{ maxWidth: '1024px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
                {/* Header */}
                <motion.div
                    className="flex items-end gap-6 mb-8"
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
                            <h2 className="text-base sm:text-xl font-medium text-white leading-tight relative text-glitch"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}
                                data-text={selectedCountry}>
                                {selectedCountry}
                            </h2>
                            <p className="text-[6px] mt-2 uppercase tracking-wider font-medium"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                <span className="text-[var(--neon-cyan)]">{filteredPosts.length}</span>
                                <span className="text-gray-500"> {filteredPosts.length === 1 ? 'STORY' : 'STORIES'} FOUND</span>
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Category filters */}
                <div className="flex flex-wrap gap-4 mb-12">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className="cursor-pointer transition-all duration-300"
                        style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: '9px',
                            padding: '10px 20px',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            border: '2px solid',
                            borderColor: !activeCategory ? 'var(--brand)' : '#444',
                            backgroundColor: !activeCategory ? 'var(--brand)' : 'transparent',
                            color: !activeCategory ? '#000' : '#888',
                            boxShadow: !activeCategory ? '0 0 12px rgba(0, 255, 65, 0.4)' : 'none',
                        }}
                    >
                        ALL
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                            className="cursor-pointer transition-all duration-300"
                            style={{
                                fontFamily: "'Press Start 2P', monospace",
                                fontSize: '9px',
                                padding: '10px 20px',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                border: '2px solid',
                                borderColor: activeCategory === cat ? 'var(--neon-magenta)' : '#444',
                                backgroundColor: activeCategory === cat ? 'var(--neon-magenta)' : 'transparent',
                                color: activeCategory === cat ? '#000' : '#888',
                                boxShadow: activeCategory === cat ? '0 0 12px rgba(255, 0, 228, 0.4)' : 'none',
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {filteredPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 + index * 0.08, duration: 0.4 }}
                            onClick={() => setSelectedPost(post)}
                            className="group cursor-pointer transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="relative overflow-hidden aspect-[16/9] mb-6 retro-corners hover-glitch"
                                style={{ boxShadow: '0 0 10px rgba(0, 255, 65, 0.15)' }}>
                                <span className="rc-extra absolute inset-0" />
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
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
                            <div className="flex items-center text-[8px] font-medium text-gray-500 mb-4 space-x-3 uppercase tracking-wider"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                <span className="text-[var(--neon-cyan)]">{post.city}, {post.country}</span>
                                <span className="w-1.5 h-1.5 bg-[var(--neon-magenta)]" />
                                <span className="text-[var(--neon-amber)]">{post.sections.length * 3} MIN</span>
                            </div>
                            <h3 className="text-sm md:text-base font-bold text-white mb-4 group-hover:text-[var(--brand)] transition-colors leading-relaxed text-glitch"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}
                                data-text={post.title}>
                                {post.title}
                            </h3>
                            <p className="text-gray-400 text-[10px] line-clamp-3 leading-[2.4]"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                {post.sections[0]?.content?.substring(0, 100)}...
                            </p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}

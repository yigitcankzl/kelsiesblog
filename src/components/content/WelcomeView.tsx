import { motion } from 'framer-motion';
import { Mail, ArrowRight, Clock } from 'lucide-react';
import { useBlogStore } from '@/store/store';

export default function WelcomeView() {
    const { posts, setSelectedCountry, setSelectedPost } = useBlogStore();

    const handlePostClick = (post: typeof posts[0]) => {
        setSelectedCountry(post.country);
        setSelectedPost(post);
    };

    const featured = posts[0];
    const rest = posts.slice(1);

    return (
        <section className="bg-black py-28 px-4 sm:px-8 lg:px-12 relative z-10">
            <div className="max-w-8xl mx-auto">
                {/* Section header — centered */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="text-[var(--neon-cyan)] font-bold tracking-[0.3em] text-[8px] uppercase block mb-4 neon-glow-cyan"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        ▸ JOURNAL ◂
                    </span>
                    <h2 className="text-lg md:text-2xl lg:text-3xl text-white leading-tight relative text-glitch-always inline-block"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                        data-text="Latest Stories">
                        Latest Stories
                    </h2>
                    <div className="flex justify-center mt-5 gap-1">
                        {Array.from({ length: 11 }).map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5"
                                style={{
                                    backgroundColor: i % 3 === 0 ? '#00FF41' : i % 3 === 1 ? '#00FFFF' : '#FF00E4',
                                    opacity: i === 5 ? 0.8 : 0.25,
                                }} />
                        ))}
                    </div>
                </motion.div>

                {/* Featured post — wide hero card */}
                {featured && (
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        onClick={() => handlePostClick(featured)}
                        className="group cursor-pointer mb-16 transition-all duration-500 hover:-translate-y-1"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 retro-corners overflow-hidden"
                            style={{ boxShadow: '0 0 20px rgba(0, 255, 65, 0.15)' }}>
                            <span className="rc-extra absolute inset-0" />
                            {/* Image side */}
                            <div className="relative overflow-hidden aspect-[4/3] md:aspect-auto hover-glitch">
                                <img
                                    src={featured.coverImage}
                                    alt={featured.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                                    style={{ filter: 'saturate(0.4) brightness(0.7)' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40 hidden md:block" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                                <span className="absolute top-4 left-4 bg-[var(--brand)] text-black text-[6px] font-bold uppercase tracking-widest px-3 py-1.5"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    {featured.country}
                                </span>
                                <span className="absolute top-4 right-4 bg-black/80 text-[var(--neon-amber)] text-[5px] font-bold uppercase tracking-widest px-2.5 py-1 border border-[var(--neon-amber)]/30"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    ★ FEATURED
                                </span>
                            </div>
                            {/* Info side */}
                            <div className="bg-[#0a0a0a] p-8 md:p-10 flex flex-col justify-center border-t-2 md:border-t-0 md:border-l-2 border-[var(--brand)]/20">
                                <div className="flex items-center text-[6px] font-medium text-gray-500 mb-5 gap-3 uppercase tracking-wider"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    <span className="text-[var(--neon-cyan)]">{featured.date}</span>
                                    <span className="text-[var(--neon-magenta)]">■</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5" />
                                        {featured.sections.length * 3} MIN
                                    </span>
                                </div>
                                <h3 className="text-xs md:text-sm font-bold text-white mb-5 group-hover:text-[var(--brand)] transition-colors leading-relaxed text-glitch"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                                    data-text={featured.title}>
                                    {featured.title}
                                </h3>
                                <p className="text-gray-400 text-[8px] leading-[2.2] mb-8 line-clamp-4"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    {featured.sections[0]?.content?.substring(0, 180)}...
                                </p>
                                <span
                                    className="text-[7px] font-semibold text-[var(--brand)] self-start inline-flex items-center gap-2 group/link hover:gap-3 transition-all duration-300 uppercase tracking-wider neon-glow"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                                >
                                    ▶ READ STORY
                                    <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </motion.article>
                )}

                {/* Pixel divider */}
                <div className="flex items-center justify-center gap-1 mb-16">
                    {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className="w-1 h-1"
                            style={{
                                backgroundColor: i % 3 === 0 ? '#00FF41' : i % 3 === 1 ? '#00FFFF' : '#FF00E4',
                                opacity: i % 2 === 0 ? 0.4 : 0.15,
                            }} />
                    ))}
                </div>

                {/* Stories grid — dynamic, centered */}
                {rest.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        {rest.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 + index * 0.08, duration: 0.5 }}
                                onClick={() => handlePostClick(post)}
                                className="group cursor-pointer w-full transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="relative overflow-hidden aspect-[4/3] mb-6 retro-corners hover-glitch"
                                    style={{ boxShadow: '0 0 10px rgba(0, 255, 65, 0.15)' }}>
                                    <span className="rc-extra absolute inset-0" />
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                        style={{ filter: 'saturate(0.4) brightness(0.7)' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <span className="absolute top-4 left-4 bg-[var(--brand)] text-black text-[6px] font-bold uppercase tracking-widest px-3 py-1.5"
                                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                        {post.country}
                                    </span>
                                    {/* Post number badge */}
                                    <span className="absolute bottom-3 right-3 text-[5px] text-[var(--neon-cyan)] opacity-40"
                                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                        #{String(index + 2).padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="flex items-center text-[6px] font-medium text-gray-500 mb-3 gap-3 uppercase tracking-wider"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    <span className="text-[var(--neon-cyan)]">{post.date}</span>
                                    <span className="text-[var(--neon-magenta)]">■</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5" />
                                        {post.sections.length * 3} MIN
                                    </span>
                                </div>
                                <h3 className="text-[9px] md:text-[10px] font-bold text-white mb-3 group-hover:text-[var(--brand)] transition-colors leading-relaxed text-glitch"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                                    data-text={post.title}>
                                    {post.title}
                                </h3>
                                <p className="text-gray-400 text-[7px] leading-[2] line-clamp-3"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    {post.sections[0]?.content?.substring(0, 100)}...
                                </p>
                            </motion.article>
                        ))}
                    </div>
                )}

                {/* Newsletter — centered below stories */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="max-w-lg mx-auto mt-20 bg-black p-8 sm:p-10 retro-corners text-center"
                    style={{ boxShadow: '0 0 12px rgba(0, 255, 65, 0.2)' }}
                >
                    <span className="rc-extra absolute inset-0" style={{ position: 'relative' }} />
                    <div className="flex items-center justify-center gap-3 mb-5">
                        <Mail className="w-5 h-5 text-[var(--neon-cyan)]" strokeWidth={1.5} />
                        <span className="text-[5px] text-[var(--neon-amber)] uppercase tracking-[0.3em]"
                            style={{ fontFamily: "'Press Start 2P', monospace" }}>
                            INCOMING TRANSMISSION
                        </span>
                    </div>
                    <h4 className="text-[10px] font-bold text-white mb-3"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        JOIN THE PARTY
                    </h4>
                    <p className="text-[6px] text-gray-500 mb-8 leading-[2.5]"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        15,000+ PLAYERS GET WEEKLY UPDATES AND TRAVEL TIPS.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="EMAIL_ADDRESS"
                            className="flex-1 text-[8px] px-4 py-3 border-2 border-[var(--brand)] bg-black text-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/30 outline-none transition-all placeholder-gray-600"
                            style={{ fontFamily: "'Press Start 2P', monospace" }}
                        />
                        <button className="bg-[var(--brand)] text-black font-medium text-[8px] py-3 px-6 hover:bg-[#00cc33] transition-all cursor-pointer uppercase tracking-wider border-2 border-[var(--brand)] whitespace-nowrap"
                            style={{
                                fontFamily: "'Press Start 2P', monospace",
                                boxShadow: '0 0 10px rgba(0, 255, 65, 0.3)',
                            }}>
                            ▶ SUBSCRIBE
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

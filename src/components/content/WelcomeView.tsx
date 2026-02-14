import { motion } from 'framer-motion';
import { ArrowRight, Clock, Image } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import { MapPin } from 'lucide-react';

export default function WelcomeView() {
    const { posts, galleryItems, setSelectedCountry, setSelectedPost, setActivePage } = useBlogStore();

    const handlePostClick = (post: typeof posts[0]) => {
        setSelectedCountry(post.country);
        setSelectedPost(post);
    };

    const featured = posts[0];
    const rest = posts.slice(1);

    return (
        <section className="bg-black py-28 relative z-10">
            <div style={{ maxWidth: '1024px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
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
                        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-0 retro-corners overflow-hidden md:min-h-[420px]"
                            style={{ boxShadow: '0 0 20px rgba(0, 255, 65, 0.15)' }}>
                            <span className="rc-extra absolute inset-0" />
                            {/* Image side */}
                            <div className="relative overflow-hidden aspect-[16/9] md:aspect-auto md:min-h-[420px] hover-glitch">
                                <img
                                    src={featured.coverImage}
                                    alt={featured.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
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
                            <div className="bg-[#0a0a0a] p-10 md:p-14 flex flex-col justify-center border-t-2 md:border-t-0 md:border-l-2 border-[var(--brand)]/20">
                                <div className="flex items-center text-[6px] font-medium text-gray-500 mb-5 gap-3 uppercase tracking-wider"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    <span className="text-[var(--neon-cyan)]">{featured.date}</span>
                                    <span className="text-[var(--neon-magenta)]">■</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5" />
                                        {featured.sections.length * 3} MIN
                                    </span>
                                </div>
                                <h3 className="text-sm md:text-base font-bold text-white mb-5 group-hover:text-[var(--brand)] transition-colors leading-relaxed text-glitch"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                                    data-text={featured.title}>
                                    {featured.title}
                                </h3>
                                <p className="text-gray-400 text-[9px] leading-[2.4] mb-8 line-clamp-4"
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
                                <div className="relative overflow-hidden aspect-[16/9] mb-6 retro-corners hover-glitch"
                                    style={{ boxShadow: '0 0 10px rgba(0, 255, 65, 0.15)' }}>
                                    <span className="rc-extra absolute inset-0" />
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
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
                                <div className="flex items-center text-[8px] font-medium text-gray-500 mb-4 gap-3 uppercase tracking-wider"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    <span className="text-[var(--neon-cyan)]">{post.date}</span>
                                    <span className="text-[var(--neon-magenta)]">■</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5" />
                                        {post.sections.length * 3} MIN
                                    </span>
                                </div>
                                <h3 className="text-sm md:text-base font-bold text-white mb-4 group-hover:text-[var(--brand)] transition-colors leading-relaxed text-glitch"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                                    data-text={post.title}>
                                    {post.title}
                                </h3>
                                <p className="text-gray-400 text-[10px] leading-[2.4] line-clamp-3"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    {post.sections[0]?.content?.substring(0, 100)}...
                                </p>
                            </motion.article>
                        ))}
                    </div>
                )}

                {/* ALL STORIES button */}
                <motion.div
                    className="text-center mt-20"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <div className="flex items-center justify-center gap-1 mb-8">
                        {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} className="w-1 h-1"
                                style={{
                                    backgroundColor: i % 3 === 0 ? '#00FF41' : i % 3 === 1 ? '#00FFFF' : '#FF00E4',
                                    opacity: i % 2 === 0 ? 0.4 : 0.15,
                                }} />
                        ))}
                    </div>
                    <button
                        onClick={() => setActivePage('stories')}
                        className="cursor-pointer group"
                        style={{
                            fontFamily: "'Press Start 2P', monospace",
                            fontSize: '10px',
                            padding: '16px 40px',
                            border: '2px solid var(--brand)',
                            backgroundColor: 'transparent',
                            color: 'var(--brand)',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase' as const,
                            boxShadow: '0 0 12px rgba(0, 255, 65, 0.2)',
                            transition: 'all 0.3s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'var(--brand)';
                            e.currentTarget.style.color = '#000';
                            e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 255, 65, 0.5)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--brand)';
                            e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 255, 65, 0.2)';
                        }}
                    >
                        ALL STORIES ▸
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>

                {/* Gallery preview */}
                {galleryItems.length > 0 && (
                    <motion.div
                        className="mt-28"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        {/* Section header */}
                        <div className="text-center mb-16">
                            <span className="text-[var(--neon-cyan)] font-bold tracking-[0.3em] text-[8px] uppercase block mb-4 neon-glow-cyan"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                ▸ GALLERY ◂
                            </span>
                            <h2 className="text-lg md:text-2xl lg:text-3xl text-white leading-tight relative text-glitch-always inline-block"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}
                                data-text="Photo Roll">
                                Photo Roll
                            </h2>
                            <div className="flex justify-center mt-5 gap-1">
                                {Array.from({ length: 11 }).map((_, i) => (
                                    <div key={i} className="w-1.5 h-1.5"
                                        style={{
                                            backgroundColor: i % 3 === 0 ? '#00FFFF' : i % 3 === 1 ? '#FF00E4' : '#00FF41',
                                            opacity: i === 5 ? 0.8 : 0.25,
                                        }} />
                                ))}
                            </div>
                        </div>

                        {/* Gallery grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {galleryItems.slice(0, 6).map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.55 + index * 0.06, duration: 0.4 }}
                                    className="group cursor-pointer retro-corners hover-glitch"
                                    onClick={() => setActivePage('gallery')}
                                    style={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        aspectRatio: index % 5 === 0 ? '1/1' : '4/3',
                                        boxShadow: '0 0 8px rgba(0, 255, 255, 0.1)',
                                    }}
                                >
                                    <span className="rc-extra" style={{ position: 'absolute', inset: 0 }} />
                                    <img
                                        src={item.src}
                                        alt={item.caption}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.7s, filter 0.5s',
                                            filter: 'saturate(0.8) brightness(0.85)',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'scale(1.1)';
                                            e.currentTarget.style.filter = 'saturate(1) brightness(1)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.filter = 'saturate(0.8) brightness(0.85)';
                                        }}
                                    />
                                    {/* Gradient overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                                        pointerEvents: 'none',
                                    }} />
                                    {/* Location label */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        left: '10px',
                                        right: '10px',
                                    }}>
                                        <span style={{
                                            fontFamily: "'Press Start 2P', monospace",
                                            fontSize: '6px',
                                            color: 'var(--neon-cyan)',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            textTransform: 'uppercase' as const,
                                            letterSpacing: '0.1em',
                                        }}>
                                            <MapPin style={{ width: '8px', height: '8px' }} />
                                            {item.city}
                                        </span>
                                        <p style={{
                                            fontFamily: "'Press Start 2P', monospace",
                                            fontSize: '5px',
                                            color: '#666',
                                            marginTop: '4px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {item.caption}
                                        </p>
                                    </div>
                                    {/* Index badge */}
                                    <span style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        fontFamily: "'Press Start 2P', monospace",
                                        fontSize: '5px',
                                        color: 'var(--neon-cyan)',
                                        opacity: 0.4,
                                    }}>
                                        #{String(index + 1).padStart(2, '0')}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* VIEW GALLERY button */}
                        <div className="text-center mt-16">
                            <div className="flex items-center justify-center gap-1 mb-8">
                                {Array.from({ length: 25 }).map((_, i) => (
                                    <div key={i} className="w-1 h-1"
                                        style={{
                                            backgroundColor: i % 3 === 0 ? '#00FFFF' : i % 3 === 1 ? '#FF00E4' : '#00FF41',
                                            opacity: i % 2 === 0 ? 0.4 : 0.15,
                                        }} />
                                ))}
                            </div>
                            <button
                                onClick={() => setActivePage('gallery')}
                                className="cursor-pointer group"
                                style={{
                                    fontFamily: "'Press Start 2P', monospace",
                                    fontSize: '10px',
                                    padding: '16px 40px',
                                    border: '2px solid var(--neon-cyan)',
                                    backgroundColor: 'transparent',
                                    color: 'var(--neon-cyan)',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase' as const,
                                    boxShadow: '0 0 12px rgba(0, 255, 255, 0.2)',
                                    transition: 'all 0.3s',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = 'var(--neon-cyan)';
                                    e.currentTarget.style.color = '#000';
                                    e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 255, 255, 0.5)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = 'var(--neon-cyan)';
                                    e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 255, 255, 0.2)';
                                }}
                            >
                                <Image className="w-4 h-4" />
                                VIEW GALLERY ▸
                            </button>
                        </div>
                    </motion.div>
                )}

            </div>
        </section>
    );
}

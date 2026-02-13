import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { useBlogStore } from '@/store/store';

export default function WelcomeView() {
    const { posts, setSelectedCountry, setSelectedPost } = useBlogStore();

    const handlePostClick = (post: typeof posts[0]) => {
        setSelectedCountry(post.country);
        setSelectedPost(post);
    };

    const santorini = posts[0];
    const istanbul = posts[1];
    const tokyo = posts[2];
    const cinqueTerre = posts[3];

    return (
        <section className="bg-black py-28 px-4 sm:px-8 lg:px-12 relative z-10">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <motion.div
                    className="flex items-end justify-between mb-16"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <span className="text-[var(--neon-cyan)] font-bold tracking-[0.2em] text-[8px] uppercase block mb-3 neon-glow-cyan"
                            style={{ fontFamily: "'Press Start 2P', monospace" }}>
                            ▸ JOURNAL ◂
                        </span>
                        <h2 className="text-lg md:text-2xl lg:text-3xl text-white leading-tight relative text-glitch-always"
                            style={{ fontFamily: "'Press Start 2P', monospace" }}
                            data-text="Latest Stories">
                            Latest Stories
                        </h2>
                    </div>
                    <button className="hidden sm:flex items-center gap-2 text-[7px] font-medium text-[var(--brand)] px-4 py-2 border-2 border-[var(--brand)] hover:bg-[var(--brand)] hover:text-black transition-all duration-300 cursor-pointer uppercase tracking-[0.12em] group"
                        style={{
                            fontFamily: "'Press Start 2P', monospace",
                            boxShadow: '0 0 8px rgba(0, 255, 65, 0.2)',
                        }}>
                        ARCHIVE
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </motion.div>

                {/* Main grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">

                    {/* === Column 1: Tall Santorini card === */}
                    {santorini && (
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            onClick={() => handlePostClick(santorini)}
                            className="group cursor-pointer flex flex-col h-full transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="relative overflow-hidden aspect-[3/4] mb-7 retro-corners hover-glitch"
                                style={{ boxShadow: '0 0 10px rgba(0, 255, 65, 0.15)' }}>
                                <span className="rc-extra absolute inset-0" />
                                <img
                                    src={santorini.coverImage}
                                    alt={santorini.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                    style={{ filter: 'saturate(0.4) brightness(0.7)' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <span className="absolute top-4 left-4 bg-[var(--brand)] text-black text-[6px] font-bold uppercase tracking-widest px-3 py-1.5"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    {santorini.country}
                                </span>
                            </div>
                            <div className="flex items-center text-[6px] font-medium text-gray-500 mb-4 gap-3 uppercase tracking-wider"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                <span className="text-[var(--neon-cyan)]">{santorini.date}</span>
                                <span className="text-[var(--neon-magenta)]">■</span>
                                <span>{santorini.category}</span>
                            </div>
                            <h3 className="text-[10px] md:text-xs font-bold text-white mb-5 group-hover:text-[var(--brand)] transition-colors leading-relaxed text-glitch"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}
                                data-text={santorini.title}>
                                {santorini.title}
                            </h3>
                            <p className="text-gray-400 text-[8px] leading-[2] mb-8 flex-1"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                {santorini.sections[0]?.content?.substring(0, 120)}...
                            </p>
                            <span
                                className="text-[7px] font-semibold text-[var(--brand)] self-start cursor-pointer inline-flex items-center gap-2 group/link hover:gap-3 transition-all duration-300 uppercase tracking-wider neon-glow"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}
                            >
                                ▶ READ STORY
                                <ArrowRight className="w-3 h-3" />
                            </span>
                        </motion.article>
                    )}

                    {/* === Column 2: Stacked — Istanbul top + Tokyo bottom === */}
                    <div className="flex flex-col gap-10 h-full justify-between">
                        {istanbul && (
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                onClick={() => handlePostClick(istanbul)}
                                className="group cursor-pointer transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="relative overflow-hidden aspect-[4/3] mb-7 retro-corners hover-glitch"
                                    style={{ boxShadow: '0 0 10px rgba(0, 255, 65, 0.15)' }}>
                                    <span className="rc-extra absolute inset-0" />
                                    <img
                                        src={istanbul.coverImage}
                                        alt={istanbul.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                        style={{ filter: 'saturate(0.4) brightness(0.7)' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <span className="absolute top-4 left-4 bg-[var(--brand)] text-black text-[6px] font-bold uppercase tracking-widest px-3 py-1.5"
                                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                        {istanbul.country}
                                    </span>
                                </div>
                                <div className="flex items-center text-[6px] font-medium text-gray-500 mb-4 gap-3 uppercase tracking-wider"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    <span className="text-[var(--neon-cyan)]">{istanbul.date}</span>
                                    <span className="text-[var(--neon-magenta)]">■</span>
                                    <span>{istanbul.category}</span>
                                </div>
                                <h3 className="text-[10px] md:text-xs font-bold text-white mb-4 group-hover:text-[var(--brand)] transition-colors leading-relaxed text-glitch"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                                    data-text={istanbul.title}>
                                    {istanbul.title}
                                </h3>
                                <p className="text-gray-400 text-[8px] line-clamp-4 leading-[2]"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    {istanbul.sections[0]?.content?.substring(0, 120)}...
                                </p>
                            </motion.article>
                        )}

                        {/* Pixel divider — multi-color */}
                        <div className="flex items-center gap-1 justify-center">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5"
                                    style={{
                                        backgroundColor: i % 3 === 0 ? '#00FF41' : i % 3 === 1 ? '#00FFFF' : '#FF00E4',
                                        opacity: i % 2 === 0 ? 0.5 : 0.2,
                                    }} />
                            ))}
                        </div>

                        {/* Tokyo small card */}
                        {tokyo && (
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                onClick={() => handlePostClick(tokyo)}
                                className="group cursor-pointer flex gap-5 items-start"
                            >
                                <div className="relative overflow-hidden w-28 h-24 flex-shrink-0 retro-corners hover-glitch"
                                    style={{ boxShadow: '0 0 8px rgba(0, 255, 65, 0.15)' }}>
                                    <span className="rc-extra absolute inset-0" />
                                    <img
                                        src={tokyo.coverImage}
                                        alt={tokyo.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        style={{ filter: 'saturate(0.4) brightness(0.7)' }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center text-[6px] font-medium text-gray-500 mb-2 gap-3 uppercase tracking-wider"
                                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                        <span className="text-[var(--neon-amber)] font-bold">{tokyo.country}</span>
                                        <span className="text-[var(--neon-cyan)]">{tokyo.date}</span>
                                    </div>
                                    <h3 className="text-[9px] font-bold text-white group-hover:text-[var(--brand)] transition-colors leading-relaxed text-glitch"
                                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                                        data-text={tokyo.title}>
                                        {tokyo.title}
                                    </h3>
                                </div>
                            </motion.article>
                        )}
                    </div>

                    {/* === Column 3: Tall Cinque Terre card + Newsletter === */}
                    <div className="flex flex-col gap-10">
                        {cinqueTerre && (
                            <motion.article
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25, duration: 0.5 }}
                                onClick={() => handlePostClick(cinqueTerre)}
                                className="group cursor-pointer transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="relative overflow-hidden aspect-[3/4] mb-7 retro-corners hover-glitch"
                                    style={{ boxShadow: '0 0 10px rgba(0, 255, 65, 0.15)' }}>
                                    <span className="rc-extra absolute inset-0" />
                                    <img
                                        src={cinqueTerre.coverImage}
                                        alt={cinqueTerre.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                        style={{ filter: 'saturate(0.4) brightness(0.7)' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <span className="absolute top-4 left-4 bg-[var(--brand)] text-black text-[6px] font-bold uppercase tracking-widest px-3 py-1.5"
                                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                        {cinqueTerre.country}
                                    </span>
                                </div>
                                <div className="flex items-center text-[6px] font-medium text-gray-500 mb-4 gap-3 uppercase tracking-wider"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    <span className="text-[var(--neon-cyan)]">{cinqueTerre.date}</span>
                                    <span className="text-[var(--neon-magenta)]">■</span>
                                    <span>{cinqueTerre.category}</span>
                                </div>
                                <h3 className="text-[10px] md:text-xs font-bold text-white mb-4 group-hover:text-[var(--brand)] transition-colors leading-relaxed text-glitch"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                                    data-text={cinqueTerre.title}>
                                    {cinqueTerre.title}
                                </h3>
                                <p className="text-gray-400 text-[8px] line-clamp-2 leading-[2]"
                                    style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                    {cinqueTerre.sections[0]?.content?.substring(0, 100)}...
                                </p>
                            </motion.article>
                        )}

                        {/* Newsletter signup — retro terminal style */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="bg-black p-8 retro-corners"
                            style={{ boxShadow: '0 0 12px rgba(0, 255, 65, 0.2)' }}
                        >
                            <span className="rc-extra absolute inset-0" style={{ position: 'relative' }} />
                            <div className="flex items-center gap-3 mb-5">
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
                            <div className="flex flex-col gap-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="EMAIL_ADDRESS"
                                        className="w-full text-[8px] px-4 py-3 border-2 border-[var(--brand)] bg-black text-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/30 outline-none transition-all placeholder-gray-600 blink-cursor"
                                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                                    />
                                </div>
                                <button className="bg-[var(--brand)] text-black font-medium text-[8px] py-3 px-4 hover:bg-[#00cc33] transition-all cursor-pointer uppercase tracking-wider w-full border-2 border-[var(--brand)]"
                                    style={{
                                        fontFamily: "'Press Start 2P', monospace",
                                        boxShadow: '0 0 10px rgba(0, 255, 65, 0.3)',
                                    }}>
                                    ▶ SUBSCRIBE
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Mobile view-all */}
                <div className="mt-12 text-center sm:hidden">
                    <button className="inline-flex items-center px-6 py-3 border-2 border-[var(--brand)] text-[7px] font-medium text-[var(--brand)] hover:bg-[var(--brand)] hover:text-black transition-colors uppercase tracking-[0.15em] cursor-pointer"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        VIEW ALL STORIES
                    </button>
                </div>
            </div>
        </section>
    );
}

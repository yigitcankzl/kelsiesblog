import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import { useBlogStore } from '@/store/store';

export default function PostReader() {
    const { selectedPost, selectedCountry, setSelectedPost } = useBlogStore();
    if (!selectedPost) return null;

    return (
        <article className="pb-20 bg-black">
            {/* Cover hero — full bleed */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-72 sm:h-[420px] overflow-hidden"
                style={{ maxWidth: '1024px', margin: '0 auto' }}
            >
                <img
                    src={selectedPost.coverImage}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                    style={{ filter: 'saturate(0.3) brightness(0.5) contrast(1.2)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 pb-6 sm:pb-10">
                    <div style={{ maxWidth: '1024px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--brand)] text-black text-[6px] font-bold uppercase tracking-[0.12em] mb-4"
                            style={{ fontFamily: "'Press Start 2P', monospace" }}>
                            <MapPin className="w-3 h-3" />
                            {selectedPost.city}, {selectedPost.country}
                        </span>
                        <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-white leading-relaxed relative text-glitch-always"
                            style={{ fontFamily: "'Press Start 2P', monospace" }}
                            data-text={selectedPost.title}>
                            {selectedPost.title}
                        </h1>
                        <div className="flex items-center gap-4 mt-3">
                            <span className="flex items-center gap-1.5 text-[var(--neon-cyan)] text-[7px]"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                <Clock className="w-3.5 h-3.5" />
                                {selectedPost.sections.length * 3} MIN READ
                            </span>
                            <span className="text-[var(--neon-amber)] text-[6px]"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                {selectedPost.date}
                            </span>
                        </div>
                    </div>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div style={{ maxWidth: '1024px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px', paddingTop: '40px' }}>
                {/* Back button */}
                <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <button
                        onClick={() => setSelectedPost(null)}
                        className="flex items-center gap-2 text-[7px] font-medium text-[var(--brand)] px-4 py-2 border-2 border-[var(--brand)] hover:bg-[var(--brand)] hover:text-black transition-all duration-300 cursor-pointer uppercase tracking-[0.12em] group"
                        style={{
                            fontFamily: "'Press Start 2P', monospace",
                            boxShadow: '0 0 8px rgba(0, 255, 65, 0.2)',
                        }}
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                        ◂ {selectedCountry || 'POSTS'}
                    </button>
                </motion.div>

                {/* Sections */}
                <div className="space-y-10">
                    {selectedPost.sections.map((section, index) => (
                        <motion.section
                            key={index}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + index * 0.08, duration: 0.4 }}
                        >
                            {/* Section pixel divider — multi-color */}
                            {index > 0 && (
                                <div className="flex items-center gap-2 mb-12 justify-center">
                                    {Array.from({ length: 7 }).map((_, i) => (
                                        <div key={i} className="w-2 h-2"
                                            style={{
                                                backgroundColor: i % 3 === 0 ? '#00FF41' : i % 3 === 1 ? '#00FFFF' : '#FF00E4',
                                                opacity: i === 3 ? 1 : 0.3,
                                            }} />
                                    ))}
                                </div>
                            )}

                            <h2 className="text-[10px] sm:text-xs font-bold mb-4 leading-relaxed text-[var(--brand)] blink-cursor"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                <span className="text-[var(--neon-cyan)] mr-1">$</span>
                                {'> '}{section.heading}
                            </h2>

                            {section.image && (
                                <div className="mb-5 overflow-hidden retro-corners hover-glitch"
                                    style={{ boxShadow: '0 0 10px rgba(0, 255, 65, 0.15)' }}>
                                    <span className="rc-extra absolute inset-0" />
                                    <img
                                        src={section.image}
                                        alt={section.heading}
                                        className="w-full h-52 sm:h-72 object-cover"
                                        style={{ filter: 'saturate(0.4) brightness(0.7)' }}
                                    />
                                </div>
                            )}

                            <p className="text-[9px] text-gray-300 leading-[2.5]"
                                style={{ fontFamily: "'Press Start 2P', monospace" }}>
                                {section.content}
                            </p>
                        </motion.section>
                    ))}
                </div>

                {/* End marker — multi-color */}
                <div className="flex justify-center pt-14">
                    <div className="flex items-center gap-2">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="w-2 h-2"
                                style={{
                                    backgroundColor: i % 3 === 0 ? '#00FF41' : i % 3 === 1 ? '#00FFFF' : '#FF00E4',
                                    opacity: i === 3 ? 1 : 0.3,
                                }} />
                        ))}
                    </div>
                </div>

                {/* GAME OVER text */}
                <div className="text-center mt-6 mb-8">
                    <span className="text-[8px] text-[var(--neon-magenta)] uppercase tracking-[0.3em] neon-glow-magenta"
                        style={{ fontFamily: "'Press Start 2P', monospace", opacity: 0.6 }}>
                        — TRANSMISSION COMPLETE —
                    </span>
                </div>
            </div>
        </article>
    );
}

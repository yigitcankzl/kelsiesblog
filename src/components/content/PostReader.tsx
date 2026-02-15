import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import { estimateReadTime } from '@/types';

export default function PostReader() {
    const { selectedPost, selectedCountry, setSelectedPost } = useBlogStore();
    if (!selectedPost) return null;

    return (
        <article className="pb-20 bg-black">
            {/* Content */}
            <div style={{ maxWidth: '1024px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px', paddingTop: '40px' }}>
                {/* Back button */}
                <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
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

                {/* Post header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    style={{ marginBottom: '24px' }}
                >
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--brand)] text-black text-[6px] font-bold uppercase tracking-[0.12em]"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        {selectedPost.city}, {selectedPost.country}
                    </span>
                    <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-white leading-relaxed relative text-glitch-always mt-4"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}
                        data-text={selectedPost.title}>
                        {selectedPost.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-3">
                        <span className="text-[var(--neon-cyan)] text-[7px]"
                            style={{ fontFamily: "'Press Start 2P', monospace" }}>
                            {estimateReadTime(selectedPost.sections)} MIN READ
                        </span>
                        <span className="text-[var(--neon-amber)] text-[6px]"
                            style={{ fontFamily: "'Press Start 2P', monospace" }}>
                            {selectedPost.date}
                        </span>
                    </div>
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

                            {/* Section images — supports both legacy `image` and new `images` */}
                            {(() => {
                                const imgs = section.images?.length ? section.images : (section.image ? [section.image] : []);
                                return imgs.map((imgUrl, imgIdx) => (
                                    <div key={imgIdx} className="mb-5 overflow-hidden retro-corners hover-glitch"
                                        style={{ boxShadow: '0 0 10px rgba(0, 255, 65, 0.15)' }}>
                                        <span className="rc-extra absolute inset-0" />
                                        <img
                                            src={imgUrl}
                                            alt={section.heading}
                                            className="w-full h-52 sm:h-72 object-cover"
                                        />
                                    </div>
                                ));
                            })()}

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

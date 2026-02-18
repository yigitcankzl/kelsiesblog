import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import { estimateReadTime, getFontConfig, resolveContents } from '@/types';

export default function PostReader() {
    const { selectedPost, selectedCountry, setSelectedPost } = useBlogStore();
    if (!selectedPost) return null;

    const fontCfg = getFontConfig(selectedPost.contentFont);

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
                    style={{ marginBottom: '40px' }}
                >
                    {/* Location badge */}
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--brand)] text-black text-[8px] font-bold uppercase tracking-[0.14em]"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        {selectedPost.city}, {selectedPost.country}
                    </span>

                    {/* Title */}
                    <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white leading-relaxed relative text-glitch-always mt-5"
                        style={{ fontFamily: "'Press Start 2P', monospace", lineHeight: '2' }}
                        data-text={selectedPost.title}>
                        {selectedPost.title}
                    </h1>

                    {/* Meta row: date + read time + categories */}
                    <div className="flex flex-wrap items-center gap-3 mt-4"
                        style={{ fontFamily: "'Press Start 2P', monospace" }}>
                        <span className="text-[var(--neon-amber)] text-[9px] tracking-wide">
                            {selectedPost.date}
                        </span>
                        <span className="text-[#333] text-[10px]">|</span>
                        <span className="text-[var(--neon-cyan)] text-[9px] tracking-wide">
                            {estimateReadTime(selectedPost.sections)} MIN READ
                        </span>
                        {selectedPost.category?.length > 0 && (
                            <>
                                <span className="text-[#333] text-[10px]">|</span>
                                {selectedPost.category.map(cat => (
                                    <span key={cat} className="text-[8px] uppercase tracking-[0.14em] px-3 py-1.5"
                                        style={{
                                            backgroundColor: 'var(--neon-magenta)',
                                            color: '#000',
                                            boxShadow: '0 0 8px rgba(255, 0, 228, 0.25)',
                                        }}>
                                        {cat}
                                    </span>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Divider */}
                    <div style={{ height: '1px', background: 'linear-gradient(to right, var(--brand), transparent)', marginTop: '24px', opacity: 0.3 }} />
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

                            <div className="text-gray-300 leading-[2.5] post-content"
                                style={{ fontFamily: fontCfg.family, fontSize: fontCfg.size }}>

                                {/* New HTML Content (TipTap) */}
                                {section.content ? (
                                    <>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: section.content }}
                                            className="rte-content"
                                            style={{
                                                ['--image-width' as any]: 'auto' // Placeholder if we want to use CSS vars, but HTML attributes should work
                                            }}
                                        />
                                        <style>{`
                                            .rte-content img {
                                                max-width: 100%;
                                                height: auto;
                                                display: block;
                                                margin: 1em 0;
                                                border: 1px solid var(--neon-cyan);
                                                box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
                                            }
                                            .rte-content img[align="left"] {
                                                float: left;
                                                margin-right: 1.5em;
                                                margin-bottom: 1em;
                                            }
                                            .rte-content img[align="right"] {
                                                float: right;
                                                margin-left: 1.5em;
                                                margin-bottom: 1em;
                                            }
                                            .rte-content img[align="center"] {
                                                display: block;
                                                margin: 1em auto;
                                                float: none;
                                            }
                                            /* Clearfix for floated images */
                                            .rte-content::after {
                                                content: "";
                                                display: table;
                                                clear: both;
                                            }
                                        `}</style>
                                    </>
                                ) : (
                                    /* Fallback: Legacy Content */
                                    resolveContents(section).map((para, pIdx) => {
                                        if (para.startsWith('IMAGE::')) {
                                            const imgUrl = para.replace('IMAGE::', '').trim();
                                            if (!imgUrl) return null;
                                            return (
                                                <div key={pIdx} className="my-8 overflow-hidden retro-corners hover-glitch"
                                                    style={{ boxShadow: '0 0 10px rgba(0, 255, 65, 0.15)' }}>
                                                    <span className="rc-extra absolute inset-0" />
                                                    <img src={imgUrl} alt="Inline" className="w-full h-auto object-cover" />
                                                </div>
                                            );
                                        }
                                        return <div key={pIdx} style={{ marginBottom: '1.2em' }} dangerouslySetInnerHTML={{ __html: para }} />;
                                    })
                                )}
                            </div>
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

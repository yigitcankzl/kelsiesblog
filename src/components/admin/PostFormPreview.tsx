import { motion } from 'framer-motion';
import type { Section } from '@/types';
import { getFontConfig } from '@/types';
import { FONT } from '@/lib/constants';

interface PostFormPreviewProps {
    title: string;
    city: string;
    country: string;
    date: string;
    categories: string[];
    contentFont: string;
    sections: Section[];
}

export default function PostFormPreview({
    title, city, country, date, categories, contentFont, sections,
}: PostFormPreviewProps) {
    const fontCfg = getFontConfig(contentFont);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 mb-4 border border-[var(--neon-cyan)] bg-[#050505]"
            style={{ boxShadow: '0 0 15px rgba(0, 255, 255, 0.1)' }}
        >
            <div className="flex items-center gap-2 mb-5">
                <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--neon-cyan)' }} />
                <h3 style={{ ...FONT, fontSize: '8px', color: 'var(--neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    PREVIEW
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-[rgba(0,255,255,0.3)] to-transparent" />
            </div>

            <div className="flex items-center flex-wrap gap-2 mb-3">
                {city && <span style={{ ...FONT, fontSize: '7px', color: 'var(--neon-cyan)' }}>{city}, {country}</span>}
                {categories.length > 0 && (
                    <>
                        <div style={{ width: '4px', height: '4px', backgroundColor: 'var(--neon-magenta)' }} />
                        {categories.map(cat => (
                            <span key={cat} style={{ ...FONT, fontSize: '6px', color: '#000', backgroundColor: 'var(--neon-magenta)', padding: '3px 8px' }}>
                                {cat}
                            </span>
                        ))}
                    </>
                )}
                {date && (
                    <>
                        <div style={{ width: '4px', height: '4px', backgroundColor: '#555' }} />
                        <span style={{ ...FONT, fontSize: '7px', color: '#555' }}>{date}</span>
                    </>
                )}
            </div>

            <h2 style={{ ...FONT, fontSize: '14px', color: '#fff', marginBottom: '16px', lineHeight: '2' }}>
                {title || 'UNTITLED POST'}
            </h2>

            {sections.filter(s => s.heading || (s.contents || []).some(c => c.trim()) || s.content).map((section, i) => (
                <div key={i} className="mb-4">
                    {section.heading && (
                        <h3 style={{ ...FONT, fontSize: '10px', color: 'var(--brand)', marginBottom: '8px' }}>
                            {'>'} {section.heading}
                        </h3>
                    )}
                    <div
                        style={{ fontFamily: fontCfg.family, fontSize: fontCfg.size, color: '#aaa', lineHeight: '2.4', marginBottom: '1em' }}
                        dangerouslySetInnerHTML={{ __html: section.content || '' }}
                    />
                    {(section.images || []).filter(Boolean).map((img, imgI) => (
                        <div key={imgI} className="mt-3 overflow-hidden h-[140px] border border-[#1a1a1a]">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            ))}
        </motion.div>
    );
}

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
            style={{
                border: '1px solid var(--neon-cyan)',
                padding: '24px',
                backgroundColor: '#050505',
                marginBottom: '16px',
                boxShadow: '0 0 15px rgba(0, 255, 255, 0.1)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--neon-cyan)' }} />
                <h3 style={{ ...FONT, fontSize: '8px', color: 'var(--neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                    PREVIEW
                </h3>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, rgba(0,255,255,0.3), transparent)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
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
                <div key={i} style={{ marginBottom: '16px' }}>
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
                        <div key={imgI} style={{ marginTop: '12px', overflow: 'hidden', height: '140px', border: '1px solid #1a1a1a' }}>
                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    ))}
                </div>
            ))}
        </motion.div>
    );
}

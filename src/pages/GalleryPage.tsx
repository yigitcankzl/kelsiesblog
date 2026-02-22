import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import { useBlogStore } from '@/store/store';
import { FONT } from '@/lib/constants';

interface GalleryImage {
    src: string;
    title: string;
    city: string;
    country: string;
    heading: string;
}

export default function GalleryPage() {
    const { galleryItems, setActivePage } = useBlogStore();
    const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

    const allImages = useMemo(() => {
        return galleryItems.map(item => ({
            src: item.src,
            title: item.caption,
            city: item.city,
            country: item.country,
            heading: item.caption,
        }));
    }, [galleryItems]);

    // Duplicate for seamless marquee
    const marqueeImages = [...allImages, ...allImages];

    return (
        <section className="bg-black min-h-screen pb-16 pt-[100px]">
            <div className="max-w-screen-lg mx-auto px-6">
                {/* Header */}
                <PageHeader
                    onBack={() => setActivePage('map')}
                    title="GALLERY"
                    subtitle={<>
                        <span style={{ color: 'var(--neon-cyan)' }}>{allImages.length}</span>
                        <span style={{ color: '#555' }}> IMAGES CAPTURED</span>
                    </>}
                />

                {/* Image grid */}
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                >
                    {allImages.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 + index * 0.04, duration: 0.4 }}
                            className={`group cursor-pointer retro-corners hover-glitch relative overflow-hidden ${index % 5 === 0 ? 'aspect-square' : 'aspect-[4/3]'}`}
                            style={{
                                boxShadow: '0 0 8px rgba(0, 255, 65, 0.1)',
                            }}
                            onClick={() => setLightbox(img)}
                        >
                            <span className="rc-extra absolute inset-0" />
                            <img
                                src={img.src}
                                alt={img.heading}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-all duration-700"
                                style={{ filter: 'saturate(0.8) brightness(0.85)' }}
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                            {/* Location */}
                            <div className="absolute bottom-2.5 left-2.5 right-2.5">
                                <span className="inline-flex items-center gap-1 uppercase tracking-wide text-[var(--brand)]"
                                    style={{ ...FONT, fontSize: '6px' }}>
                                    <MapPin className="w-2 h-2" />
                                    {img.city}
                                </span>
                                <p className="mt-1 overflow-hidden text-ellipsis whitespace-nowrap text-[#666]"
                                    style={{ ...FONT, fontSize: '5px' }}>
                                    {img.heading}
                                </p>
                            </div>
                            {/* Index badge */}
                            <span className="absolute top-2 right-2 opacity-40 text-[var(--neon-cyan)]"
                                style={{ ...FONT, fontSize: '5px' }}>
                                #{String(index + 1).padStart(2, '0')}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Rotating image strip at bottom */}
            <motion.div
                className="mt-15"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <div className="text-center mb-5">
                    <span style={{ ...FONT, fontSize: '7px', color: '#333', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                        ◂ FILM STRIP ▸
                    </span>
                </div>
                <div className="overflow-hidden" style={{ boxShadow: '0 0 12px rgba(0, 255, 65, 0.15) inset' }}>
                    <div className="marquee-track">
                        {marqueeImages.map((img, index) => (
                            <div
                                key={index}
                                className="relative overflow-hidden shrink-0 cursor-pointer hover-glitch"
                                style={{
                                    width: '200px',
                                    height: '140px',
                                    borderRight: '1px solid #00FF4144',
                                }}
                                onClick={() => setLightbox(img)}
                            >
                                <img
                                    src={img.src}
                                    alt={img.heading}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover transition-all duration-500"
                                    style={{ filter: 'saturate(0.6) brightness(0.8)' }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'scale(1.15)';
                                        e.currentTarget.style.filter = 'saturate(1) brightness(1)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.filter = 'saturate(0.6) brightness(0.8)';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                                <span className="absolute top-1.5 left-1.5 opacity-50 tracking-wide text-[var(--neon-cyan)]"
                                    style={{ ...FONT, fontSize: '5px' }}>
                                    CH-{String((index % allImages.length) + 1).padStart(2, '0')}
                                </span>
                                <span className="absolute bottom-2 left-2 uppercase tracking-wider text-[var(--brand)]"
                                    style={{ ...FONT, fontSize: '6px', textShadow: '0 0 6px rgba(0, 255, 65, 0.5)' }}>
                                    {img.city}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-6"
                    onClick={() => setLightbox(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative max-w-[900px] w-full"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setLightbox(null)}
                            className="cursor-pointer absolute -top-10 right-0 bg-transparent border border-[var(--brand)] text-[var(--brand)] w-8 h-8 flex items-center justify-center z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="retro-corners overflow-hidden" style={{ boxShadow: '0 0 30px rgba(0, 255, 65, 0.3)' }}>
                            <span className="rc-extra absolute inset-0 z-[2]" />
                            <img
                                src={lightbox.src}
                                alt={lightbox.heading}
                                referrerPolicy="no-referrer"
                                className="w-full max-h-[80vh] object-contain bg-black"
                            />
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                            <MapPin className="w-3 h-3 text-[var(--brand)]" />
                            <span style={{ ...FONT, fontSize: '8px', color: 'var(--neon-cyan)' }}>
                                {lightbox.city}, {lightbox.country}
                            </span>
                            <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--neon-magenta)' }} />
                            <span style={{ ...FONT, fontSize: '7px', color: '#555' }}>
                                {lightbox.heading}
                            </span>
                        </div>
                        <p style={{ ...FONT, fontSize: '9px', color: '#888', marginTop: '8px', lineHeight: '2' }}>
                            {lightbox.title}
                        </p>
                    </motion.div>
                </div>
            )}
        </section>
    );
}

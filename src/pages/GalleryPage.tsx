import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import BackButton from '@/components/shared/BackButton';
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
        <section className="bg-black min-h-screen pb-16" style={{ paddingTop: '100px' }}>
            <div style={{ maxWidth: '1024px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
                {/* Header */}
                <motion.div
                    className="flex items-end gap-6 mb-10"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <BackButton onClick={() => setActivePage('map')} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--brand)', opacity: 0.3 }} />
                        <div>
                            <h1 className="text-glitch" style={{ ...FONT, fontSize: '18px', color: '#fff', lineHeight: 1.4 }}
                                data-text="GALLERY">
                                GALLERY
                            </h1>
                            <p style={{ ...FONT, fontSize: '6px', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                <span style={{ color: 'var(--neon-cyan)' }}>{allImages.length}</span>
                                <span style={{ color: '#555' }}> IMAGES CAPTURED</span>
                            </p>
                        </div>
                    </div>
                </motion.div>

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
                            className="group cursor-pointer retro-corners hover-glitch"
                            style={{
                                position: 'relative',
                                overflow: 'hidden',
                                aspectRatio: index % 5 === 0 ? '1/1' : '4/3',
                                boxShadow: '0 0 8px rgba(0, 255, 65, 0.1)',
                            }}
                            onClick={() => setLightbox(img)}
                        >
                            <span className="rc-extra" style={{ position: 'absolute', inset: 0 }} />
                            <img
                                src={img.src}
                                alt={img.heading}
                                referrerPolicy="no-referrer"
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
                            {/* Location */}
                            <div style={{
                                position: 'absolute',
                                bottom: '10px',
                                left: '10px',
                                right: '10px',
                            }}>
                                <span style={{
                                    ...FONT,
                                    fontSize: '6px',
                                    color: 'var(--brand)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                }}>
                                    <MapPin style={{ width: '8px', height: '8px' }} />
                                    {img.city}
                                </span>
                                <p style={{
                                    ...FONT,
                                    fontSize: '5px',
                                    color: '#666',
                                    marginTop: '4px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {img.heading}
                                </p>
                            </div>
                            {/* Index badge */}
                            <span style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                ...FONT,
                                fontSize: '5px',
                                color: 'var(--neon-cyan)',
                                opacity: 0.4,
                            }}>
                                #{String(index + 1).padStart(2, '0')}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Rotating image strip at bottom */}
            <motion.div
                style={{ marginTop: '60px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
            >
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
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
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        filter: 'saturate(0.6) brightness(0.8)',
                                        transition: 'all 0.5s',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'scale(1.15)';
                                        e.currentTarget.style.filter = 'saturate(1) brightness(1)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.filter = 'saturate(0.6) brightness(0.8)';
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
                                    pointerEvents: 'none',
                                }} />
                                <span style={{
                                    position: 'absolute',
                                    top: '6px',
                                    left: '6px',
                                    ...FONT,
                                    fontSize: '5px',
                                    color: 'var(--neon-cyan)',
                                    opacity: 0.5,
                                    letterSpacing: '0.1em',
                                }}>
                                    CH-{String((index % allImages.length) + 1).padStart(2, '0')}
                                </span>
                                <span style={{
                                    position: 'absolute',
                                    bottom: '8px',
                                    left: '8px',
                                    ...FONT,
                                    fontSize: '6px',
                                    color: 'var(--brand)',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    textShadow: '0 0 6px rgba(0, 255, 65, 0.5)',
                                }}>
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
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                    }}
                    onClick={() => setLightbox(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{ position: 'relative', maxWidth: '900px', width: '100%' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setLightbox(null)}
                            className="cursor-pointer"
                            style={{
                                position: 'absolute',
                                top: '-40px',
                                right: '0',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--brand)',
                                color: 'var(--brand)',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10,
                            }}
                        >
                            <X style={{ width: '16px', height: '16px' }} />
                        </button>
                        <div className="retro-corners" style={{ overflow: 'hidden', boxShadow: '0 0 30px rgba(0, 255, 65, 0.3)' }}>
                            <span className="rc-extra" style={{ position: 'absolute', inset: 0, zIndex: 2 }} />
                            <img
                                src={lightbox.src}
                                alt={lightbox.heading}
                                referrerPolicy="no-referrer"
                                style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', backgroundColor: '#000' }}
                            />
                        </div>
                        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <MapPin style={{ width: '12px', height: '12px', color: 'var(--brand)' }} />
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

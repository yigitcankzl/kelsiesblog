import { useState } from 'react';

export default function PhotoStrip() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const images = [
        {
            src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600',
            alt: 'European café with red awning',
            location: 'Paris',
        },
        {
            src: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600',
            alt: 'Venice canal with gondolas',
            location: 'Venice',
        },
        {
            src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
            alt: 'Dubai skyline at sunset',
            location: 'Dubai',
        },
        {
            src: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600',
            alt: 'Big Ben and Houses of Parliament',
            location: 'London',
        },
        {
            src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600',
            alt: 'Matterhorn mountain peak',
            location: 'Switzerland',
        },
        {
            src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
            alt: 'Tropical beach with palm tree',
            location: 'Maldives',
        },
    ];

    return (
        <section className="w-full overflow-hidden border-t-2 border-b-2 border-[var(--brand)]"
            style={{ boxShadow: '0 0 12px rgba(0, 255, 65, 0.15) inset' }}>
            <div className="flex">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="relative w-1/3 sm:w-1/6 aspect-square overflow-hidden cursor-pointer"
                        style={{
                            borderRight: index < images.length - 1 ? '1px solid #00FF4144' : 'none',
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <img
                            src={img.src}
                            alt={img.alt}
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out"
                            style={{
                                transform: hoveredIndex === index ? 'scale(1.15)' : 'scale(1)',
                                filter: hoveredIndex === index
                                    ? 'saturate(0.3) contrast(1.3) brightness(0.6)'
                                    : 'saturate(0.5) brightness(0.7)',
                                imageRendering: hoveredIndex === index ? 'pixelated' as any : 'auto',
                            }}
                        />
                        {/* Neon green gradient overlay on hover */}
                        <div
                            className="absolute inset-0 transition-opacity duration-500"
                            style={{
                                opacity: hoveredIndex === index ? 1 : 0,
                                background: 'linear-gradient(to top, rgba(0,255,65,0.3) 0%, rgba(0,0,0,0) 60%)',
                            }}
                        />
                        {/* Location label on hover */}
                        <span
                            className="absolute bottom-3 left-0 right-0 text-center text-[var(--brand)] transition-all duration-500"
                            style={{
                                fontFamily: "'Press Start 2P', monospace",
                                fontSize: '7px',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                opacity: hoveredIndex === index ? 1 : 0,
                                transform: hoveredIndex === index ? 'translateY(0)' : 'translateY(8px)',
                                textShadow: '0 0 8px rgba(0, 255, 65, 0.6)',
                            }}
                        >
                            {'> '}{img.location}{' <'}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}

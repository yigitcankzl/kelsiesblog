import { useState } from 'react';

export default function PhotoStrip() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const images = [
        {
            src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600',
            alt: 'European caf\u00e9 with red awning',
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
            src: 'https://images.unsplash.com/photo-1531210483974-4f8205f49e36?w=600',
            alt: 'Matterhorn mountain peak',
            location: 'Zermatt',
        },
        {
            src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
            alt: 'Tropical beach with palm tree',
            location: 'Maldives',
        },
    ];

    return (
        <section className="w-full overflow-hidden">
            <div className="flex">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="relative w-1/3 sm:w-1/6 aspect-square overflow-hidden cursor-pointer"
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <img
                            src={img.src}
                            alt={img.alt}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out"
                            style={{
                                transform: hoveredIndex === index ? 'scale(1.15)' : 'scale(1)',
                            }}
                        />
                        {/* Gradient overlay on hover */}
                        <div
                            className="absolute inset-0 transition-opacity duration-500"
                            style={{
                                opacity: hoveredIndex === index ? 1 : 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%)',
                            }}
                        />
                        {/* Location label on hover */}
                        <span
                            className="absolute bottom-3 left-0 right-0 text-center text-white text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500"
                            style={{
                                opacity: hoveredIndex === index ? 1 : 0,
                                transform: hoveredIndex === index ? 'translateY(0)' : 'translateY(8px)',
                            }}
                        >
                            {img.location}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}

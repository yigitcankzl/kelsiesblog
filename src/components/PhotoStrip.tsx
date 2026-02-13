export default function PhotoStrip() {
    // 6 unique travel images matching the Stitch reference
    const images = [
        {
            src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600',
            alt: 'European café with red awning',
        },
        {
            src: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=600',
            alt: 'Venice canal with gondolas',
        },
        {
            src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
            alt: 'Dubai skyline at sunset',
        },
        {
            src: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600',
            alt: 'Big Ben and Houses of Parliament',
        },
        {
            src: 'https://images.unsplash.com/photo-1531210483974-4f8205f49e36?w=600',
            alt: 'Matterhorn mountain peak',
        },
        {
            src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
            alt: 'Tropical beach with palm tree',
        },
    ];

    return (
        <section className="w-full overflow-hidden">
            <div className="flex">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="w-1/3 sm:w-1/6 aspect-square bg-cover bg-center"
                        style={{ backgroundImage: `url('${img.src}')` }}
                    />
                ))}
            </div>
        </section>
    );
}

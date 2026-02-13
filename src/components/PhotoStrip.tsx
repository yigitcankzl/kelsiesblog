import { useBlogStore } from '@/store/store';

export default function PhotoStrip() {
    const { posts } = useBlogStore();

    // Use cover images from posts, cycling if fewer than 6
    const images = Array.from({ length: 6 }, (_, i) => {
        const post = posts[i % posts.length];
        return {
            src: post?.coverImage || '',
            alt: post?.title || 'Travel photo',
        };
    });

    return (
        <section className="w-full overflow-hidden">
            <div className="flex">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="w-1/3 sm:w-1/6 aspect-square bg-cover bg-center relative group cursor-pointer"
                        style={{ backgroundImage: `url('${img.src}')` }}
                    >
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                <circle cx="12" cy="13" r="4" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

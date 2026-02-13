import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import { useBlogStore } from '@/store/store';

export default function PostReader() {
    const { selectedPost, selectedCountry, setSelectedPost } = useBlogStore();
    if (!selectedPost) return null;

    return (
        <article className="pb-20">
            {/* Cover hero — full bleed */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-72 sm:h-[420px] w-full overflow-hidden"
            >
                <img
                    src={selectedPost.coverImage}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                    <div className="max-w-3xl mx-auto">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.12em] mb-4">
                            <MapPin className="w-3 h-3" />
                            {selectedPost.city}, {selectedPost.country}
                        </span>
                        <h1
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            {selectedPost.title}
                        </h1>
                        <div className="flex items-center gap-3 mt-3 text-white/60 text-sm">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{selectedPost.sections.length * 3} min read</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
                {/* Back button */}
                <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-10"
                >
                    <button
                        onClick={() => setSelectedPost(null)}
                        className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-[var(--brand)] transition-colors uppercase tracking-[0.15em] cursor-pointer border-b border-gray-200 hover:border-[var(--brand)] pb-1"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to {selectedCountry || 'Posts'}
                    </button>
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
                            {/* Section divider */}
                            {index > 0 && (
                                <div className="flex items-center gap-3 mb-10">
                                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                                    <div className="w-1.5 h-1.5 bg-[var(--brand)]" />
                                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                                </div>
                            )}

                            <h2
                                className="text-xl sm:text-2xl font-bold mb-4 leading-snug text-gray-900 dark:text-white"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                {section.heading}
                            </h2>

                            {section.image && (
                                <div className="mb-5 overflow-hidden shadow-md">
                                    <img
                                        src={section.image}
                                        alt={section.heading}
                                        className="w-full h-52 sm:h-72 object-cover"
                                    />
                                </div>
                            )}

                            <p className="text-[15px] text-gray-600 dark:text-gray-300 leading-[1.85] font-light">
                                {section.content}
                            </p>
                        </motion.section>
                    ))}
                </div>

                {/* End marker */}
                <div className="flex justify-center pt-14">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-px bg-[var(--brand)]" />
                        <div className="w-2 h-2 rotate-45 bg-[var(--brand)]" />
                        <div className="w-8 h-px bg-[var(--brand)]" />
                    </div>
                </div>
            </div>
        </article>
    );
}

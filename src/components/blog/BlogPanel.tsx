import { motion } from 'framer-motion';
import { X, MapPin, ChevronDown } from 'lucide-react';
import { useBlogStore } from '../../store/store';

export default function BlogPanel() {
    const { selectedPost, setSelectedPost } = useBlogStore();

    if (!selectedPost) return null;

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full z-[1001] w-full sm:w-[480px] lg:w-[540px] bg-white shadow-2xl overflow-hidden flex flex-col"
        >
            {/* Cover Image */}
            <div className="relative h-56 sm:h-64 flex-shrink-0 overflow-hidden">
                <img
                    src={selectedPost.coverImage}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Close button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedPost(null)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </motion.button>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300 text-xs font-medium uppercase tracking-wider">
                            {selectedPost.city}, {selectedPost.country}
                        </span>
                    </div>
                    <h2
                        className="text-2xl sm:text-3xl font-bold text-white leading-tight"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        {selectedPost.title}
                    </h2>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="flex justify-center py-2 bg-gradient-to-b from-white to-transparent">
                <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-8">
                {selectedPost.sections.map((section, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
                        className="mb-8"
                    >
                        {/* Section divider */}
                        {index > 0 && (
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
                            </div>
                        )}

                        {/* Section heading */}
                        <h3
                            className="text-xl font-semibold text-[#1a1a2e] mb-3"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            {section.heading}
                        </h3>

                        {/* Section image */}
                        {section.image && (
                            <motion.div
                                className="mb-4 rounded-xl overflow-hidden shadow-md"
                                whileHover={{ scale: 1.01 }}
                                transition={{ duration: 0.2 }}
                            >
                                <img
                                    src={section.image}
                                    alt={section.heading}
                                    className="w-full h-48 object-cover"
                                />
                            </motion.div>
                        )}

                        {/* Section content */}
                        <p className="text-gray-600 leading-relaxed text-[15px]">
                            {section.content}
                        </p>
                    </motion.div>
                ))}

                {/* End decoration */}
                <div className="flex justify-center pt-4 pb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-px bg-amber-300" />
                        <div className="w-2 h-2 rotate-45 bg-amber-400" />
                        <div className="w-8 h-px bg-amber-300" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

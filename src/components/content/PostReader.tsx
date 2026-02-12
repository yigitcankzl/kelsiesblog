import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PostReader() {
    const { selectedPost, selectedCountry, setSelectedPost } = useBlogStore();

    if (!selectedPost) return null;

    return (
        <article className="max-w-3xl mx-auto px-6 py-10">
            {/* Back button */}
            <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPost(null)}
                    className="cursor-pointer gap-2 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to {selectedCountry || 'Posts'}
                </Button>
            </motion.div>

            {/* Cover image */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-2xl overflow-hidden shadow-lg mb-8"
            >
                <img
                    src={selectedPost.coverImage}
                    alt={selectedPost.title}
                    className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <Badge variant="secondary" className="gap-1.5 mb-2 bg-white/20 backdrop-blur-sm text-emerald-300 border-emerald-500/30">
                        <MapPin className="w-3 h-3" />
                        {selectedPost.city}, {selectedPost.country}
                    </Badge>
                    <h1
                        className="text-3xl sm:text-4xl font-bold text-white leading-tight"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        {selectedPost.title}
                    </h1>
                </div>
            </motion.div>

            {/* Sections */}
            <div className="space-y-10">
                {selectedPost.sections.map((section, index) => (
                    <motion.section
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + index * 0.1, duration: 0.5 }}
                    >
                        {/* Section divider */}
                        {index > 0 && (
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
                            </div>
                        )}

                        {/* Heading */}
                        <h2
                            className="text-2xl font-semibold mb-4"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            {section.heading}
                        </h2>

                        {/* Image */}
                        {section.image && (
                            <div className="mb-5 rounded-xl overflow-hidden shadow-md">
                                <img
                                    src={section.image}
                                    alt={section.heading}
                                    className="w-full h-56 sm:h-64 object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <p className="text-muted-foreground leading-[1.85] text-[16px]">
                            {section.content}
                        </p>
                    </motion.section>
                ))}
            </div>

            {/* End decoration */}
            <div className="flex justify-center pt-10 pb-14">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-px bg-amber-300" />
                    <div className="w-2.5 h-2.5 rotate-45 bg-amber-400" />
                    <div className="w-10 h-px bg-amber-300" />
                </div>
            </div>
        </article>
    );
}

import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
                className="relative h-72 sm:h-96 w-full overflow-hidden"
            >
                <img
                    src={selectedPost.coverImage}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-3xl mx-auto">
                    <Badge
                        variant="secondary"
                        className="bg-white/20 backdrop-blur-md text-white border-white/20 gap-1.5 mb-3"
                    >
                        <MapPin className="w-3 h-3" />
                        {selectedPost.city}, {selectedPost.country}
                    </Badge>
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
            </motion.div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
                {/* Back button */}
                <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPost(null)}
                        className="cursor-pointer gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to {selectedCountry || 'Posts'}
                    </Button>
                </motion.div>

                {/* Sections */}
                <div className="space-y-8">
                    {selectedPost.sections.map((section, index) => (
                        <motion.section
                            key={index}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + index * 0.08, duration: 0.4 }}
                        >
                            {/* Section divider */}
                            {index > 0 && (
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="flex-1 h-px bg-border" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]" />
                                    <div className="flex-1 h-px bg-border" />
                                </div>
                            )}

                            <h2
                                className="text-xl sm:text-2xl font-bold mb-4 leading-snug"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                {section.heading}
                            </h2>

                            {section.image && (
                                <div className="mb-5 rounded-xl overflow-hidden shadow-md">
                                    <img
                                        src={section.image}
                                        alt={section.heading}
                                        className="w-full h-52 sm:h-64 object-cover"
                                    />
                                </div>
                            )}

                            <p className="text-[15px] text-muted-foreground leading-[1.85]">
                                {section.content}
                            </p>
                        </motion.section>
                    ))}
                </div>

                {/* End marker */}
                <div className="flex justify-center pt-12">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-px bg-[var(--amber)]" />
                        <div className="w-2 h-2 rotate-45 bg-[var(--amber)]" />
                        <div className="w-8 h-px bg-[var(--amber)]" />
                    </div>
                </div>
            </div>
        </article>
    );
}

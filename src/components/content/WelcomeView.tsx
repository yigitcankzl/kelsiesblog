import { motion } from 'framer-motion';
import { MapPin, Compass, ArrowRight } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function WelcomeView() {
    const { posts, setSelectedCountry, setSelectedPost } = useBlogStore();

    const handlePostClick = (post: typeof posts[0]) => {
        setSelectedCountry(post.country);
        setSelectedPost(post);
    };

    // Split: first post is featured, rest are grid
    const featured = posts[0];
    const rest = posts.slice(1);

    return (
        <div className="w-full px-8 sm:px-12 lg:px-16 py-12">
            {/* Header */}
            <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="inline-flex items-center gap-2 text-[var(--brand-light)] text-xs font-semibold uppercase tracking-[0.15em] mb-3">
                    <Compass className="w-4 h-4" />
                    Stories From Around the World
                </div>
                <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                >
                    Latest Adventures
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
                    Click a green country on the map to explore, or dive into a story below.
                </p>
            </motion.div>

            {/* Featured post — full width hero */}
            {featured && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="mb-10"
                >
                    <Card
                        onClick={() => handlePostClick(featured)}
                        className="group relative overflow-hidden cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl py-0"
                    >
                        <div className="relative h-72 sm:h-96">
                            <img
                                src={featured.coverImage}
                                alt={featured.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            {/* Content overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                                <Badge
                                    variant="secondary"
                                    className="bg-white/20 backdrop-blur-md text-white border-white/20 gap-1.5 mb-3"
                                >
                                    <MapPin className="w-3 h-3" />
                                    {featured.city}, {featured.country}
                                </Badge>
                                <h3
                                    className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight"
                                    style={{ fontFamily: 'Playfair Display, serif' }}
                                >
                                    {featured.title}
                                </h3>
                                <p className="text-white/70 text-sm sm:text-base max-w-2xl line-clamp-2 leading-relaxed">
                                    {featured.sections[0]?.content}
                                </p>
                                <div className="mt-4 inline-flex items-center gap-1.5 text-white/90 text-sm font-medium group-hover:gap-3 transition-all">
                                    Read Story <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Section divider */}
            <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    More Stories
                </span>
                <div className="h-px flex-1 bg-border" />
            </div>

            {/* Posts grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
                {rest.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.06, duration: 0.4 }}
                    >
                        <Card
                            onClick={() => handlePostClick(post)}
                            className="group overflow-hidden cursor-pointer border border-border/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-xl py-0 gap-0"
                        >
                            {/* Image */}
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                <Badge
                                    variant="secondary"
                                    className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-[var(--brand)] border-0 shadow-sm gap-1"
                                >
                                    <MapPin className="w-3 h-3" />
                                    {post.country}
                                </Badge>
                            </div>

                            {/* Body */}
                            <CardContent className="p-4 pt-3">
                                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mb-1">
                                    {post.city}, {post.country}
                                </p>
                                <h3
                                    className="text-base font-semibold mb-1.5 group-hover:text-[var(--brand-light)] transition-colors leading-snug"
                                    style={{ fontFamily: 'Playfair Display, serif' }}
                                >
                                    {post.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                    {post.sections[0]?.content}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

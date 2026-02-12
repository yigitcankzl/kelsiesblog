import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CountryPostsView() {
    const { selectedCountry, posts, setSelectedCountry, setSelectedPost } = useBlogStore();
    const countryPosts = posts.filter(p => p.country === selectedCountry);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <motion.div
                className="flex items-center gap-4 mb-8"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCountry(null)}
                    className="cursor-pointer gap-2 shrink-0"
                >
                    <ArrowLeft className="w-4 h-4" />
                    All Posts
                </Button>
                <div className="flex items-center gap-3">
                    <div className="w-px h-8 bg-border" />
                    <div>
                        <h2
                            className="text-2xl sm:text-3xl font-bold leading-tight"
                            style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                            {selectedCountry}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {countryPosts.length} {countryPosts.length === 1 ? 'story' : 'stories'}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-10">
                {countryPosts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + index * 0.08, duration: 0.4 }}
                    >
                        <Card
                            onClick={() => setSelectedPost(post)}
                            className="group overflow-hidden cursor-pointer border border-border/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-xl py-0 gap-0"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            </div>
                            <CardContent className="p-4 pt-3">
                                <Badge variant="secondary" className="gap-1 mb-2 text-[var(--brand)] bg-[var(--brand-surface)] border-0 text-[11px]">
                                    <MapPin className="w-3 h-3" />
                                    {post.city}
                                </Badge>
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

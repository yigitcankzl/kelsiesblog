import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CountryPostsView() {
    const { selectedCountry, posts, setSelectedCountry, setSelectedPost } = useBlogStore();

    const countryPosts = posts.filter((p) => p.country === selectedCountry);

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            {/* Back button + heading */}
            <div className="flex items-center gap-4 mb-8">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCountry(null)}
                    className="cursor-pointer gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    All Posts
                </Button>
                <div>
                    <h2
                        className="text-2xl md:text-3xl font-bold"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        {selectedCountry}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {countryPosts.length} {countryPosts.length === 1 ? 'story' : 'stories'}
                    </p>
                </div>
            </div>

            {/* Posts grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                {countryPosts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + index * 0.08, duration: 0.4 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    >
                        <Card
                            onClick={() => setSelectedPost(post)}
                            className="group overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 py-0 gap-0"
                        >
                            {/* Cover image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            </div>

                            {/* Card body */}
                            <CardContent className="p-5">
                                <Badge variant="secondary" className="gap-1.5 mb-2 text-[#2d6a4f] bg-emerald-50 border-emerald-200">
                                    <MapPin className="w-3 h-3" />
                                    {post.city}
                                </Badge>
                                <h3
                                    className="text-lg font-semibold mb-2 group-hover:text-[#2d6a4f] transition-colors"
                                    style={{ fontFamily: 'Playfair Display, serif' }}
                                >
                                    {post.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
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

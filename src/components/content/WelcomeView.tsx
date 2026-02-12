import { motion } from 'framer-motion';
import { MapPin, Compass } from 'lucide-react';
import { useBlogStore } from '../../store/store';

export default function WelcomeView() {
    const { posts, setSelectedCountry, setSelectedPost } = useBlogStore();

    const handlePostClick = (post: typeof posts[0]) => {
        setSelectedCountry(post.country);
        setSelectedPost(post);
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            {/* Welcome header */}
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 bg-[#f0fdf4] text-[#2d6a4f] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
                >
                    <Compass className="w-3.5 h-3.5" />
                    Explore the World
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-3xl md:text-4xl font-bold mb-3"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                >
                    Welcome to Kelsie Sharp's Journey
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-500 max-w-xl mx-auto leading-relaxed"
                >
                    Click any green country on the map above to explore, or browse the latest stories below.
                </motion.p>
            </div>

            {/* Latest posts header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Latest Stories</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </div>

            {/* Posts grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                {posts.map((post, index) => (
                    <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.06, duration: 0.4 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        onClick={() => handlePostClick(post)}
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-100/60"
                    >
                        {/* Cover image */}
                        <div className="relative h-44 overflow-hidden">
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-[#1a472a] text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                                <MapPin className="w-3 h-3" />
                                {post.country}
                            </span>
                        </div>

                        {/* Card body */}
                        <div className="p-5">
                            <h3
                                className="text-lg font-semibold mb-1 group-hover:text-[#2d6a4f] transition-colors"
                                style={{ fontFamily: 'Playfair Display, serif' }}
                            >
                                {post.title}
                            </h3>
                            <p className="text-sm text-gray-400 mb-2">{post.city}, {post.country}</p>
                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                                {post.sections[0]?.content}
                            </p>
                        </div>
                    </motion.article>
                ))}
            </div>
        </div>
    );
}

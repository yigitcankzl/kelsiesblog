import { motion } from 'framer-motion';
import { Edit2, Trash2, MapPin, FileText } from 'lucide-react';
import { useBlogStore } from '../../store/store';
import { BlogPost } from '../../types';

interface PostListProps {
    onEdit: (post: BlogPost) => void;
}

export default function PostList({ onEdit }: PostListProps) {
    const { posts, deletePost } = useBlogStore();

    if (posts.length === 0) {
        return (
            <div className="text-center py-20">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2">No posts yet</h3>
                <p className="text-gray-400 text-sm">Create your first blog post to get started</p>
            </div>
        );
    }

    // Group posts by country
    const grouped = posts.reduce<Record<string, BlogPost[]>>((acc, post) => {
        if (!acc[post.country]) acc[post.country] = [];
        acc[post.country].push(post);
        return acc;
    }, {});

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                    All Posts <span className="text-gray-400 font-normal">({posts.length})</span>
                </h2>
            </div>

            {Object.entries(grouped).map(([country, countryPosts]) => (
                <div key={country}>
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-[#2d6a4f]" />
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{country}</h3>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    <div className="grid gap-3">
                        {countryPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
                            >
                                <div className="flex items-stretch">
                                    {/* Image */}
                                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 px-4 py-3 flex flex-col justify-center min-w-0">
                                        <h4 className="font-semibold text-sm text-gray-900 truncate">{post.title}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {post.city} · {post.sections.length} {post.sections.length === 1 ? 'section' : 'sections'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            [{post.coordinates[0].toFixed(2)}, {post.coordinates[1].toFixed(2)}]
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 px-3">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => onEdit(post)}
                                            className="w-9 h-9 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-500 flex items-center justify-center text-gray-400 transition-colors cursor-pointer"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => {
                                                if (confirm('Delete this post?')) deletePost(post.id);
                                            }}
                                            className="w-9 h-9 rounded-lg bg-gray-50 hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-gray-400 transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

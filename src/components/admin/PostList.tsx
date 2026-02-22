import { motion } from 'framer-motion';
import { Edit2, Trash2, MapPin, FileText } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import type { BlogPost } from '@/types';
import { FONT } from '@/lib/constants';

interface PostListProps {
    onEdit: (post: BlogPost) => void;
}

export default function PostList({ onEdit }: PostListProps) {
    const { posts, deletePost } = useBlogStore();

    if (posts.length === 0) {
        return (
            <div className="text-center py-20">
                <FileText className="w-12 h-12 text-[#333] mx-auto mb-4" />
                <h3 style={{ ...FONT, fontSize: '14px', color: '#555', marginBottom: '8px' }}>
                    NO DATA FOUND
                </h3>
                <p style={{ ...FONT, fontSize: '9px', color: '#444', lineHeight: '2' }}>
                    {'>'} CREATE YOUR FIRST POST TO BEGIN_
                </p>
            </div>
        );
    }

    const grouped = posts.reduce<Record<string, BlogPost[]>>((acc, post) => {
        if (!acc[post.country]) acc[post.country] = [];
        acc[post.country].push(post);
        return acc;
    }, {});

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h2 style={{ ...FONT, fontSize: '14px', color: '#fff' }}>
                    ALL POSTS <span style={{ color: 'var(--neon-cyan)' }}>[ {posts.length} ]</span>
                </h2>
            </div>

            {Object.entries(grouped).map(([country, countryPosts]) => (
                <div key={country}>
                    <div className="flex items-center gap-2.5 mb-4">
                        <MapPin className="w-3 h-3 text-[var(--brand)]" />
                        <h3 style={{ ...FONT, fontSize: '11px', color: 'var(--neon-amber)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            {country}
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#333] to-transparent" />
                        <span style={{ ...FONT, fontSize: '8px', color: '#444' }}>
                            {countryPosts.length} {countryPosts.length === 1 ? 'ENTRY' : 'ENTRIES'}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        {countryPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                style={{
                                    border: '1px solid #1a1a1a',
                                    backgroundColor: '#080808',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = '#333';
                                    e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 255, 65, 0.08)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = '#1a1a1a';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div className="flex items-stretch">
                                    {/* Image */}
                                    <div className="w-[120px] h-[110px] shrink-0 overflow-hidden relative">
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                            style={{ filter: 'saturate(0.6) brightness(0.8)' }}
                                        />
                                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 70%, #080808)' }} />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 px-5 py-4 flex flex-col justify-center min-w-0">
                                        <h4 style={{ ...FONT, fontSize: '12px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {post.title}
                                        </h4>
                                        <p style={{ ...FONT, fontSize: '8px', color: 'var(--neon-cyan)', marginTop: '8px' }}>
                                            {post.city} <span style={{ color: '#333' }}>|</span> <span style={{ color: '#555' }}>{post.sections.length} {post.sections.length === 1 ? 'SECTION' : 'SECTIONS'}</span>
                                        </p>
                                        <p style={{ ...FONT, fontSize: '7px', color: '#444', marginTop: '6px' }}>
                                            [{post.coordinates[0].toFixed(2)}, {post.coordinates[1].toFixed(2)}]
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 px-5">
                                        <button
                                            onClick={() => onEdit(post)}
                                            className="cursor-pointer w-9 h-9 flex items-center justify-center bg-transparent border border-[#333] text-[#555] transition-all duration-300"
                                            onMouseEnter={e => {
                                                e.currentTarget.style.color = 'var(--neon-cyan)';
                                                e.currentTarget.style.borderColor = 'var(--neon-cyan)';
                                                e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 255, 255, 0.2)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.color = '#555';
                                                e.currentTarget.style.borderColor = '#333';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this post?')) deletePost(post.id);
                                            }}
                                            className="cursor-pointer w-9 h-9 flex items-center justify-center bg-transparent border border-[#333] text-[#555] transition-all duration-300"
                                            onMouseEnter={e => {
                                                e.currentTarget.style.color = '#FF00E4';
                                                e.currentTarget.style.borderColor = '#FF00E4';
                                                e.currentTarget.style.boxShadow = '0 0 8px rgba(255, 0, 228, 0.2)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.color = '#555';
                                                e.currentTarget.style.borderColor = '#333';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
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

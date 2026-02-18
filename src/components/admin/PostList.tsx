import { motion } from 'framer-motion';
import { Edit2, Trash2, MapPin, FileText } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import type { BlogPost } from '@/types';

const font = { fontFamily: "'Press Start 2P', monospace" } as const;

interface PostListProps {
    onEdit: (post: BlogPost) => void;
}

export default function PostList({ onEdit }: PostListProps) {
    const { posts, deletePost } = useBlogStore();

    if (posts.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <FileText style={{ width: '48px', height: '48px', color: '#333', margin: '0 auto 16px' }} />
                <h3 style={{ ...font, fontSize: '14px', color: '#555', marginBottom: '8px' }}>
                    NO DATA FOUND
                </h3>
                <p style={{ ...font, fontSize: '9px', color: '#444', lineHeight: '2' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ ...font, fontSize: '14px', color: '#fff' }}>
                    ALL POSTS <span style={{ color: 'var(--neon-cyan)' }}>[ {posts.length} ]</span>
                </h2>
            </div>

            {Object.entries(grouped).map(([country, countryPosts]) => (
                <div key={country}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <MapPin style={{ width: '12px', height: '12px', color: 'var(--brand)' }} />
                        <h3 style={{ ...font, fontSize: '11px', color: 'var(--neon-amber)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                            {country}
                        </h3>
                        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #333, transparent)' }} />
                        <span style={{ ...font, fontSize: '8px', color: '#444' }}>
                            {countryPosts.length} {countryPosts.length === 1 ? 'ENTRY' : 'ENTRIES'}
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                                <div style={{ display: 'flex', alignItems: 'stretch' }}>
                                    {/* Image */}
                                    <div style={{ width: '120px', height: '110px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.6) brightness(0.8)' }}
                                        />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 70%, #080808)' }} />
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                                        <h4 style={{ ...font, fontSize: '12px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {post.title}
                                        </h4>
                                        <p style={{ ...font, fontSize: '8px', color: 'var(--neon-cyan)', marginTop: '8px' }}>
                                            {post.city} <span style={{ color: '#333' }}>|</span> <span style={{ color: '#555' }}>{post.sections.length} {post.sections.length === 1 ? 'SECTION' : 'SECTIONS'}</span>
                                        </p>
                                        <p style={{ ...font, fontSize: '7px', color: '#444', marginTop: '6px' }}>
                                            [{post.coordinates[0].toFixed(2)}, {post.coordinates[1].toFixed(2)}]
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px' }}>
                                        <button
                                            onClick={() => onEdit(post)}
                                            className="cursor-pointer"
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'transparent',
                                                border: '1px solid #333',
                                                color: '#555',
                                                transition: 'all 0.3s',
                                            }}
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
                                            <Edit2 style={{ width: '14px', height: '14px' }} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Delete this post?')) deletePost(post.id);
                                            }}
                                            className="cursor-pointer"
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'transparent',
                                                border: '1px solid #333',
                                                color: '#555',
                                                transition: 'all 0.3s',
                                            }}
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
                                            <Trash2 style={{ width: '14px', height: '14px' }} />
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

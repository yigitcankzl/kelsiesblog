import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import { useBlogStore } from '@/store/store';
import type { BlogPost } from '@/types';

const font = { fontFamily: "'Press Start 2P', monospace" } as const;

export default function AllStoriesPage() {
    const { posts, setSelectedCountry, setSelectedPost, setActivePage } = useBlogStore();

    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const categories = ['Culture', 'History', 'Tourism', 'Transportation', 'Politic', 'Food'];

    const filteredPosts = activeCategory
        ? posts.filter(p => p.category.includes(activeCategory))
        : posts;

    const grouped = filteredPosts.reduce<Record<string, BlogPost[]>>((acc, post) => {
        if (!acc[post.country]) acc[post.country] = [];
        acc[post.country].push(post);
        return acc;
    }, {});

    const handlePostClick = (post: BlogPost) => {
        setActivePage('map');
        setSelectedCountry(post.country);
        setSelectedPost(post);
    };

    return (
        <section className="bg-black min-h-screen py-16">
            <div style={{ maxWidth: '1024px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
                {/* Header */}
                <motion.div
                    className="flex items-end gap-6 mb-10"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <button
                        onClick={() => setActivePage('map')}
                        className="cursor-pointer"
                        style={{
                            ...font,
                            fontSize: '7px',
                            padding: '10px 16px',
                            border: '2px solid var(--brand)',
                            backgroundColor: 'transparent',
                            color: 'var(--brand)',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase' as const,
                            boxShadow: '0 0 8px rgba(0, 255, 65, 0.2)',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            flexShrink: 0,
                        }}
                    >
                        <ArrowLeft style={{ width: '12px', height: '12px' }} />
                        ◂ BACK
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--brand)', opacity: 0.3 }} />
                        <div>
                            <h1 className="text-glitch" style={{ ...font, fontSize: '18px', color: '#fff', lineHeight: 1.4 }}
                                data-text="ALL STORIES">
                                ALL STORIES
                            </h1>
                            <p style={{ ...font, fontSize: '6px', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                <span style={{ color: 'var(--neon-cyan)' }}>{filteredPosts.length}</span>
                                <span style={{ color: '#555' }}> {filteredPosts.length === 1 ? 'STORY' : 'STORIES'} FOUND</span>
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Category filters */}
                {categories.length > 1 && (
                    <motion.div
                        style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px' }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                    >
                        <button
                            onClick={() => setActiveCategory(null)}
                            className="cursor-pointer"
                            style={{
                                ...font,
                                fontSize: '9px',
                                padding: '10px 20px',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                border: '2px solid',
                                borderColor: !activeCategory ? 'var(--brand)' : '#444',
                                backgroundColor: !activeCategory ? 'var(--brand)' : 'transparent',
                                color: !activeCategory ? '#000' : '#888',
                                boxShadow: !activeCategory ? '0 0 12px rgba(0, 255, 65, 0.4)' : 'none',
                                transition: 'all 0.3s',
                            }}
                        >
                            ALL
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                                className="cursor-pointer"
                                style={{
                                    ...font,
                                    fontSize: '9px',
                                    padding: '10px 20px',
                                    letterSpacing: '0.15em',
                                    textTransform: 'uppercase',
                                    border: '2px solid',
                                    borderColor: activeCategory === cat ? 'var(--neon-magenta)' : '#444',
                                    backgroundColor: activeCategory === cat ? 'var(--neon-magenta)' : 'transparent',
                                    color: activeCategory === cat ? '#000' : '#888',
                                    boxShadow: activeCategory === cat ? '0 0 12px rgba(255, 0, 228, 0.4)' : 'none',
                                    transition: 'all 0.3s',
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                )}

                {/* Posts grouped by country */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    {Object.entries(grouped).map(([country, countryPosts]) => (
                        <motion.div
                            key={country}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Country header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                <MapPin style={{ width: '12px', height: '12px', color: 'var(--brand)' }} />
                                <h2 style={{ ...font, fontSize: '12px', color: 'var(--neon-amber)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                    {country}
                                </h2>
                                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #333, transparent)' }} />
                                <span style={{ ...font, fontSize: '8px', color: '#444' }}>
                                    {countryPosts.length} {countryPosts.length === 1 ? 'ENTRY' : 'ENTRIES'}
                                </span>
                            </div>

                            {/* Post cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {countryPosts.map((post, index) => (
                                    <motion.article
                                        key={post.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.06, duration: 0.4 }}
                                        onClick={() => handlePostClick(post)}
                                        className="group cursor-pointer"
                                        style={{ transition: 'transform 0.5s' }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        {/* Image */}
                                        <div className="retro-corners hover-glitch" style={{
                                            position: 'relative',
                                            overflow: 'hidden',
                                            aspectRatio: '16/9',
                                            marginBottom: '16px',
                                            boxShadow: '0 0 10px rgba(0, 255, 65, 0.15)',
                                        }}>
                                            <span className="rc-extra" style={{ position: 'absolute', inset: 0 }} />
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.7s',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                                            }} />
                                            <span style={{
                                                position: 'absolute',
                                                top: '12px',
                                                left: '12px',
                                                ...font,
                                                fontSize: '6px',
                                                backgroundColor: 'var(--brand)',
                                                color: '#000',
                                                padding: '6px 10px',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.12em',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                            }}>
                                                <MapPin style={{ width: '10px', height: '10px' }} />
                                                {post.city}
                                            </span>
                                        </div>

                                        {/* Meta */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            marginBottom: '12px',
                                            ...font,
                                            fontSize: '7px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.12em',
                                        }}>
                                            <span style={{ color: 'var(--neon-cyan)' }}>{post.date}</span>
                                            <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--neon-magenta)' }} />
                                            <span style={{ color: '#555', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock style={{ width: '10px', height: '10px' }} />
                                                {post.sections.length * 3} MIN
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3
                                            className="text-glitch"
                                            data-text={post.title}
                                            style={{
                                                ...font,
                                                fontSize: '11px',
                                                color: '#fff',
                                                marginBottom: '12px',
                                                lineHeight: '2',
                                                transition: 'color 0.3s',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.color = 'var(--brand)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.color = '#fff'; }}
                                        >
                                            {post.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p style={{
                                            ...font,
                                            fontSize: '8px',
                                            color: '#666',
                                            lineHeight: '2.4',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}>
                                            {post.sections[0]?.content?.substring(0, 120)}...
                                        </p>

                                        {/* Categories */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                                            {post.category.map(cat => (
                                                <span key={cat} style={{
                                                    ...font,
                                                    fontSize: '5px',
                                                    padding: '4px 8px',
                                                    border: '1px solid #333',
                                                    color: '#555',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em',
                                                }}>
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.article>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty state */}
                {filteredPosts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        <h3 style={{ ...font, fontSize: '14px', color: '#555', marginBottom: '8px' }}>
                            NO STORIES FOUND
                        </h3>
                        <p style={{ ...font, fontSize: '9px', color: '#444', lineHeight: '2' }}>
                            {'>'} TRY A DIFFERENT CATEGORY_
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

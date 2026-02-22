import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import BackButton from '@/components/shared/BackButton';
import { useBlogStore } from '@/store/store';
import { estimateReadTime, type BlogPost } from '@/types';
import { FONT } from '@/lib/constants';
import CategoryFilter from '@/components/shared/CategoryFilter';

export default function AllStoriesPage() {
    const { posts, setSelectedCountry, setSelectedPost, setActivePage } = useBlogStore();

    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const filteredPosts = activeCategory
        ? posts.filter(p =>
            p.category.includes(activeCategory) ||
            (activeCategory === 'Food and Drink' && p.category.includes('Food'))
        )
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
        <section className="bg-black min-h-screen pb-16" style={{ paddingTop: '100px' }}>
            <div style={{ maxWidth: '1024px', margin: '0 auto', paddingLeft: '24px', paddingRight: '24px' }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <BackButton onClick={() => setActivePage('map')} />
                    <div style={{ width: '1px', height: '32px', backgroundColor: 'var(--brand)', opacity: 0.3 }} />
                    <h1 className="text-glitch" style={{ ...FONT, fontSize: '16px', color: '#fff', lineHeight: 1.4 }}
                        data-text="ALL STORIES">
                        ALL STORIES
                    </h1>
                    <span style={{ ...FONT, fontSize: '6px', color: 'var(--neon-cyan)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                        {filteredPosts.length} {filteredPosts.length === 1 ? 'STORY' : 'STORIES'}
                    </span>
                </div>

                {/* Category filters */}
                <div style={{ marginBottom: '32px' }}>
                    <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
                </div>

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
                                <h2 style={{ ...FONT, fontSize: '12px', color: 'var(--neon-amber)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                                    {country}
                                </h2>
                                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #333, transparent)' }} />
                                <span style={{ ...FONT, fontSize: '8px', color: '#444' }}>
                                    {countryPosts.length} {countryPosts.length === 1 ? 'ENTRY' : 'ENTRIES'}
                                </span>
                            </div>

                            {/* Post cards - adjusted to single column stack */}
                            <div className="flex flex-col gap-6">
                                {countryPosts.map((post, index) => (
                                    <motion.article
                                        key={post.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.06, duration: 0.4 }}
                                        onClick={() => handlePostClick(post)}
                                        className="group cursor-pointer flex flex-col sm:flex-row gap-6 items-start"
                                        style={{ transition: 'transform 0.5s' }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        {/* Image - reduced size and fixed width on desktop */}
                                        <div className="retro-corners hover-glitch w-full sm:w-48 md:w-64 shrink-0" style={{
                                            position: 'relative',
                                            overflow: 'hidden',
                                            aspectRatio: '4/3',
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
                                        </div>

                                        {/* Content side */}
                                        <div className="flex-1 min-w-0">
                                            {/* Meta */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                marginBottom: '8px',
                                                ...FONT,
                                                fontSize: '7px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.12em',
                                            }}>
                                                <span style={{ color: 'var(--neon-cyan)' }}>{post.date}</span>
                                                <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--neon-magenta)' }} />
                                                <span style={{ color: '#555', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Clock style={{ width: '10px', height: '10px' }} />
                                                    {estimateReadTime(post.sections)} MIN
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3
                                                className="text-glitch"
                                                data-text={post.title}
                                                style={{
                                                    ...FONT,
                                                    fontSize: '11px',
                                                    color: '#fff',
                                                    marginBottom: '8px',
                                                    lineHeight: '1.8',
                                                    transition: 'color 0.3s',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.color = 'var(--brand)'; }}
                                                onMouseLeave={e => { e.currentTarget.style.color = '#fff'; }}
                                            >
                                                {post.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p style={{
                                                ...FONT,
                                                fontSize: '8px',
                                                color: '#666',
                                                lineHeight: '2.2',
                                                marginBottom: '10px',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}>
                                                {post.sections[0]?.content?.substring(0, 120)}...
                                            </p>

                                            {/* Categories */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {post.category.map(cat => (
                                                    <span key={cat} style={{
                                                        ...FONT,
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
                        <h3 style={{ ...FONT, fontSize: '14px', color: '#555', marginBottom: '8px' }}>
                            NO STORIES FOUND
                        </h3>
                        <p style={{ ...FONT, fontSize: '9px', color: '#444', lineHeight: '2' }}>
                            {'>'} TRY A DIFFERENT CATEGORY_
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
